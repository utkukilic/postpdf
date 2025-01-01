[MISSING_PAGE_FAIL:1]

## 2. Security Issues in Cross-Chain Bridges

The cross-chain bridge is an application acting as an intermediary between users on different blockchains. Users lock various tokens on different blockchains to the bridge, and the bridge takes responsibility for validating these locked tokens, performing cross-chain trading logic like deposit or swap, and unlocking target tokens to users. Correspondingly, a cross-chain bridge consists of two parts, the on-chain router contracts and the off-chain relayer. The router contracts interact with various token contracts and provide on-chain functions, including locking users' tokens and unlocking tokens to users. They also record token transfer information as specific on-chain events to communicate with the off-chain relayer. The off-chain relayer keeps fetching on-chain events from the source chain and coordinates router contracts on the destination chain to finish a cross-chain transfer.

Specifically, we show a detailed workflow of typical cross-chain bridges in Fig 1. Upon receiving the cross-chain request, the router contract on chain A will call token contracts to lock users' tokens. In this call, the token contract will emit a lock event \(\mathbb{E}_{lk}\) and transfer users' tokens to the router contract. After that, the router contract will emit a deposit event \(\mathbb{E}_{dep}\) containing detailed information of this lock action such as asset type and amount as proof of locked assets. By parsing \(\mathbb{E}_{dep}\), the relayer can learn the lock action \(\mathbb{A}_{lk}\) on chain A, authorize the unlock action \(\mathbb{A}_{unlk}\) on chain B, and send transactions to the router contract on chain B. The router contract will verify the transaction sender and other optional proofs like multi-signatures and call target token contracts. Eventually, the token contract emits an unlock event \(\mathbb{E}_{unlk}\) and unlocks the target tokens to the users' addresses.

### Bugs in Cross-Chain Bridges

Although the lock-then-unlock idea is fairly simple, cross-chain bridges face three practical challenges which have caused severe attacks in reality. First, managing various assets with inconsistent contract interfaces on heterogeneous blockchains introduces bug-prone on-chain logic. Second, the big on-chain-off-chain gap causes complicated off-chain code and leads to potential inconsistency between on-chain router contracts and off-chain relayer. Third, cross-chain bridges' complex and multi-step workflow introduces large attack surfaces, including both traditional and blockchain-specific attacks. According to these three challenges, we document and categorize three new classes of security bugs in existing cross-chain bridges1 as follows.

Footnote 1: We summarize existing attacks in cross-chain bridges at https://github.com/Xscope-Tool/Cross-Chain-Attacks

**Unrestricted Deposit Emitting (UDE).** This bug happens in Steps 2 and 3 at the router contract in Figure 1. Typically, the router contract should lock senders' tokens before emitting the deposit event \(\mathbb{E}_{dep}\). The relayer will regard \(\mathbb{E}_{dep}\) as proof of locked tokens and authorize unlocking on the destination chain. However, mishandling complex contract interfaces like using unsafe transfer functions may let attackers bypass the lock procedure and trigger a valid deposit event directly. It will provide proof of non-existent locked tokens to the relayer and cause a false deposit on the destination chain. This bug caused Qubit, Meter.io, Wormhole, and Mulichain bridges' exploits. **Inconsistent Event Parsing (IEP).** This bug happens in Step 5 at the event parser in Figure 1 and causes inconsistent off-chain action \(\mathbb{A}_{lk}\) and on-chain event \(\mathbb{E}_{dep}\). It includes two common mistakes. First, the parser may recognize invalid events emitted by malicious contracts as valid deposit events. Second, even with a valid \(\mathbb{E}_{dep}\), the parser may parse out invalid lock action \(\mathbb{A}_{lk}\) with wrong token types or amount, _e.g._, recognize a fake token named "ETH" as native ETH. This bug resulted in three attacks on THORChain, and one attack on pNetwork.

**Unauthorized Unlocking (UU).** This bug happens in Steps 7 and 8 in Figure 1. Typically, only the trusted off-chain relayer can authorize unlock actions on the destination chain. However, key leakage caused by traditional cyberattacks or improper access control in on-chain/off-chain codes may allow unauthorized attackers to successfully call the unlock function of the router contract and

\begin{table}
\begin{tabular}{l l l} \hline \hline
**Notation State** & **Attributes** \\ \hline \(\mathbb{E}_{lk}\) & Lock Event & \(\langle tx^{s},\mathit{sc}^{s},\mathit{assets}^{s},\mathit{amount}^{s},\mathit{lo}^{s}\rangle\) \\ \(\mathbb{E}_{dep}\) & Deposit Event & \(\langle tx^{s},\mathit{sc}^{s},\mathit{assets}^{s},\mathit{amount}^{s},\mathit{ ID}^{d},\mathit{asset}^{d},\mathit{lo}^{d}\rangle\) \\ \(\mathbb{E}_{unlk}\) & Unlock Event & \(\langle tx^{d},\mathit{sc}^{d},\mathit{asset}^{d},\mathit{amount}^{d},\mathit{lo}^{d}\rangle\) \\ \(\mathbb{T}(tx)\) & Trace of \(tx\) & \(\langle\mathit{EventEvent.tx}=tx\rangle\) \\ \(\mathbb{A}_{lk}\) & Lock Action & \(\langle tx^{s},\mathit{ID}^{s},\mathit{ID}^{d},\mathit{asset}^{s},\mathit{ amount}^{s},\mathit{asset}^{d},\mathit{lo}^{d}\rangle\) \\ \(\mathbb{A}_{unlk}\) & Unlock Action & \(\langle tx^{s},\mathit{ID}^{d},\mathit{asset}^{d},\mathit{amount}^{d},\mathit{lo}^{d}\rangle\) \\ \hline \hline \end{tabular}
\end{table}
Table 1. Notations for States in Cross-Chain Bridges. \(s\) and \(d\) represent the source chain and the destination chain respectively.

Figure 1. Cross-Chain Bridge Workflow.

transfer out assets. This bug caused Robin Bridge, Anyswap, and PolyNetwork's exploits.

### Security Properties and Patterns

In this part, we formulate new security issues in cross-chain bridges and propose security properties to detect them.

We start from an observation that a cross-chain transfer shown in Figure 1 can be characterized as an execution sequence containing a serial of on-chain events and off-chain actions, _i.e._, \(\mathbb{B}_{lk}\rightarrow\mathbb{B}_{dep}\)\(\rightarrow\)\(\mathbb{A}_{ilk}\rightarrow\)\(\mathbb{A}_{unilk}\rightarrow\)\(\mathbb{B}_{unilk}\). Specifically, \(\mathbb{E}_{lk}\rightarrow\mathbb{B}_{dep}\) describes operations on the source chain: first, the token contract transfers users' tokens to the router contract and emits \(\mathbb{B}_{lk}\), then, the router contract emit \(\mathbb{B}_{dep}\) to aggregate on-chain lock actions into a uniform representation and inform the off-chain relayer. \(\mathbb{B}_{dep}\rightarrow\mathbb{A}_{lk}\rightarrow\)\(\mathbb{A}_{unilk}\) describes the relayers' behaviors, _i.e._, parse \(\mathbb{B}_{dep}\) to learn on-chain actions \(\mathbb{A}_{lk}\) and authorize unlock action \(\mathbb{A}_{unilk}\) on the destination chain. \(\mathbb{A}_{unilk}\rightarrow\mathbb{B}_{unilk}\) shows operations on destination chain, _i.e._, receive relayer's transactions and unlock target tokens to users. Furthermore, we transform states in the sequence into representations in Table 1. For better compatibility, the representations follow the minimum principle and only contain essential attributes that can be easily derivated from most cross-chain bridges.

After simplifying the complex workflow into a four-step sequence from \(\mathbb{B}_{lk}\) to \(\mathbb{B}_{unilk}\), we formulate the security issues with logical constraints in the execution sequence. Specifically, we introduce two types of security facts in Table 2 to describe the constraints, _i.e._, Validity facts and Consistence facts, denoted by \(V\) and \(C\) respectively. Validity facts define whether a state is valid to be part of the execution sequence. For example, \(V(\mathbb{B}_{dep})\) defines that only \(\mathbb{B}_{dep}\) emitted by the router contract can occur in an execution sequence and finally cause an unlock on the destination chain while an invalid \(\mathbb{B}_{dep}\) emitted by malicious contracts should never take part in a normal sequence. Consistence facts define the expected relations between two states. For example, \(C(\mathbb{B}_{dep},\mathbb{A}_{lk})\) requires exactly the same asset type and amount in \(\mathbb{B}_{dep}\) and \(\mathbb{A}_{lk}\), _i.e._, the off-chain relayer correctly learns what asset is locked to the router contract.

Based on the security facts we conduct, we introduce three security properties and patterns in Table 3 to detect three new classes of cross-chain bridge bugs. Respectively, \(\mathcal{ROI}\) ensures every valid deposit event has a corresponding valid lock event to detect the deposit-without-lock violations in the UDE bug. \(\mathcal{CP}\) detects the IEP bug by ensuring every off-chain action \(\mathbb{A}_{lk}\) is parsed from a valid and consistent \(\mathbb{B}_{dep}\). And \(\mathcal{HU}\) ensures every unlock event must be caused by an authorized unlock action \(\mathbb{A}_{lk}\) from the off-chain relayer to characterize the UU bug.

## 3. Tool Overview

Based on these security properties and patterns, we propose Xscope, an automatic tool to detect cross-chain bridge attacks. Xscope provides two modes to use: runtime monitoring and offline analyzing. In runtime monitoring mode, it is deployed as an extension of the off-chain relayer to enforce security properties and abort malicious requests. Specifically, the off-chain relayer will additionally call Xscope after generating outgoing transactions at step 7 in Figure 1. Then, Xscope will pre-execute the outgoing transactions to get complete execution sequences from \(\mathbb{B}_{lk}\) to \(\mathbb{B}_{unilk}\) and detect security violations in them. If a violation is detected, the relayer will abort the outgoing transactions to prevent potential loss. In offline analyzing mode, Xscope passively analyses historical requests and issues warnings for suspicious execution sequences.

Correspondingly, Xscope provides twofold benefits. With runtime monitoring mode, it protects existing bridges from real-world attacks with updatable and flexible security patterns. With off-line analyzing mode, it provides efficient forensics and accurate error location for bridges to investigate past or ongoing attacks.

Figure 2 shows the architecture of Xscope. The Chain Connector and Relayer Adaptor provide a consistent interface above different blockchains and relayers. They transform on-chain events and off-chain actions into logical representations and feed them into the Analyzer. The Analyzer uses Z3 as SMT Solver to detect violations in each execution sequence. Additionally, the Configurator is introduced to support user-specific configurations, _e.g._, filtering out transactions from specific addresses or importing external knowledge like a blacklist. The Task Manager is designed to schedule

\begin{table}
\begin{tabular}{l l l} \hline \hline
**Security Fact** & **Intuitive Meaning** & **Inference Rule** \\ \hline \(V(\mathbb{B}_{lk})\) & Lock Real Asset to Router Contract & \(\mathbb{B}_{lk}.sc^{s}\)=\(\mathbb{B}_{lk}.asset^{s}\)\(\times\)\(\mathbb{B}_{lk}.to^{s}\)=\(routerContract^{s}\) \\ \(V(\mathbb{B}_{dep})\) & Real \(\mathbb{B}_{dep}\) Generated by Router Contract & \(\mathbb{B}_{dep}.sc^{c}\)=\(routerContract^{s}\) \\ \(C(\mathbb{B}_{lk}.\mathbb{B}_{dep})\) & Same Asset Type and Amount & \(\mathbb{B}_{lk}.tx^{s}\)=\(\mathbb{B}_{dep}.tx^{s}\)\(\times\)\(\mathbb{B}_{lk}.asset^{s}\)=\(\mathbb{B}_{dep}.asset^{s}\)\(\times\)\(\mathbb{B}_{lk}.amount^{s}\)=\(\mathbb{B}_{dep}.amount^{s}\) \\ \(V(tx^{s})\) & No Lock, No Deposit & \(\forall\mathbb{B}_{dep}\in\mathbb{T}(tx^{s}),\)\(V(\mathbb{B}_{dep})\rightarrow\)\(\exists\)\(\mathbb{B}_{lk}\in\mathbb{T}(tx^{s}),\)\(s.t.\)\(V(\mathbb{B}_{lk})\wedge C(\mathbb{B}_{lk}.\mathbb{B}_{dep})\) \\ \(C(\mathbb{A}_{lk}.\mathbb{B}_{dep})\) & Same Asset Type, Amount and Receiver & \(\mathbb{A}_{lk}.asset^{d}=\mathbb{B}_{dep}.asset^{s}\)\(\wedge\)\(\mathbb{A}_{lk}.amount^{s}\) = \(\mathbb{B}_{dep}.amount^{s}\) \\ \(\wedge\mathbb{A}_{lk}.asset^{d}=\mathbb{B}_{dep}.asset^{d}\wedge\)\(\mathbb{A}_{lk}.to^{d}\)\(\mathbb{B}_{dep}.to^{d}\) \\ \(V(\mathbb{A}_{lk}.tx^{s})\wedge\exists\)\(\mathbb{B}_{dep}\in\mathbb{T}(tx^{s})\)\(s.t.\)\(V(\mathbb{B}_{dep})\wedge C(\mathbb{A}_{lk}.\mathbb{B}_{dep})\) \\ \(C(\mathbb{A}_{lk}.\mathbb{A}_{unilk})\) & Consistent \(\mathbb{A}_{unilk}\) based on Valid \(\mathbb{A}_{lk}\) & \(V(\mathbb{A}_{lk})\wedge\mathbb{A}_{unk}.lb^{d}=\mathbb{A}_{lk}.lb^{d}\wedge \mathbb{A}_{unk}.asset^{d}\)\(\rightarrow\)\(\mathbb{A}_{lk}.asset^{d}\wedge\)\(\mathbb{A}_{unk}.to^{d}\) =\(\mathbb{A}_{lk}.to^{d}\) \\ \(C(\mathbb{A}_{unilk},\mathbb{B}_{unilk})\) & Unlock Right Asset to Right Address & \(\mathbb{B}_{unilk}.asset^{d}\wedge\mathbb{A}_{unk}.asset^{d}\)\(\rightarrow\)\(\mathbb{A}_{unk}.to^{d}\) =\(\mathbb{A}_{unk}.sc^{d}\) \\ \(V(\mathbb{B}_{unilk})\) & Authorized Unlock based on Real Lock & \(\exists\)\(\mathbb{A}_{unilk}.\mathbb{A}_{lk}.s.t.\), \(C(\mathbb{A}_{unk}.\mathbb{B}_{unk})\wedge C(\mathbb{A}_{lk}.\mathbb{A}_{unk}) \wedge V(\mathbb{A}_{lk})\) \\ \hline \hline \end{tabular}
\end{table}
Table 2. Security Facts and Inference Rules for in Cross-Chain Bridges. Representations of notations are listed in Table 1.

\begin{table}
\begin{tabular}{l l l} \hline \hline
**Prop.** & **Description** & **Pattern** \\ \hline \(\mathcal{ROI}\) & Restricted Deposit: No Lock, No Deposit & \(\forall tx^{s},V(tx^{s})\) \\ \(\mathcal{CP}\) & Consistent Parsing: Get Real Actions & \(\forall\mathbb{A}_{lk},\)\(V(\mathbb{A}_{lk})\) \\ \(\mathcal{HU}\) & Authorized Unlock: Unlock as Expected & \(\forall\mathbb{B}_{unilk},\)\(V(\mathbb{B}_{unilk})\) \\ \hline \hline \end{tabular}
\end{table}
Table 3. Security Properties and Patterns to Detects Attacks analysis/monitor tasks, generate reports, and send notifications to users.

An example output of Xscope is shown in Figure 3. In this case, we collect over 2 million historical transactions from a cross-chain bridge named THORChain2 and use Xscope to detect security violations in them. Xscope shows a list containing 56 suspicious transactions clustered in three time periods (Block 12723674-12724474, 12833114-12833448, and 12878663-12878671 on Ethereum), each labeled with relevant bugs. Xscope also supports searching, filtering, and sorting functions based on attributes like block number and transaction hash, which can help cross-chain bridges investigate those transactions efficiently.

Footnote 2: The data is available at https://github.com/Xscope-Tool/Data

## 4. Preliminary Evaluation

In this section, we conduct a preliminary evaluation of Xscope to validate its effectiveness in finding cross-chain bridge attacks. Specifically, we use Xscope to analyze four popular cross-chain bridges between Ethereum and Binance Smart Chain related to six known cross-chain bridge attacks.

We compare detected suspicious transactions given by Xscope with the officially reported attack transactions3. The results in Table 4 show that Xscope not only successively detects all reported attack transactions covering three new classes of attacks in cross-chain bridges, but also detects several unreported attack transactions. In particular, Xscope detects an unreported suspicious transaction 43 days before the major attack in Qubit Bridge on Jan 27, 2022. If this suspicious and unnoticed transaction had been detected just in time, the major attack causing 80M dollars loss might have been prevented. We have reported our findings to the Qubit team.

Footnote 3: The official reports of these attacks and detailed comparison are available at https://github.com/Xscope-Tool/Results

## 5. Related Work

Attack detection for smart contracts (HordChain, 2020; Zhang et al., 2021) and decentralized applications (DApp) (HordChain, 2020) have been widely discussed over the past years. Rodler et al. (Rodler et al., 2020) introduce Sereum to protect contracts against re-entrancy attacks based on runtime monitoring. Zhang et al. (Zhang et al., 2021) propose a tool to detect Ethereum attacks using user-specific detection rules. Su et al. (Su et al., 2020) propose DEFIER to automatically investigate on-chain attack incidents. To our knowledge, they all focus on a single chain and target no cross-chain specific attack. In addition, several previous studies focus on the security of atomic cross-chain swap protocols (HordChain, 2020; Zhang et al., 2021) or generic cross-chain architectures like Polakdot (Kumar et al., 2020) and Cosmos (Cosmos, 2020), which are orthogonal to application-level cross-chain bridges we discuss.

## 6. Conclusion

In this paper, we conduct the first study on the security of cross-chain bridges. We document three new classes of security bugs in cross-chain bridges and introduce a set of security properties and patterns to characterize them. We propose Xscope as an automatic tool to find security violations and detect real-work attacks in cross-chain bridges. Our preliminary evaluation demonstrates the effectiveness of Xscope.

## Acknowledgement

This work was supported by National Key Research and Development Program of China (2020YFB1005802), National Natural Science Foundation of China (62172010), and Beijing Natural Science Foundation (M21040).

## References

* (1)
* (2)
* (3)
* (4) PolyNetwork Community. 2021. _Report_. https://medium.com/poly-network/the-root-cause-of-poly-network-being-hacked-e3bcf27468fb
* (5) THORChain Community. 2021. _Incidents_. https://threatchitect.notin.acite/Incidents-Community-Ltd-4H58388cdf4b4b4b3b6a3b6a50cf476fb
* (6) Maurice Herlihy. 2018. Atomic cross-chain swaps. In _Proceedings of the 2018 ACM symposium on principles of distributed computing_. 245-254.
* (7) Kwon Jae and Buchman Ethan. 2021. _Cosmos Whitepaper_. https://vt.cosmos.network/resources/whitepaper
* (8) Wang Kevin and Choy Donovan. 2021. _In Search of Interpreparability: An Overview of the Cross-Chain Market_. https://crypto.com/research/an_overview_of_the_cross_chain_market-2
* (9) Michael Rodler, Wenting Li, Chassan Karame, and Lucas Davi. 2019. Sereum: Protecting Existing Smart Contracts Against Re-Entrancy Attacks. In _Proceedings of the Network and Distributed System Security Symposium (NDSS'19)_.
* (10) Liya Su, Xinye Shen, Xiangyu Du, Xiaoying Liao, et al. 2021. Evil Under the Sun: Understanding and Discovering Attacks on Ethereum Decentralized Applications. In _30th USENIX Security Symposium (USENIX Security 2)_. 1307-1324.
* (11) Itay Tabary, Matan Yecheli, Alex Manukin, and Itayu Eyal. 2021. MAD-HTLC: because HTLC is array-cheap to attack. In _2021 IEEE Symposium on Security Privacy (SP)_. IEEE, 1230-1248.
* (12) Petar Tsankov, Andrei Dan, Dana Drachsler-Cohen, Arthur Gervais, et al. 2018. Security: Practical security analysis of smart contracts. In _Proceedings of the 2018 ACM SIGSAC Conference on Computer and Communications security_. 67-82.
* (13) Gavin Wood. 2016. Polakdot: Vision for a heterogeneous multi-chain framework. _White Paper_ 21 (2016), 2327-4662.
* (14) Mengya Zhang, Xiaokuan Zhang, Yinqian Zhang, and Zhiguang Lin. 2020. \(TXSPECTOR\): Uncovering attacks in ethereum from transactions. In _29th USENIX Security Symposium (USENIX Security 20)_. 2775-2792.

\begin{table}
\begin{tabular}{c c c c c c} \hline \hline Attack & Bug Type & \begin{tabular}{c} Transactions \\ Reported \\ \end{tabular} & \begin{tabular}{c} Transactions \\ Reported \\ \end{tabular} & \begin{tabular}{c} Transactions Detected \\ Reported \\ \end{tabular} & \begin{tabular}{c} Directed \\ Reported \\ \end{tabular} & 
\begin{tabular}{c} Linear \\ Reported \\ \end{tabular} \\ \hline THORChain \#1 & IEP & 6 & \(6\) (100\%) & +3 & 9 \\ THORChain \#2 & IEP & 41 & \(41\) (100\%) & - & 41 \\ THORChain \#3 & IEP & 6 & \(6\) (100\%) & - & 6 \\ pNetwork & IEP & 3 & \(3\) (100\%) & - & 3 \\ Anyswap & UU & 4 & \(4\) (100\%) & - & 4 \\ Qubit Bridge & UDE & 16 & \(16\) (100\%) & +4 & 20 \\ \hline \hline \end{tabular}
\end{table}
Table 4. Evaluation Results of Xscope

Figure 3. The Output Interface of Xscope

Figure 2. Architecture of Xscope
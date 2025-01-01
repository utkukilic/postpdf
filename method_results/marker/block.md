# Blockchain Meets Database: Design And Implementation Of A Blockchain Relational Database∗

Senthil Nathan1, Chander Govindarajan1, Adarsh Saraf1, Manish Sethi2, and Praveen Jayachandran1 1IBM Research India, 2IBM Industry Platforms USA
1(snatara7, chandg12, adasaraf, praveen.j)@in.ibm.com, 2*manish.sethi1@ibm.com*

## Abstract

In this paper, we design and implement the first-ever decentralized replicated relational database with blockchain properties that we term *blockchain relational database*. We highlight several similarities between features provided by blockchain platforms and a replicated relational database, although they are conceptually different, primarily in their trust model. Motivated by this, we leverage the rich features, decades of research and optimization, and available tooling in relational databases to build a blockchain relational database. We consider a permissioned blockchain model of known, but mutually distrustful organizations each operating their own database instance that are replicas of one another. The replicas execute transactions independently and engage in decentralized consensus to determine the commit order for transactions. We design two approaches, the first where the commit order for transactions is agreed upon prior to executing them, and the second where transactions are executed without prior knowledge of the commit order while the ordering happens in parallel. We leverage serializable snapshot isolation (SSI) to guarantee that the replicas across nodes remain consistent and respect the ordering determined by consensus, and devise a new variant of SSI based on block height for the latter approach. We implement our system on PostgreSQL and present detailed performance experiments analyzing both approaches.

### 1. Introduction

Blockchain has gained immense popularity over recent years, with its application being actively explored in several industries. At its core, it is an immutable append-only log of cryptographically signed transactions, that is replicated and managed in a decentralized fashion through distributed consensus among a set of untrusted parties. Opinion on the technology has varied widely from being hailed as the biggest innovation since the Internet to being considered as another database in disguise. For the first time, we undertake the challenge of explaining blockchain technology from the perspective of concepts well known in databases, and highlight the similarities and differences between the two.

Existing blockchain platforms [17, 51, 39, 14], in an attempt to build something radically new and transformative, rebuild a lot of features provided by databases, and treat it as just a store of information. We take a contrarian view in this paper. By leveraging the rich features and
∗Copyright held by the owner/author(s)
transactional processing capabilities already built into relational databases over decades of research and development, we demonstrate that we can build a blockchain relational database with all features provided by existing blockchain platforms and with better support for complex data types, constraints, triggers, complex queries, and provenance queries.

Furthermore, our approach makes building blockchain applications as easy as building database applications; developers can leverage the rich tooling available for backup, analytics, and integration with existing enterprise systems. Applications that have a strong compliance and audit requirements and need for rich analytical queries such as in financial services that are already built atop relational databases, or ones that are reliant on rich provenance information such as in supply chains are likely to most benefit from the blockchain relational database proposed in this paper.

With a focus on enterprise blockchain applications, we target a permissioned setup of known but untrusted organizations each operating their own independent database nodes but connected together to form a blockchain network. These database nodes need to be replicas of each other but distrust one another. The replication of transaction logs and state among multiple database nodes is possible using master-slave [16, 25, 45, 50] and master-master [25, 48, 50] protocols. In these protocols, the master node is trusted as it is the only node that executes transactions and propagates the final updates to other masters and slaves either synchronously or asynchronously [28]. For synchronous replication in the Master-Master architecture, the serializable order is decided using techniques such as 2-phase commit [38], 3-phase commit [20], a quorum protocol [44] to ensure consistency. Asynchronous replication can result in an intermediate inconsistent state between masters. Various solutions [42, 46] exist to reconcile inconsistency. However, in a blockchain network, one node cannot trust the execution results of another node. Hence, all transactions need to be independently executed on all nodes. Further, such an execution and subsequent commits across multiple untrusted nodes must result in the same serializable order to ensure consistency. As a result, existing replication protocols cannot be used for blockchain networks and hence, we need a novel protocol with a notion of decentralized trust.

Although crash fault-tolerant synchronous commit protocols [29, 49] exist, it involves multiple rounds of communications between database nodes per transaction or a centralized trusted controller. However, applying synchronous commit per transaction on a blockchain network would be very costly as nodes may be globally distributed. Further, a trusted controller cannot be used.

In this paper, we address this key challenge of ensuring that all the untrusted database nodes execute transactions independently and commit them in the same serializable order asynchronously. Towards achieving this, we make two key design choices. First, we modify the database to separate the concerns of concurrent transaction execution and decentralized ordering of blocks of transactions. We leverage ordering through consensus only to order blocks of transactions, and not for the serializable ordering of transactions within a single block. Second, independently at each node, we leverage serializable snapshot isolation (SSI) [23, 43] to execute transactions concurrently and then serially validate
& commit each transaction in a block. to obtain a serializable order that will be the same across all untrusted nodes and respect the ordering of blocks obtained from consensus. Using these ideas, we present two novel approaches, the first where block ordering is performed before transaction execution, and the second where transaction execution happens parallelly without prior knowledge of block ordering, and discuss their trade-offs. We leverage and modify serializable snapshot isolation [43] to create a novel variant which guarantees the same serializable ordering across all nodes. We implement our ideas on PostgreSQL and discuss several subtle challenges we had to overcome. We make the following contributions in this paper:
1. We devise two novel approaches of building a blockchain platform starting from a database, ensuring that a network of untrusted database nodes can remain consistent.

2. We devise a new variant of SSI based on block height to permit transaction execution to happen parallelly with ordering based on consensus.

3. We implement the system in PostgreSQL that required an addition of only 4000 lines of C code and present the modified architecture.

The rest of this paper is organized as follows. We highlight the properties required in a blockchain platform, motivate how several of these are either partially or fully available in relational databases, and identify shortcomings that need to be addressed in §2. We discuss our design in §3 and describe two approaches to transaction processing leveraging serializable snapshot isolation. We provide an account of our prototype implementation on PostgreSQL in §4. In §5, we present a detailed performance study. We discuss related work in §6, future work in §7, and conclude in §8.

### 2. Motivation

Table 1 presents a comparison of properties required by a blockchain platform and features available in relational databases. We argue that there is much to be gained by leveraging and enhancing the features of relational databases to build a permissioned blockchain platform, rather than building one from scratch. This approach helps us leverage the decades of research in relational databases, stable enterprise-ready code with rich features, the large community, libraries, tools and integrations with enterprise applications. Next, we compare blockchains and databases across eight features and the enhancements needed.

(1) Smart contract & transaction: Many blockchain platforms such as Hyperledger Fabric [17], Ethereum [51] and Corda [30] support smart contracts which are functions that manage state on the blockchain ledger. Transactions are invocations of smart contract functions. Independent execution of the smart contract functions by different mutually distrustful peers need to be deterministic. This is similar to stored PL/SQL procedures in relational databases.

Both accept input arguments, retrieve data by executing queries, apply the predefined logic, and write data back to the database. However, the execution of a PL/SQL procedure may not be deterministic when executed independently on multiple nodes if utility functions such as random and timestamp are used. Hence, we need to constrain PL/SQL
procedures to ensure that the execution is deterministic.

(2) User authenticity & non-repudiability: Permissioned blockchain systems employ public key infrastructure for user management and ensuring authenticity. Participating users belong to organizations are permissioned to participate in the blockchain network. Transactions are digitally signed by the invoker and recorded on the blockchain, making them non-repudiable. Relational databases have sophisticated user management capabilities including support for users, roles, groups, and various user authentication options. However, submitted and recorded transactions are not signed by the invoker making them repudiable. Hence, we need invoker's signature on transaction.

(3) Confidentiality & access control: Some permissioned blockchains support the notion of confidentiality, where smart contracts, transactions and data are only accessible by authorized users. In addition, access to invoke functions and to modify data is restricted to specific users. Relational databases have comprehensive support for access control on tables, rows, columns and PL/SQL procedures. Some relational databases even provide features like content-based access control, encryption and isolation of data. Advanced confidentiality features where only a subset of the nodes have access to a particular data element or smart contract can be implemented, although we don't consider that in this paper.

(4) Immutability of transactions and ledger state:
The blockchain ledger is an append-only log of blocks containing sets of transactions that are chained together by adding the hash of each block to it's succeeding block. This makes it difficult for an attacker to tamper with a block and avoid detection. The ledger state can only be modified by invoking smart contract functions recorded as transactions on the blockchain and are immutable otherwise. Although a database logs all submitted transactions, executed queries, and the user information, it isn't possible to detect changes to the log as there are no digital signatures.

(5) Consistent replicated ledger across distrustful nodes: All non-faulty peers in a blockchain must maintain a consistent replica of all transactions and the ledger state. This is ensured by all peers committing transactions in the same sequential order as agreed through consensus. Note that consensus is performed on blocks of transactions rather than on individual transactions to be more performant. Databases support replication of transaction logs and state among nodes using master-slave [16, 25, 45, 50] and master-master [25, 48, 50] protocols. In these protocols, the master node is trusted as it is the only node that executes transactions and propagates the final updates to other masters and slaves. Hence, we need to propose a replication

| Table 1: Similarities between blockchain properties and relational database features.   |                                                |                                         |
|-----------------------------------------------------------------------------------------|------------------------------------------------|-----------------------------------------|
| Blockchain Properties                                                                   | Relational Database Features                   | Enhancement Needed                      |
| Smart contract                                                                          | PL/SQL procedure                               | Deterministic execution                 |
| Authenticity, non-repudiability                                                         | User management with groups and roles          | Crypto-based transaction authentication |
| Access control                                                                          | Role & content-based ACL policies              | None                                    |
| Immutable transaction logs                                                              | Transaction logs                               | Digitally signed transactions           |
| Consistent replicated ledger between untrusted nodes                                                                                         | Master-slave & master-master replication with  | Decentralized trust and transaction ordering determined by consensus                                         |
| trust on transaction ordering and update logs                                           |                                                |                                         |
| Serializable isolation level                                                            | Strict 2-phase locking, optimistic concurrency | Order must respect block ordering obtained through consensus                                         |
| control, serializable snapshot isolation                                                |                                                |                                         |
| Async transaction, notification                                                         | LISTEN & NOTIFY commands                       | None                                    |
| Provenance queries                                                                      | Maintains all versions of a row                | Enable query on historical records      |

protocol with a notion of decentralized trust, while ensuring that the replicas remain consistent.

(6) Serializability isolation, ACID: Blockchain transactions require serializable isolation, in which dirty read, non-repeatable read, phantom reads, and serialization anomalies are not possible. Transactions, when executed in parallel, must follow the same serializable order across all nodes.

Further, transactions should be ACID [22] compliant. Serializable isolation can be achieved in databases by employing:
(i) strict 2-phase locking [38], (ii) optimistic concurrency control [32], or (iii) SSI [23, 43]. This needs to be enhanced to follow the block order as determined through consensus, but can be leveraged to a large extent.

(7) Asynchronous transactions: As transaction processing and consensus may involve a non-trivial delay, clients submit transactions asynchronously and then leverage notification mechanisms to learn whether their transaction was successfully committed. Databases provide support for notification channels and triggers that applications can leverage.

(8) Provenance: The auditable append-only log of transactions in blockchains can be harnessed as a provenance store, for several use cases including supply chain tracking and financial compliance. However, most blockchain platforms today do not support complex queries on historic data or are not optimized for provenance queries. In certain relational databases which support Multi-Version Concurrency Control [19] such as snapshot isolation [18], all versions of a row are maintained and old rows are purged on demand or periodically. However, a SQL query cannot access the old rows. For provenance queries, we need to disable purging and enable queries on the old rows.

### 3. Design Of A Blockchain Database

We identify two approaches to achieve our goal of building a consistent replicated ledger across untrusted nodes starting from a relational database. The first approach, *orderthen-execute*, orders all the transactions through a consensus service and then nodes execute them concurrently, whereas in the second approach, *execute-order-in-parallel*, transaction execution happens on nodes without prior knowledge of ordering while block ordering happens parallelly through a consensus service. Intuitively, while the first approach is simpler and requires fewer modifications to the relational database, the second approach has the potential to achieve better performance. We design and implement both approaches to study their trade-offs.

We first describe the key components of our system in
§3.1. We provide background on Serializable Snapshot Isolation in §3.2 and show later in §3.4 that SSI, if directly applied, does not guarantee serializability and consistency across nodes for the *execute-order-in-parallel* approach. Figure 1 juxtaposes the two proposed approaches and we describe them in detail in §3.3 and §3.4, including a novel SSI
based on block height technique. We discuss security properties of the proposed approaches in §3.5. We describe a mechanism for peer node recovery in §3.6 and then discuss how a permissioned blockchain network can be bootstrapped in §3.7.

### 3
### 3.1 Key Components

We consider a permissioned network of organizations that are known to one another but may be mutually distrustful. The network is private to the participating organizations and a new organization must be permissioned to join the network. Each organization may include clients, database peer nodes and ordering service nodes, which we describe below, that together form the decentralized network.

Client: Each organization has an administrator responsible for onboarding client users onto the network. The administrator and each client have a digital certificate registered with all the database peers in the system, which they use to digitally sign and submit transactions on the network
(we describe the network setup process in §3.7). This helps support authenticity, non-repudiability and access control properties. Clients may also listen on a notification channel to receive transaction status.

Database Peer Node: An organization may run one or more database nodes in the network. All communication to send and receive transactions and blocks happens via a secure communication protocol such as TLS. Each node also has a cryptographic identity (i.e., public key) and all communications are signed and authenticated cryptographically.

Each database node maintains its own replica of the ledger as database files, independently executes smart contracts as stored procedures, and validates and commits blocks of transactions formed by the ordering service.

Ordering Service: Consensus is required to ensure that the untrusted database nodes agree on an ordering of blocks of transactions. In order to leverage the rich literature on consensus algorithms with different trust models, such as crash fault tolerant (e.g., Raft [40], Paxos [34], Zab [31])
and byzantine fault tolerant (e.g., PBFT [24], XFT [37])
consensus we make the ordering service in our system pluggable and agnostic to the database implementation. The ordering service consists of consensus or orderer nodes, each

![3_image_0.png](3_image_0.png)

![3_image_1.png](3_image_1.png)

owned by a different organization. Each orderer node, similar to database nodes, have their own digital certificate or identity. The output of consensus yields a block of transactions, which is then atomically broadcast to all the database nodes. A block consists of (a) a sequence number, (b) a set of transactions, (c) metadata associated with the consensus protocol, (d) hash of the previous block, (e) hash of the current block, i.e., hash (a, b, c, d); and (f) digital signature on the hash of the current block by the orderer node.

### 3.2 Serializable Snapshot Isolation (Ssi)

Strict 2-phase locking (S2PL), optimistic concurrency control (OCC), and SSI are approaches to achieve serializability.

As SSI offers greater concurrency than a S2PL and OCC, we have chosen SSI in our design to ensure serializability. SSI
achieves serializability using a modified snapshot isolation
(SI) technique.

Snapshot Isolation and Anomalies. In SI, each transaction reads from a consistent snapshot of the database comprising of the last committed values that existed at the time the transaction started. Although SI prevents dirty read, non-repeatable read, and phantom read, it cannot guarantee serializability due to SI anomalies [18] which violates consistency (i.e., C in ACID), specifically integrity constraints
(refer to [18, 23, 43] for examples). Hence, Cahill et. al. [23]
proposed SSI to detect and resolve anomalies automatically to ensure serializability.

Background on SI Anomalies. To detect SI anomalies, Adya et. al. [15] proposed Multi-Version Serialization history Graph (MVSG). This graph contains a node per transaction, and an edge from transaction T1 to transaction T2, if T1 must have preceded T2 in the apparent serial order of execution. Three types of dependencies can create these edges:
- *rw-dependency*: if T1 writes a version of some object, and T2 reads the previous version of that object, then T1 appears to have executed after T2, because T2 did not see the update. To represent this, an edge from T2 to T1 with a label rw needs to be added. As we will see, these rw-conflicts are central to SSI. Further, a dependency can also be caused by predicate reads.

- *wr-dependency*: if T1 writes a version of an object, and T2 reads that version, then T1 appears to have executed before T2 (an edge from T1 to T2 with a label wr).

- *ww-dependency*: if T1 writes a version of some object, and T2 replaces that version with the next version, then T1 appears to have executed before T2 (an edge from T1 to T2 with a label ww).

If a cycle is present in the graph, then the execution does not correspond to any serial order, i.e., a SI anomaly has caused a serializability violation. Otherwise, the serial order can be determined using a topological sort.

In SI, a wr or *ww-dependency* from T1 to T2 denotes that T1 must have committed before T2 began. In practice, writes acquire an exclusive lock to prevent *ww-dependency* between two concurrent transactions. A *wr-dependency* also cannot occur between two concurrent transactions. In contrast, only *rw-dependency* occurring between concurrent transactions is relevant when studying serialization anomalies.

Adya et. al. [15] observed that every cycle in a serialization graph contains at least two *rw-dependency* edges.

Fekete et. al. [26] subsequently found that two such edges must be adjacent. Figure 2(a) shows the only possible cycle with two transactions, and Figure 2(b) and (c) show the two possible cycles with three transactions. If any of the transactions is aborted, a serializable order could be achieved.

SSI 
- Resolving Anomalies. SSI automatically detects and resolves anomalies. As tracking rw & wr dependencies, and subsequently detecting cycles is costly, SSI applies heuristics that are anomaly-safe, but could result in false positives. They are:
(1) abort immediately: Cahill et. al. [23] used two flags per transaction T: (a) *inConflict*—set when there is a *rwdependency* from a concurrent transaction to T; (b) *outConflict*—set when there is a *rw-dependency* from T to a concurrent transaction. As soon as both of these flags are set for T, which could lead to an SI anomaly, T is aborted.

(2) abort during commit: Ports et. al. [43] maintained two lists per transaction T: (a) *inConflictList*—maintains a list of concurrent transactions from which there is a *rwdependency* to T. (b) *outConflictList*—maintains a list of concurrent transactions to which T has a *rw-dependency*.

The transactions present in inConflictList of T are called nearConflicts. The transactions present in the inConflictList of each nearConflict are called farConflicts. For e.g., in Figure 2(b), for T2, T1 is a nearConflict and T3 is a farConflict. Recall that *rw-dependency* occurs only between concurrently executing transactions (such as in Figures 2(a) and (b)). For each pair of nearConflict and farConflict, if both transactions are not yet committed, then this heuristic aborts the nearConflict so that an immediate retry can succeed. In contrast, a *wr-dependency* only occurs between a committed and a just commenced transaction (Figure 2(c)). In this case, only if T3 has committed first, its nearConflict T2 is aborted. Otherwise, no transactions are aborted. In other words, while the heuristic does not track *wr-dependency*, it accounts for its possibility and aborts a transaction whose outConflict has committed.

In the next two sections, we describe the transaction flows for (1) Order then Execute; and (2) Execute and Order in Parallel as shown in Figure 1. In both flows, transactions are committed asynchronously across nodes.

### 3.3 Order Then Execute

A transaction submitted by a client in the *order-thenexecute* approach comprises of (a) a unique identifier, (b)
the *username* of the client, (c) the PL/SQL procedure execution command with the name of the procedure and arguments, and (d) a digital signature on the hash(a, b, c)
using the client's private key. The transaction flow consists of four pipelined phases: ordering, execution, committing, and checkpointing, wherein a submitted transaction needs to first be ordered, then executed, and finally committed before recording a checkpoint.

#### 3.3.1 Ordering Phase

Clients submit transactions directly to any one of the ordering service nodes (it is possible for a peer to act as a proxy for the client to submit transactions to the ordering service, as long as the client trusts the peer to not drop its transactions). On a periodic timeout (say every 1 second), the ordering service nodes initiate a consensus protocol among themselves to construct a block of transactions. After constructing a block, the ordering service delivers it to all nodes in the network via atomic broadcast. In Figure 1(a), steps 2 and 3 denote this phase.

#### 3.3.2 Execution Phase

On receiving a block of transactions, each database node verifies whether the received block is in sequence and sent by the ordering service. On successful verification, the node appends the block to a block store which is maintained in the local file system. In parallel, the node retrieves unprocessed blocks one at a time, in the order of their block sequence number, from the block store and performs the following four operations:

1. The database node assigns a thread per transaction
(provided that the identifier present in a transaction's field is unique) to authenticate and execute it. In an append-only *ledger table*, it records each transaction in a block. This *ledger table* is used for recovery as explained in §3.6 and also for provenance queries as demonstrated in §4.2.

2. Each thread retrieves the public key associated with the *username* in the transaction, to verify the user's digital signature. On successful authentication, the username is set for the thread's session which is needed for access control. We leverage the database's access control capabilities without modification.

3. Each thread executes the PL/SQL procedure with the passed arguments as per the transaction. To ensure that on all nodes the transactions are executed on the same committed state, all valid transactions in a block are executed concurrently using the *abort during commit* SSI variant. This helps in ensuring that the set of transactions marked to be committed are the same and that they follow the same serializable order across all nodes.

4. Once a thread completes execution of a transaction, the transaction would be ready to either commit or abort (as per the procedure's execution logic), but waits without proceeding. This is because it could result in a different commit order in different nodes, if the execution completion order is different (which could result in different aborts by SSI in each node).
Only after committing a block of transactions, the execution phase will process the next block. In Figure 1(a), step 4 denotes the execution phase.

#### 3.3.3 Committing Phase

To ensure that the commit order is the same on all nodes, the order in which the transactions get committed is the order in which the transactions appear in the block. Only when all valid transactions are executed and ready to be either committed or aborted, the node serially notifies one thread at a time to proceed further. Every transaction applies the *abort during commit* approach to determine whether to commit, and only then does the next transaction enter the commit stage. While it is possible to apply SSI for all transactions at once to obtain a serializable order, we defer such optimizations for simplicity. The node records the transaction status in the *ledger table* and emits an event via a notification channel to inform the client. In Figure 1(a),
step 5 denotes the committing phase.

There is one additional challenge. In SSI, *ww-dependency* is handled using an exclusive lock. For example, if T1 and T2 are competing to write an object, only one transaction can acquire a lock (say T1) and the other (say T2) must wait for the lock to be released which can happen only after the commit/abort of T1. However, in our system, to ensure consistency across all nodes, the committing phase cannot start unless all transactions complete execution. So, we cannot use locks for *ww-dependency*. However, as the ordering

![5_image_0.png](5_image_0.png)

Example: Execute transaction-1 at snapshot-height 1 Can access only the DB state at block height 1 
=>

## Figure 3: Logical Database Storage To Enable Snapshot Isolation Based On Block Height.

between transactions is determined by consensus and fixed across all nodes, we leverage this to permit both transactions to write to different copies of the object, but subsequently commit only the first as determined by the ordering. We show how such an implementation is possible in §4.

It is noteworthy that certain existing blockchain platforms such as Ethereum also follow an *order-then-execute* approach. However, they execute transactions sequentially in the order they appear in the block to ensure serializability and consistency across nodes, but this affects performance.

In contrast, leveraging SSI to execute transactions concurrently and then sequentially issuing committing as per ordering from consensus, enables us to optimize performance.

#### 3.3.4 Checkpointing Phase

Once all transactions in a block are processed, each node computes the hash of the write set, which is the union of all changes made to the database by the block, and submits it to the ordering service as a proof of execution and commit. When a node receives subsequent blocks, it would receive the hash of write set computed by other nodes. The hash computed by all non-faulty nodes would be the same and the node then proceeds to record a checkpoint (note that this is different from the Write-Ahead Logging checkpointing). It is not necessary to record a checkpoint every block. Instead, the hash of write sets can be computed for a preconfigured number of blocks and then sent to the ordering service. In Figure 1(a), steps 6, 7, and 8 denote the checkpointing phase.

### 3.4 Execute And Order In Parallel

A transaction submitted by a client in the *execute-orderin-parallel* approach comprises of (a) the *username* of the client, (b) the PL/SQL procedure execution command with the name of the procedure and arguments, (c) a block number, (d) a unique identifier which is computed as hash(a, b, c), and (e) a digital signature on the hash(a, b, c, d)
using the client's private key. The transaction flow consists of four phases: execution, ordering, committing, and checkpointing phase. A submitted transaction is executed by the database nodes and in parallel ordered by the ordering nodes and placed in a block. This is followed by the commit and checkpoint phases. We describe each phase in detail below.
##3.4.1 Execution Phase Clients

 submit transactions directly to one of the database nodes. When a node receives a transaction, it assigns a thread to authenticate, forward and execute the transaction.

On successful authentication (same as in the *order-thenexecute* approach), the transaction is forwarded to other database nodes and the ordering service in the background.

The four steps described in §3.3.2 for the execution phase applies for the *execute-order-in-parallel* approach as well, except for the default SSI and the logic to handle duplicate transaction identifiers. This is shown in steps 1-3 in Figure 1(b). Unlike the *order-then-execute* approach where execution of transactions happen *after* ordering and on the committed state from the previous block, in the *executeorder-in-parallel* approach we endeavor to execute and order in parallel. To ensure that the transaction is executing on the same committed data on all nodes, the submitted transaction includes the block height on which it should be executed (the client can obtain this from the peer it is connected with). We propose SSI based on block height as depicted in Figure 3, as the default SSI cannot ensure that transactions are executed on the same committed state on all nodes as each node can be at a different block height depending on its processing speed.

SSI Based on Block Height: In this isolation level, each row of a table contains a creator block number and deleter block number which denote the block that created and deleted this row, respectively (irrespective of the transaction within the block that created it). Note that, creator and deleter block number are part of the implementation for the *orderthen-execute* approach as well, but are used only for provenance queries and are not required for SSI. During a transaction execution, based on the block number specified, the transaction can view the database state comprising of all commits up to this block height as shown in Figure 3. We refer to this specified block number as the transaction's snapshot-height. In other words, a transaction sees all rows with creator lesser than or equal to its snapshot-height. For all such rows, the deleter should be either empty or greater than the snapshot-height. For this SSI to work, we need to maintain all versions of a row and every update should be a flagging of the old row and an insertion of the new row. Every delete should be a marking of deleter.

This facilitates the transaction to be executed on the same committed data on all nodes.

However, the current block (current-block) processed for commit by a node might be either lower or higher than the specified snapshot-height of a transaction. If the current -block is lower, the transaction would start executing once the node completes processing all blocks and transactions up to the specified snapshot-height. If the current-block is higher, the transaction would be executed immediately, but the serializability requirement could be violated because of a phantom or stale data read, which needs to be detected and handled. For example, assume that a transaction is updating all rows in a table which satisfy a given predicate mentioned in a WHERE clause. There is a possibility that a row that satisfies the predicate was committed by a block with a number which is greater than the specified snapshot-height and lesser than or equal to current-block. In this scenario, a phantom read [18] has occurred that violated the serializability. Similarly, a transaction can read a row from a snapshot as of snapshot-height, but if that row was either updated or deleted by a subsequent block it would result in a stale read for this transaction.

In order to ensure serializability, the proposed SSI approach detects such phantom reads and stale data reads to abort the corresponding transaction. To detect and abort

| Table 2: Abort rule for our proposed SSI variants when Transaction T is committing. nearConflict farConflict to commit first Abort same block among conflicts " " nearConflict farConflict " " farConflict nearConflict " % nearConflict farConflict % " farConflict % % nearConflict 
- % none 
-   |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

such a transaction, the proposed approach applies row visibility logic on the committed state:
1. when a row with creator greater than the specified snapshot-height satisfies the given predicate, abort the transaction provided that the deleter is empty
(handles phantom read);
2. when a row with creator lesser than snapshot-height satisfies the given predicate, abort the transaction provided that the deleter is non-empty and greater than snapshot-height (handles stale read).

Further, concurrent transactions which are going to be committed during or after current-block can also create a phantom read or a stale read problem. Such cases are tracked by our proposed SSI as described in the committing phase.

#### 3.4.2 Ordering Phase

Database nodes submit transactions to the ordering service unlike the *order-then-execute* approach. Note that the transactions are being executed in the database nodes while they are being ordered by the ordering service. The rest of the logic is same as explained in §3.3.1 for the *order-thenexecute* approach. In Figure 1(b), the steps 4 and 5 denote the ordering phase.

#### 3.4.3 Committing Phase

Similar to the *order-then-execute* approach, an important pre-condition for entering commit phase is that all transactions in a block must have completed its execution and waiting to proceed with commit/abort. However, there are two key differences compared to the commit phase of *order-thenexecute*. First, after receiving a block, if all transactions are not running (this occurs if the node has not received communication of a transaction from another peer due to maliciousness or network delay), the committer starts executing all missing transactions and waits for their completion before proceeding to the committing phase. Second, unlike the previous approach, it is possible for concurrent transactions to be executing at different snapshot heights (as specified by the respective clients). Further, transactions that are concurrent on one node, may not be concurrent on another, but we need the set of transactions that are decided to be committed to be the same on all nodes. As a result, we don't support blind updates such as UPDATE table SET column = value; which might result in a lock for *ww-dependency* only on a subset of nodes. Note, ww-dependencies are handled in the same way as described in §3.3.3. Further, instead of employing the *abort during commit* variant of SSI, we propose a *block-aware abort during commit* variant of SSI as described next.

SSI variant—block-aware abort during commit. Table 2 presents the abort rules for the proposed SSI variant.

In addition to nearConflict and far- Conflict used in abort during commit, our variant considers two additional parameters:

1. whether the nearConflict and farConflict are in the same block.

2. if they are in the same block, which among them is earlier as per the ordering.
When either or both the conflicts are in the same block as transaction T, it is straightforward to abort the one that comes later in the ordering, and is deterministic on all nodes.

The tricky case is when neither of the conflicts are in the same block. In this case, we abort the *nearConflict* transaction. Note, the nearConflict is not in the same block but executes concurrently with T—this means that the snapshot
-height specified for both could be lesser than or equal to the current block height at the node. With no synchronization on transaction executions between nodes, it is possible for an SI anomaly to occur only at a subset of nodes. To ensure consistency between nodes, we need to ensure that the same set of transactions are aborted on all nodes. Let us consider possible scenarios in other nodes (say T2 is the nearConflict transaction):

1. If T2 is concurrent with T and an anomaly structure is detected, then T2 is aborted as per our heuristic.

2. If T commits before T2 starts execution, then T2 being a nearConflict for T read a stale value and would be aborted as discussed earlier.

3. If T2 is concurrent with T, but T is committed first, then this is a case of a *rw-dependency* where the outConflict has already committed leading to an anomaly structure (similar to Figure 2(c)) and T2 will be aborted in this case as well.
Even if there is no farConflict, the nearConflict would get aborted (if it not in same block as T) as it could result in a stale read only at a subset of nodes. Whereas, in other nodes, it might result in a rw-dependency without an anomaly structure. Hence, we must abort the nearConflict irrespective of the presence of a farConflict, whenever the nearConflict is not in the same block.

The unique identifier used for a transaction must be the hash of (a) the *username* of the client, (b) the PL/SQL procedure execution command with the name of the procedure and arguments, and (c) a block number specified for the SSI
by the client. The reason is that if two different transactions are submitted to two different nodes with the same unique identifier, whichever transaction executes first on a given node is the one that would succeed, whereas the other would fail due to the duplicate identifier. As this can result in an inconsistent state across nodes, the unique identifier is composed of the three fields in the transaction to ensure that no two different transactions have the same identifier.

3.4.4 Checkpointing Phase This phase is same as the one explained in §3.3.4.

### 3.5 Discussion On Security Properties (1) Submission Of Invalid Transactions. A Malicious

client can potentially submit a large number of invalid transactions (e.g., ones that will eventually fail due to stale reads, try to perform operations they do not have access for) in an attempt to launch a denial of service attack. This can be thwarted in one of two ways. First, similar to permissionless blockchain networks, a transaction fee could be levied for each transaction using a native currency (it is possible to implement a native currency in our system if desired).

Second, by monitoring clients and their behavior on the network, it is possible to exclude them from participation. We leave such enhancements for future work as it does not affect the core design of our system.

(2) Obscuration of valid transactions. In *orderexecute* approach, when a malicious orderer node receives a transaction from the user, it might not include the transaction in a block. Similarly, in *execute-order-in-parallel* approach, when a malicious database node receives a transaction from the user, it might not forward the transaction to other database and orderer nodes. In both scenarios, at the client side, the transaction request would timeout. The client can then submit the same transaction to some other orderer or database node depending on the approach. Note that even if the client side timeout was a false alarm (i.e.,
the transaction is forwarded, included in a block and executed), the resubmission of the same transaction does not affect the data consistency as all nodes check for the unique identifier included in the transaction before execution.

In *execute-order-in-parallel* approach, if the database node forwards the transaction to an orderer node but not to other database nodes, eventually the request would be added into a block and delivered to all database nodes. The default committing phase described in §3.4 would take care of executing missing transactions while processing the block.

(3) Withholding of a block or transaction commit. In both approaches, when a malicious database node receives a block, it might skip committing the block or a particular transaction in that block. In such a scenario, the hash computed during the checkpointing phase would differ from other nodes, and it would become evident during the checkpointing process that the malicious node did not commit the block correctly. As other organizations can detect such maliciousness, there is no incentive for the malicious organization to engage in such a scenario. Since, database nodes validate and commit blocks independently of one another, a malicious database node cannot hamper the liveness of the network.

(4) Byzantine ordering nodes. A malicious ordering node could send an incorrect block to database nodes connected to it. If an organization's database node trusts the ordering node it operates, but the ordering node is malicious, then that database node would also become faulty.

This scenario would then be similar to the previous scenario of the database node being malicious. If a database node does not trust the ordering node, it should obtain blocks from 2f + 1 ordering nodes (assuming the consensus algorithm tolerates f failures), to ensure it obtains the correct block after consensus.

(5) Tampering of user data. In both approaches, the user can submit a read query to a single database node to fetch the stored data. A malicious database node can tamper the data and return an incorrect result to the user. The following are two ways to detect such malicious behavior.

The user can submit the query to multiple database nodes and verify whether the results are the same. Otherwise, any of the existing query authentication [35, 36, 41, 52, 53] methods can be used to verify the integrity of query results.

Further, when a stored data is tampered with, it would eventually be identified through the checkpointing phase.

(6) Tampering of blockchain. Each database node stores all blocks in a separate store called the *block store*. If any malicious database node tampers its block store, it will not affect the other replicas maintained at other organizations' node. In order to tamper the block store and not be detected, the database node would need the private cryptographic key of the orderer node as well as the client who submitted the transaction to forge their signatures. Even if the malicious node achieves this, if the majority of the nodes are non-malicious, honest organizations could prove that the malicious organization has tampered with the block store by comparing the replicated chain when a conflict occurs. Only if 51% of the nodes are malicious, a blockchain can be successfully tampered.

### 3.6 Recovery After A Failure

A blockchain network is required to tolerate node failures and we need to ensure that a failed node recovers to a consistent state when it restarts. In both *order-thenexecute* and *execute-order-in-parallel* approaches, the block processing stage has the following two common operations per block: (1) atomically store all transactions information in the *ledger table* along with the block number; (2) atomically store all transactions' status (i.e., commit/abort) in the *ledger table*. Note, only after all transactions get written to write-ahead-logging and the default transaction logs, the step 2 gets executed. A node can fail during any of the above two stages. When the node comes back online, it would execute the following operations to recover the node to a consistent state:

1. Retrieves the last processed block number from the ledger table and checks whether all transactions in the ledger table have a status. Note, as we store all transactions' status atomically, either all transactions must have a status or none.

8 2. If a status is found in the *ledger table* for transactions, it means that the block was committed successfully and no recovery is needed. Note, if a node fails after committing a transaction, during restart, the default recovery mechanism that uses write-ahead logging (WAL) would take care of disk consistency.

3. If a status is not found in the *ledger table* for transactions, a node might have (a) either failed after committing all those transactions but before updating the ledger table with the status, or (b) failed before committing all or some those transactions. If a transaction was successfully committed, the relational database would have recorded the status on the default transaction logs. The node first checks the status of each transaction by reading the default transaction logs. If a status is present for all transactions, the node would update the *ledger table* with the status (i.e., case (a)).
4. If a status is not present in the transaction log for all or some transactions (i.e., case (b)), the node needs to rollback all other committed transactions in the same block. Then the node can start re-executing all transactions as described in §3.3.2 and §3.4.1, commit them, and record the status in the *ledger table*. The rollback of committed transactions is required as we need to execute all transactions in a block parallelly using SSI
at the same time to get a consistent result with other nodes as well.

By the time a node restarts and recovers after a failure, a few more blocks may have been added in the network. When the node receives a block from the ordering service, it would notice a gap in the sequence number due to missing blocks. To ensure consistency, the node then retrieves any missing blocks, processes and commits them one by one. We observe that it is possible to do a single atomic commit for all transactions in a block after validating them serially. This can simplify the recovery process described above, but we have omitted describing this in the interest of simplicity.

### 3.7 Network Bootstrapping

To bootstrap a permissioned network, first, we need to bring up the database and orderer nodes each with their respective admin users and secure communication via TLS between them. We need to then create users & roles for each organization, deploy PL/SQL procedures as smart contracts, and define access control policies.

Setting up database nodes and ordering service.

At network startup, each organization shares data consisting of TLS certificates, domain names of database and orderer nodes, and credentials of admin users (i.e., public keys)
with all other organizations. Each organization then starts its database and orderer nodes with the credentials of all organizations' admin users.

Support for blockchain and non-blockchain schema.

As a part of database node startup, the node creates a default database with two schemas named *blockchain* and *nonblockchain* (the latter being optional for any private data held by the organization). Any transaction submitted to a blockchain schema is treated as a blockchain transaction, which must follow the transaction flow described in §3.3 or §3.4. In the blockchain schema, both users and admins can execute only PL/SQL procedures and individual SELECT statements. Note, individual SELECT statements would not be recorded on the blockchain and can only be a read-only operation. Other individual DML & DDL statements are not allowed to be executed, but only through PL/SQL procedures. On a non-blockchain schema, transactions are executed using the default single node transaction flow implemented in a relational database. The non-blockchain schema in a database node is accessible only by the organization which owns that node. of other organizations can query or submit transactions only on the blockchain schema of the database node and not on the non-blockchain schema. Users of an organization can execute reports or analytical queries combining the blockchain and non-blockchain schema on the node owned by their organization.

Setting up of PL/SQL procedures. To facilitate deployment of smart contracts, each node exposes the following four system smart contracts. These contracts are created in the blockchain schema during the database node startup.

These system smart contracts can only be invoked by organization admins, are considered blockchain transactions and follow the transaction flow described earlier.

1. create_deployTx() creates, replaces or drops a smart contract. The argument to this procedure can be CREATE FUNCTION statement (to create a new smart-contract),
CREATE OR REPLACE FUNCTION (to update an existing smart-contract), or DROP FUNCTION (to delete an existing smart-contract). On a successful execution, this procedure creates a record in the deployment table with the passed argument but does not yet execute it to CREATE/REPLACE/DROP.

2. submit_deployTx() executes the SQL statement present in the deployment table after verifying that an admin from each organization has approved the deployment transaction. If not all organizations have approved, the invocation returns an error. If a smart contract is updated, any uncommitted transactions that executed on an older version of the contract are aborted.

3. approve_deployTx() approves a deployment transaction by adding a digital signature provided by the organization's admin.

4. reject_deployTx() rejects a deployment transaction by adding a digital signature provided by the organization's admin and a reason for the rejection.

5. comment_deployTx(): adds a comment to a deployment transaction. When an admin wants to suggest a change to a smart contract present in a deployment transaction, this system contract can be used.
Further, each node creates three more system smart contracts to create, delete, and update users with cyrptographic credentials. As an invocation of all system smart contracts are recorded as blockchain transactions, the network holds an immutable transaction log and a history of approvals from organizations before deploying smart contracts. For access control policies, the network cannot rely on the system contract as it is unware of tables to be created and privileges for each user. Hence, access control policies need to be embedded within a smart contract itself. Once user's smart contracts are created successfully using the above system contracts, applications can start invoking them.

### 4. Implementation Using Postgresql

PostgreSQL [11] is the first open source database to implement the *abort during commit* SSI variant [43]. Further, it maintains all rows even after an update or delete and is highly modular and extensible. For these reasons, we chose to modify PostgreSQL to build a blockchain relational database, rather than implementing one from scratch. The modifications only amounted to adding around 4000 lines of C code to implement both approaches. We present relevant background on PostgreSQL in §4.1. Then, in §4.2 and
§4.3, we describe the components we added and modified in PostgreSQL respectively. In §4.4, we present implementation details of a crash fault-tolerant ordering service, and describe the transaction flows in §4.5.

### 4.1 Postgresql Background

PostgreSQL supports three isolation levels—read committed, repeatable read (i.e., SI), and serializable (i.e., SI with detection and mitigation of anomalies). A snapshot comprises of a set of transaction IDs, which were committed

![9_image_0.png](9_image_0.png)

as of the start of this transaction, whose effects are visible. Each row has two additional elements in the header, namely *xmin* and *xmax*, which are the IDs of the transactions that created and deleted the row, respectively. Note, every update to a row is a delete followed by an insert (both in the table and index). Deleted rows are flagged by setting xmax instead of being actually deleted. In other words, PostgreSQL maintains all versions of a row unlike other implementations such as Oracle that update rows in-place and keep a rollback log. This is ideal for our goal of building a blockchain that maintains all versions of data. For each row, a snapshot checks *xmin* and *xmax* to see which of these transactions' ID are included in the snapshot to determine row visibility.

Clients connect to the PostgreSQL server, postgres, using an application interface such as libpq [10]. A backend process [9] is then assigned to each client connection to execute queries. PostgreSQL supports background workers [8]
(additional processes other than backend) to perform other activities such as logical replication and statistics collection.

Note, the postgres server, backends, and background workers coordinate and share data through shared memory regions. Both the shared memory data structures and background workers are easily extensible.

### 4.2 New Components Introduced

Communication Middleware & Block Processor.

We introduced two new background workers: (1) communication middleware to communicate with other nodes and orderer, to transfer and receive transactions/blocks. The received blocks are stored in an append-only file named *pgBlockstore*. Further, the middleware is also responsible for starting a transaction using libpq in the *order-then-execute* flow, and for starting any missing transactions in the *executeorder-in-parallel* flow; (2) block processor to process a block.

It executes the commit phase as described in §3.3.3 and
§3.4.3.

Shared Memory Data Structures. We introduced the following four data structures in the shared memory (the last two are used only for the *execute-order-in-parallel* flow).

1. TxMetadata enables communication and synchronization between block processor and backends executing the transaction (as needed in the commit phase). The block processor uses this data structure to check whether all transactions have completed its execution and to signal each backend to proceed further. Each entry consists of the global transaction identifier (as present in the transaction), transaction ID assigned locally by the node, process id of the backend, a semaphore to denote whether the transaction has completed its execution and waiting for a signal to proceed further, and a final status (i.e., commit/abort).

2. BlockProcessorMetadata helps in signaling block processor from the backend once it commits/aborts a transaction. Additionally, this data structure holds the last committed block number, current block number
(so that the backend can use it to set the creator &
deleter block number in rows), and a semaphore to enable signaling from middleware to block processor.

3. TxWriteSet holds the write-set of each transaction so that after SSI validation and before writing to WAL,
backend can store the creator or deleter in each row. Note, TxWriteSet just keeps a pointer to the row in buffer. For an update, it stores both the old and new row pointer. For delete, it stores only the old row pointer. Further, TxWriteSet is used to compute the hash of the write-set for each block.

4. TxOrder helps backend to apply our proposed *blockaware abort during commit* variant of SSI. It stores the global transaction identifier of each transaction in the block as per the commit order to aid in finding whether a nearCon- flict or farConflict is present in the same block.
Blockchain Related Catalog Tables. We introduced two system catalog tables, *pgLedger* and *pgCerts*. The *pgLedger* is the *ledger table* described in §3.6, and stores information about each transaction such as the global identifier, local transaction ID, query passed in the transaction, client who submitted the transaction, and commit/abort status. It is used for recovery and for supporting provenance queries.

The *pgCerts* table stores the cryptographic credentials of all blockchain users.

| Table 3: Example provenance queries to audit user transactions.                                                         |                                                                                                                                                                                                                 |            |         |               |          |               |      |       |
|-------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|---------|---------------|----------|---------------|------|-------|
| Audit Scenarios                                                                                                         | Queries                                                                                                                                                                                                         |            |         |               |          |               |      |       |
| Get all invoice details from table invoices which were                                                                  | SELECT                                                                                                                                                                                                          | invoices.* | FROM    | invoices,     | pgLedger | WHERE         |      |       |
| updated by a supplier S between blocks 100 and 300                                                                      | pgLedger.blockNumber                                                                                                                                                                                            | BETWEEN    | 100     | AND           | 300      | AND           |      |       |
| pgLedger.user                                                                                                           | =                                                                                                                                                                                                               | S          | AND     | invoices.xmax | =        | pgLedger.txid |      |       |
| AND invoices.deleter IS NULL;                                                                                           |                                                                                                                                                                                                                 |            |         |               |          |               |      |       |
| Get                                                                                                                     | all                                                                                                                                                                                                             | historical | details | of            | an       | invoice       | from | table |
| invoices whose invoiceID (primary key) is k and was updated by either supplier S or manufacturer M in the last 24 hours | SELECT invoices.* FROM invoices, pgLedger WHERE invoiceID = k AND pgLedger.user IN (S, M) AND pgLedger.commitTime > now() - interval '24 hours' AND invoices.xmax = pgLedger.txid AND invoices.deleter IS NULL; |            |         |               |          |               |      |       |

Provenance Query. We introduced a special type of read only query called *provenance*. This query type can see all committed rows present in tables irrespective of whether it is inactive (i.e., marked with *xmax* ) or active. As it can access all historical content, it enables support for very complex analytical and audit queries with the help of *pgLedger*.

Table 3 presents two examples of provenance queries.

### 4.3 Components Modified

Application Interface & Deterministic PL/SQL Procedures. We have enhanced the default application interface, i.e., libpq, with additional APIs to submit blockchain transactions & provenance queries, and fetch the latest block height at the node. To make the PL/SQL procedure deterministic, we have restricted the usage of date/time library, random functions from the mathematics library, sequence manipulation functions, and system information functions.

Further, SELECT statements must specify ORDER BY primary
_key when using LIMIT or FETCH. Additionally, it cannot use row headers such as xmin, *xmax* in WHERE clause.

SSI Based on Block Height. We have added two fields for each row: (i) creator block number, (ii) deleter block number. During commit, these two fields are filled for entries in the TxWriteSet depending on whether an entry is an update, insert, or delete. SI applies a row visibility logic using *xmin* and *xmax* to identify whether a row should be seen by a transaction (as described in §4.1). We enhance the row visibility logic to have additional conditions using the row's creator and deleter block number and the snapshot-height of the transaction (as described in §3.4.1). This is in addition to the default row visibility logic that helps avoid seeing rows updated/deleted by concurrent transactions. During predicate reads, the default visibility logic in PostgreSQL
traverses rows as per the index entries that satisfies the given predicate or traverses the whole table when an index is missing. For our approach to work (mainly to avoid phantom or stale read described in §3.4.1), all read access is enforced to happen via index entries only which satisfies a given predicate clause. Otherwise, there is a high possibility of transactions getting aborted due to false positive phantom or stale read. Hence, if an index is not available for the given predicate clause, nodes abort the transaction.

Further, SELECT * FROM table_name; is not allowed from PL/SQL procedures as it always traverses the whole table. It is possible to implement our approach without the need for an index, but for simplicity we defer such optimizations.

Note, any kind of individual SELECT statements without any writes on the blockchain schema will not be affected by SSI as the transaction would be marked as read-only and would be executed on one node only.

SSI Block-Aware Abort During Commit & wwdependency. For the *execute-order-in-parallel* approach, we have modified the abort rule to follow our proposed rules in Table 2. The modified SSI utilizes the TxOrder data structure in the shared memory. For ww-conflicts, we allow writes to the same object by different transactions (as updates are anyway not in-place in PostgreSQL) by maintaining an array of *xmax* values comprising of transaction IDs of all competing transactions in the row being updated.

During commit, for each old row entry in the TxWriteSet, the backend (corresponding to the transaction that is committing now) checks *xmax* values and marks all other transactions for abort as only one transaction can write to the row to avoid lost update. Finally, it retains only its own transaction ID in the *xmax* field.

### 4.4 Ordering Service

As described in §3.1, any consensus algorithm can be leveraged. For this work we use two different ordering services: an Apache Kafka [1] and ZooKeeper [2] based crash fault tolerant, and a BFT-SMaRt [21] based byzantine fault tolerant ordering service. Clients/peers connect to independent orderer nodes to submit transactions and receive created blocks. Orderer nodes either: 1. connect to a Kafka cluster and publish all received transactions to a *Kafka topic*,
which delivers the transactions in a FIFO order, or 2. submit the transactions to a BFT-SMaRt cluster which is then responsible for totally ordering the received transactions among them. For creating a block of transactions, we use two parameters: *block size*, the maximum number of transactions in a block, and *block timeout*, the maximum time since the first transaction to appear in a block was received. Each orderer node either publishes a *time-to-cut* message to the Kafka topic or sends it to the BFT-SMaRt cluster when its timer expires. The first time-to-cut message is considered to cut a block and all other duplicates are ignored. Once a block is cut, orderer nodes append their signatures to the block, persist the block in filesystem and then send it to connected peers.

### 4.5 Transaction Flow

Figure 4 depicts the new and modified components described in the previous sections and outlines the *executeorder-in-parallel* transaction flow. Since the *order-then-execute* flow is simpler, we omit presenting the details for it in the interest of brevity. The application leverages the blockchain interfaces in libpq to fetch the latest block height and submit the transaction to the PostgreSQL backend. After verifying the client signature leveraging *pgCerts*, the transaction is forwarded to other PostgreSQL nodes and to the ordering service using the communication middleware (the client can also submit the transaction to all peers, rather than

![11_image_0.png](11_image_0.png)

Table 4: Order then execute: micro metrics for an arrival rate of 2100 tps.

bs brr bpr bpt bet bct tet su 10 209.7 163.5 6 5 1 0.2 98.1%
100 20.9 17.9 55.4 47 8.3 0.2 99.1% 500 4.2 3.5 285.4 245 44.3 0.4 99.7%
one peer forwarding to all other peers). The backend updates TxMetadata, executes the transaction leveraging the SSI variant based on *block-aware abort during commit*, and collects the write-set into TxWriteSet. It then sets *readyto-proceed* status in TxMetadata and waits for a signal from the block processor.

Upon receiving the block from the ordering service, the middleware verifies the orderer signature and stores the block in *pgBlockstore*. The block processor retrieves each unprocessed block from the *pgBlockstore* one at a time and adds all transactions to *pgLedger*. It confirms from TxMetadata that all transactions have completed execution and then serially signals each backend as per the order in the block to proceed further. Upon receiving this signal, the backend validates the transaction based on the *block-aware abort during* commit logic as explained in §3.4.3, sets either commit/*abort* status in TxMetadata, and signals the block processor. Once all transactions have been processed, the block processor updates the *pgLedger* table with the status for each transaction.

We are yet to implement the checkpoint flow described in §3.4.4.

### 5. Evaluation

In this section, we study the performance and cost of both our design approaches. We measure performance in terms of throughput and latency. *Throughput* is defined as the average number of unique transactions committed per second in the blockchain network, and *latency* is defined as the average time taken to commit a transaction, measured from the time a client submits it. A transaction is said to be committed in the blockchain network when majority of the nodes commit. The cost is measured in terms of resource utilization such as CPU, memory, disk and network bandwidth utilization. We study the effect on performance and cost by varying several system parameters, namely (a) block size,
(b) transaction arrival rate, (c) smart contract query complexity, (d) deployment model (local/wide area network),
and (e) the number of database nodes (network size).

We use three smart contracts (1) simple contract—inserts values into a table; (2) complex-join contract—performs complex joins between two tables to execute aggregate operations and write the result to a third table; (3) complex-group contract—performs aggregate queries over subgroups in a group and uses order by and limit to write the max aggregate across the subgroups into a table. We illustrate these queries in Appendix A. Note that while simple contract can be implemented in most blockchain platforms today, both complex-join contract and complex-group contract are impossible to implement efficiently. We consider two deployment models, the first where all organizations host their database nodes on a common public cloud data center
(LAN), and second where nodes are hosted independently leading to a multi/hybrid-cloud setup (WAN). In our experiments, the WAN setup involved four data centers spread across four continents. These models help us study the communication overheads of the two approaches. In both deployments, database and orderer nodes were hosted on virtual machines each with 32 vCPUs of Intel Xeon E5-2683 v3 @ 2.00GHz and 64 GB of memory. In the multi-cloud deployment, the network bandwidth between nodes was between 50 and 60 Mbps, whereas, it is 5 Gbps in the single cloud deployment.

In addition to *throughput* and *latency*, we also measure the following seven micro metrics (all as averages) to gain a deeper understanding of system behavior:

1. the block receive rate (brr)—the number of blocks received per second at the middleware from orderer.

2. the block processing rate (bpr)—the number of blocks processed and committed per second at the block processor.

3. the block processing time (bpt in ms)—the time taken to process and commit a block.

4. the block execution time (bet in ms)—the time taken to start all transactions in a block till they suspend for commit/abort.

5. the transaction execution time (tet in ms)—the time taken by the backend to execute a transaction until it suspends for commit/abort.

6. the block commit time (bct in ms)—the time taken to perform the serial commit of all transactions in a block and can be measured as bpt − bet.

7. the missing transactions (mt)—the number of transactions missing per second while processing blocks at the block processor (relevant for *execute-order-in-parallel*).
We define two additional terms: (1) the *peak throughput* as the maximum achieved throughput for a given smart contract type and block size across all possible arrival rates;
(2) the *system utilization* (su) as the fraction of time the block processor is busy (bpb) expressed as a percentage. bpb can be estimated as the average number of blocks processed in 1s (bpr) multiplied by the time taken to process each block (bpt). In an ideal scenario, when peak throughput is achieved, our system utilization should be close to 100%.

Unless mentioned otherwise, our experiments use a single data center with three organizations, each running one database and one orderer node. At the orderer, the block timeout was set to 1s and the block size was varied. We used pgTune [7] to configure PostgreSQL and *max_connection*
(i.e., number of backends) was set to 2600. The arrival rate was load balanced among the orderer nodes in the case of order-then-execute and the database nodes in the case of execute-order-in-parallel.

![12_image_0.png](12_image_0.png)

![12_image_1.png](12_image_1.png)

### 5.1 Block Size And Arrival Rate

Order then Execute. Figure 5(a) plots the *throughput* and *latency* achieved in *order-then-execute* approach using the simple contract. Table 4 presents the micro metrics for an arrival rate of 2100 transactions per second (tps).

With an increase in transaction arrival rate, the throughput increased linearly as expected till it flattened out at around 1800 tps, which was the peak throughput (system utilization close to 100% as shown in Table 4). When the arrival rate was close to or above the peak throughput, the latency increased significantly from an order of 100s of milliseconds to 10s of seconds. For an arrival rate lower than the peak throughput, with an increase in the block size, the latency increased. The reason is that with an increase in block size, it took longer for the orderer to fill a block with transactions leading to an increased block creation time, and hence, a larger waiting time for each transaction at the orderer. For an arrival rate greater than the peak throughput, with an increase in block size, the latency decreased. This is because there was no waiting for transactions to arrive and form a block, and more transactions were executed in parallel. This is also observable as the block processing time
(bpt) of a block of size n was always lesser than the sum of bpt of m blocks each of size nm . For the same reason, with an increase in the block size, the throughput also increased.

Execute and Order in Parallel. Figure 5(b) plots the same for *execute-and-order-in-parallel* approach. Table 5 presents the micro metrics for an arrival rate of 2400 tps.

The maximum throughput achieved was 2700 tps, i.e., 1.5×
higher than what was achieved with *order-then-execute*. Note that the system utilization (su) was only 90%. When the arrival rate was greater than 2700 tps, the throughput started to degrade and su never reached 100%. We believe the reason to be a large number of active backends that resulted in a lot of contention on default shared memory datastructure
(we intend to study this further as part of the future work).

Though the block processing time (bpt) and the block execution time (bet) were observed to be lesser with *executeand-order-in-parallel* as compared to *order-then-execute*, the block commit time (bct) was observed to be higher. This could again be because of a large number of active backends.

Comparison With Ethereum's Order then Execute. Blockchain platforms such as Ethereum also adopt an order-then-execute approach, but execute transactions serially once the block is formed. To emulate this behavior, we made our block processor also execute and commit transactions one at a time. This resulted in a peak throughput of 800 tps (for a block size of 100, although the block size does not matter when we execute serially). This is only about 40% of the throughput achieved with our approach, which supports parallel execution of transactions leveraging SSI. Table 5: Execute and order in parallel: micro metrics for an arrival rate of 2400 tps.

bs brr bpr bpt bet bct tet mt su 10 232.26 232.26 3.86 2.05 1.81 0.58 479 89%
## 5.26 18
100 24.00 24.00 3.57 16.69 3.08 519 84% 500 4.83 4.83 149.64 50.83 98.81 6.27 230 72%
5.2 Smart Contract Complexity Order then Execute. Figure 6(a) plots the peak throughput and micro metrics achieved when using complex-join contract for *order-then-execute*. As observed earlier, with an increase in block size, the throughput increased and reached a peak throughput of 400 tps. This was less than 25% of what was observed with simple contract, primarily because of transaction execution time (tet) increasing by about 160× as compared to simple contract. The block processing time (bpt) and the block execution time (bet) also increased. The CPU and memory utilization for simple contract was 10% and 15 GB respectively, compared to 30% and 15GB for complex-join contract.

Execute and Order in Parallel. Figure 6(b) plots the same for *execute-order-in-parallel*. Both the block processing time (bpt) and the block execution time (bet) were lower as compared the one observed in *order-then-execute*. This is because, by the time the block reaches the block processor, all transactions were either executing or already completed execution. The peak throughput achieved was more than twice that of *order-then-execute*. Unlike *order-thenexecute* approach, this approach permits concurrent execution of a larger number of transactions unrestricted by the block size (in *order-then-execute*, the maximum number of concurrently executing transactions is capped by the block size). This manifested as a significantly larger increase to the transaction execution time tet compared to *order-thenexecute*. For the same reason, the CPU utilization increased to 100%, i.e., 3.3× higher than what was observed for *orderthen-execute*.

In the third complex-group contract smart-contract, for a block size of 100, the maximum throughput achieved for order-then-execute and *execute-order-in-parallel* was 1.75× and 1.6× higher respectively than what was observed with the complex-join contract. We plot the graphs for the same in Figure 7.

### 5.3 Deployment Model And Network Size

Deployment Model. Figure 8(a) plots the peak throughput achieved with both approaches in a multi-cloud deployment. As compared to a single cloud deployment (refer to Figure 6), only the latency increased on average by 100 ms due to the WAN network but the throughput reminded the same for most part except a 4% reduction in the peak

![13_image_0.png](13_image_0.png)

Figure 8: Performance (a) withcomplex contractin amulti-cloud deployment; (b) with different network sizes.

throughput when the block size was 100. In our system, each transaction was only 196 bytes in size, and hence the size of a block with 500 transactions was only about 100 KB. Hence, the lower bandwidth in the multi-cloud deployment did not have a significant impact on the performance that our system can work equally well in a geographically distributed environment.

Network Size Figure 8(b) plots the throughput achieved with kafka and bft based ordering service while varying the number of orderer nodes and fixing the transaction arrival rate to 3000 tps. With an increase in the number of orderer nodes, we observed no impact on the performance of kafkabased ordering service but the performance achieved with bft-based ordering service reduced from 3000 tps to 650 tps as expected due to the communication overhead. With an increase in the number of database nodes alone, the overall system throughput did not get affected but limited by the peak throughput of the ordering service.

### 6. Related Work

Bitcoin [39] and Ethereum [51] adopt an order-execute model, where transactions are first ordered in a block through consensus (such as proof-of-work) and each node validates and commits transactions to its copy of the blockchain by serially executing each transaction. In our *order-execute* approach, we leverage SSI to execute transactions concurrently. Further, such platforms only support a simple keyvalue data model.

Hyperledger Fabric [17] adopts an *execute-then-order* approach, where transactions are first executed and endorsed by multiple nodes, then ordered by consensus, and then followed by serial validation and commit. In contrast, in our *execute-order-in-parallel* approach transaction execution and ordering happen parallelly. Fabric only supports leveldb and couchdb as the underlying database, with support for composite keys and range queries. In contrast, we support the full spectrum of SQL queries in a smart contract (for the first time) with the exception of libraries that could introduce non-determinism and blind updates. Further, by leveraging capabilities already available within a relational database we provide support for complex data types, schemas, constraints, and provenance queries. Performance studies on Fabric [17, 47] have shown that a throughput of 3000 tps can be achieved with goLevelDB as the state database for a simple smart-contract, while the throughput drops to 700 tps with CouchDB.

Hyperledger Composer [4] is a set of collaboration tools for building blockchain business networks utilizing Hyperledger Fabric. It allows a user to write a basic SQL query with limited syntax [5] and internally converts the SQL
query to a JSON selector query [3] supported by CouchDB.

Corda [30] refers to their platform as a decentralized database. Transactions are executed by one node at a time (not parallelly executed by all nodes) and the results are shared with other nodes that have a need to know. There is no notion of a blockchain in Corda. However, optionally, a notary could order transactions and validate them for double spending. Corda uses the H2 embedded SQL engine as the state database. State objects can define a relational mapping, and an object serialization framework is used to store the states in a relational database. This permits querying the database using SQL and also permits rich queries (such as joins) with an organization's private non-blockchain data. However, it does not enable rich query support within the smart contract itself.

Veritas [27] proposes shared verifiable tables using a set of Redis key-value stores each owned by an organization.

Only the verifiability property, i.e., immutable logs, is supported. For ensuring consistency across replicas, it uses a centralized trusted timestamp server to order transactions.

Further, a transaction is executed only on one of the nodes, and each node periodically ships logs of multiple read-write sets to other nodes via a Kafka-based broadcast service. Nodes are trusted to execute and share results correctly with other nodes, and hence is not decentralized. Nodes vote on transactions to resolve any conflicts.

BigchainDB [14] employs Tendermint consensus [33, 12]
over a set of independent MongoDB [6] instances, each owned by a different organization. It supports immutability and decentralization. While the overall goals of BigchainDB are similar to ours, there are fundamental architectural differences. It supports only user tokens/assets similar to Bitcoin and no support for smart contracts. A transaction submitted to BigchainDB is forwarded to Tendermint nodes, which ensure that all the BigchainDB nodes agree on the next block in a Byzantine fault tolerant way. Transactions are serially executed post ordering, similar to Ethereum.

It is evident from the related work that ours is the first blockchain relational database with rich features of both blockchain and databases. Further, the *execute-and-orderin-parallel* approach proposed in this paper is highly novel and we believe it is applicable to centralized replicated databases.

### 7. Discussion And Future Work

In ongoing work, we are studying the performance of both our design approaches in the presence of rw/ww dependencies with two setups: (a) a homogeneous network so that all nodes would be approximately at the same current-block;
(b) a heterogeneous network that could lead to a significant gap in the current-block of different nodes over time.

As stated in §3.3.3 and §3.6, there is a potential to optimize the current implementation by (a) executing the serialization check using all transaction's *inConflictList* and outConflictList at once in a separate background process instead of executing at the backend serially, and (b) committing the whole block atomically rather than one transaction at a time. Optimizations are also possible in our communication layer by leveraging gossip protocols (for larger number of nodes) and batching together transaction replication. We expect the performance to improve with these optimizations.

Over time, the amount of historical data in the network would grow significantly. Hence, we need to enhance the existing pruning tool such as vacuum [13] to remove rows based on fields such as creator, deleter. As privacy is an important consideration for blockchain solutions, there is potential to enhance relational database features such as user management to provide stronger privacy guarantees.

Data privacy can be achieved using database schemas and the concept of channels as in Hyperledger Fabric [17].

### 8. Conclusion

In this paper, we presented the design of a *blockchain* relational database, a decentralized database with replicas managed by different organizations that do not trust one another. The key challenge we addressed is in ensuring that all untrusted replicas commit transactions in the same serializable order that respects the block ordering determined by consensus. We proposed two design approaches that leveraged and modified SSI to achieve this, and devised a new variant of SSI based on block height. Leveraging features already available in databases enables us to better support complex data types, schemas, complex queries and provenance queries that are not provided by blockchain platforms today. We implemented the system on PostgreSQL and presented detailed performance results.

### 9. References [1] Apache Kafka. Https://Kafka.Apache.Org.

[2] Apache zookeeper. http://zookeeper.apache.org. [3] Couchdb selector query.

https://docs.couchdb.org/en/2.2.0/api/database/find.html.

[4] Hyperledger composer.

https://www.hyperledger.org/projects/composer.

[5] Hyperledger composer query language.

https://hyperledger.github.io/composer/v0.19/reference/querylanguage.

[6] Mongodb. https://www.mongodb.com/.

[7] pgtune. https://github.com/gregs1104/pgtune.

[8] Postgresql background worker processes.

https://www.postgresql.org/docs/10/bgworker.html.

[9] Postgresql frontend/backend protocol.

https://www.postgresql.org/docs/10/protocol.html.

[10] Postgresql libpq - c library.

https://www.postgresql.org/docs/10/libpq.html.

[11] Postgresql v10. https://www.postgresql.org/.

[12] Tendermint. https://tendermint.com/.

[13] Vacuum. https://www.postgresql.org/docs/10/sqlvacuum.html.

[14] B. 2018. Bigchaindb: The blockchain database.

https://www.bigchaindb.com/whitepaper/bigchaindbwhitepaper.pdf.

2018.

[15] A. Adya, B. Liskov, and P. O'Neil. Generalized isolation level definitions. In Proceedings of 16th International Conference on Data Engineering (Cat.

No.00CB37073), pages 67–78, Feb 2000.

[16] P. A. Alsberg and J. D. Day. A principle for resilient sharing of distributed resources. In *Proceedings of the* 2Nd International Conference on Software Engineering, ICSE '76, pages 562–570, Los Alamitos, CA, USA, 1976. IEEE Computer Society Press.

[17] E. Androulaki, A. Barger, V. Bortnikov, C. Cachin, K. Christidis, A. De Caro, D. Enyeart, C. Ferris, G. Laventman, Y. Manevich, S. Muralidharan, C. Murthy, B. Nguyen, M. Sethi, G. Singh, K. Smith, A. Sorniotti, C. Stathakopoulou, M. Vukolić, S. W. Cocco, and J. Yellick. Hyperledger fabric: A distributed operating system for permissioned blockchains. In Proceedings of the Thirteenth EuroSys Conference, EuroSys '18, pages 30:1–30:15, New York, NY, USA, 2018. ACM.

[18] H. Berenson, P. Bernstein, J. Gray, J. Melton, E. O'Neil, and P. O'Neil. A critique of ansi sql isolation levels. In Proceedings of the 1995 ACM
SIGMOD International Conference on Management of Data, SIGMOD '95, pages 1–10, New York, NY, USA,
1995. ACM.

[19] P. A. Bernstein and N. Goodman. Multiversion concurrency control—theory and algorithms.

ACM Trans. Database Syst., 8(4):465–483, Dec. 1983.

[20] P. A. Bernstein, V. Hadzilacos, and N. Goodman.

Concurrency Control and Recovery in Database Systems. Addison-Wesley Longman Publishing Co.,
Inc., Boston, MA, USA, 1986.

[21] A. Bessani, J. Sousa, and E. E. P. Alchieri. State machine replication for the masses with bft-smart. In 2014 44th Annual IEEE/IFIP International Conference on Dependable Systems and Networks, pages 355–362, June 2014.

[22] E. Brewer. Cap twelve years later: How the "rules" have changed. *Computer*, 45(2):23–29, Feb 2012.

[23] M. J. Cahill, U. Röhm, and A. D. Fekete. Serializable isolation for snapshot databases. In Proceedings of the 2008 ACM SIGMOD International Conference on Management of Data, SIGMOD '08, pages 729–738, New York, NY, USA, 2008. ACM.

[24] M. Castro and B. Liskov. Practical byzantine fault tolerance. In *Proceedings of the Third Symposium on* Operating Systems Design and Implementation, OSDI
'99, pages 173–186, Berkeley, CA, USA, 1999. USENIX Association.

[25] E. Cecchet, G. Candea, and A. Ailamaki.

Middleware-based database replication: The gaps between theory and practice. In *Proceedings of the* 2008 ACM SIGMOD International Conference on Management of Data, SIGMOD '08, pages 739–752, New York, NY, USA, 2008. ACM.

[26] A. Fekete, D. Liarokapis, E. O'Neil, P. O'Neil, and D. Shasha. Making snapshot isolation serializable.

ACM Trans. Database Syst., 30(2):492–528, June 2005.

[27] J. Gehrke, L. Allen, P. Antonopoulos, A. Arasu, J. Hammer, J. Hunter, R. Kaushik, D. Kossmann, R. Ramamurthy, S. T. V. Setty, J. Szymaszek, A. van Renen, J. Lee, and R. Venkatesan. Veritas: Shared verifiable databases and tables in the cloud. In CIDR 2019, 9th Biennial Conference on Innovative Data Systems Research, Asilomar, CA, USA, January 13-16, 2019, Online Proceedings, 2019.

[28] J. Gray, P. Helland, P. O'Neil, and D. Shasha. The dangers of replication and a solution. In Proceedings of the 1996 ACM SIGMOD International Conference on Management of Data, SIGMOD '96, pages 173–182, New York, NY, USA, 1996. ACM.

[29] J. Gray and L. Lamport. Consensus on transaction commit. *ACM Trans. Database Syst.*, 31(1):133–160, Mar. 2006.

[30] M. Hearn. Corda 2016.

https://www.corda.net/content/corda-technicalwhitepaper.pdf.

[31] F. P. Junqueira, B. C. Reed, and M. Serafini. Zab:
High-performance broadcast for primary-backup systems. In *Proceedings of the 2011 IEEE/IFIP 41st* International Conference on Dependable Systems&Networks, DSN '11, pages 245–256, Washington, DC, USA, 2011. IEEE Computer Society.

[32] H. T. Kung and J. T. Robinson. On optimistic methods for concurrency control. ACM Trans. Database Syst., 6(2):213–226, June 1981.

[33] J. Kwon. Tendermint: Consensus without mining.

2014.

[34] L. Lamport. The part-time parliament. ACM Trans.

Comput. Syst., 16(2):133–169, May 1998.

[35] F. Li, M. Hadjieleftheriou, G. Kollios, and L. Reyzin.

Dynamic authenticated index structures for outsourced databases. In Proceedings of the 2006 ACM SIGMOD International Conference on Management of Data, SIGMOD '06, pages 121–132, New York, NY, USA, 2006. ACM.

[36] F. Li, M. Hadjieleftheriou, G. Kollios, and L. Reyzin.

Authenticated index structures for aggregation queries. *ACM Trans. Inf. Syst. Secur.*,
13(4):32:1–32:35, Dec. 2010.

[37] S. Liu, P. Viotti, C. Cachin, V. Quéma, and M. Vukolic. Xft: Practical fault tolerance beyond crashes. In Proceedings of the 12th USENIX
Conference on Operating Systems Design and Implementation, OSDI'16, pages 485–500, Berkeley, CA, USA, 2016. USENIX Association.

[38] D. A. Menasce, G. J. Popek, and R. R. Muntz. A
locking protocol for resource coordination in distributed databases. In *Proceedings of the 1978* ACM SIGMOD International Conference on Management of Data, SIGMOD '78, pages 2–2, New York, NY, USA, 1978. ACM.

[39] S. Nakamoto. Bitcoin: A peer-to-peer electronic cash system," http://bitcoin.org/bitcoin.pdf.

[40] D. Ongaro and J. Ousterhout. In search of an understandable consensus algorithm. In Proceedings of the 2014 USENIX Conference on USENIX Annual Technical Conference, USENIX ATC'14, pages 305–320, Berkeley, CA, USA, 2014. USENIX
Association.

[41] H. H. Pang and K. . Tan. Authenticating query results in edge computing. In Proceedings. 20th International Conference on Data Engineering, pages 560–571, April 2004.

[42] K. Petersen, M. J. Spreitzer, D. B. Terry, M. M.

Theimer, and A. J. Demers. Flexible update propagation for weakly consistent replication. In Proceedings of the Sixteenth ACM Symposium on Operating Systems Principles, SOSP '97, pages 288–301, New York, NY, USA, 1997. ACM.

[43] D. R. K. Ports and K. Grittner. Serializable snapshot isolation in postgresql. *Proc. VLDB Endow.*,
5(12):1850–1861, Aug. 2012.

[44] S. H. Son. Replicated data management in distributed database systems. *SIGMOD Rec.*, 17(4):62–69, Nov.

1988.

[45] M. Stonebraker. Concurrency control and consistency of multiple copies of data in distributed ingres. IEEE
Transactions on Software Engineering, SE-5(3):188–194, May 1979.

[46] D. B. Terry, M. M. Theimer, K. Petersen, A. J.

Demers, M. J. Spreitzer, and C. H. Hauser. Managing update conflicts in bayou, a weakly connected replicated storage system. In *Proceedings of the* Fifteenth ACM Symposium on Operating Systems Principles, SOSP '95, pages 172–182, New York, NY,
USA, 1995. ACM.

[47] P. Thakkar, S. Nathan, and B. Viswanathan.

Performance benchmarking and optimizing hyperledger fabric blockchain platform. In *2018 IEEE*
26th International Symposium on Modeling, Analysis, and Simulation of Computer and Telecommunication Systems (MASCOTS), pages 264–276, Sep. 2018.

[48] R. H. Thomas. A majority consensus approach to concurrency control for multiple copy databases. ACM
Trans. Database Syst., 4(2):180–209, June 1979.

[49] B. Vandiver, H. Balakrishnan, B. Liskov, and S. Madden. Tolerating byzantine faults in transaction processing systems using commit barrier scheduling. In Proceedings of Twenty-first ACM SIGOPS
Symposium on Operating Systems Principles, SOSP
'07, pages 59–72, New York, NY, USA, 2007. ACM.

[50] M. Wiesmann, F. Pedone, A. Schiper, B. Kemme, and G. Alonso. Understanding replication in databases and distributed systems. In Proceedings 20th IEEE
International Conference on Distributed Computing Systems, pages 464–474, April 2000.

[51] G. Wood. Ethereum: A secure decentralised generalised transaction ledger. *Ethereum project* yellow paper, 2014.

[52] C. Xu, J. Xu, H. Hu, and M. H. Au. When query authentication meets fine-grained access control: A
zero-knowledge approach. In *Proceedings of the 2018* International Conference on Management of Data, SIGMOD '18, pages 147–162, New York, NY, USA,
2018. ACM.

[53] Y. Zhang, J. Katz, and C. Papamanthou. Integridb:
Verifiable sql for outsourced databases. In *Proceedings* of the 22Nd ACM SIGSAC Conference on Computer and Communications Security, CCS '15, pages 1480–1491, New York, NY, USA, 2015. ACM.

## Appendix Smart Contracts Used For Evaluation A.

CREATE TABLE blockchain.simple_query_history(value int);
CREATE OR REPLACE FUNCTION blockchain.insert_simple(num int) RETURNS VOID AS $$
BEGIN
INSERT INTO blockchain.simple_query_history values (num);
END;
$ LANGUAGE PLPGSQL;
Figure 9: Simple query with single inserts into table CREATE TABLE blockchain.join_query_history(value_int); CREATE TABLE blockchain.join_query_tl(id char(15), num1 int, join_string1 char(50));
CREATE TABLE blockchain.join_query_t2(join_string2 char(50), num2_int);
CREATE OR REPLACE FUNCTION blockchain.join_query_transact(param_id char(15)) RETURNS VOID AS $$
DECLARE
value_to_insert INTEGER;
BEGIN
value_to_insert := sum(num1*num2) from blockchain.join_query_t1, blockchain.join_query_t2 | where id = param_id and join_string1 = join_string2; insert into blockchain.join_query_history values(value_to_insert);
END;
$ LANGUAGE PLPGSQL;
Figure 10: Complex queries with joins and aggregates CREATE TABLE blockchain.group query history(value int);
CREATE TABLE blockchain.group_query_tl(category_int, subcategory_int, num_int); CREATE INDEX group query category index ON blockchain.group query t1 USING btree(category);
CREATE OR REPLACE FUNCTION blockchain.group query transact(c int) RETURNS VOID AS $$
DECLARE
value_to_insert INTEGER;
BEGIN
value_to_insert := sum(num) as subcategory_sum from blockchain.group_query_tl | group by category, subcategory having category = c order by subcategory sum desc limit 1; insert into blockchain.group query history values(value to insert);
END;
$ LANGUAGE PLPGSQL;
Figure 11: Complex queries with group-by, order-by, limit and aggregates
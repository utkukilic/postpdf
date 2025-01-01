## Blockchain Meets Database: Design and Implementation

## of a Blockchain Relational Database ∗

## Senthil Nathan^1 , Chander Govindarajan^1 , Adarsh Saraf^1 ,

## Manish Sethi^2 , and Praveen Jayachandran^1

(^1) IBM Research India, (^2) IBM Industry Platforms USA
(^1) (snatara7, chandg12, adasaraf, praveen.j)@in.ibm.com, (^2) manish.sethi1@ibm.com

## ABSTRACT

```
In this paper, we design and implement the first-ever de-
centralized replicated relational database with blockchain
properties that we termblockchain relational database. We
highlight several similarities between features provided by
blockchain platforms and a replicated relational database,
although they are conceptually different, primarily in their
trust model. Motivated by this, we leverage the rich fea-
tures, decades of research and optimization, and available
tooling in relational databases to build a blockchain rela-
tional database. We consider a permissioned blockchain
model of known, but mutually distrustful organizations each
operating their own database instance that are replicas of
one another. The replicas execute transactions indepen-
dently and engage in decentralized consensus to determine
the commit order for transactions. We design two approaches,
the first where the commit order for transactions is agreed
upon prior to executing them, and the second where trans-
actions are executed without prior knowledge of the commit
order while the ordering happens in parallel. We leverage
serializable snapshot isolation (SSI) to guarantee that the
replicas across nodes remain consistent and respect the or-
dering determined by consensus, and devise a new variant
of SSI based on block height for the latter approach. We
implement our system on PostgreSQL and present detailed
performance experiments analyzing both approaches.
```
## 1. INTRODUCTION

```
Blockchain has gained immense popularity over recent
years, with its application being actively explored in several
industries. At its core, it is an immutable append-only log
of cryptographically signed transactions, that is replicated
and managed in a decentralized fashion through distributed
consensus among a set of untrusted parties. Opinion on
the technology has varied widely from being hailed as the
biggest innovation since the Internet to being considered as
another database in disguise. For the first time, we under-
take the challenge of explaining blockchain technology from
the perspective of concepts well known in databases, and
highlight the similarities and differences between the two.
Existing blockchain platforms [17, 51, 39, 14], in an at-
tempt to build something radically new and transforma-
tive, rebuild a lot of features provided by databases, and
treat it as just a store of information. We take a contrar-
ian view in this paper. By leveraging the rich features and
∗Copyright held by the owner/author(s)
```
```
transactional processing capabilities already built into rela-
tional databases over decades of research and development,
we demonstrate that we can build ablockchain relational
databasewith all features provided by existing blockchain
platforms and with better support for complex data types,
constraints, triggers, complex queries, and provenance queries.
Furthermore, our approach makes building blockchain appli-
cations as easy as building database applications; developers
can leverage the rich tooling available for backup, analytics,
and integration with existing enterprise systems. Applica-
tions that have a strong compliance and audit requirements
and need for rich analytical queries such as in financial ser-
vices that are already built atop relational databases, or ones
that are reliant on rich provenance information such as in
supply chains are likely to most benefit from the blockchain
relational database proposed in this paper.
With a focus on enterprise blockchain applications, we
target a permissioned setup of known but untrusted orga-
nizations each operating their own independent database
nodes but connected together to form a blockchain network.
These database nodes need to be replicas of each other but
distrust one another. The replication of transaction logs
and state among multiple database nodes is possible us-
ing master-slave [16, 25, 45, 50] and master-master [25,
48, 50] protocols. In these protocols, the master node is
trusted as it is the only node that executes transactions and
propagates the final updates to other masters and slaves ei-
ther synchronously or asynchronously [28]. For synchronous
replication in the Master-Master architecture, the serializ-
able order is decided using techniques such as 2-phase com-
mit [38], 3-phase commit [20], a quorum protocol [44] to
ensure consistency. Asynchronous replication can result in
an intermediate inconsistent state between masters. Various
solutions [42, 46] exist to reconcile inconsistency. However,
in a blockchain network, one node cannot trust the execu-
tion results of another node. Hence, all transactions need
to be independently executed on all nodes. Further, such
an execution and subsequent commits across multiple un-
trusted nodes must result in the same serializable order to
ensure consistency. As a result, existing replication proto-
cols cannot be used for blockchain networks and hence, we
need a novel protocol with a notion of decentralized trust.
Although crash fault-tolerant synchronous commit proto-
cols [29, 49] exist, it involves multiple rounds of commu-
nications between database nodes per transaction or a cen-
tralized trusted controller. However, applying synchronous
commit per transaction on a blockchain network would be
```
# arXiv:1903.01919v2 [cs.DC] 31 May 2019


very costly as nodes may be globally distributed. Further,
a trusted controller cannot be used.
In this paper, we address this key challenge of ensuring
that all the untrusted database nodes execute transactions
independently and commit them in the same serializable or-
der asynchronously. Towards achieving this, we make two
key design choices. First, we modify the database to sep-
arate the concerns of concurrent transaction execution and
decentralized ordering of blocks of transactions. We leverage
ordering through consensus only to order blocks of transac-
tions, and not for the serializable ordering of transactions
within a single block. Second, independently at each node,
we leverage serializable snapshot isolation (SSI) [23, 43] to
execute transactions concurrently and then serially validate
& commit each transaction in a block. to obtain a serializ-
able order that will be the same across all untrusted nodes
and respect the ordering of blocks obtained from consensus.
Using these ideas, we present two novel approaches, the first
where block ordering is performed before transaction execu-
tion, and the second where transaction execution happens
parallelly without prior knowledge of block ordering, and
discuss their trade-offs. We leverage andmodify serializable
snapshot isolation [43] to create a novel variantwhich guar-
antees the same serializable ordering across all nodes. We
implement our ideas on PostgreSQL and discuss several sub-
tle challenges we had to overcome. We make the following
contributions in this paper:

1. We devise two novel approaches of building a blockchain
    platform starting from a database, ensuring that a net-
    work of untrusted database nodes can remain consis-
    tent.
2. We devise a new variant of SSI based on block height
    to permit transaction execution to happen parallelly
    with ordering based on consensus.
3. We implement the system in PostgreSQL that required
    an addition of only 4000 lines of C code and present
    the modified architecture.

The rest of this paper is organized as follows. We highlight
the properties required in a blockchain platform, motivate
how several of these are either partially or fully available
in relational databases, and identify shortcomings that need
to be addressed in §2. We discuss our design in §3 and
describe two approaches to transaction processing leveraging
serializable snapshot isolation. We provide an account of our
prototype implementation on PostgreSQL in §4. In §5, we
present a detailed performance study. We discuss related
work in §6, future work in §7, and conclude in §8.

## 2. MOTIVATION

Table 1 presents a comparison of properties required by
a blockchain platform and features available in relational
databases. We argue that there is much to be gained by
leveraging and enhancing the features of relational databases
to build a permissioned blockchain platform, rather than
building one from scratch. This approach helps us lever-
age the decades of research in relational databases, stable
enterprise-ready code with rich features, the large commu-
nity, libraries, tools and integrations with enterprise appli-
cations. Next, we compare blockchains and databases across
eight features and the enhancements needed.

```
(1) Smart contract & transaction:Many blockchain
platforms such as Hyperledger Fabric [17], Ethereum [51]
and Corda [30] support smart contracts which are functions
that manage state on the blockchain ledger. Transactions
are invocations of smart contract functions. Independent
execution of the smart contract functions by different mutu-
ally distrustful peers need to be deterministic. This is sim-
ilar to stored PL/SQL procedures in relational databases.
Both accept input arguments, retrieve data by executing
queries, apply the predefined logic, and write data back to
the database. However, the execution of a PL/SQL proce-
dure may not be deterministic when executed independently
on multiple nodes if utility functions such asrandomand
timestampare used. Hence, we need to constrain PL/SQL
procedures to ensure that the execution is deterministic.
(2) User authenticity & non-repudiability:Permis-
sioned blockchain systems employ public key infrastructure
for user management and ensuring authenticity. Participat-
ing users belong to organizations are permissioned to par-
ticipate in the blockchain network. Transactions are digi-
tally signed by the invoker and recorded on the blockchain,
making them non-repudiable. Relational databases have so-
phisticated user management capabilities including support
for users, roles, groups, and various user authentication op-
tions. However, submitted and recorded transactions are
not signed by the invoker making them repudiable. Hence,
we need invoker’s signature on transaction.
(3) Confidentiality & access control:Some permis-
sioned blockchains support the notion of confidentiality, where
smart contracts, transactions and data are only accessible
by authorized users. In addition, access to invoke functions
and to modify data is restricted to specific users. Relational
databases have comprehensive support for access control on
tables, rows, columns and PL/SQL procedures. Some re-
lational databases even provide features like content-based
access control, encryption and isolation of data. Advanced
confidentiality features where only a subset of the nodes have
access to a particular data element or smart contract can be
implemented, although we don’t consider that in this paper.
(4) Immutability of transactions and ledger state:
The blockchain ledger is an append-only log of blocks con-
taining sets of transactions that are chained together by
adding the hash of each block to it’s succeeding block. This
makes it difficult for an attacker to tamper with a block and
avoid detection. The ledger state can only be modified by
invoking smart contract functions recorded as transactions
on the blockchain and are immutable otherwise. Although a
database logs all submitted transactions, executed queries,
and the user information, it isn’t possible to detect changes
to the log as there are no digital signatures.
(5) Consistent replicated ledger across distrustful
nodes: All non-faulty peers in a blockchain must main-
tain a consistent replica of all transactions and the ledger
state. This is ensured by all peers committing transactions
in the same sequential order as agreed through consensus.
Note that consensus is performed on blocks of transactions
rather than on individual transactions to be more perfor-
mant. Databases support replication of transaction logs and
state among nodes using master-slave [16, 25, 45, 50] and
master-master [25, 48, 50] protocols. In these protocols, the
master node is trusted as it is the only node that executes
transactions and propagates the final updates to other mas-
ters and slaves. Hence, we need to propose a replication
```

```
Table 1: Similarities between blockchain properties and relational database features.
Blockchain Properties Relational Database Features Enhancement Needed
Smart contract PL/SQL procedure Deterministic execution
Authenticity, non-repudiability User management with groups and roles Crypto-based transaction authentication
Access control Role & content-based ACL policies None
Immutable transaction logs Transaction logs Digitally signed transactions
Consistent replicated ledger be-
tween untrusted nodes
```
```
Master-slave & master-master replication with
trust on transaction ordering and update logs
```
```
Decentralized trust and transaction or-
dering determined by consensus
Serializable isolation level Strict 2-phase locking, optimistic concurrency
control, serializable snapshot isolation
```
```
Order must respect block ordering ob-
tained through consensus
Async transaction, notification LISTEN & NOTIFY commands None
Provenance queries Maintains all versions of a row Enable query on historical records
```
protocol with a notion of decentralized trust, while ensuring
that the replicas remain consistent.
(6) Serializability isolation, ACID:Blockchain trans-
actions require serializable isolation, in which dirty read,
non-repeatable read, phantom reads, and serialization anoma-
lies are not possible. Transactions, when executed in paral-
lel, must follow the same serializable order across all nodes.
Further, transactions should be ACID [22] compliant. Seri-
alizable isolation can be achieved in databases by employing:
(i) strict 2-phase locking [38], (ii) optimistic concurrency
control [32], or (iii) SSI [23, 43]. This needs to be enhanced
to follow the block order as determined through consensus,
but can be leveraged to a large extent.
(7) Asynchronous transactions:As transaction pro-
cessing and consensus may involve a non-trivial delay, clients
submit transactions asynchronously and then leverage noti-
fication mechanisms to learn whether their transaction was
successfully committed. Databases provide support for noti-
fication channels and triggers that applications can leverage.
(8) Provenance:The auditable append-only log of trans-
actions in blockchains can be harnessed as a provenance
store, for several use cases including supply chain tracking
and financial compliance. However, most blockchain plat-
forms today do not support complex queries on historic data
or are not optimized for provenance queries. In certain rela-
tional databases which support Multi-Version Concurrency
Control [19] such as snapshot isolation [18], all versions of a
row are maintained and old rows are purged on demand or
periodically. However, a SQL query cannot access the old
rows. For provenance queries, we need to disable purging
and enable queries on the old rows.

## 3. DESIGN OF A BLOCKCHAIN DATABASE

We identify two approaches to achieve our goal of building
a consistent replicated ledger across untrusted nodes start-
ing from a relational database. The first approach,order-
then-execute, orders all the transactions through a consensus
service and then nodes execute them concurrently, whereas
in the second approach,execute-order-in-parallel, transac-
tion execution happens on nodes without prior knowledge
of ordering while block ordering happens parallelly through
a consensus service. Intuitively, while the first approach is
simpler and requires fewer modifications to the relational
database, the second approach has the potential to achieve
better performance. We design and implement both ap-
proaches to study their trade-offs.
We first describe the key components of our system in

```
§3.1. We provide background on Serializable Snapshot Iso-
lation in §3.2 and show later in §3.4 that SSI, if directly
applied, does not guarantee serializability and consistency
across nodes for theexecute-order-in-parallelapproach. Fig-
ure 1 juxtaposes the two proposed approaches and we de-
scribe them in detail in §3.3 and §3.4, including a novel SSI
based on block height technique. We discuss security prop-
erties of the proposed approaches in §3.5. We describe a
mechanism for peer node recovery in §3.6 and then discuss
how a permissioned blockchain network can be bootstrapped
in §3.7.
```
## 3.1 Key Components

```
We consider a permissioned network of organizations that
are known to one another but may be mutually distrustful.
The network is private to the participating organizations
and a new organization must be permissioned to join the
network. Each organization may include clients, database
peer nodes and ordering service nodes, which we describe
below, that together form the decentralized network.
Client:Each organization has an administrator respon-
sible for onboarding client users onto the network. The ad-
ministrator and each client have a digital certificate regis-
tered with all the database peers in the system, which they
use to digitally sign and submit transactions on the network
(we describe the network setup process in §3.7). This helps
support authenticity, non-repudiability and access control
properties. Clients may also listen on a notification channel
to receive transaction status.
Database Peer Node:An organization may run one or
more database nodes in the network. All communication to
send and receive transactions and blocks happens via a se-
cure communication protocol such as TLS. Each node also
has a cryptographic identity (i.e., public key) and all com-
munications are signed and authenticated cryptographically.
Each database node maintains its own replica of the ledger
as database files, independently executes smart contracts
as stored procedures, and validates and commits blocks of
transactions formed by the ordering service.
Ordering Service:Consensus is required to ensure that
the untrusted database nodes agree on an ordering of blocks
of transactions. In order to leverage the rich literature on
consensus algorithms with different trust models, such as
crash fault tolerant (e.g., Raft [40], Paxos [34], Zab [31])
and byzantine fault tolerant (e.g., PBFT [24], XFT [37])
consensus we make the ordering service in our system plug-
gable and agnostic to the database implementation. The
ordering service consists of consensus or orderer nodes, each
```

```
T1: invoke 
smart­contract
foo(args) at
height 'n'
```
```
1
```
(^22) T
2
Notify 5 block
Client
5
5
**(b) Execute and Order In Parallel**
Client­1 form 
Org­
Database Node
of Org­
Database Node
of Org­
Database Node
of Org­N
Ordering 
Service
3 3 3
6 6 commit transactionsas per the order in
block
6
7 7 state change hash^7
state change hashes are
9 9 block^9 added in the next block^
10 10 checkpoints or ^10
point in time rollback
8
executes transactions
concurrently using
proposed SSI
at  **height n**
Client­1 form 
Org­
Database Node
of Org­
Ordering
Service
T1: invoke 
smart­contract
foo(args)
1
4 4 4
performs consensus to 
block construct a block
2
3
Notify
Client
3 3
**(a) Order then Execute**
5 5 5
 executes transactions 
in block concurrently
using proposed SSI
commit transactions^
as per the order in
block
6 6 state change hash^6
state change hashes are 
8 8 block^8 added in the next block^
Database Node
of Org­
Database Node
of Org­N
9 9  checkpoints or ^9
point in time rollback
7
checkpointing
phase
6 7 8 9
2
3
4
5
ordering
phase
execution 
phase
committing
phase
performs consensus to 
construct a block
4
2
3
4
5
execution
phase
ordering
phase
6
checkpointing
phase
7 8 9 10
Figure 1: Proposed transaction flows—order-then-executeandexecute-and-order-in-parallel
T 1 T 2 T 1 T 2 T 3 T 1 T 2 T 3
(a) (b) (c)
rw-dependency wr-dependency
Figure 2: SI Anomalies between 2 and 3 transactions
owned by a different organization. Each orderer node, sim-
ilar to database nodes, have their own digital certificate or
identity. The output of consensus yields a block of transac-
tions, which is then atomically broadcast to all the database
nodes. A block consists of (a) a sequence number, (b) a set
of transactions, (c) metadata associated with the consensus
protocol, (d) hash of the previous block, (e) hash of the cur-
rent block, i.e., hash (a, b, c, d); and (f) digital signature on
the hash of the current block by the orderer node.

## 3.2 Serializable Snapshot Isolation (SSI)

Strict 2-phase locking (S2PL), optimistic concurrency con-
trol (OCC), and SSI are approaches to achieve serializability.
As SSI offers greater concurrency than a S2PL and OCC, we
have chosen SSI in our design to ensure serializability. SSI
achieves serializability using a modified snapshot isolation
(SI) technique.
Snapshot Isolation and Anomalies.In SI, each trans-
action reads from a consistent snapshot of the database com-
prising of the last committed values that existed at the time
the transaction started. Although SI prevents dirty read,
non-repeatable read, and phantom read, it cannot guarantee
serializability due to SI anomalies [18] which violates con-
sistency (i.e., C in ACID), specifically integrity constraints
(refer to [18, 23, 43] for examples). Hence, Cahill et. al. [23]
proposed SSI to detect and resolve anomalies automatically
to ensure serializability.
Background on SI Anomalies.To detect SI anomalies,
Adya et. al. [15] proposed Multi-Version Serialization his-
tory Graph (MVSG). This graph contains a node per trans-
action, and an edge from transactionT 1 to transactionT 2 ,

```
ifT 1 must have precededT 2 in the apparent serial order
of execution. Three types of dependencies can create these
edges:
```
- rw-dependency: ifT 1 writes a version of some object,
    andT 2 reads the previous version of that object, then
    T 1 appears to have executed afterT 2 , becauseT 2 did
    not see the update. To represent this, an edge from
    T 2 toT 1 with a label rw needs to be added. As we
    will see, these rw-conflicts are central to SSI. Further,
    a dependency can also be caused by predicate reads.
- wr-dependency: ifT 1 writes a version of an object,
    andT 2 reads that version, thenT 1 appears to have
    executed beforeT 2 (an edge fromT 1 toT 2 with a label
    wr).
- ww-dependency: ifT 1 writes a version of some object,
    andT 2 replaces that version with the next version,
    thenT 1 appears to have executed beforeT 2 (an edge
    fromT 1 toT 2 with a label ww).

```
If a cycle is present in the graph, then the execution does not
correspond to any serial order, i.e., a SI anomaly has caused
a serializability violation. Otherwise, the serial order can be
determined using a topological sort.
In SI, awrorww-dependencyfromT 1 toT 2 denotes that
T 1 must have committed beforeT 2 began. In practice, writes
acquire an exclusive lock to preventww-dependencybetween
two concurrent transactions. Awr-dependencyalso can-
not occur between two concurrent transactions. In contrast,
onlyrw-dependencyoccurring between concurrent transac-
tions is relevant when studying serialization anomalies.
Adya et. al. [15] observed that every cycle in a serial-
ization graph contains at least tworw-dependencyedges.
Fekete et. al. [26] subsequently found that two such edges
must be adjacent. Figure 2(a) shows the only possible cycle
with two transactions, and Figure 2(b) and (c) show the two
possible cycles with three transactions. If any of the trans-
actions is aborted, a serializable order could be achieved.
SSI - Resolving Anomalies.SSI automatically detects
and resolves anomalies. As tracking rw & wr dependen-
cies, and subsequently detecting cycles is costly, SSI applies
```

heuristics that are anomaly-safe, but could result in false
positives. They are:
(1) abort immediately: Cahill et. al. [23] used two flags
per transaction T: (a)inConflict—set when there is arw-
dependencyfrom a concurrent transaction to T; (b)out-
Conflict—set when there is arw-dependencyfrom T to a
concurrent transaction. As soon as both of these flags are
set for T, which could lead to an SI anomaly, T is aborted.
(2) abort during commit: Ports et. al. [43] maintained
two lists per transaction T: (a)inConflictList—maintains
a list of concurrent transactions from which there is arw-
dependencyto T. (b)outConflictList—maintains a list of
concurrent transactions to which T has arw-dependency.
The transactions present in inConflictList of T are called
nearConflicts. The transactions present in the inCon-
flictList of each nearConflict are calledfarConflicts. For
e.g., in Figure 2(b), forT 2 ,T 1 is a nearConflict andT 3 is
a farConflict. Recall thatrw-dependencyoccurs only be-
tween concurrently executing transactions (such as in Fig-
ures 2(a) and (b)). For each pair of nearConflict and far-
Conflict, if both transactions are not yet committed, then
this heuristic aborts the nearConflict so that an immedi-
ate retry can succeed. In contrast, awr-dependencyonly
occurs between a committed and a just commenced trans-
action (Figure 2(c)). In this case, only ifT 3 has committed
first, its nearConflictT 2 is aborted. Otherwise, no transac-
tions are aborted. In other words, while the heuristic does
not trackwr-dependency, it accounts for its possibility and
aborts a transaction whose outConflict has committed.
In the next two sections, we describe the transaction flows
for (1) Order then Execute; and (2) Execute and Order in
Parallel as shown in Figure 1. In both flows, transactions
are committed asynchronously across nodes.

## 3.3 Order then Execute

A transaction submitted by a client in theorder-then-
executeapproach comprises of (a) a unique identifier, (b)
theusernameof the client, (c) the PL/SQL procedure ex-
ecution command with the name of the procedure and ar-
guments, and (d) a digital signature on thehash(a, b, c)
using the client’s private key. The transaction flow consists
of four pipelined phases: ordering, execution, committing,
and checkpointing, wherein a submitted transaction needs
to first be ordered, then executed, and finally committed
before recording a checkpoint.

### 3.3.1 Ordering phase

Clients submit transactions directly to any one of the or-
dering service nodes (it is possible for a peer to act as a proxy
for the client to submit transactions to the ordering service,
as long as the client trusts the peer to not drop its trans-
actions). On a periodic timeout (say every 1 second), the
ordering service nodes initiate a consensus protocol among
themselves to construct a block of transactions. After con-
structing a block, the ordering service delivers it to all nodes
in the network via atomic broadcast. In Figure 1(a), steps
2 and 3 denote this phase.

### 3.3.2 Execution phase

On receiving a block of transactions, each database node
verifies whether the received block is in sequence and sent
by the ordering service. On successful verification, the node
appends the block to a block store which is maintained in the
local file system. In parallel, the node retrieves unprocessed

```
blocks one at a time, in the order of their block sequence
number, from the block store and performs the following
four operations:
```
1. The database node assigns a thread per transaction
    (provided that the identifier present in a transaction’s
    field is unique) to authenticate and execute it. In an
    append-onlyledger table, it records each transaction
    in a block. Thisledger tableis used for recovery as
    explained in §3.6 and also for provenance queries as
    demonstrated in §4.2.
2. Each thread retrieves the public key associated with
    theusernamein the transaction, to verify the user’s
    digital signature. On successful authentication, the
    usernameis set for the thread’s session which is needed
    for access control. We leverage the database’s access
    control capabilities without modification.
3. Each thread executes the PL/SQL procedure with the
    passed arguments as per the transaction. To ensure
    that on all nodes the transactions are executed on the
    same committed state, all valid transactions in a block
    are executed concurrently using theabort during com-
    mitSSI variant. This helps in ensuring that the set
    of transactions marked to be committed are the same
    and that they follow the same serializable order across
    all nodes.
4. Once a thread completes execution of a transaction,
    the transaction would be ready to either commit or
    abort (as per the procedure’s execution logic), but
    waits without proceeding. This is because it could
    result in a different commit order in different nodes,
    if the execution completion order is different (which
    could result in different aborts by SSI in each node).

```
Only after committing a block of transactions, the execution
phase will process the next block. In Figure 1(a), step 4
denotes the execution phase.
```
### 3.3.3 Committing Phase

```
To ensure that the commit order is the same on all nodes,
the order in which the transactions get committed is the
order in which the transactions appear in the block. Only
when all valid transactions are executed and ready to be
either committed or aborted, the node serially notifies one
thread at a time to proceed further. Every transaction ap-
plies theabort during commitapproach to determine whether
to commit, and only then does the next transaction enter
the commit stage. While it is possible to apply SSI for all
transactions at once to obtain a serializable order, we de-
fer such optimizations for simplicity. The node records the
transaction status in theledger tableand emits an event via
a notification channel to inform the client. In Figure 1(a),
step 5 denotes the committing phase.
There is one additional challenge. In SSI,ww-dependency
is handled using an exclusive lock. For example, ifT 1 and
T 2 are competing to write an object, only one transaction
can acquire a lock (sayT 1 ) and the other (sayT 2 ) must
wait for the lock to be released which can happen only after
the commit/abort ofT 1. However, in our system, to ensure
consistency across all nodes, the committing phase cannot
start unless all transactions complete execution. So, we can-
not use locks forww-dependency. However, as the ordering
```

```
3
2
1
```
```
Current
Block
Height
```
```
DB state at block height 3
```
```
DB state at block height 1
```
```
DB state at block height 2
```
#### Logical Storage

```
Example : Execute
transaction-1 at snapshot-height 1
```
```
Can access only the DB
state at block height 1
```
```
=>
```
Figure 3: Logical Database Storage to Enable Snap-
shot Isolation Based on Block Height.

between transactions is determined by consensus and fixed
across all nodes, we leverage this to permit both transactions
to write to different copies of the object, but subsequently
commit only the first as determined by the ordering. We
show how such an implementation is possible in §4.
It is noteworthy that certain existing blockchain plat-
forms such as Ethereum also follow anorder-then-execute
approach. However, they execute transactions sequentially
in the order they appear in the block to ensure serializability
and consistency across nodes, but this affects performance.
In contrast, leveraging SSI to execute transactions concur-
rently and then sequentially issuing committing as per or-
dering from consensus, enables us to optimize performance.

### 3.3.4 Checkpointing Phase

Once all transactions in a block are processed, each node
computes the hash of the write set, which is the union of
all changes made to the database by the block, and sub-
mits it to the ordering service as a proof of execution and
commit. When a node receives subsequent blocks, it would
receive the hash of write set computed by other nodes. The
hash computed by all non-faulty nodes would be the same
and the node then proceeds to record a checkpoint (note
that this is different from the Write-Ahead Logging check-
pointing). It is not necessary to record a checkpoint every
block. Instead, the hash of write sets can be computed for
a preconfigured number of blocks and then sent to the or-
dering service. In Figure 1(a), steps 6, 7, and 8 denote the
checkpointing phase.

## 3.4 Execute and Order in Parallel

A transaction submitted by a client in theexecute-order-
in-parallelapproach comprises of (a) theusernameof the
client, (b) the PL/SQL procedure execution command with
the name of the procedure and arguments, (c) a block num-
ber, (d) a unique identifier which is computed ashash(a,
b, c), and (e) a digital signature on thehash(a, b, c, d)
using the client’s private key. The transaction flow consists
of four phases: execution, ordering, committing, and check-
pointing phase. A submitted transaction is executed by the
database nodes and in parallel ordered by the ordering nodes
and placed in a block. This is followed by the commit and
checkpoint phases. We describe each phase in detail below.

### 3.4.1 Execution Phase

Clients submit transactions directly to one of the database
nodes. When a node receives a transaction, it assigns a
thread to authenticate, forward and execute the transaction.
On successful authentication (same as in theorder-then-
executeapproach), the transaction is forwarded to other

```
database nodes and the ordering service in the background.
The four steps described in §3.3.2 for the execution phase
applies for theexecute-order-in-parallel approach as well,
except for the default SSI and the logic to handle dupli-
cate transaction identifiers. This is shown in steps 1-3 in
Figure 1(b). Unlike theorder-then-executeapproach where
execution of transactions happenafterordering and on the
committed state from the previous block, in theexecute-
order-in-parallelapproach we endeavor to execute and or-
der in parallel. To ensure that the transaction is executing
on the same committed data on all nodes, the submitted
transaction includes the block height on which it should be
executed (the client can obtain this from the peer it is con-
nected with). We propose SSI based on block height as
depicted in Figure 3, as the default SSI cannot ensure that
transactions are executed on the same committed state on
all nodes as each node can be at a different block height
depending on its processing speed.
SSI Based on Block Height: In this isolation level, each
row of a table contains acreatorblock number anddeleter
block number which denote the block that created and deleted
this row, respectively (irrespective of the transaction within
the block that created it). Note that,creatoranddeleter
block number are part of the implementation for theorder-
then-executeapproach as well, but are used only for prove-
nance queries and are not required for SSI. During a trans-
action execution, based on the block number specified, the
transaction can view the database state comprising of all
commits up to this block height as shown in Figure 3. We
refer to this specified block number as the transaction’s
snapshot-height. In other words, a transaction sees all
rows withcreatorlesser than or equal to itssnapshot-height.
For all such rows, thedeletershould be either empty or
greater than thesnapshot-height. For this SSI to work,
we need to maintain all versions of a row and every update
should be a flagging of the old row and an insertion of the
new row. Every delete should be a marking ofdeleter.
This facilitates the transaction to be executed on the same
committed data on all nodes.
However, the current block (current-block) processed for
commit by a node might be either lower or higher than the
specifiedsnapshot-heightof a transaction. If thecurrent
-blockis lower, the transaction would start executing once
the node completes processing all blocks and transactions up
to the specifiedsnapshot-height. If thecurrent-blockis
higher, the transaction would be executed immediately, but
the serializability requirement could be violated because of a
phantom or stale data read, which needs to be detected and
handled. For example, assume that a transaction is updat-
ing all rows in a table which satisfy a given predicate men-
tioned in aWHERE clause. There is a possibility that a row
that satisfies the predicate was committed by a block with a
number which is greater than the specifiedsnapshot-height
and lesser than or equal tocurrent-block. In this scenario,
a phantom read [18] has occurred that violated the serial-
izability. Similarly, a transaction can read a row from a
snapshot as ofsnapshot-height, but if that row was either
updated or deleted by a subsequent block it would result in
a stale read for this transaction.
In order to ensure serializability, the proposed SSI ap-
proach detects such phantom reads and stale data reads to
abort the corresponding transaction. To detect and abort
```

Table 2:Abort rule for our proposed SSI variants when
Transaction T is committing.
nearConflict farConflict to commit first Abort
same block among conflicts
" " nearConflict farConflict
" " farConflict nearConflict
" % nearConflict farConflict
% " farConflict
% % - nearConflict
% none -

such a transaction, the proposed approach applies row visi-
bility logic on the committed state:

1. when a row withcreatorgreater than the specified
    snapshot-heightsatisfies the given predicate, abort
    the transaction provided that thedeleteris empty
    (handles phantom read);
2. when a row withcreatorlesser thansnapshot-height
    satisfies the given predicate, abort the transaction pro-
    vided that thedeleteris non-empty and greater than
    snapshot-height(handles stale read).

Further, concurrent transactions which are going to be com-
mitted during or aftercurrent-blockcan also create a phan-
tom read or a stale read problem. Such cases are tracked by
our proposed SSI as described in the committing phase.

### 3.4.2 Ordering Phase

Database nodes submit transactions to the ordering ser-
vice unlike theorder-then-executeapproach. Note that the
transactions are being executed in the database nodes while
they are being ordered by the ordering service. The rest of
the logic is same as explained in §3.3.1 for theorder-then-
executeapproach. In Figure 1(b), the steps 4 and 5 denote
the ordering phase.

### 3.4.3 Committing Phase

Similar to theorder-then-executeapproach, an important
pre-condition for entering commit phase is that all transac-
tions in a block must have completed its execution and wait-
ing to proceed with commit/abort. However, there are two
key differences compared to the commit phase oforder-then-
execute. First, after receiving a block, if all transactions are
not running (this occurs if the node has not received com-
munication of a transaction from another peer due to mali-
ciousness or network delay), the committer starts executing
all missing transactions and waits for their completion be-
fore proceeding to the committing phase. Second, unlike the
previous approach, it is possible for concurrent transactions
to be executing at different snapshot heights (as specified by
the respective clients). Further, transactions that are con-
current on one node, may not be concurrent on another, but
we need the set of transactions that are decided to be com-
mitted to be the same on all nodes. As a result, we don’t
support blind updates such asUPDATE table SET column =
value;which might result in a lock forww-dependencyonly
on a subset of nodes. Note, ww-dependencies are handled
in the same way as described in §3.3.3. Further, instead of
employing theabort during commitvariant of SSI, we pro-
pose ablock-aware abort during commitvariant of SSI as
described next.

```
SSI variant—block-aware abort during commit.Ta-
ble 2 presents the abort rules for the proposed SSI variant.
In addition tonearConflictandfar- Conflictused in
abort during commit, our variant considers two additional
parameters:
```
1. whether thenearConflictandfarConflictare in the
    same block.
2. if they are in the same block, which among them is
    earlier as per the ordering.

```
When either or both the conflicts are in the same block
as transaction T, it is straightforward to abort the one that
comes later in the ordering, and is deterministic on all nodes.
The tricky case is when neither of the conflicts are in the
same block. In this case, we abort thenearConflicttransac-
tion. Note, the nearConflict is not in the same block but ex-
ecutes concurrently withT—this means that thesnapshot
-heightspecified for both could be lesser than or equal to
the current block height at the node. With no synchroniza-
tion on transaction executions between nodes, it is possible
for an SI anomaly to occur only at a subset of nodes. To
ensure consistency between nodes, we need to ensure that
the same set of transactions are aborted on all nodes. Let
us consider possible scenarios in other nodes (sayT 2 is the
nearConflict transaction):
```
1. IfT 2 is concurrent withTand an anomaly structure
    is detected, thenT 2 is aborted as per our heuristic.
2. IfTcommits beforeT 2 starts execution, thenT 2 being
    a nearConflict forTread a stale value and would be
    aborted as discussed earlier.
3. IfT 2 is concurrent withT, butTis committed first,
    then this is a case of arw-dependencywhere the out-
    Conflict has already committed leading to an anomaly
    structure (similar to Figure 2(c)) andT 2 will be aborted
    in this case as well.

```
Even if there is no farConflict, the nearConflict would get
aborted (if it not in same block as T) as it could result
in a stale read only at a subset of nodes. Whereas, in
other nodes, it might result in a rw-dependency without an
anomaly structure. Hence, we must abort the nearConflict
irrespective of the presence of a farConflict, whenever the
nearConflict is not in the same block.
The unique identifier used for a transaction must be the
hash of (a) theusernameof the client, (b) the PL/SQL pro-
cedure execution command with the name of the procedure
and arguments, and (c) a block number specified for the SSI
by the client. The reason is that if two different transac-
tions are submitted to two different nodes with the same
unique identifier, whichever transaction executes first on a
given node is the one that would succeed, whereas the other
would fail due to the duplicate identifier. As this can result
in an inconsistent state across nodes, the unique identifier
is composed of the three fields in the transaction to ensure
that no two different transactions have the same identifier.
```
### 3.4.4 Checkpointing Phase

```
This phase is same as the one explained in §3.3.4.
```

## 3.5 Discussion on Security Properties

(1) Submission of invalid transactions.A malicious
client can potentially submit a large number of invalid trans-
actions (e.g., ones that will eventually fail due to stale reads,
try to perform operations they do not have access for) in an
attempt to launch a denial of service attack. This can be
thwarted in one of two ways. First, similar to permission-
less blockchain networks, a transaction fee could be levied
for each transaction using a native currency (it is possible
to implement a native currency in our system if desired).
Second, by monitoring clients and their behavior on the net-
work, it is possible to exclude them from participation. We
leave such enhancements for future work as it does not affect
the core design of our system.
(2) Obscuration of valid transactions. In order-
executeapproach, when a malicious orderer node receives
a transaction from the user, it might not include the trans-
action in a block. Similarly, inexecute-order-in-parallelap-
proach, when a malicious database node receives a trans-
action from the user, it might not forward the transaction
to other database and orderer nodes. In both scenarios, at
the client side, the transaction request would timeout. The
client can then submit the same transaction to some other
orderer or database node depending on the approach. Note
that even if the client side timeout was a false alarm (i.e.,
the transaction is forwarded, included in a block and exe-
cuted), the resubmission of the same transaction does not
affect the data consistency as all nodes check for the unique
identifier included in the transaction before execution.
Inexecute-order-in-parallelapproach, if the database node
forwards the transaction to an orderer node but not to other
database nodes, eventually the request would be added into
a block and delivered to all database nodes. The default
committing phase described in §3.4 would take care of exe-
cuting missing transactions while processing the block.
(3) Withholding of a block or transaction com-
mit.In both approaches, when a malicious database node
receives a block, it might skip committing the block or a
particular transaction in that block. In such a scenario, the
hash computed during the checkpointing phase would differ
from other nodes, and it would become evident during the
checkpointing process that the malicious node did not com-
mit the block correctly. As other organizations can detect
such maliciousness, there is no incentive for the malicious
organization to engage in such a scenario. Since, database
nodes validate and commit blocks independently of one an-
other, a malicious database node cannot hamper the liveness
of the network.
(4) Byzantine ordering nodes.A malicious ordering
node could send an incorrect block to database nodes con-
nected to it. If an organization’s database node trusts the
ordering node it operates, but the ordering node is mali-
cious, then that database node would also become faulty.
This scenario would then be similar to the previous scenario
of the database node being malicious. If a database node
does not trust the ordering node, it should obtain blocks
from 2 f+ 1ordering nodes (assuming the consensus algo-
rithm toleratesffailures), to ensure it obtains the correct
block after consensus.
(5) Tampering of user data.In both approaches, the
user can submit a read query to a single database node to
fetch the stored data. A malicious database node can tam-
per the data and return an incorrect result to the user. The

```
following are two ways to detect such malicious behavior.
The user can submit the query to multiple database nodes
and verify whether the results are the same. Otherwise,
any of the existing query authentication [35, 36, 41, 52, 53]
methods can be used to verify the integrity of query results.
Further, when a stored data is tampered with, it would even-
tually be identified through the checkpointing phase.
(6) Tampering of blockchain. Each database node
stores all blocks in a separate store called theblock store. If
any malicious database node tampers its block store, it will
not affect the other replicas maintained at other organiza-
tions’ node. In order to tamper the block store and not be
detected, the database node would need the private cryp-
tographic key of the orderer node as well as the client who
submitted the transaction to forge their signatures. Even if
the malicious node achieves this, if the majority of the nodes
are non-malicious, honest organizations could prove that the
malicious organization has tampered with the block store by
comparing the replicated chain when a conflict occurs. Only
if 51% of the nodes are malicious, a blockchain can be suc-
cessfully tampered.
```
## 3.6 Recovery After a Failure

```
A blockchain network is required to tolerate node fail-
ures and we need to ensure that a failed node recovers to
a consistent state when it restarts. In bothorder-then-
executeandexecute-order-in-parallelapproaches, the block
processing stage has the following two common operations
per block: (1) atomically store all transactions information
in theledger tablealong with the block number; (2) atom-
ically store all transactions’ status (i.e., commit/abort) in
theledger table. Note, only after all transactions get writ-
ten to write-ahead-logging and the default transaction logs,
the step 2 gets executed. A node can fail during any of
the above two stages. When the node comes back online, it
would execute the following operations to recover the node
to a consistent state:
```
1. Retrieves the last processed block number from the
    ledger tableand checks whether all transactions in the
    ledger tablehave a status. Note, as we store all trans-
    actions’ status atomically, either all transactions must
    have a status or none.
2. If a status is found in theledger tablefor transactions,
    it means that the block was committed successfully
    and no recovery is needed. Note, if a node fails af-
    ter committing a transaction, during restart, the de-
    fault recovery mechanism that uses write-ahead log-
    ging (WAL) would take care of disk consistency.
3. If a status is not found in theledger tablefor trans-
    actions, a node might have (a) either failed after com-
    mitting all those transactions but before updating the
    ledger tablewith the status, or (b) failed before com-
    mitting all or some those transactions. If a transaction
    was successfully committed, the relational database
    would have recorded the status on the default trans-
    action logs. The node first checks the status of each
    transaction by reading the default transaction logs. If
    a status is present for all transactions, the node would
    update theledger tablewith the status (i.e., case (a)).
4. If a status is not present in the transaction log for all
    or some transactions (i.e., case (b)), the node needs to


```
rollback all other committed transactions in the same
block. Then the node can start re-executing all trans-
actions as described in §3.3.2 and §3.4.1, commit them,
and record the status in theledger table. The rollback
of committed transactions is required as we need to
execute all transactions in a block parallelly using SSI
at the same time to get a consistent result with other
nodes as well.
```
By the time a node restarts and recovers after a failure,
a few more blocks may have been added in the network.
When the node receives a block from the ordering service, it
would notice a gap in the sequence number due to missing
blocks. To ensure consistency, the node then retrieves any
missing blocks, processes and commits them one by one.
We observe that it is possible to do a single atomic commit
for all transactions in a block after validating them serially.
This can simplify the recovery process described above, but
we have omitted describing this in the interest of simplicity.

## 3.7 Network Bootstrapping

To bootstrap a permissioned network, first, we need to
bring up the database and orderer nodes each with their
respective admin users and secure communication via TLS
between them. We need to then create users & roles for
each organization, deploy PL/SQL procedures as smart con-
tracts, and define access control policies.
Setting up database nodes and ordering service.
At network startup, each organization shares data consist-
ing of TLS certificates, domain names of database and or-
derer nodes, and credentials of admin users (i.e., public keys)
with all other organizations. Each organization then starts
its database and orderer nodes with the credentials of all
organizations’ admin users.
Support for blockchain and non-blockchain schema.
As a part of database node startup, the node creates a de-
fault database with two schemas namedblockchainandnon-
blockchain(the latter being optional for any private data
held by the organization). Any transaction submitted to a
blockchain schema is treated as a blockchain transaction,
which must follow the transaction flow described in §3.
or §3.4. In the blockchain schema, both users and admins
can execute only PL/SQL procedures and individualSELECT
statements. Note, individualSELECTstatements would not
be recorded on the blockchain and can only be a read-only
operation. Other individual DML & DDL statements are
not allowed to be executed, but only through PL/SQL pro-
cedures. On a non-blockchain schema, transactions are ex-
ecuted using the default single node transaction flow imple-
mented in a relational database. The non-blockchain schema
in a database node is accessible only by the organization
which owns that node. of other organizations can query
or submit transactions only on the blockchain schema of the
database node and not on the non-blockchain schema. Users
of an organization can execute reports or analytical queries
combining the blockchain and non-blockchain schema on the
node owned by their organization.
Setting up of PL/SQL procedures.To facilitate de-
ployment of smart contracts, each node exposes the follow-
ing four system smart contracts. These contracts are created
in the blockchain schema during the database node startup.
These system smart contracts can only be invoked by orga-
nization admins, are considered blockchain transactions and
follow the transaction flow described earlier.

```
1.create_deployTx()creates, replaces or drops a smart
contract. The argument to this procedure can beCREATE
FUNCTIONstatement (to create a new smart-contract),
CREATE OR REPLACE FUNCTION(to update an existing
smart-contract), orDROP FUNCTION(to delete an ex-
isting smart-contract). On a successful execution, this
procedure creates a record in the deployment table
with the passed argument but does not yet execute
it toCREATE/REPLACE/DROP.
```
```
2.submit_deployTx()executes the SQL statement present
in the deployment table after verifying that an admin
from each organization has approved the deployment
transaction. If not all organizations have approved,
the invocation returns an error. If a smart contract is
updated, any uncommitted transactions that executed
on an older version of the contract are aborted.
```
```
3.approve_deployTx()approves a deployment transac-
tion by adding a digital signature provided by the or-
ganization’s admin.
```
```
4.reject_deployTx()rejects a deployment transaction
by adding a digital signature provided by the organi-
zation’s admin and a reason for the rejection.
```
```
5.comment_deployTx(): adds a comment to a deploy-
ment transaction. When an admin wants to suggest
a change to a smart contract present in a deployment
transaction, this system contract can be used.
```
```
Further, each node creates three more system smart con-
tracts to create, delete, and update users with cyrptographic
credentials. As an invocation of all system smart contracts
are recorded as blockchain transactions, the network holds
an immutable transaction log and a history of approvals
from organizations before deploying smart contracts. For
access control policies, the network cannot rely on the sys-
tem contract as it is unware of tables to be created and
privileges for each user. Hence, access control policies need
to be embedded within a smart contract itself. Once user’s
smart contracts are created successfully using the above sys-
tem contracts, applications can start invoking them.
```
## 4. IMPLEMENTATION USING POSTGRESQL

```
PostgreSQL [11] is the first open source database to im-
plement theabort during commitSSI variant [43]. Further,
it maintains all rows even after an update or delete and
is highly modular and extensible. For these reasons, we
chose to modify PostgreSQL to build a blockchain relational
database, rather than implementing one from scratch. The
modifications only amounted to adding around 4000 lines
of C code to implement both approaches. We present rele-
vant background on PostgreSQL in §4.1. Then, in §4.2 and
§4.3, we describe the components we added and modified
in PostgreSQL respectively. In §4.4, we present implemen-
tation details of a crash fault-tolerant ordering service, and
describe the transaction flows in §4.5.
```
## 4.1 PostgreSQL Background

```
PostgreSQL supports three isolation levels—read commit-
ted, repeatable read (i.e., SI), and serializable (i.e., SI with
detection and mitigation of anomalies). A snapshot com-
prises of a set of transaction IDs, which were committed
```

```
(1) [Transaction{uuid, queries}blk#, sig]
libpq jdbc odbc
```
```
application
```
```
postgres
(server)
```
```
postgres backend
fork
exec_simple_query(query)
```
1. Parse/Analyze
2. Plan
3. Execute

```
Shared Memory
```
```
page buffer
background writer
```
```
XLOG: WAL CLOG vaccum Lock
```
```
storage
```
```
Statistics Semaphore
```
```
fork Middleware fork BlockProcessor
```
```
Postgres Node 1
```
```
Postgres Node 2
```
```
jdbc odbc
```
```
application
```
```
Middleware
```
```
(2) Middleware: Forward transaction to other
nodes and ordering service
```
```
Ordering Service
(solo, kafka, pbft)
```
```
Modified SSI
```
```
Crypto
```
```
Denotes modified or newly added module
```
```
TxWriteSet
```
```
BlockProcessor
Metadata
```
```
(2) Execution Phase. Verify user signature. Invoke
Middleware to forward transaction.
```
```
(2) Transaction{uuid, queries} blk#, sig
```
```
TxMetadata
```
```
pgCerts pgBlockstore pgLedger
```
```
(8) Commit Phase. Apply the proposed SSI
```
```
(4) Ordering Phase:
Construct & send the block
```
```
(5) Block
```
```
(5) Block
```
```
(6) Middleware: On receiving the block, verify
orderersignature and store in pgBlockstore
```
```
(7) BlockProcessor : Signal each backend
serially as per transaction order in block. Wait
for all to commit/abort. Update pgLedger.
```
```
TxOrder
```
```
(3) Execute transaction using proposed SSI. Wait for
signal from BlockProcessorbefore either commit/abort.
```
```
libpq
```
```
Figure 4:Transaction Flow in PostgreSQL forexecute-order-in-parallel
```
as of the start of this transaction, whose effects are visi-
ble. Each row has two additional elements in the header,
namelyxminandxmax, which are the IDs of the transac-
tions that created and deleted the row, respectively. Note,
every update to a row is a delete followed by an insert (both
in the table and index). Deleted rows are flagged by set-
ting xmax instead of being actually deleted. In other words,
PostgreSQL maintains all versions of a row unlike other im-
plementations such as Oracle that update rows in-place and
keep a rollback log. This is ideal for our goal of building
a blockchain that maintains all versions of data. For each
row, a snapshot checksxminandxmaxto see which of these
transactions’ ID are included in the snapshot to determine
row visibility.
Clients connect to the PostgreSQL server,postgres, us-
ing an application interface such as libpq [10]. A backend
process [9] is then assigned to each client connection to exe-
cute queries. PostgreSQL supports background workers [8]
(additional processes other than backend) to perform other
activities such as logical replication and statistics collection.
Note, thepostgresserver, backends, and background work-
ers coordinate and share data through shared memory re-
gions. Both the shared memory data structures and back-
ground workers are easily extensible.

## 4.2 New Components Introduced

Communication Middleware & Block Processor.
We introduced two new background workers: (1) commu-
nication middleware to communicate with other nodes and
orderer, to transfer and receive transactions/blocks. The
received blocks are stored in an append-only file namedpg-
Blockstore. Further, the middleware is also responsible for
starting a transaction using libpq in theorder-then-execute
flow, and for starting any missing transactions in theexecute-
order-in-parallelflow; (2) block processor to process a block.
It executes the commit phase as described in §3.3.3 and
§3.4.3.
Shared Memory Data Structures.We introduced the
following four data structures in the shared memory (the last
two are used only for theexecute-order-in-parallelflow).

```
1.TxMetadataenables communication and synchroniza-
tion between block processor and backends execut-
```
```
ing the transaction (as needed in the commit phase).
The block processor uses this data structure to check
whether all transactions have completed its execution
and to signal each backend to proceed further. Each
entry consists of the global transaction identifier (as
present in the transaction), transaction ID assigned lo-
cally by the node, process id of the backend, a semaphore
to denote whether the transaction has completed its
execution and waiting for a signal to proceed further,
and a final status (i.e., commit/abort).
```
```
2.BlockProcessorMetadatahelps in signaling block pro-
cessor from the backend once it commits/aborts a trans-
action. Additionally, this data structure holds the
last committed block number, current block number
(so that the backend can use it to set thecreator&
deleterblock number in rows), and a semaphore to
enable signaling from middleware to block processor.
```
```
3.TxWriteSetholds the write-set of each transaction so
that after SSI validation and before writing to WAL,
backend can store thecreatorordeleterin each row.
Note,TxWriteSetjust keeps a pointer to the row in
buffer. For an update, it stores both the old and new
row pointer. For delete, it stores only the old row
pointer. Further,TxWriteSetis used to compute the
hash of the write-set for each block.
```
```
4.TxOrderhelps backend to apply our proposedblock-
aware abort during commitvariant of SSI. It stores
the global transaction identifier of each transaction in
the block as per the commit order to aid in finding
whether anearCon- flictorfarConflictis present
in the same block.
```
```
Blockchain Related Catalog Tables.We introduced
two system catalog tables,pgLedgerandpgCerts. ThepgLedger
is theledger tabledescribed in §3.6, and stores information
about each transaction such as the global identifier, local
transaction ID, query passed in the transaction, client who
submitted the transaction, and commit/abort status. It is
used for recovery and for supporting provenance queries.
ThepgCertstable stores the cryptographic credentials of
all blockchain users.
```

```
Table 3: Example provenance queries to audit user transactions.
Audit Scenarios Queries
Get all invoice details from tableinvoiceswhich were
updated by a supplierSbetween blocks 100 and 300
```
```
SELECT invoices.* FROM invoices, pgLedger WHERE
pgLedger.blockNumber BETWEEN 100 AND 300 AND
pgLedger.user = S AND invoices.xmax = pgLedger.txid
ANDinvoices.deleterIS NULL;
Get all historical details of an invoice from table
invoiceswhoseinvoiceID (primary key) iskand was
updated by either supplierSor manufacturerMin the
last 24 hours
```
```
SELECTinvoices.*FROMinvoices, pgLedgerWHEREinvoiceID =
kANDpgLedger.userIN (S, M)ANDpgLedger.commitTime
> now() - interval ‘24 hours’ AND invoices.xmax =
pgLedger.txidANDinvoices.deleterIS NULL;
```
Provenance Query. We introduced a special type of
read only query calledprovenance. This query type can see
all committed rows present in tables irrespective of whether
it is inactive (i.e., marked withxmax) or active. As it can
access all historical content, it enables support for very com-
plex analytical and audit queries with the help ofpgLedger.
Table 3 presents two examples of provenance queries.

## 4.3 Components Modified

Application Interface & Deterministic PL/SQL Pro-
cedures.We have enhanced the default application inter-
face, i.e., libpq, with additional APIs to submit blockchain
transactions & provenance queries, and fetch the latest block
height at the node. To make the PL/SQL procedure deter-
ministic, we have restricted the usage of date/time library,
random functions from the mathematics library, sequence
manipulation functions, and system information functions.
Further,SELECTstatements must specifyORDER BY primary
_keywhen usingLIMITorFETCH. Additionally, it cannot use
row headers such asxmin,xmaxinWHERE clause.
SSI Based on Block Height.We have added two fields
for each row: (i)creatorblock number, (ii)deleterblock
number. During commit, these two fields are filled for en-
tries in theTxWriteSetdepending on whether an entry is an
update, insert, or delete. SI applies a row visibility logic us-
ingxminandxmaxto identify whether a row should be seen
by a transaction (as described in §4.1). We enhance the row
visibility logic to have additional conditions using the row’s
creator and deleter block number and thesnapshot-height
of the transaction (as described in §3.4.1). This is in addi-
tion to the default row visibility logic that helps avoid seeing
rows updated/deleted by concurrent transactions. During
predicate reads, the default visibility logic in PostgreSQL
traverses rows as per the index entries that satisfies the
given predicate or traverses the whole table when an in-
dex is missing. For our approach to work (mainly to avoid
phantom or stale read described in §3.4.1), all read access
is enforced to happen via index entries only which satisfies
a given predicate clause. Otherwise, there is a high possi-
bility of transactions getting aborted due to false positive
phantom or stale read. Hence, if an index is not available
for the given predicate clause, nodes abort the transaction.
Further,SELECT * FROM table_name;is not allowed from
PL/SQL procedures as it always traverses the whole table.
It is possible to implement our approach without the need
for an index, but for simplicity we defer such optimizations.
Note, any kind of individualSELECTstatements without any
writes on the blockchain schema will not be affected by SSI
as the transaction would be marked as read-only and would
be executed on one node only.
SSI Block-Aware Abort During Commit & ww-
dependency. For theexecute-order-in-parallel approach,

```
we have modified the abort rule to follow our proposed rules
in Table 2. The modified SSI utilizes theTxOrderdata
structure in the shared memory. For ww-conflicts, we al-
low writes to the same object by different transactions (as
updates are anyway not in-place in PostgreSQL) by main-
taining an array ofxmaxvalues comprising of transaction
IDs of all competing transactions in the row being updated.
During commit, for each old row entry in theTxWriteSet,
the backend (corresponding to the transaction that is com-
mitting now) checksxmaxvalues and marks all other trans-
actions for abort as only one transaction can write to the
row to avoid lost update. Finally, it retains only its own
transaction ID in thexmaxfield.
```
## 4.4 Ordering Service

```
As described in §3.1, any consensus algorithm can be
leveraged. For this work we use two different ordering ser-
vices: an Apache Kafka [1] and ZooKeeper [2] based crash
fault tolerant, and a BFT-SMaRt [21] based byzantine fault
tolerant ordering service. Clients/peers connect to indepen-
dent orderer nodes to submit transactions and receive cre-
ated blocks. Orderer nodes either: 1. connect to a Kafka
cluster and publish all received transactions to aKafka topic,
which delivers the transactions in a FIFO order, or 2. submit
the transactions to a BFT-SMaRt cluster which is then re-
sponsible for totally ordering the received transactions among
them. For creating a block of transactions, we use two pa-
rameters:block size, the maximum number of transactions
in a block, andblock timeout, the maximum time since the
first transaction to appear in a block was received. Each
orderer node either publishes atime-to-cutmessage to the
Kafka topic or sends it to the BFT-SMaRt cluster when its
timer expires. The first time-to-cut message is considered
to cut a block and all other duplicates are ignored. Once
a block is cut, orderer nodes append their signatures to the
block, persist the block in filesystem and then send it to
connected peers.
```
## 4.5 Transaction Flow

```
Figure 4 depicts the new and modified components de-
scribed in the previous sections and outlines theexecute-
order-in-paralleltransaction flow. Since theorder-then-execute
flow is simpler, we omit presenting the details for it in the
interest of brevity. The application leverages the blockchain
interfaces in libpq to fetch the latest block height and sub-
mit the transaction to the PostgreSQL backend. After veri-
fying the client signature leveragingpgCerts, the transaction
is forwarded to other PostgreSQL nodes and to the order-
ing service using the communication middleware (the client
can also submit the transaction to all peers, rather than
```

```
0
```
```
500
```
```
1000
```
```
1500
```
```
2000
```
```
2500
```
```
1200 1500 1800 2100 0.
```
```
0.
```
```
1
```
```
10
```
```
100
```
```
Throughput Latency (sec)
```
```
Transaction Arrival Rate (tps)
```
```
(a) order then execute
```
```
Throughput (block size: 10)
Throughput (block size: 100)
Throughput (block size: 500)
```
```
Latency (block size: 10)
Latency (block size: 100)
Latency (block size: 500)
```
```
5
```
```
500
```
```
1000
```
```
1500
```
```
2000
```
```
2500
```
```
1800 2100 2400 2700 0.
```
```
0.
```
```
1
```
```
10
```
```
100
```
```
Throughput (tps)
Latency (sec)
```
```
Transaction Arrival Rate (tps)
```
```
(b) execute and order in parallel
```
```
Figure 5:Performance withsimple contract
```
Table 4:Order then execute: micro metrics for an ar-
rival rate of 2100 tps.
bs brr bpr bpt bet bct tet su
10 209.7 163.5 6 5 1 0.2 98.1%
100 20.9 17.9 55.4 47 8.3 0.2 99.1%
500 4.2 3.5 285.4 245 44.3 0.4 99.7%

one peer forwarding to all other peers). The backend up-
datesTxMetadata, executes the transaction leveraging the
SSI variant based onblock-aware abort during commit, and
collects the write-set intoTxWriteSet. It then setsready-
to-proceedstatus inTxMetadataand waits for a signal from
the block processor.
Upon receiving the block from the ordering service, the
middleware verifies the orderer signature and stores the block
inpgBlockstore. The block processor retrieves each unpro-
cessed block from thepgBlockstoreone at a time and adds
all transactions topgLedger. It confirms fromTxMetadata
that all transactions have completed execution and then se-
rially signals each backend as per the order in the block to
proceed further. Upon receiving this signal, the backend val-
idates the transaction based on theblock-aware abort during
commitlogic as explained in §3.4.3, sets eithercommit/abort
status inTxMetadata, and signals the block processor. Once
all transactions have been processed, the block processor up-
dates thepgLedgertable with the status for each transaction.
We are yet to implement the checkpoint flow described in
§3.4.4.

## 5. EVALUATION

In this section, we study the performance and cost of both
our design approaches. We measure performance in terms of
throughputandlatency.Throughputis defined as the aver-
age number of unique transactions committed per second in
the blockchain network, andlatencyis defined as the aver-
age time taken to commit a transaction, measured from the
time a client submits it. A transaction is said to be commit-
ted in the blockchain network when majority of the nodes
commit. The cost is measured in terms of resource utiliza-
tion such as CPU, memory, disk and network bandwidth
utilization. We study the effect on performance and cost by
varying several system parameters, namely (a) block size,
(b) transaction arrival rate, (c) smart contract query com-
plexity, (d) deployment model (local/wide area network),
and (e) the number of database nodes (network size).
We use three smart contracts (1)simple contract—inserts
values into a table; (2)complex-join contract—performs
complex joins between two tables to execute aggregate oper-
ations and write the result to a third table; (3)complex-group
contract—performs aggregate queries over subgroups in a
group and uses order by and limit to write the max aggre-
gate across the subgroups into a table. We illustrate these

```
queries in Appendix A. Note that whilesimple contract
can be implemented in most blockchain platforms today,
bothcomplex-join contractandcomplex-group contract
are impossible to implement efficiently. We consider two
deployment models, the first where all organizations host
their database nodes on a common public cloud data center
(LAN), and second where nodes are hosted independently
leading to a multi/hybrid-cloud setup (WAN). In our exper-
iments, the WAN setup involved four data centers spread
across four continents. These models help us study the
communication overheads of the two approaches. In both
deployments, database and orderer nodes were hosted on
virtual machines each with 32 vCPUs of Intel Xeon E5-
v3 @ 2.00GHz and 64 GB of memory. In the multi-cloud
deployment, the network bandwidth between nodes was be-
tween 50 and 60 Mbps, whereas, it is 5 Gbps in the single
cloud deployment.
In addition tothroughputandlatency, we also measure
the following seven micro metrics (all as averages) to gain a
deeper understanding of system behavior:
```
1. the block receive rate (brr)—the number of blocks re-
    ceived per second at the middleware from orderer.
2. the block processing rate (bpr)—the number of blocks
    processed and committed per second at the block pro-
    cessor.
3. the block processing time (bptinms)—the time taken
    to process and commit a block.
4. the block execution time (betinms)—the time taken
    to start all transactions in a block till they suspend for
    commit/abort.
5. the transaction execution time (tetinms)—the time
    taken by the backend to execute a transaction until it
    suspends for commit/abort.
6. the block commit time (bctinms)—the time taken
    to perform the serial commit of all transactions in a
    block and can be measured asbpt−bet.
7. the missing transactions (mt)—the number of transac-
    tions missing per second while processing blocks at the
    block processor (relevant forexecute-order-in-parallel).

```
We define two additional terms: (1) thepeak throughputas
the maximum achieved throughput for a given smart con-
tract type and block size across all possible arrival rates;
(2) thesystem utilization(su) as the fraction of time the
block processor is busy (bpb) expressed as a percentage.bpb
can be estimated as the average number of blocks processed
in 1s (bpr) multiplied by the time taken to process each
block (bpt). In an ideal scenario, when peak throughput is
achieved, our system utilization should be close to100%.
Unless mentioned otherwise, our experiments use a sin-
gle data center with three organizations, each running one
database and one orderer node. At the orderer, the block
timeout was set to 1s and the block size was varied. We used
pgTune[7] to configure PostgreSQL andmax_connection
(i.e., number of backends) was set to 2600. The arrival rate
was load balanced among the orderer nodes in the case of
order-then-executeand the database nodes in the case of
execute-order-in-parallel.
```

```
0
```
```
200
```
```
400
```
```
600
```
```
800
```
```
1000
```
```
10 50 100 0
```
```
50
```
```
100
```
```
150
```
```
200
```
```
250
```
```
Peak Throughput
```
```
Time (ms)
```
```
Block Size (#tx)
```
```
(a) order-then-execute
```
```
Peak Throughput
bpt
bet
tet
```
(^5 )
**200
400
600
800
1000
10 50 100 0
50
100
150
200
250
Peak Throughput
Time (ms)
Block Size (#tx)**
(b) execute-and-order-in-parallel
Figure 6:Performance withcomplex-join contract
**0
200
400
600
800
1000
1200
1400
10 50 100 0
50
100
150
200
250
Peak Throughput
Time (ms)
Block Size (#tx)**
(a) order-then-execute
**Peak Throughput
bpt
bet
tet
5 0
200
400
600
800
1000
1200
1400
10 50 100 0
50
100
150
200
250
Peak Throughput
Time (ms)
Block Size (#tx)**
(b) execute-and-order-in-parallel
Figure 7:Performance withcomplex-group contract

## 5.1 Block Size and Arrival Rate

Order then Execute.Figure 5(a) plots thethroughput
andlatencyachieved inorder-then-executeapproach using
thesimple contract. Table 4 presents the micro metrics
for an arrival rate of 2100 transactions per second (tps).
With an increase in transaction arrival rate, the through-
put increased linearly as expected till it flattened out at
around 1800tps, which was the peak throughput (system
utilization close to100%as shown in Table 4). When the
arrival rate was close to or above the peak throughput, the
latency increased significantly from an order of 100s of mil-
liseconds to 10s of seconds. For an arrival rate lower than
the peak throughput, with an increase in the block size, the
latency increased. The reason is that with an increase in
block size, it took longer for the orderer to fill a block with
transactions leading to an increased block creation time, and
hence, a larger waiting time for each transaction at the or-
derer. For an arrival rate greater than the peak throughput,
with an increase in block size, the latency decreased. This
is because there was no waiting for transactions to arrive
and form a block, and more transactions were executed in
parallel. This is also observable as the block processing time
(bpt) of a block of sizenwas always lesser than the sum of
bptofmblocks each of sizemn. For the same reason, with
an increase in the block size, the throughput also increased.
Execute and Order in Parallel.Figure 5(b) plots the
same forexecute-and-order-in-parallel approach. Table 5
presents the micro metrics for an arrival rate of 2400tps.
The maximum throughput achieved was 2700tps, i.e., 1.5×
higher than what was achieved withorder-then-execute. Note
that the system utilization (su) was only 90%. When the ar-
rival rate was greater than 2700 tps, the throughput started
to degrade andsunever reached 100%. We believe the rea-
son to be a large number of active backends that resulted in
a lot of contention on default shared memory datastructure
(we intend to study this further as part of the future work).
Though the block processing time (bpt) and the block exe-
cution time (bet) were observed to be lesser withexecute-
and-order-in-parallelas compared toorder-then-execute, the

```
block commit time (bct) was observed to be higher. This
could again be because of a large number of active backends.
Comparison With Ethereum’s Order then Exe-
cute.Blockchain platforms such as Ethereum also adopt an
order-then-executeapproach, but execute transactions seri-
ally once the block is formed. To emulate this behavior, we
made our block processor also execute and commit transac-
tions one at a time. This resulted in a peak throughput of
800 tps(for a block size of 100, although the block size does
not matter when we execute serially). This is only about
40% of the throughput achieved with our approach, which
supports parallel execution of transactions leveraging SSI.
```
```
Table 5: Execute and order in parallel: micro metrics
for an arrival rate of 2400 tps.
bs brr bpr bpt bet bct tet mt su
10 232.26 232.26 3.86 2.05 1.81 0.58 479 89%
100 24.00 24.00 35.26 18.57 16.69 3.08 519 84%
500 4.83 4.83 149.64 50.83 98.81 6.27 230 72%
```
## 5.2 Smart Contract Complexity

```
Order then Execute.Figure 6(a) plots the peak through-
put and micro metrics achieved when usingcomplex-join
contractfororder-then-execute. As observed earlier, with
an increase in block size, the throughput increased and reached
a peak throughput of 400tps. This was less than 25% of
what was observed withsimple contract, primarily be-
cause of transaction execution time (tet) increasing by about
160 ×as compared tosimple contract. The block pro-
cessing time (bpt) and the block execution time (bet) also
increased. The CPU and memory utilization forsimple
contractwas 10% and 15 GB respectively, compared to
30% and 15GB forcomplex-join contract.
Execute and Order in Parallel.Figure 6(b) plots the
same forexecute-order-in-parallel. Both the block process-
ing time (bpt) and the block execution time (bet) were lower
as compared the one observed inorder-then-execute. This
is because, by the time the block reaches the block proces-
sor, all transactions were either executing or already com-
pleted execution. The peak throughput achieved was more
than twice that oforder-then-execute. Unlikeorder-then-
executeapproach, this approach permits concurrent execu-
tion of a larger number of transactions unrestricted by the
block size (inorder-then-execute, the maximum number of
concurrently executing transactions is capped by the block
size). This manifested as a significantly larger increase to
the transaction execution timetetcompared toorder-then-
execute. For the same reason, the CPU utilization increased
to 100%, i.e., 3.3×higher than what was observed fororder-
then-execute.
In the thirdcomplex-group contractsmart-contract, for
a block size of 100, the maximum throughput achieved for
order-then-executeandexecute-order-in-parallelwas 1.75×
and 1.6×higher respectively than what was observed with
thecomplex-join contract. We plot the graphs for the
same in Figure 7.
```
## 5.3 Deployment Model and Network Size

```
Deployment Model.Figure 8(a) plots the peak through-
put achieved with both approaches in a multi-cloud deploy-
ment. As compared to a single cloud deployment (refer
to Figure 6), only the latency increased on average by 100
msdue to the WAN network but the throughput reminded
the same for most part except a 4% reduction in the peak
```

```
0
```
```
200
```
```
400
```
```
600
```
```
800
```
```
1000
```
```
10 50 100 0.
```
```
0.
```
```
1
```
```
10
```
```
100
```
```
1000
```
```
Peak Throughput
```
```
Time (ms)
```
```
Block Size (#tx)
```
```
(a) a multi-cloud deployment
```
**Peak Throughput (OE)
Peak Throughput (EO)
increase in latency (OE)
increase in latency (EO)**

```
5
```
```
500
```
```
1000
```
```
1500
```
```
2000
```
```
2500
```
```
3000
```
```
3500
```
```
0 4 8 12 16 20 24 28 32 36
Orderer Throughput
#Orderer Nodes
```
```
(b) impact of network size
```
```
Kafka Throughput
BFT Throughput
```
Figure 8: Performance (a) withcomplex contractin
amulti-cloud deployment; (b) with different network
sizes.

throughput when the block size was 100. In our system,
each transaction was only 196 bytes in size, and hence the
size of a block with 500 transactions was only about 100
KB. Hence, the lower bandwidth in the multi-cloud deploy-
ment did not have a significant impact on the performance
that our system can work equally well in a geographically
distributed environment.
Network SizeFigure 8(b) plots the throughput achieved
with kafka and bft based ordering service while varying the
number of orderer nodes and fixing the transaction arrival
rate to 3000 tps. With an increase in the number of orderer
nodes, we observed no impact on the performance of kafka-
based ordering service but the performance achieved with
bft-based ordering service reduced from 3000 tps to 650 tps
as expected due to the communication overhead. With an
increase in the number of database nodes alone, the overall
system throughput did not get affected but limited by the
peak throughput of the ordering service.

## 6. RELATED WORK

Bitcoin[39] andEthereum[51] adopt an order-execute
model, where transactions are first ordered in a block through
consensus (such as proof-of-work) and each node validates
and commits transactions to its copy of the blockchain by
serially executing each transaction. In ourorder-execute
approach, we leverage SSI to execute transactions concur-
rently. Further, such platforms only support a simple key-
value data model.
Hyperledger Fabric[17] adopts anexecute-then-order
approach, where transactions are first executed and endorsed
by multiple nodes, then ordered by consensus, and then
followed by serial validation and commit. In contrast, in
ourexecute-order-in-parallelapproach transaction execution
and ordering happen parallelly. Fabric only supports lev-
eldb and couchdb as the underlying database, with sup-
port for composite keys and range queries. In contrast,
we support the full spectrum of SQL queries in a smart
contract (for the first time) with the exception of libraries
that could introduce non-determinism and blind updates.
Further, by leveraging capabilities already available within
a relational database we provide support for complex data
types, schemas, constraints, and provenance queries. Perfor-
mance studies on Fabric [17, 47] have shown that a through-
put of 3000 tps can be achieved with goLevelDB as the state
database for asimplesmart-contract, while the throughput
drops to 700 tps with CouchDB.
Hyperledger Composer[4] is a set of collaboration
tools for building blockchain business networks utilizing Hy-
perledger Fabric. It allows a user to write a basic SQL query
with limited syntax [5] and internally converts the SQL
query to a JSON selector query [3] supported by CouchDB.

```
Corda[30] refers to their platform as a decentralized
database. Transactions are executed by one node at a time
(not parallelly executed by all nodes) and the results are
shared with other nodes that have a need to know. There is
no notion of a blockchain in Corda. However, optionally, a
notary could order transactions and validate them for double
spending. Corda uses the H2 embedded SQL engine as the
state database. State objects can define a relational map-
ping, and an object serialization framework is used to store
the states in a relational database. This permits querying
the database using SQL and also permits rich queries (such
as joins) with an organization’s private non-blockchain data.
However, it does not enable rich query support within the
smart contract itself.
Veritas[27] proposes shared verifiable tables using a set
of Redis key-value stores each owned by an organization.
Only the verifiability property, i.e., immutable logs, is sup-
ported. For ensuring consistency across replicas, it uses a
centralized trusted timestamp server to order transactions.
Further, a transaction is executed only on one of the nodes,
and each node periodically ships logs of multiple read-write
sets to other nodes via a Kafka-based broadcast service.
Nodes are trusted to execute and share results correctly with
other nodes, and hence is not decentralized. Nodes vote on
transactions to resolve any conflicts.
BigchainDB[14] employs Tendermint consensus [33, 12]
over a set of independent MongoDB [6] instances, each owned
by a different organization. It supports immutability and
decentralization. While the overall goals of BigchainDB are
similar to ours, there are fundamental architectural differ-
ences. It supports only user tokens/assets similar to Bitcoin
and no support for smart contracts. A transaction submit-
ted to BigchainDB is forwarded to Tendermint nodes, which
ensure that all the BigchainDB nodes agree on the next
block in a Byzantine fault tolerant way. Transactions are
serially executed post ordering, similar to Ethereum.
It is evident from the related work that ours is the first
blockchain relational database with rich features of both
blockchain and databases. Further, theexecute-and-order-
in-parallelapproach proposed in this paper is highly novel
and we believe it is applicable to centralized replicated databases.
```
## 7. DISCUSSION AND FUTURE WORK

```
In ongoing work, we are studying the performance of both
our design approaches in the presence ofrw/ww dependencies
with two setups: (a) a homogeneous network so that all
nodes would be approximately at the samecurrent-block;
(b) a heterogeneous network that could lead to a significant
gap in thecurrent-blockof different nodes over time.
As stated in §3.3.3 and §3.6, there is a potential to op-
timize the current implementation by (a) executing the se-
rialization check using all transaction’sinConflictListand
outConflictListat once in a separate background process
instead of executing at the backend serially, and (b) com-
mitting the whole block atomically rather than one transac-
tion at a time. Optimizations are also possible in our com-
munication layer by leveraging gossip protocols (for larger
number of nodes) and batching together transaction repli-
cation. We expect the performance to improve with these
optimizations.
Over time, the amount of historical data in the network
would grow significantly. Hence, we need to enhance the
```

existing pruning tool such asvacuum[13] to remove rows
based on fields such ascreator,deleter. As privacy is
an important consideration for blockchain solutions, there
is potential to enhance relational database features such as
user management to provide stronger privacy guarantees.
Data privacy can be achieved using database schemas and
the concept of channels as in Hyperledger Fabric [17].

## 8. CONCLUSION

In this paper, we presented the design of ablockchain
relational database, a decentralized database with replicas
managed by different organizations that do not trust one
another. The key challenge we addressed is in ensuring that
all untrusted replicas commit transactions in the same serial-
izable order that respects the block ordering determined by
consensus. We proposed two design approaches that lever-
aged and modified SSI to achieve this, and devised a new
variant of SSI based on block height. Leveraging features
already available in databases enables us to better support
complex data types, schemas, complex queries and prove-
nance queries that are not provided by blockchain platforms
today. We implemented the system on PostgreSQL and pre-
sented detailed performance results.

## 9. REFERENCES

[1] Apache kafka. https://kafka.apache.org.
[2] Apache zookeeper. [http://zookeeper.apache.org.](http://zookeeper.apache.org.)
[3] Couchdb selector query.
https://docs.couchdb.org/en/2.2.0/api/database/find.html.
[4] Hyperledger composer.
https://www.hyperledger.org/projects/composer.
[5] Hyperledger composer query language.
https://hyperledger.github.io/composer/v0.19/reference/query-
language.
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
[13] Vacuum. https://www.postgresql.org/docs/10/sql-
vacuum.html.
[14] B. 2018. Bigchaindb: The blockchain database.
https://www.bigchaindb.com/whitepaper/bigchaindb-
whitepaper.pdf.
2018.

[15] A. Adya, B. Liskov, and P. O’Neil. Generalized
isolation level definitions. InProceedings of 16th
International Conference on Data Engineering (Cat.
No.00CB37073), pages 67–78, Feb 2000.

[16] P. A. Alsberg and J. D. Day. A principle for resilient
sharing of distributed resources. InProceedings of the
2Nd International Conference on Software
Engineering, ICSE ’76, pages 562–570, Los Alamitos,
CA, USA, 1976. IEEE Computer Society Press.
[17] E. Androulaki, A. Barger, V. Bortnikov, C. Cachin,
K. Christidis, A. De Caro, D. Enyeart, C. Ferris,

```
G. Laventman, Y. Manevich, S. Muralidharan,
C. Murthy, B. Nguyen, M. Sethi, G. Singh, K. Smith,
A. Sorniotti, C. Stathakopoulou, M. Vukolić, S. W.
Cocco, and J. Yellick. Hyperledger fabric: A
distributed operating system for permissioned
blockchains. InProceedings of the Thirteenth EuroSys
Conference, EuroSys ’18, pages 30:1–30:15, New York,
NY, USA, 2018. ACM.
[18] H. Berenson, P. Bernstein, J. Gray, J. Melton,
E. O’Neil, and P. O’Neil. A critique of ansi sql
isolation levels. InProceedings of the 1995 ACM
SIGMOD International Conference on Management of
Data, SIGMOD ’95, pages 1–10, New York, NY, USA,
```
1995. ACM.
[19] P. A. Bernstein and N. Goodman. Multiversion
concurrency control&mdash;theory and algorithms.
ACM Trans. Database Syst., 8(4):465–483, Dec. 1983.
[20] P. A. Bernstein, V. Hadzilacos, and N. Goodman.
Concurrency Control and Recovery in Database
Systems. Addison-Wesley Longman Publishing Co.,
Inc., Boston, MA, USA, 1986.
[21] A. Bessani, J. Sousa, and E. E. P. Alchieri. State
machine replication for the masses with bft-smart. In
2014 44th Annual IEEE/IFIP International
Conference on Dependable Systems and Networks,
pages 355–362, June 2014.
[22] E. Brewer. Cap twelve years later: How the "rules"
have changed.Computer, 45(2):23–29, Feb 2012.
[23] M. J. Cahill, U. Röhm, and A. D. Fekete. Serializable
isolation for snapshot databases. InProceedings of the
2008 ACM SIGMOD International Conference on
Management of Data, SIGMOD ’08, pages 729–738,
New York, NY, USA, 2008. ACM.
[24] M. Castro and B. Liskov. Practical byzantine fault
tolerance. InProceedings of the Third Symposium on
Operating Systems Design and Implementation, OSDI
’99, pages 173–186, Berkeley, CA, USA, 1999.
USENIX Association.
[25] E. Cecchet, G. Candea, and A. Ailamaki.
Middleware-based database replication: The gaps
between theory and practice. InProceedings of the
2008 ACM SIGMOD International Conference on
Management of Data, SIGMOD ’08, pages 739–752,
New York, NY, USA, 2008. ACM.
[26] A. Fekete, D. Liarokapis, E. O’Neil, P. O’Neil, and
D. Shasha. Making snapshot isolation serializable.
ACM Trans. Database Syst., 30(2):492–528, June
2005.
[27] J. Gehrke, L. Allen, P. Antonopoulos, A. Arasu,
J. Hammer, J. Hunter, R. Kaushik, D. Kossmann,
R. Ramamurthy, S. T. V. Setty, J. Szymaszek, A. van
Renen, J. Lee, and R. Venkatesan. Veritas: Shared
verifiable databases and tables in the cloud. InCIDR
2019, 9th Biennial Conference on Innovative Data
Systems Research, Asilomar, CA, USA, January
13-16, 2019, Online Proceedings, 2019.
[28] J. Gray, P. Helland, P. O’Neil, and D. Shasha. The
dangers of replication and a solution. InProceedings of
the 1996 ACM SIGMOD International Conference on
Management of Data, SIGMOD ’96, pages 173–182,
New York, NY, USA, 1996. ACM.


[29] J. Gray and L. Lamport. Consensus on transaction
commit.ACM Trans. Database Syst., 31(1):133–160,
Mar. 2006.
[30] M. Hearn. Corda 2016.
https://www.corda.net/content/corda-technical-
whitepaper.pdf.

[31] F. P. Junqueira, B. C. Reed, and M. Serafini. Zab:
High-performance broadcast for primary-backup
systems. InProceedings of the 2011 IEEE/IFIP 41st
International Conference on Dependable
Systems&Networks, DSN ’11, pages 245–256,
Washington, DC, USA, 2011. IEEE Computer Society.
[32] H. T. Kung and J. T. Robinson. On optimistic
methods for concurrency control.ACM Trans.
Database Syst., 6(2):213–226, June 1981.

[33] J. Kwon. Tendermint: Consensus without mining.
2014.

[34] L. Lamport. The part-time parliament.ACM Trans.
Comput. Syst., 16(2):133–169, May 1998.
[35] F. Li, M. Hadjieleftheriou, G. Kollios, and L. Reyzin.
Dynamic authenticated index structures for
outsourced databases. InProceedings of the 2006
ACM SIGMOD International Conference on
Management of Data, SIGMOD ’06, pages 121–132,
New York, NY, USA, 2006. ACM.
[36] F. Li, M. Hadjieleftheriou, G. Kollios, and L. Reyzin.
Authenticated index structures for aggregation
queries.ACM Trans. Inf. Syst. Secur.,
13(4):32:1–32:35, Dec. 2010.
[37] S. Liu, P. Viotti, C. Cachin, V. Quéma, and
M. Vukolic. Xft: Practical fault tolerance beyond
crashes. InProceedings of the 12th USENIX
Conference on Operating Systems Design and
Implementation, OSDI’16, pages 485–500, Berkeley,
CA, USA, 2016. USENIX Association.

[38] D. A. Menasce, G. J. Popek, and R. R. Muntz. A
locking protocol for resource coordination in
distributed databases. InProceedings of the 1978
ACM SIGMOD International Conference on
Management of Data, SIGMOD ’78, pages 2–2, New
York, NY, USA, 1978. ACM.

[39] S. Nakamoto. Bitcoin: A peer-to-peer electronic cash
system,” [http://bitcoin.org/bitcoin.pdf.](http://bitcoin.org/bitcoin.pdf.)

[40] D. Ongaro and J. Ousterhout. In search of an
understandable consensus algorithm. InProceedings of
the 2014 USENIX Conference on USENIX Annual
Technical Conference, USENIX ATC’14, pages
305–320, Berkeley, CA, USA, 2014. USENIX
Association.
[41] H. H. Pang and K.. Tan. Authenticating query results
in edge computing. InProceedings. 20th International
Conference on Data Engineering, pages 560–571, April
2004.
[42] K. Petersen, M. J. Spreitzer, D. B. Terry, M. M.
Theimer, and A. J. Demers. Flexible update

```
propagation for weakly consistent replication. In
Proceedings of the Sixteenth ACM Symposium on
Operating Systems Principles, SOSP ’97, pages
288–301, New York, NY, USA, 1997. ACM.
[43] D. R. K. Ports and K. Grittner. Serializable snapshot
isolation in postgresql.Proc. VLDB Endow.,
5(12):1850–1861, Aug. 2012.
[44] S. H. Son. Replicated data management in distributed
database systems.SIGMOD Rec., 17(4):62–69, Nov.
1988.
[45] M. Stonebraker. Concurrency control and consistency
of multiple copies of data in distributed ingres.IEEE
Transactions on Software Engineering,
SE-5(3):188–194, May 1979.
[46] D. B. Terry, M. M. Theimer, K. Petersen, A. J.
Demers, M. J. Spreitzer, and C. H. Hauser. Managing
update conflicts in bayou, a weakly connected
replicated storage system. InProceedings of the
Fifteenth ACM Symposium on Operating Systems
Principles, SOSP ’95, pages 172–182, New York, NY,
USA, 1995. ACM.
[47] P. Thakkar, S. Nathan, and B. Viswanathan.
Performance benchmarking and optimizing
hyperledger fabric blockchain platform. In2018 IEEE
26th International Symposium on Modeling, Analysis,
and Simulation of Computer and Telecommunication
Systems (MASCOTS), pages 264–276, Sep. 2018.
[48] R. H. Thomas. A majority consensus approach to
concurrency control for multiple copy databases.ACM
Trans. Database Syst., 4(2):180–209, June 1979.
[49] B. Vandiver, H. Balakrishnan, B. Liskov, and
S. Madden. Tolerating byzantine faults in transaction
processing systems using commit barrier scheduling.
InProceedings of Twenty-first ACM SIGOPS
Symposium on Operating Systems Principles, SOSP
’07, pages 59–72, New York, NY, USA, 2007. ACM.
[50] M. Wiesmann, F. Pedone, A. Schiper, B. Kemme, and
G. Alonso. Understanding replication in databases
and distributed systems. InProceedings 20th IEEE
International Conference on Distributed Computing
Systems, pages 464–474, April 2000.
[51] G. Wood. Ethereum: A secure decentralised
generalised transaction ledger.Ethereum project
yellow paper, 2014.
[52] C. Xu, J. Xu, H. Hu, and M. H. Au. When query
authentication meets fine-grained access control: A
zero-knowledge approach. InProceedings of the 2018
International Conference on Management of Data,
SIGMOD ’18, pages 147–162, New York, NY, USA,
```
2018. ACM.
[53] Y. Zhang, J. Katz, and C. Papamanthou. Integridb:
Verifiable sql for outsourced databases. InProceedings
of the 22Nd ACM SIGSAC Conference on Computer
and Communications Security, CCS ’15, pages
1480–1491, New York, NY, USA, 2015. ACM.


## APPENDIX

## A. SMART CONTRACTS USED FOR EVALUATION

```
Figure 9: Simple query with single inserts into table
```
```
Figure 10: Complex queries with joins and aggregates
```
```
Figure 11: Complex queries with group-by, order-by, limit and aggregates
```


# Analysis And Comparison Of Drain And Drain3 With Similar Log Parsing Methods

Ahmet Utku Kilic Seminar Operating Complex IT-Systems Technische Universitat Berlin ¨
Berlin,Germany kilic.2@campus.tu-berlin.de Abstract**—As the prevalence and usage of real-time web services and cloud computing escalate so does the need for optimised**
and mostly automated error detection and correction systems. To achieve that one of the most important aspects is creating log templates from unstructured logs by parsing them efficiently.

Older methods were either not built for a real-time log analysis or they were not as fast as wanted. The purpose of this paper is to show the accuracy and efficiency of a log parsing method, Drain, and how it manages to reach high accuracy when implemented on common log parsing datasets. It does it by applying a fixed depth tree method to the log messages and analyses the token count and compares tokens in the fixed segments of the log messages.

The updated version,Drain3, implements some new methods to make it more suitable for production usage. The examples shown in the paper show that Drain is a very successful method for log parsing.

Index Terms**—Log parsing, Drain, Log analysis**

## I. Introduction

As technology advances, its integration becomes more widespread. We are getting more familiar with the fact that many devices and vehicles we have been using for a long time are now connected with the internet and feed us and the companies data. There are smart ovens which can be preheated before we reach home or we can click update to upgrade our car's software before we go to sleep. Likewise the systems which already had a big amount of data flow now have more information to process and analyse. Naturally this huge amount of information should keep a history of the events and that should be analysed, preferably as fast and accurate as possible to keep the services provided healthily running. These services are mainly enabled by cloud computing service providers like Amazon Web Services.

However this also means the data flow is impossible to track manually. There are many requests being sent to the system and each of them invoke around 100 methods [1]. Real-time systems should be always up and running and errors should be fixed without disrupting the rest of system if possible.

For this reason artificial intelligence for IT operations(AIOps)
applications are being developed to monitor time, usage or memory related activities, to increase the time saved for developers and improve end-user satisfaction by detecting possible problems and reducing outage periods [2].

For an AIOps system to be successful what it takes is very similar to the system of any industry. It needs to find the root of the problems and detect anomalies in the system [3]. The difference is that the the colossal size of information is given with log lines in the software systems. Logs do not have the same structure always and can be very unstructured by nature, but they have always fixed and variable parts in their nature
[4]. There are many different log parsing methods that try to automate this process [5].

The more recent developments in this area are the open source log parser project Drain and its successor Drain3. To increase the speed of the log parsing and template creation, Drain utilises a fixed depth tree method. It reaches up to 99 percent accuracy when tested on sample data sets that are commonly used for log parsing and templating purposes [6].It is very accurate, because Drain focuses on the length and the non-numerical tokens in the logs, especially the first tokens. It also has thresholds for fine tuning that makes it flexible.It is also has an accuracy of up to 99 percent on the 2000 lines of datasets provided by HDFS (Apache Hadoop Distributed File System) [4].

The newer version Drain3 is very similar to Drain. Its improvements are mostly for practicality in an environment with a huge amount of dynamic data. It removes some dependencies, enables saving of the state to a Apache Kafka topic, Redis or a file. Enables caching and adds possibility of the inference mode, which enables a faster matching based on the existing templates. It also allows users to add more delimiters for the log file. Drain has whitespace as its default.

In this paper we explain the structure of Drain and how it uses the fixed depth tree, its method of deciding the similarity of a new log message. The paper also explains possible configuration settings of the method to make it more suitable to real world scenarios. Then it shows the improvements which are included in the newer version Drain3 by an example.Drain3 takes more time in preprocessing in general but provides better results.

The rest of the work is organised as follows. Section 2 explains the background knowledge about the topic, which depicts the previous work and the gap Drain fills. Section 3 elaborates on the approach of this paper to the topic. Section 4 describes how the suggested approach for testing has been implemented. Section 5 depicts the results of the comparison conducted in this paper. Section 6 mentions the related work in the field and what they aim to achieve. Section 7 summarises the work and finally concludes.

## Ii. Background

Log parsing and log analysis have been researched more heavily in the recent times [7] [8].

It is important for anomaly detection, program verification, performance monitoring, security assurance, root causes analysis and many other related topics [8]. There is so far not one single solution to all questions which needs to be answered to improve log parsing and analysing. The prior methods had their own solutions to different problems.

LKE is an offline parser that uses hierarchical clustering [8].

It is really good at analysing smaller datasets, but as a setback of using hierarchical clustering its effectiveness reduces a lot when used on larger datasets. Also it being an offliner parser does not provide the best usage in a real-time system.

IPLoM is an another offline parser that applies a three-step hierarchical partitioning before generating templates [9]. It is very similar to LKE when it comes to its capabilities and shortcomings.

Shiso is an online parser with predefined number of children in each node to increase efficiency. It also has a hierarchical structure [10].

The online parsers are better adjusted for real-time web services and cloud computing as they can analyse real-time, something offline parsers cannot do. Offline parsers require a snapshot of the logs to be sent to them and then analyse, while online parsers can theoretically analyse it dynamically on the go and can change its templates.

## A. Drain Iii. Approach

The main method used in Drain is a fixed depth tree. The minimum depth is three. A common method that is used in log parsing happens before processing the logs. During the preprocessing one can make use of their domain knowledge.

Drain has a method that lets users to apply regular expressions to the logs and remove for example IDs. That way the amount of data that needs to be traversed can be reduced and abundance of it will be prevented.

Then the traversing of the tree starts. Drain considers every entry delimited by the space character in a log as a token. First step checks number of tokens in the log message. And then it creates a node which responds to number of tokens in the log message, also known as the length of the message. Drain assumes log messages with similar information have generally the same length [4].

Second node in the tree checks for the first token of the log message. The method assumes that the very first token is mostly a fixed token and not a variable. It puts in the second node of the traversed tree. If it is a variable, for Drain it means a number input, then it puts a < ∗ > to mark it to the node.

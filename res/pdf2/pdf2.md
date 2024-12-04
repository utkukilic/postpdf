# A Picture Is Worth A Thousand Words: Exploring Diagram And Video-Based Oop Exercises To Counter Llm Over-Reliance

Bruno Pereira Cipriano 1, Pedro Alves 1, and Paul Denny 2 1 Lus´ofona University, COPELABS, Campo Grande, 376, Lisbon, Portugal {bcipriano,pedro.alves}@ulusofona.pt 2 The University of Auckland, Auckland, New Zealand paul@cs.auckland.ac.nz Abstract. Much research has highlighted the impressive capabilities of large language models (LLMs), like GPT and Bard, for solving introductory programming exercises. Recent work has shown that LLMs can effectively solve a range of more complex object-oriented programming (OOP) exercises with text-based specifications. This raises concerns about academic integrity, as students might use these models to complete assignments unethically, neglecting the development of important skills such as program design, problem-solving, and computational thinking.

To address this, we propose an innovative approach to formulating OOP
tasks using diagrams and videos, as a way to foster problem-solving and deter students from a copy-and-prompt approach in OOP courses. We introduce a novel notation system for specifying OOP assignments, encompassing structural and behavioral requirements, and assess its use in a classroom setting over a semester. Student perceptions of this approach are explored through a survey (n=56). Generally, students responded positively to diagrams and videos, with video-based projects being better received than diagram-based exercises. This notation appears to have several benefits, with students investing more effort in understanding the diagrams and feeling more motivated to engage with the video-based projects. Furthermore, students reported being less inclined to rely on LLM-based code generation tools for these diagram and video-based exercises. Experiments with GPT-4 and Bard's vision abilities revealed that they currently fall short in interpreting these diagrams to generate accurate code solutions.

Keywords: object-oriented programming· large language models· gpt4 · bard

## 1 Introduction

The advent of large language models (LLM) and their ability to generate computer code from natural language descriptions has led to robust discussion in the computing education community around the opportunities and challenges they present to educators and students [5,11]. In fact, there is differing opinion amongst educators regarding whether to resist and fight the usage of these tools, or to try and find ways to embrace them [16,26]. While there have been some initial attempts to integrate LLMs into teaching practice at the introductory level [22,14], very little is known about the efficacy of these approaches and there is little discussion or consensus about how higher level courses should adapt [23].

Given that LLMs are becoming an essential part of industry practice [4], it is necessary for educators to explore approaches that promote the acquisition of core computing knowledge and skills alongside authentic use of code-generation tools. Tasks which are solvable through pure "copy-and-prompt" approaches may not be engaging or motivating for students. Very recent research has suggested using image-based exercises that illustrate expected behaviors through diagrammatic descriptions of input/output pairs [16,9]. The goals of this approach, which has only been explored at the introductory programming level, are twofold: first, students have to make an effort to understand the expected transformation, and, second, they can't just copy the assignment into ChatGPT,
Bard or similar tool.

In this research we propose extending the idea of image-based problem specifications to more complex design-oriented tasks suitable for Object-Oriented Programming (OOP) courses. In such courses, the focus is not on implementing stand-alone functions but rather on tasking students with designing and implementing multiple classes that maintain mutable states and collaborate with each other to achieve specific objectives. Our aim is also to develop an approach where problems can be presented in such a way that that their solution is not uniquely specified. Instead, rather than guiding students towards a single model solution, we want students to have the flexibility to infer their own object-oriented design by performing a domain analysis. To achieve this, we propose a novel notation for expressing program requirements. Problems are then presented to students using this notation, rather than as highly descriptive plain text specifications, which we hypothesize will help to guard against probable LLM-abuse as motivated in prior work [10].

We conducted an experiment with diagram-based OOP exercises and videobased OOP projects, both utilizing a custom notation, and evaluated it in a classroom setting over the course of a semester. Our investigation is guided by the following three research questions (RQs):
RQ1: Do students express a preference towards diagram-based exercises compared to exercises with more traditional text-based specifications?

RQ2: For larger-scale projects, are video-based specifications motivating for students and do they find them easier for interpreting required behavior?

RQ3: To what extent does the proposed notation for specifying programming tasks discourage students from inappropriate use of LLMs for code-generation?

Recently, both ChatGPT3 and Bard4 were updated with the capacity to interpret image content (i.e. 'vision'). We performed some experiments to determine if these new capabilities could jeopardize our diagramming efforts. Although these were ad-hoc experiments, the relevance to our study made us include them in a brief section of this paper.

This paper makes the following contributions: (1) Presents a novel notation to represent OOP exercises; (2) presents the results of a student survey evaluating diagram-based and video-based exercises, as well as the impact of these new exercise formats on their LLM usage; and, (3) presents the results of several ad-hoc experiences using ChatGPT-4 and Bard's 'vision' capabilities to solve diagram-based exercises.

## 2 Related Work

Specifying Programming Tasks Many programming courses require students to implement certain behaviours described in natural language (e.g. "Create a function that receives an array of int(s) and returns the sum of all elements in the array"). Students have to interpret the textual description of the problem, devise an algorithm to solve it, and then create computer code that implements the algorithm. This is particularly common for introductory programming exercises [1]. GPT-based models have demonstrated great capacity for solving such exercises described in natural language [12,25,24,8].

OOP Courses Some object-oriented programming exercises are based on Unified Modeling Language (UML) diagrams: teachers first teach students how to interpret UML class diagrams, and then ask them to create the code that implements the classes described in the UML diagram [20]. Other educators use text based instructions, with either strongly directed instructions [25,24], or with less directed instructions which require that students partially decide the object model for themselves [6]. GPT-based models have also demonstrated the capability to solve text-based OOP exercises [7,25,24,20,6].

LLM-oriented exercises Several strands of work have explored ways to limit student reliance on LLMs and foster new skillsets. Denny et al. proposed Prompt Problems [9], a novel pedagogical approach to the teaching of programming, in which diagrams are displayed to students, who must then derive an effective LLM-prompt to obtain working code. Liffiton et al. describe CodeHelp [18], a LLM-powered tool which acts an intermediate between the student and GPT, in order to prevent students from over-relying on the LLM by filtering out generated source code. Students reported positive feedback regarding its usefulness for support while programming.

## 3 Notation: Diagrams And Videos 3.1 Diagrams

Our proposed notation aims to address the variety of scenarios that typically occur in OOP, such as functions that change the state of an object, functions that receive multiple objects and associate them with each-other, concepts with common attributes and/or behaviours that should take advantage of the inheritance and polymorphism mechanisms, and so on.

We propose 5 types of diagrams, and explain the relevant notation in the following subsections. A given assignment may use a combination of several diagram types.

Algorithmic function diagram These diagrams are used to present students with single non-instance (i.e. static) functions that transform input into output, similar to prior research adapting introductory programming courses [9]. See Figure 1 for an example.

These diagrams depict the function, with a black box denoting its name, input elements represented using inbound orange arrows, and output elements in green (with outbound black arrows). In cases where inputs or outputs are arrays, lines of small boxes should be utilized, as illustrated in the Figure 1. The function name within the black box should be "obfuscated," so as not to provide clues to the function's purpose (e.g., 'f()'). This is recommended as research has shown GPT-based models can generate working solutions from only meaningful function names [3,27].

A minimum of two examples of inputs/outputs should be provided to assist in clarifying the expected behavior. In certain instances, more than two examples may be necessary, particularly to illustrate how the function should behave with invalid inputs or boundary cases.

Fig. 1. Example algorithmic exercise. Students should understand that the function

![3_image_0.png](3_image_0.png) must create an array with elements from the two input arrays, in alternating fashion.

State-change function diagram These diagrams are similar to the algorithmic function diagrams described in the previous section but are used for noninstance (static) functions that change the state of one or more objects and possibly also return a value. While this may be considered bad practice in imperative programming, where students should avoid implementing functions

![4_image_1.png](4_image_1.png)

![4_image_2.png](4_image_2.png)

![4_image_0.png](4_image_0.png)

Listing 1.1. Withdraw function and supporting class, in Java
with side-effects, it is common practice in OOP. Since these functions can have two simultaneous effects, a different notation must be used for changing the objects and returning a value. The former is represented by a dashed arrow while the latter is represented by a solid arrow (in concordance with the algorithmic diagrams that only return values). Given that the distinction between solid and dashed arrows may not be immediately evident, a caption is provided to highlight this difference for students. The remaining notation is expected to be inferred by students.

The business rules can be directly written in the diagram as a side note but we consider it more interesting to just provide several examples and allow students to infer those rules. For more complex rules, it may not be feasible to describe them through examples - consider using a state transition rules diagram
(see Section 3.1) in those cases.

Notice that students are expected to implement not only the function but also the classes and methods that support its behavior. Imagine you want students to implement the 'withdraw' function in Java, as illustrated in Listing 1.1. Using our notation, the corresponding diagram is the one shown in Figure 2 with the first example showing a successful withdrawal that returns true and reduces the account's balance and the second example showing a failed withdrawal due to insufficient balance.

![4_image_3.png](4_image_3.png)

Class declaration diagram These diagrams provide students with guidelines for implementing predefined classes, attributes, and relationships (e.g., composition). Each class should be depicted within a box, enumerating its attributes
(optionally with their types), specifying the necessary constructors, and outlining the expected behavior of fundamental methods like 'toString()'. The behavior can be described similarly to algorithmic diagrams, with examples of input/output and corresponding arrows. It is important to note that the direct representation of relationships between classes is omitted. Specific attributes are linked with an accompanying image, indicating that they are, in fact, objects themselves.

See Figure 3 for an example where students had to implement two related classes. In that example, students had to infer that the small house-like figure within the 'Person' class diagram represented a composition relationship between the 'Person' and 'Apartment' classes. Note also the reference to the 'toString()' function, with a black arrow which indicates the expected return value, similar to the previously discussed diagrams for algorithmic exercises.

Although this information could be partially represented by UML class diagrams, this proposal has two advantages: (1) it presents both structure (e.g. the class's attributes) and behaviour (e.g. 'toString()"s expected return-value); and,
(2) the composition relationship is less explicit than it would be in UML.

![5_image_0.png](5_image_0.png)

Inheritance diagram These diagrams are an extension (or adaptation) of the previously mentioned class declaration diagrams, specifically tailored for exercising inheritance relationships between classes (i.e. generalization via inheritance). The notation is exactly the same, however the goal is different. Instead of describing all the classes that the students must implement (as in class diagrams),
they only describe the child classes and students must determine the structure and behaviour of the parent class (which is absent from the diagram). After this, they must implement all classes (structure and behavior), both those explicitly outlined in the diagram and classes that are not present in the diagram but have been identified by the students.

Figure 4 presents one of these diagrams, in which two similar concepts are represented: one representing 'Managers' and the other representing 'IT Technicians'. Students are expected to infer that these two concepts should share a common super-class since they have common attributes (e.g. name, salary) and similar behaviours (e.g. salary calculation).

Fig. 4. Example inheritance exercise. Students were expected to understand that some

![6_image_0.png](6_image_0.png)

common elements exist between the 'Manager' and the 'IT Technician' and thus create an inheritance relationship with a super-class above those.

State transition rules diagram These diagrams should be used when the exercise has certain classes which can transition between different internal states, with rules which guide those transitions. In practical terms, these diagrams are simplified state transition diagrams which only display valid transitions. See Figure 6 for an example. That figure's diagram explains the name of the action which changes the state (e.g. 'plan', 'start'), as well as what information should exist inside the object in each state. For example, a newly created task only has value for the 'description'.

These diagrams are useful for providing complementary information to the other exercises. For example, the state transition diagram of Figure 6 and the state-change function diagram of Figure 5 were part of the same assignment and are complementary: for students to correctly implement the 'f06()' function, to assign a 'Task' to an 'Employee', they must understand that the association can only be done if the Task is in the 'Planned' state. The diagram explains this connection to the student in the form of a small asterisk near the function's return value.

## 3.2 Videos

While some exercises are easy to describe with a diagram containing 2 or 3 example inputs, or even with 2 or 3 diagrams, in more complex assignments, where there is a significant amount of user interaction or input validation, or projects which span multiple weeks or months, creating diagrams to represent all relevant behaviours and interactions is complex and time consuming.

In such cases, it is more practical to create video demonstrations of the expected behaviours. The videos can include a mixture of behavioural demonstrations and static diagrams. More concretely, we recommend using demonstrations for explaining user interactions, and diagrams for presenting any mandatory protocols which the students must follow. The videos should start with the

![7_image_0.png](7_image_0.png)

![7_image_1.png](7_image_1.png)

demonstration of the expected functionality from the user's perspective, and only afterwards go into required implementation details. A video5 with an example OOP course project is available online6.

Table 1. The quantitative questions used in the survey, organized by Research Question.

| RQ Q. # Question 1 1 'It is easier to understand the objective of the exercise when presented in the form of a diagram, than when it is presented textually.' 1 2 'When I come across a diagram-based exercise, I tend to think more carefully before writing code, compared to what I do with exercises described textually.' 1 3 'In general, I prefer exercises based on diagrams over exercises described textually.' 1 4 'Considering the interpretation of the exercise, the absence of the function name in the diagrams ...' 2 1 'It is easier to interpret the project when presented in video format, due to the combination of text, images and audio.' 2 2 'Video statements fall short when compared to statements in natural language, because it is more difficult to take notes on paper' 2 3 'I feel more motivated to do the project when the statement is in video than when it is in natural language.' 2 4 'I find it easier to develop the project with the video statement than with the traditional model'. 3 1 'I am more likely to use GPT/Bard with textual exercise descriptions than with diagrams and/or videos'. 'Diagram and/or video exercises effectively prevent abuse of GPT/Bard, 3 2 as they force me to prepare a prompt instead of simply copying the description into GPT/Bard.' 3 3 'I consider diagram and/or video exercises a good step towards making me more prepared for a professional future where I have to interact with GPT/Bard.'   |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

## 4 Method 4.1 Experimental Context

To evaluate the proposed diagrams and videos as formats to present students with OOP tasks, we applied them in the 2023/24 edition of a University course focused on Object-Oriented Design and Programming. In this course, students are exposed to OO analysis and design, as well as Java implementation details. They are also challenged to solve a number of practical programming activities, with the course following a mixed approach with both exercise-based and projectbased learning [17], supported by an AAT [21].

5 Narrated in Portuguese, but auto-translated captions are available.

6https://www.youtube.com/watch?v=LkyEaAVK6yU
The diagrammatic notation and videos proposed in this paper were applied to the majority of these practical activities, which were originally described in natural language. Diagrams were used to describe the exercises, while the project was described in video.

## 4.2 Evaluation

To assess the effectiveness of this novel notation, students were administered a structured anonymous questionnaire during the 12th week of the course. At this juncture, students had been exposed to multiple diagrams of all types presented in this paper: this includes 9 assignments, each composed of multiple diagrams7.

Also, students were actively engaged in the project.

The questionnaire was composed of 11 quantitative questions, each associated with one RQ. Ten of the questions - presented in Table 1 - used a standard 5-point Likert scale (strongly disagree to strongly agree). One question was categorical, with three possible options. Finally, the questionnaire included a qualitative question for students to provide open-response comments.

## 5 Results

The course had 115 enrolled students. Among them, 84 students had some level of participation, submitting at least one diagram-based assignment. For those 84 students, the average number of submitted assignments was 6.25 and the mean was 7 (out of the 9 available assignments). The minimum number of submitted assignments was 1, the maximum and mode were both 10, and 12 students submitted all assignments. A total of 56 results participated in the survey.

## 5.1 Rq1: Preference For Diagram-Based Exercises

This section of the survey was dedicated to understanding students opinions on diagram-based exercises, in comparison to text-based exercises that they are familiar with from previous courses (RQ1). Response distributions to the three quantitative questions associated with RQ1 are presented in Figure 7. Although the results are somewhat balanced between the agreement and disagreement sides, in the first two questions, more students agree with the benefits of diagrammatic exercises. However, in the third question, results were skewed to the disagreement side, indicating that most students do not prefer diagram-based exercises over text-based ones.

Finally, we asked students to evaluate the impact of the absence of the function name from the diagrams (Table 1: Question 4, RQ1). This question was categorical and had 3 possible options: 'It causes me some difficulties' (selected by 37 students or 66.07%), 'It doesn't affect me' (14 students or 25.00%), and, 'It causes me a lot of difficulties' (5 students or 8.93%). These results somewhat surprised us, since we thought that the majority of students would report the lack of function names to have caused them more difficulty.

7 The total number of unique diagrams was 72.

![10_image_0.png](10_image_0.png)

![10_image_1.png](10_image_1.png)

![10_image_2.png](10_image_2.png)

## 5.2 Rq2: Interpretability And Motivation Of Video-Based Projects

Figure 8 presents the results for each question related with RQ2. The vast majority of students indicated that videos make projects easier to interpret. However, with regards to the ease of note taking, most students feel that videos are not as good as textual descriptions. Videos also seem to have a positive impact on students' motivation (Table 1: Question 3, RQ2). Finally, the majority of students reported that developing the project with the video statement is easier than with the traditional text-based assignments.

## 5.3 Rq3: Use And Reliance On Llms

Figure 9 presents results for questions related with RQ3. The majority of students indicate that they would be more likely to resort to an LLM when solving textual exercises than with diagrammatic or video exercises. The vast majority of students also agree that diagrams and videos are an effective way of preventing LLM abuse. Finally, students agree that these new formats will help them be more prepared for a potential professional future where they have to interact with an LLM to produce code [2].

## 6 Discussion

The proposed notation and diagrams present a new visual language relevant for the specificities of teaching and learning OO design and programming. These diagrams require that students first understand the problem by analysing the diagrammatic sample sets, and then proceed to define an object model and/or algorithm which solves it, with or without the help of a LLM.

Diagrams and videos can prescribe more or less directed tasks, according to educators' goals, by using clues such as 'Implement in class Main', 'Represent these concepts', and so on. However, educators should avoid exposing too much information textually or verbally, since some textual instructions can be parsed from images [13] and audio interpretation tools are also emerging [19].

We consider this model to have three advantages: (1) it forces students to interpret test cases and infer a problem description; (2), it should prevent direct 'copy-and-prompting' from the assignment description to the LLM; and, (3)
it requires students that wish to use an LLM to create prompts that guide it towards the goal. Although these last two ideas might seem contradictory, we believe that both have some pedagogical value, since it is important that students gain some experience with using LLMs in an authentic way, as helpers for solving coding problems, due to the likelihood that they will use these tools professionally [2,4].

During the experiment, we observed some interesting student behaviours which we believe should guide future work on this topic. One interesting aspect was, at least in some cases, students' difficulties in interpreting the diagrams prompted interesting discussions between students and teachers. When the doubts were not obvious, we would engage with the student and help them reach the expected interpretation by themselves. For example, when a student asked "What does this 'N + 1' tasks mean?", the teacher pointed out that, before the function call, the object indicated 'N tasks', and then asked the student what they thought was happening that resulted in the change from 'N tasks' to 'N + 1 tasks'. As for the videos, at least one student transcribed the video to a text document. We informally asked the student for their reasons, and they indicated doing it to support offline work because they didn't have an internet connection at all times. One other student used a tool to download Youtube's automatic captions for the video assignment. Although these techniques could be used to exploit the video assignment, since not all information is obtainable from the narration, the videos should remain LLM-resistant for the time being.

Besides countering LLM over-reliance, the survey shows that these approaches also seem to have other benefits, such as the apparent positive impact on students' motivation levels. Moreover, the qualitative question also allowed us to identify another added benefit, since multiple students reported the need to analyse and reflect on the diagram's contents, in order to fully understand it.

For example, participant S7 indicated that "Not knowing specifically what the function should do [...], I had to 'spend' some time trying to understand that". Another participant, S39, commented that "Since I don't have a [function] name, I don't immediately know what I'm supposed to do, I have to think and reflect on the diagram". Finally, S56 indicated that "Sometimes, just the diagram without a brief contextual explanation made the exercise more difficult to understand than solving it.". As such, it appears that diagrams might also promote some development of analytical skills, and this would be an interest avenue to explore more rigorously in future work.

## 6.1 Gpt-4 And Bard'S Vision Capabilities

Recently, both GPT-4 and Bard have become capable of interpreting images.

Given the potential threat to the proposed diagrams, we conducted initial explorations of the vision capabilities of these tools. To achieve this, GPT-4 and Bard where supplied with the same information that students had: a diagram containing some introductory text and Figure 6, and then a second diagram which was equal to Figure 5. This experiment was repeated 3 times with the same images, but with slightly different prompts and the generated code was evaluated considering 3 compilation and 3 logical items. None of the attempts yielded a correct implementation of the 'f06()' function, with both models generating code with compilation errors and/or logical errors 8. In its best attempt, GPT-4 generated a function that compiled correctly, but the function's logic 8 GPT-4's diagram scores: Best compilation: 3/3 (experiment \#3). Best logic: 1/3
(experiment \#2). Worst compilation: 0/3 (experiments \#1 and \#2). Worst logic: 0/3 (experiments \#1 and \#3). Bard's diagram scores: Best/Worst compilation: 0/3
(all experiments). Best logic: 1/3 (experiment \#2). Worst logic: 0/3 (experiments
\#1 and \#3).

## 14 B. Pereira Cipriano Et Al.

was hardcoded to the example provided in the diagram and would not work with different input values. Bard's best attempt was also problematic: it failed to create the function in the prescribed class, the argument order was wrong, it was not declared as final and the return-type was void instead of boolean. As for the logic, the code fails to correctly validate the 'Task"s state transition and also fails to check if the 'Employee' belongs to the company. The only sub-behaviour that would work as expected was the assignment of the Task to the Employee. Finally, instead of returning the requested boolean, an 'Exception' was being thrown. We also supplied both models with an equivalent text-based description of the exercise. With the textual input, GPT-4 was able to generate an almost correct solution, failing only to declare the function as 'static' 9. Bard's solution to the text-based variant was also better than all its diagram-based attempts 10.

The logs of our experiments are available online11.

This experiment shows that LLMs are much better at handling OOP exercises described textually, than diagram-based exercises. As such, diagrams seem a good approach to limit students' over-reliance on LLMs, at least for the time being.

## 7 Limitations

One limitation is the significant proportion of students opting for the neutral option in most quantitative questions. This could potentially have skewed some of our interpretations.

In relation to the questions about the impact of diagrams and videos on the utilization of LLMs, it is conceivable that some students may not have provided honest responses to this question given concerns around academic integrity.

## 8 Conclusions

We believe that the biggest challenge in adapting courses and classes to this brave new world where LLMs with code generation capacity are easily accessible is creating exercises that are hard for an LLM to solve, but are still accessible and can be solved by students. In this paper we present a novel pedagogical approach to describe OO programming exercises and projects. This notation allowed us to replace the previously used natural language descriptions which could be handled, to some degree, by GPT-3.5, GPT-4 and Bard. The proposed notation was well received by our students, who also agree that it helped mitigate LLM over-reliance.

9 GPT-4's textual scores: Compilation: 2/3. Logic: 3/3.

10 Bard's textual scores: Compilation: 3/3. Logic: 1.5/3.

11 https://doi.org/10.5281/zenodo.10547278

## References

1. Allen, J.M., Downey, K., Miller, K., et al.: Many small programs in cs1: Usage analysis from multiple universities. In: 2019 ASEE Annual Conference & Exposition ". p. 1–13. No. 10.18260/1-2–33084, ASEE Conferences, Tampa, Florida (June 2019), https://peer.asee.org/33084 2. Alves, P., Cipriano, B.P.: The centaur programmer - How Kasparov's Advanced Chess spans over to the software development of the future (2023)
3. Babe, H.M., Nguyen, S., Zi, Y., Guha, A., Feldman, M.Q., Anderson, C.J.: Studenteval: A benchmark of student-written prompts for large language models of code (2023)
4. Barke, S., James, M.B., Polikarpova, N.: Grounded copilot: How programmers interact with code-generating models. Proc. ACM Program. Lang. 7(OOPSLA1)
(apr 2023). https://doi.org/10.1145/3586030, https://doi.org/10.1145/3586030 5. Becker, B.A., Denny, P., Finnie-Ansley, J., Luxton-Reilly, A., Prather, J.,
Santos, E.A.: Programming is hard - or at least it used to be: Educational opportunities and challenges of ai code generation. In: Proceedings of the 54th ACM Technical Symposium on Computer Science Education V. 1. p. 500–506. SIGCSE 2023, Association for Computing Machinery, New York, NY, USA (2023). https://doi.org/10.1145/3545945.3569759, https://doi.org/
10.1145/3545945.3569759 6. Cipriano, B.P., Alves, P.: LLMs Still Can't Avoid Instanceof: An Investigation Into GPT-3.5, GPT-4 and Bard's Capacity to Handle Object-Oriented Programming Assignments http://arxiv.org/abs/2403.06254v1 7. Cipriano, B.P., Alves, P.: GPT-3 vs Object Oriented Programming Assignments: An Experience Report. In: Proceedings of the 2023 Conference on Innovation and Technology in Computer Science Education V. 1.

p. 61–67. ITiCSE 2023, Association for Computing Machinery, New York, NY, USA (2023). https://doi.org/10.1145/3587102.3588814, https://doi.org/
10.1145/3587102.3588814 8. Denny, P., Kumar, V., Giacaman, N.: Conversing with copilot: Exploring prompt engineering for solving cs1 problems using natural language. In: Proceedings of the 54th ACM Technical Symposium on Computer Science Education V. 1.

p. 1136–1142. SIGCSE 2023, Association for Computing Machinery, New York, NY, USA (2023). https://doi.org/10.1145/3545945.3569823, https://doi.org/
10.1145/3545945.3569823 9. Denny, P., Leinonen, J., Prather, J., Luxton-Reilly, A., Amarouche, T., Becker, B.A., Reeves, B.N.: Promptly: Using prompt problems to teach learners how to effectively utilize ai code generators. arXiv preprint arXiv:2307.16364 (2023)
10. Denny, P., Leinonen, J., Prather, J., Luxton-Reilly, A., Amarouche, T., Becker, B.A., Reeves, B.N.: Prompt problems: A new programming exercise for the generative ai era. In: Proceedings of the 55th ACM Technical Symposium on Computer Science Education V. 1. p. 296–302. SIGCSE 2024, Association for Computing Machinery, New York, NY, USA (2024). https://doi.org/10.1145/3626252.3630909, https://doi.org/10.1145/3626252.3630909 11. Denny, P., Prather, J., Becker, B.A., Finnie-Ansley, J., Hellas, A., Leinonen, J.,
Luxton-Reilly, A., Reeves, B.N., Santos, E.A., Sarsa, S.: Computing Education in the Era of Generative AI. Commun. ACM 67(2), 56–67 (Jan 2024), https:
//doi.org/10.1145/3624720 12. Finnie-Ansley, J., Denny, P., Becker, B.A., Luxton-Reilly, A., Prather, J.: The robots are coming: Exploring the implications of openai codex on introductory programming. In: Proceedings of the 24th Australasian Computing Education Conference. pp. 10–19 (2022)
13. Hou, I., Man, O., Mettille, S., Gutierrez, S., Angelikas, K., MacNeil, S.: More robots are coming: Large multimodal models (chatgpt) can solve visually diverse images of parsons problems. arXiv preprint arXiv:2311.04926 (2023)
14. Kazemitabaar, M., Chow, J., Ma, C.K.T., Ericson, B.J., Weintrop, D., Grossman, T.: Studying the effect of ai code generators on supporting novice learners in introductory programming. In: Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems. CHI '23, Association for Computing Machinery, New York, NY, USA (2023). https://doi.org/10.1145/3544548.3580919, https://doi.org/10.1145/3544548.3580919 15. Krawczyk, Jack: Bard's latest update: more features, languages and countries. https://blog.google/products/bard/
google-bard-new-features-update-july-2023/ (2023), [Online; last accessed 16-December-2023]
16. Lau, S., Guo, P.: From" ban it till we understand it" to" resistance is futile":
How university programming instructors plan to adapt as more students use ai code generation and explanation tools such as chatgpt and github copilot. In:
Proceedings of the 2023 ACM Conference on International Computing Education Research-Volume 1. pp. 106–121 (2023)
17. Lenfant, R., Wanner, A., Hott, J.R., Pettit, R.: Project-based and assignmentbased courses: A study of piazza engagement and gender in online courses. In:
Proceedings of the 2023 Conference on Innovation and Technology in Computer Science Education V. 1. pp. 138–144 (2023)
18. Liffiton, M., Sheese, B.E., Savelka, J., Denny, P.: CodeHelp: Using Large Language Models with Guardrails for Scalable Support in Programming Classes.

In: Proceedings of the 23rd Koli Calling International Conference on Computing Education Research. Koli Calling '23, Association for Computing Machinery, New York, NY, USA (2024). https://doi.org/10.1145/3631802.3631830, https:
//doi.org/10.1145/3631802.3631830 19. OpenAI: Chatgpt can now see, hear, and speak. https://openai.com/
blog/chatgpt-can-now-see-hear-and-speak (2023), [Online; last accessed 12-
December-2023]
20. Ouh, E.L., Gan, B.K.S., Shim, K.J., Wlodkowski, S.: Chatgpt, can you generate solutions for my coding exercises? an evaluation on its effectiveness in an undergraduate java programming course. arXiv preprint arXiv:2305.13680 (2023)
21. Paiva, J.C., Leal, J.P., Figueira, A.: Automated assessment in computer science education: A state-of-the-art review. ACM Trans. Comput. Educ. 22(3) (jun 2022).

https://doi.org/10.1145/3513140, https://doi.org/10.1145/3513140 22. Porter, L., Zingaro, D.: Learn AI-Assisted Python Programming With GitHub Copilot and ChatGPT. Manning, Shelter Island, NY, USA (2023), https://www.

manning.com/books/learn-ai-assisted-python-programming 23. Prather, J., Denny, P., Leinonen, J., Becker, B.A., Albluwi, I., Craig, M., Keuning, H., Kiesler, N., Kohn, T., Luxton-Reilly, A., MacNeil, S., Petersen, A.,
Pettit, R., Reeves, B.N., Savelka, J.: The robots are here: Navigating the generative ai revolution in computing education. In: Proceedings of the 2023 Working Group Reports on Innovation and Technology in Computer Science Education. p. 108–159. ITiCSE-WGR '23, Association for Computing Machinery, New York, NY, USA (2023). https://doi.org/10.1145/3623762.3633499, https:
//doi.org/10.1145/3623762.3633499 24. Savelka, J., Agarwal, A., An, M., Bogart, C., Sakr, M.: Thrilled by your progress!

large language models (gpt-4) no longer struggle to pass assessments in higher education programming courses. In: Proceedings of the 2023 ACM Conference on International Computing Education Research V.1. ICER 2023, ACM
(Aug 2023). https://doi.org/10.1145/3568813.3600142, http://dx.doi.org/10.

1145/3568813.3600142 25. Savelka, J., Agarwal, A., Bogart, C., Song, Y., Sakr, M.: Can generative pre-trained transformers (gpt) pass assessments in higher education programming courses? In: Proceedings of the 2023 Conference on Innovation and Technology in Computer Science Education V. 1. ITiCSE 2023, ACM (Jun 2023). https://doi.org/10.1145/3587102.3588792, http://dx.doi.org/10.1145/
3587102.3588792 26. Sheard, J., Denny, P., Hellas, A., Leinonen, J., Malmi, L., Simon: Instructor perceptions of ai code generation tools - a multi-institutional interview study.

In: Proceedings of the 55th ACM Technical Symposium on Computer Science Education V. 1. p. 1223–1229. SIGCSE 2024, Association for Computing Machinery, New York, NY, USA (2024). https://doi.org/10.1145/3626252.3630880, https://doi.org/10.1145/3626252.3630880 27. Yeti¸stiren, B., Ozsoy, I., Ayerdem, M., T¨uz¨un, E.: Evaluating the code quality of ¨
ai-assisted code generation tools: an empirical study on github copilot, amazon codewhisperer, and chatgpt. arxiv preprint arxiv: 230410778. 2023 (2023)
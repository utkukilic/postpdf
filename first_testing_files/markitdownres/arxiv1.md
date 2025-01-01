4
2
0
2

t
c
O
3
1

]

R

I
.
s
c
[

1
v
1
7
8
9
0
.
0
1
4
2
:
v
i
X
r
a

A Comparative Study of PDF Parsing Tools Across Diverse
Document Categories

Narayan S. Adhikari1* and Shradha Agarwal1,2,3

1JadooAI, Sacramento, California, USA.
2Department Nuclear Engineering and Radiation Science, Missouri University of Science
and Technology, Rolla, Missouri, USA.
3Department of Computer Science, Missouri University of Science and Technology, Rolla,
Missouri, USA.

*Corresponding author(s). E-mail(s): n.adhikari2010@gmail.com;
Contributing authors: sabrc@mst.edu;

Abstract

PDF is one of the most prominent data formats, making PDF parsing crucial for diverse NLP tasks,
including document classiﬁcation, information extraction, and retrieval, especially with the growing
prevalence of Retrieval Augmented Generation (RAG) framework. While various PDF parsing tools
exist, their eﬀectiveness across diﬀerent document types remains understudied, especially beyond
academic documents. Our research aims to address this gap by comparing 10 popular PDF pars-
ing tools across 6 document categories using the DocLayNet dataset. These tools include PyPDF,
pdfminer.six, PyMuPDF, pdfplumber, pypdﬁum2, Unstructured, Tabula, Camelot, as well as the deep
learning-based tools Nougat and Table Transformer(TATR). We evaluated both text extraction and
table detection capabilities. For text extraction, PyMuPDF and pypdﬁum generally outperformed
others, but all parsers struggled with Scientiﬁc and Patent documents. For these challenging cate-
gories, learning-based tools like Nougat demonstrated superior performance. In table detection, TATR
excelled in the Financial, Patent, Law & Regulations, and Scientiﬁc categories. Table detection tool
Camelot performed best for Government Tenders, while PyMuPDF performed superiorly in the Man-
ual category. Our ﬁndings highlight the importance of selecting appropriate parsing tools based on
document type and speciﬁc tasks, providing valuable insights for researchers and practitioners working
with diverse document sources.

Keywords: Text extraction, PDF parsing, Table detection, Evaluation

1 Introduction

PDF(Portable Document Format) was developed
in 1992 to enable viewing and exchanging elec-
tronic documents independently of device or
environment[1]. It uses an imaging model derived
from the PostScript language. PDF can incor-
porate various types of content, including text,

images, annotations, videos, and 3D objects.
Also, PDF supports encryption, digital signa-
tures, attachments, and metadata. These features
have made it one of the most popular docu-
ment formats. It is estimated that roughly around
2.5 trillion PDF documents are in circulation[2].
PDF parsing is crucial for a wide range of NLP

1

tasks, including document summarization, trans-
lation, information retrieval, and question answer-
ing. With the advent of promising Retrieval-
Augmented Generation (RAG) architectures[3],
it has become even more important, as PDF is
a common source for knowledge base creation,
and unlike tagged documents such as HTML,
PDFs only store instructions for character and line
placement[4]. Parsing PDFs has several critical
challenges that demand careful consideration and
handling[5], some of these are mentioned below:

1. Word identiﬁcation: Extraction processes may
incorrectly break words, mishandle hyphen-
ation, or struggle with special characters like
emojis and diacritics (e.g., ‘a’ vs. ‘`a’).

2. Word order preservation: Maintaining correct
word sequence can be problematic, especially
when dealing with multi-column layouts.

3. Paragraph integrity: Text ﬂow can be disrupted
by embedded formulas or images, potentially
fragmenting paragraphs or inadvertently incor-
porating image captions into the main text.

4. Table extraction:

Inaccurate identiﬁcation/
complete failure in the identiﬁcation of tabu-
lar data. This can result in misaligned rows
and columns, compromising the integrity of the
extracted information.

PDF parsing methods can be broadly cat-
rule-based and learning-based
egorized into
approaches. Rule-based methods include ﬁxed
rules[6], Hidden Markov Models[7], etc. Learning-
based approaches include a variety of
tech-
such as using Machine learning[8][9],
niques
CRNN[10], and transformer architectures[11][12].
While advanced machine learning methods are
promising in this area, studying rule-based parsers
for PDF analysis remains highly relevant. Rule-
based approaches oﬀer distinct advantages in com-
putational eﬃciency, speed of deployment, and
ease of use. They require less processing power
and can be quickly implemented without any
domain-speciﬁc training, making them accessible
to a wider range of users and scenarios. One of
the other advantages of rule-based parsers is their
interpretability, which allows for easier debugging
and auditing of the parsed text. The primary
objective of our study is to evaluate the state-of-
the-art rule-based tools for text extraction from

PDFs across various domains, including their per-
formance on both general text and tabular con-
tent. We aim to identify their shortcomings and
propose potential solutions to address these limi-
tations.
We conduct a comprehensive comparison of 10
well-maintained, open-source PDF parsing tools
using the DocLayNet dataset[13] for general text
extraction and table detection tasks. Notably, this
is the ﬁrst comparative study of PDF parsers
across six distinct document categories. To the
best of our knowledge, the DocLayNet dataset
has not been previously utilized for such studies.
Our study primarily utilizes digitally-born PDFs
rather than being scanned from paper documents
from the DocLayNet dataset. For such documents,
rule-based parsers are one of the most eﬃcient
methods for text extraction. To contextualize our
work, we summarize labeled datasets and evalua-
tion approaches used in previous studies in Section
2. Section 3 outlines the DocLayNet dataset and
our evaluation criteria, establishing the founda-
tion for our comparative analysis of PDF parsing
tools. At the end part of the paper, we provide a
comparison of PDF parsers across document cate-
gories as well as an overall study, aiming to provide
a fair assessment of their capabilities for table and
text extraction.

2 Related Work

We ﬁrst survey the existing labeled datasets for
information extraction tasks from PDFs. The ear-
liest datasets for Document Image Analysis and
Recognition (DIAR) can be traced back to the
1990s, including NIST[14] and UW[15] datasets.
Over the past 30 years, there has been signif-
icant progress in this direction. Notable, since
2015, the ﬁeld has seen a boom in terms of
dataset availability. Initially, the datasets were
small and comprised scanned PDFs or images,
but as time progressed, datasets with digital-
born PDFs became more prevalent. In creating a
Document Layout Analysis (DLA) dataset, anno-
tation is the most challenging part. The process
of annotation can be broadly classiﬁed into three
categories[16]:

1. Manual: A set of rules is given to human
annotators for annotating the documents.

2

2. Automatic: A set of algorithms is used to anno-
tate the data. Humans are only needed for
quality checking.

3. Generative: Generative models are used to

synthesize the data.

Manual annotation is very laborious and not scal-
able for large documents. Automatic annotation
is a good choice for a large number of documents,
but it has certain constraints. It often requires
additional structured ﬁles such as TeX or XML.
Most of the DLA datasets consist of scientiﬁc or
research documents as shown in Table 1. There
are two primary reasons for this: (i) Availability:
These documents are easily accessible online, e.g.,
arXiv. (ii) Ease of annotation: Automatic annota-
tion is possible since most of these accompanying
TeX ﬁles.
We also observe that some of these datasets are
partially annotated, focusing only on certain ele-
ments (such as metadata or references) of the doc-
uments. DocBank and PubLayNet are currently
the two largest fully annotated datasets available.
PubLayNet[17], containing over 360,000 docu-
ments, was constructed using scientiﬁc and medi-
cal publications. On the other hand, DocBank[18]
was created using approximately 500,000 docu-
ments from arXiv. It categorizes the extracted text
into 12 element categories. The recent M6Doc[19]
dataset contains 9,080 manually annotated pages,
which include scanned and photographed doc-
uments from categories such as scientiﬁc arti-
cles, textbooks, books, test papers, magazines,
newspapers, and notes in Chinese and English.
There are many datasets speciﬁcally dedicated
to table detection and table structure recogni-
tion. PubTables-1M[20] is the largest dataset cre-
ated using scientiﬁc articles for table detection
and structure recognition. It has input ﬁles in
PDF/XML format and output as JSON. However,
several popular datasets, such as ICDAR-2019 [21]
and TableBank [22], contain input in Image/La-
TeX format. We have not included them in Table
1 as we are interested in PDFs only.
DocLayNet[13] is the largest dataset containing
fully annotated digital-born documents from six
diﬀerent domains (Law and Regulations, Finan-
cial documents, Government Tenders, Scientiﬁc
articles, Manuals, and Patents). It comprises over
80,000 manually annotated documents catego-
rized into 11 diﬀerent element categories (Caption,

Footnote, Formula, List-item, Page footer, Page-
header, Picture, Section-header, Table, Text, and
Title).

Several studies have been conducted to evalu-
ate PDF parsing tools using various metrics (Table
2). Our literature review of these studies found
that:

1. Some of these studies[8][28] focus solely on
selected element extraction capabilities of PDF
parsers (e.g. metadata).

2. Only Bast[5] and Meuschke[29] have compared

PDF parsers for full layout analysis.

3. Almost all of these studies have tested PDF
parsers against academic documents exclu-
sively.

4. There is no study comparing PDF parsers
that focus solely on full-text extraction with-
out speciﬁc element extraction (e.g., headers,
titles).

quality

5. Meuschke et al.[29] shows that the Table
these
of
extraction
tools(Camelot, Tabula, etc.) is signiﬁcantly
lower compared to other elements. However,
they do not further investigate the underlying
reasons for this disparity.

some

of

6. Except for the study by Meuschke[29], most of
the tools from other studies are outdated or not
actively maintained.

These observations highlight the need for a
comparative study to evaluate the performance
of the latest PDF parsers across a wide range of
document types, not just limited to scientiﬁc pub-
lications. The DocLayNet dataset includes various
document types with speciﬁc element labels such
as formulas and tables. The diversity in docu-
ment categories in the DocLayNet dataset allows
for a more accurate representation of the variety
of document layouts found in real-world applica-
tions. We chose this dataset for our study because
it directly aligns with our objectives: (i) com-
paring PDF parser performance across multiple
document types; (ii) assessing parser capabilities
for comprehensive full-text extraction; and (iii)
evaluating table extraction performance.

3 Methodology

In this section, we provide an overview of the
main features of the dataset we used for our study,
namely the DocLayNet dataset[13], and outline

3

Table 1 Overview of commonly cited datasets for information extraction from PDFs, detailing various types of ground
truth elements (GTE) including references (R), full text with layout details (FT), and tables (T). The ground truth
elements were generated either automatically using XML or LaTeX ﬁles, or manually with human intervention.

Dataset

Size

Source

Document Type

GTE Annotation

GIANT [23]
S2ORC[24]
PubLayNet[17]
SciTSR[25]
Bast[5]
DocBank[18]
FinTabNet[26]
PubTables-1M[20]
DocLayNet[13]
M6Doc[19]
SciBank[27]

Crossref

Research articles
1B
8.1M Semantic Scholar Research articles
360k PubMed
15k
12k
500k
89k
1M
80k
9k
74k

arXiv
arXiv
arXiv
Multiple sources
PubMed
Multiple sources Multiple
Multiple sources Multiple
arXiv

Biomedical articles
Research articles
Scientiﬁc articles
Research articles
Annual ﬁnancial reports T
T
Scientiﬁc articles
FT
FT
FT

Automatic(XML)
R
R, FT Automatic(Latex)
Automatic(XML)
FT
Automatic(Latex)
T
Automatic(Text)
FT
Automatic(Text)
FT
Automatic(XML)
Automatic(XML)
Manual
Manual
Automatic(Latex)

Scientiﬁc articles

Table 2 Summary of studies comparing PDF parsers Evaluation metrics used by the studies: Precision(P), Recall(R),
and F1 Score.

Paper

Dataset Size Document Type Metrics Elements No. of tools

Tkaczyk[8]
Bast[5]
Lipinski[28]
Meuschke[29]

9,491
12,000
1,253
500,000

Scientiﬁc
Scientiﬁc
Scientiﬁc
Academic

P, R, F1 References
Custom
Multiple
Accuracy Metadata
Multiple
P, R, F1

10
14
9
10

the steps we took to generate the ground truth
text. Additionally, we discuss the evaluation met-
rics utilized and the PDF parsers evaluated in our
analysis.

3.1 DocLayNet Dataset

DocLayNet contains approximately 80,000 docu-
ment pages. Documents are annotated with 11
distinct elements: Footnote, Formula, List-item,
Page footer, Page-header, Picture, Section header,
Table, Text, and Title. The documents provided
in the DocLayNet dataset are classiﬁed into 6
distinct categories: Financial Reports, Manuals,
Scientiﬁc Articles, Laws and Regulations, Patents,
and Government Tenders. The distribution of
these categories is provided in Figure 1. These doc-
uments are mostly in English (95%), with a few
documents in German (2.5%), French (1%), and
Japanese (1%).

The other datasets[17][18]mainly contain sci-
entiﬁc documents taken from repositories such as
arXiv or PubMed. These datasets have limited
variability in layout as they follow more or less

Law and Regulation

Financial

16.0%

32.0%

Tenders

6.0%

21.0%

17.0%

Manuals

8.0%

Scientific

Patents

Fig. 1 Distribution of document categories in DocLaynet
Dataset[13]

uniform templates. However, DocLayNet provides
a wide range of document layouts. The ‘Financial’
and ‘Manual’ categories include a large num-
ber of freestyle documents. Speciﬁcally, Financial
Reports consist of both annual reports in freestyle
format and formal SEC (Securities and Exchange
Commission) ﬁlings, while the Manuals category

4

comprises documents such as instructions for com-
puter program manuals and grammar guides. The
remaining categories - Scientiﬁc Articles, Laws
and Regulations, Patents, and Government Ten-
ders - contain documents from various websites
and publishers, further increasing the variability
in document layouts. To ensure the high quality
and reliability of the annotations, around 7,059
documents were doubly annotated, and 1,591 doc-
uments were triply annotated. This means these
documents were independently annotated by two
or three diﬀerent annotators respectively, allowing
for the determination of inter-annotator agree-
ment.
DocLayNet’s ‘core’ dataset contains JSON ﬁles in
standard COCO format[30] with images (PNG).
Each JSON ﬁle has information such as document
category, document name, precedence (non-zero in
case of redundant double- or triple-annotation),
bounding box coordinates, and text inside the
bounding boxes. DocLayNet’s ‘extra’ dataset con-
tains PDF and JSON ﬁles which include the text
and bounding box coordinates. Both datasets con-
tain ﬁles split into test, train, and validation
sets.

3.1.1 Extraction of Ground Truth

For the extraction of ground truth, we used the
processed ﬁles from Hugging Face 1, which con-
tained the DocLayNet core dataset with corre-
sponding PDF ﬁles taken from DocLayNet extra
ﬁles. For text extraction, we followed a 4-step
process to generate ground truth from JSON :

1. Load the JSON into a data frame.
2. Sort the text by ‘id box line’. The ‘id box line’
is a unique identiﬁer that ensures the text is
processed in the correct order based on its
position in the document.

3. Add the text together with a space if the text
‘category’ is the same. If the text ‘category’
changes, add a new line.

4. Repeated the process for each JSON ﬁle.

With these steps, we were able to extract the
full ground truth text as closely as possible to the
actual layout. In addition to that we made sure
that the header is always on top and the footer

1

https://huggingface.co/datasets/pierreguillou/DocLayNet-

base

on bottom. An example of the output is shown in
Figure 2.

JSON

Fig. 2 Example of ground truth generation from the
JSON ﬁle loaded into a dataframe. Content from the ‘text’
column was extracted, and new lines and spaces were added
according to the ‘category’ column.

3.2 Evaluation Procedure

We used two diﬀerent evaluation procedures: i) for
the text and ii) for the tables. The distinction is
necessary because, in the former, we are evaluating
the text extraction quality of the parser, while in
the latter, we are only evaluating the table detec-
tion ability of parsers.
i) For the text extraction: Ground truth
text was obtained by parsing JSON ﬁles using
the procedure discussed in the previous section.
Correspondingly, PDFs with matching ﬁlenames
were processed using a PDF parser to obtain the
extracted text. We compared the text extracted
from PDF parsers with the ground truth from the
JSON ﬁle. However, for some metrics(Levenshtein
similarity and BLEU) as shown in Figure 3, the
text is required in tokenized format, we tokenized
the combined text for those metrics.

ii)For the table detection: We used a sim-
ilar process as described in the previous section.
However, we only extracted ‘text’ from the JSON
ﬁle if it belonged to the ‘Table’ category. The
rule-based PDF parser we used has the capability
to extract the tables separately (Table 1). How-
ever, these parsers only provide the tables and
not the bounding boxes of the identiﬁed tables.
Therefore, we relied on the extracted text to deter-
mine whether the table was correctly detected. We
compared the extracted text from the tables rec-
ognized by the PDF parsers with the ground truth
text and then used a threshold to decide whether
the table was correctly identiﬁed. When com-
paring with transformer-based parsers, instead of
using the extracted text, we relied on the bounding

5

Ls(s1, s2) = 1 − Ld(s1, s2)

kLs(s1, s2)k =

Ls(s1, s2)
max(l1, l2)

(1)

(2)

where,

l1, l2 are lengths of strings s1, s2.
For each document, we generated a similarity
matrix by computing the Normalized Levenshtein
similarity score between the tokenized extracted
text and the ground truth. Each element of Simi-
larity Matrix S (Equation 3) represents the simi-
larity between the ith token of extracted text and
jth token of ground truth.

S = [Sij ](let×lgt)

(3)

We chose a matching threshold of 0.7[29]. We
then computed Precision, Recall, and F1 scores as
follows:

T Pi,j =

1 if sij ≥ 0.7
0 Otherwise

(

Where, sij is an element of the similarity matrix.

P =

R =

F1 =

P

P

let
i=1

let
i=1

lgt
j=1 T Pi,j
let
lgt
j=1 T Pi,j
lgt
P
2 × P × R
P + R

P

(4)

(5)

(6)

This procedure is discussed in detail by Meuschke
et al.[29]. This metric evaluates the PDF parser’s
word/token-wise extraction quality. By computing
the Normalized Levenshtein similarity token-wise,
the F1 score provides a reliable estimate of the
PDF parser’s ability to accurately identify and
extract individual words from the PDF.

The

BLEU

(Bilingual

Evaluation
Understudy)[32] method was originally developed
for evaluating machine translation. It can be
used to compare a reference text (the ground
truth) with a candidate text (the extracted text).
To calculate the BLEU score, we ﬁrst compute
the geometric average of the modiﬁed n-gram
precision pn of the tokenized ground truth and
extracted text. Then, we multiply it by the

Fig. 3 Comparison of PDF parser outputs against ground
truth data. Both JSON and PDF ﬁles are processed to
produce ground truth text and extracted text from PDF
parsers. Both outputs are saved in the tokenized and com-
bined format before being evaluated using metrics such as
F1 score, BLEU, and Local Alignment.

boxes since they provide the bounding box coor-
dinates in the output. The threshold criterion and
the evaluation metrics will be discussed in detail
in the subsequent section.

3.3 Evaluation Metrics

In this section, we establish evaluation criteria
suitable for comparing extracted text against the
ground truth and for assessing table detection. As
discussed in the introduction, several factors can
aﬀect extraction quality,
including word order,
word identiﬁcation, paragraph alignment, and
misidentiﬁcation of tables. Therefore, it is crucial
to utilize evaluation metrics that consider all
these factors.

For Text Extraction: For the evaluation of
text extraction, we used a three-fold evaluation
strategy: i) Calculation of F1 score using Leven-
shtein similarity ii) BLEU Score iii) Calculation of
local alignment score

The Levenshtein distance(Ld) is the minimum
number of edit operations required to transform
one string into another. The edit operations are:
(i) Single character insertion (ii) Single character
deletion (iii) Single character substitution.
Levenshtein Similarity(Ls) for two strings s1, s2 is
deﬁned in Equation 1. However, we prefer Normal-
ized Levenshtein similarity deﬁned in Equation 2
as it is not sensitive to the length of strings[31].

6

Text

Fig. 4 Similarity matrix is generated by calculating
the normalized Levenshtein similarity between tokenized
GT(Ground truth) and ET(Extracted text). if the value is
greater than the threshold(colored) it is counted as 1. Here
P

3
j=1 T Pi,j = 2

3
i=1 P

brevity penalty (BP),

1
exp(1 − r/c) otherwise.

if c > r

(

(7)

BP =

and,

BLEU = BP · exp

wn log pn

N

n=1
X

(8)

!

where c is the length of candidate text(extracted
text) and r is the length of reference text(ground
truth text). N is the maximum length of n-
gram, wn assigned weights to n-gram preci-
sion. In our experiments, we calculated BLEU-4
score(N=4). Since BLEU computes the n-gram
overlap between the extracted text and the ground
truth, it is an eﬀective metric for evaluating both
word order and word identiﬁcation.

Local alignment is a commonly used method in
bioinformatics for matching sequences[33]. We use
the local alignment score to assess the overall qual-
ity of text extraction. When given two strings s1
and s2, we look for two substrings s′
2 (from
s1 and s2 respectively) with the highest similar-
ity among all pairs of substrings from s1 and s2.
The similarity is calculated using a scoring system
(refer to Figure 5), where matches receive positive
scores, and mismatches and gaps are penalized.
The gap penalty[33] can be deﬁned in the following
way:

1 and s′

GS = OGS + (n-1) × EGS

(9)

Where, GS is Gap Score, OGS is an open gap score
for the ﬁrst gap in a cluster. EGS is the extended
gap score used for each gap following the open gap.

7

n is the length of the gap.
Local alignment score is a quantiﬁable scoring
system, that balances well-matched areas against
parsing errors like incorrect word extraction, lay-
out mistakes, and paragraph splitting issues, mak-
ing it an excellent choice for evaluating PDF
parsers. The local alignment score is usually cal-
culated using the Smith-Waterman algorithm[34].
In our experiments, we calculated the normal-
ized local alignment(normalized by the length of a
longer string) score using combined ground truth
and extracted text.

Fig. 5 An example of Local alignment score calculation
for two strings. First, we deﬁne the matching score, mis-
match, and Gap penalty. For these two strings, the local
alignment score is 4 and the normalized local alignment
score is 0.67.

For Tables: In order to evaluate table extrac-
tion, we use the Intersection over Union (IoU)
to compare the similarity between the table
extracted by the parser and the ground truth
table. IoU can be deﬁned as follows:

IoU =

| A ∩ B |
| A ∪ B |

(10)

Where A and B can be areas of bounding boxes or
sets of strings; the latter is also known as Jaccard
similarity.

If the parser extracts text from a table without
providing the bounding boxes, we use the Jaccard
index to calculate the precision and recall of the
detection. First, we ﬂatten the tables extracted by
parsers into a list, as the tables from the ground
truth JSON can only be extracted as a list. Then,
for each document, we compute the normalized
Jaccard similarity between all extracted tables
and ground truth tables. If the Levenshtein simi-
larity between a pair of ground truth tables and an
extracted table exceeds a threshold, we consider it
as a correctly identiﬁed table by the parser.

In cases where bounding box information is
available, we use Intersection over Union (IoU) to
calculate the precision and recall of the detection.

The DocLayeNet dataset contains bounding boxes
in COCO format, but we converted it to Pascal
VOC format because the model we used requires
this format.2 Then we computed the IoU between
the extracted table and ground truth table accord-
ing to the Equation 10. If the IoU is greater than
the threshold, we consider it a correctly identiﬁed
table. Finally, we calculate precision, recall, and
F1 score for table detection.

3.4 Tools used

It has

In our study, we conducted a comprehensive com-
parison of 10 open-source tools for text and table
extraction tasks. These tools were selected based
on their recent activity, ensuring that each has
had active contributions on GitHub within the
last six months. This criterion guarantees that the
tools are up-to-date and likely to be supported
and maintained by their developers. The tools we
evaluated are summarized in Table 3. By including
only actively maintained tools, we aim to present
the most relevant and eﬀective solutions available
for text and table extraction tasks.
PyPDF3: PyPDF is a mature, pure Python
images, and
library capable of extracting text,
metadata from PDF ﬁles.
inspired
many forks, including the well-known PyPDF2,
PyPDF3, and PyPDF4. Notably, PyPDF2 has
been merged back into the main PyPDF library,
consolidating its features and improvements. For
our experiments, we used the latest version of
PyPDF.
Pdfminer4: Pdfminer is a versatile tool capable of
extracting text, images, table of contents, and font
size information from PDF ﬁles. It performs auto-
matic layout analysis and supports CJK (Chinese,
Japanese, Korean) languages as well as vertical
writing. For our experiments, we used its most
active fork, pdfminer.six.
PDFPlumber5: Built on top of pdfminer, it can
extract text as well as tables. It also features a
visual debugging tool to aid in the extraction pro-
cess.
PyMuPDF6: It provides Python bindings to the

MuPDF library written in C. It can extract text,
tables, and images, and provides optional OCR
support with Tesseract. However, here we use only
the rule-based version of PyMuPDF for our anal-
ysis.
Pypdﬁum27: Pypdﬁum2 is a binding to the
PDFium library, capable of extracting text and
images from PDF ﬁles.
Unstructured8: Unstructured is a library for
preprocessing and ingesting images and text doc-
uments. It supports element-wise text extraction
and can extract images as well. Unstructured also
provides support for the OCR and chipper model,
to extract text from scanned documents, and per-
forms layout analysis with the ‘detectron2’ model.
It oﬀers table extraction features with OCR. We
haven’t used the OCR version of this tool in our
comparison.
Camelot9: It is a Python library that provides
table extraction features for PDFs. Tables are
extracted as Pandas DataFrames. It provides user
ﬂexibility to tweak the conﬁguration parameters
for table extraction. It uses two technologies:
stream and lattice. Lattice mode identiﬁes the
demarcated lines between cells and uses them to
parse the tables. On the other hand, stream mode
uses whitespace between cells to parse the table.
In our experiments, we used the default settings.
Tabula10: Tabula or tabula-py is a Python wrap-
per around tabula-java and uses PDFBox in the
background. It can extract tables from PDFs
and convert them into DataFrames, CSV ﬁles, or
JSON. It also oﬀers stream and lattice modes. In
our experiments, we did not specify any mode our-
selves.
Nougat: Nougat[35](Neural Optical Understand-
ing for Academic documents) is a transformer-
based vision and document understanding (VDU)
model. It uses an encoder-decoder architecture
inspired by the donut model. It is speciﬁcally
trained for academic documents. Nougat excels at
converting Scientiﬁc documents to markup text
and is particularly adept at parsing Mathematical
equations.
TATR: The Table Transformer(TATR)[36] is an

2

3

4

5

6

COCO to PASCAL:
[xmin, ymin, xmax, ymax]

[xcenter, ycenter, width, height] →

https://github.com/py-pdf/pypdf
https://github.com/pdfminer/pdfminer.six
https://github.com/jsvine/pdfplumber
https://github.com/pymupdf/PyMuPDF

8

7

8

9

https://github.com/pypdﬁum2-team/pypdﬁum2
https://github.com/Unstructured-IO/unstructured
https://github.com/camelot-dev/camelot
https://github.com/chezou/tabula-py

10

metrics, emphasizing the signiﬁcance of consider-
ing multiple evaluation criteria when choosing a
parser.

Scientiﬁc and Patent categories presented
notable challenges. In the Scientiﬁc category, all
tools showed a marked decrease in performance,
with Pypdﬁum maintaining a slight edge at an F1
score of 0.8525 and BLEU score of 0.7089 as shown
in Table 4. The Patent category exhibited the
widest performance gap among tools. PyMuPDF
and pypdﬁum signiﬁcantly outperformed others,
scoring F1 scores of 0.973 and 0.969 respectively.
The signiﬁcant drop in scores for Scientiﬁc and
Patent documents highlights a persistent chal-
lenge in PDF parsing technology. For Scientiﬁc
documents, we compare the rule-based parser with
Nougat a Visual transformer model and it outper-
forms all rule-based parsers by a huge margin as
shown in Figure 8.

The results show that the type of document
has a strong inﬂuence on the performance of the
tools used. The best choice of tools depends on
the speciﬁc document type and the performance
aspects prioritized for a particular information
retrieval task. For tasks that prioritize maintain-
ing the structure of the document, like legal doc-
ument analysis, parsers with high BLEU-4 scores
such as PyMuPDF may be preferred. On the other
hand, tasks requiring comprehensive information
capture may beneﬁt from parsers with high recall.
Although there was not a signiﬁcant diﬀerence in
F1 scores among the tools (the highest diﬀerence
being 0.1 for the patent category), the variation
in BLEU and local alignment scores was quite
apparent as shown in Table 4. This indicates that
the diﬀerences in performance among parsers pri-
marily lie in their ability to accurately interpret
the structure and layout of the documents, rather
than in their ability to extract individual words.

object detection model trained on the PubTables-
1M and FinTabNet datasets for table detection.
It is capable of recognizing tables from image
inputs. However, a separate OCR model is needed
to extract the text. TATR can be trained for other
domains using custom datasets.

4 Results

In this section, we present the results of evaluating
various PDF parsers for text extraction and table
detection tasks using the DocLayNet dataset[13].
We compared parsers across 6 categories as sum-
marized in Table 4-5 and Figures 6-9. For text
extraction(4.1), we used a Levenshtein similar-
ity threshold of 0.7. For table detection(4.2), the
Jaccard index threshold was set to 0.75, and we
computed IOU with two thresholds: 0.6 and 0.7.
To ensure a fair comparison, we used a balanced
dataset with an equal number of documents across
all categories in our experiments.

4.1 For Text Extraction:

We compared the PDF parsers using the met-
rics: F1 scores, BLEU-4, and local alignment
scores across 6 document categories(refer Table
4). The results reveal signiﬁcant performance vari-
ations among PDF parsing tools across diﬀer-
ent document categories. Financial, Tender, Law,
and Manual categories saw consistently high F1
scores across most tools, with PyMuPDF and
pypdﬁum consistently performing better in these
document types as shown in Figure 6 and Figure
7. PyMuPDF and pypdﬁum demonstrated con-
sistency in word order preservation, achieving
the highest BLEU-4 scores in Financial, Manual,
Scientiﬁc, and Tender, Patent, Law & Regula-
tions categories, respectively. This suggests that
these two tools are particularly adept at main-
taining the original word structure in sentences, a
crucial factor in many information retrieval appli-
cations. PyMuPDF and pypdﬁum have also shown
good performance in local alignment scores indi-
cating their ability to handle complex layouts
and paragraph structures eﬀectively. Additionally,
PyPDF has demonstrated high local alignment
scores across some categories such as Law (0.9358)
and Manual (0.9343). However,
it’s important
to note that it didn’t perform as well in other

9

Table 3 Overview of text and table extraction tools used in our study. Key extraction capabilities include extraction of
Image (I), Text (T), Metadata (M), Table of Contents (TOC), and Table (TB). Most tools use rule-based (RB)
technology, with some oﬀering Optical Character Recognition (OCR) capabilities. However, Nougat and Table
Transformers were not the primary focus of this study.

Tool
PyPDF
pdfminer.six
PyMuPDF
pdfplumber
pypdﬁum2
Unstructured
Tabula
Camelot
Nougat
Table Transformer TATR-v1.1-All TB

Version
4.3.0
20240706
1.24.7
0.11.2
4.30.0
0.14.10
2.9.3
0.11.0
base(350M)

Extraction Technology
I, T, M
I, T, TOC
I, T, TB
I, T, TB
T
T, TB
TB
TB
T

RB
RB
RB(MuPDF), OCR
RB(pdfminer)
RB
RB, OCR
RB
RB
Transformer
Transformer

Output
TXT
TXT, HTML, hORC, JPG
TXT, HTML, SVG, JSON
TXT, HTML, hORC, JPG
TXT
TXT
DataFrame, CSV, JSON
DataFrame, CSV, JSON, HTML
Markdown
Image

Tools

pdfminer

pdfplumber

PyMuPDF

pypdf

pypdfium

Unstructured

1.0

0.8

0.6

e
r
o
c
S
1
F

0.4

0.2

0.0

Financial

Tender

Law

Scientific

Manual

Patent

Categories

Fig. 6 F1 score of 6 PDF parsers across all document
categories for text extraction.

Tools

pdfminer

pdfplumber

PyMuPDF

pypdf

pypdfium

Unstructured

1.0

0.8

0.6

e
r
o
c
S
U
E
L
B

0.4

0.2

0.0

Financial

Tender

Law

Scientific Manual

Patent

Categories

4.2 For Table Extraction:

-

along with

tools
and Tabula

four rule-based PDF table
The evaluation of
pdfplumber,
- Camelot,
extraction
PyMuPDF,
a
transformer-based model TATR for table detec-
tion shows performance patterns across various
document categories(Table 5). While rule-based
tools like Camelot excel
in speciﬁc document
types, the transformer-based model demonstrates
superior versatility and consistency across all
categories. In terms of recall, the rule-based
tools performed poorly in all categories other
than Manual and Tender, as shown in Fig. 11.
Camelot achieved the highest score in the Tender
category (0.72). Tabula outperformed others in
the Manual, Scientiﬁc, and Patent categories.
PyMuPDF showed the most consistent recall
across categories among rule-based tools. The
Table Transformer, however, demonstrated high
recall scores across Scientiﬁc, Financial, and Ten-
der categories with Scientiﬁc documents achieving
the highest recall (>0.9) (Fig. 9, right panel).
However, In the Manual and Tender categories,
its performance is not better than PyMuPDF and
Camleot respectively(Table 5).

Fig. 7 BLEU-4 score of 6 PDF parsers across all docu-
ment categories for text extraction.

5 Discussion

1.0

0.8

0.6

s
e
r
o
c
S

0.4

0.2

0.0

Metrics

F1

BLEU

For text extraction, all rule-based parsers under-
performed in the Scientiﬁc and Patent categories.
Scientiﬁc documents are challenging to parse due
to the Mathematical expressions in them. All
of the rule-based parsers analyzed here extract
the mathematical equation in symbolic form. We

10

Nougat

Pdfminer Pdfplumber PyMuPDF

PyPDF

Pypdfium Unstructured

Parsers

Fig. 8 Comparison of rule-based parsers and Nougat
for text extraction in Scientiﬁc documents using F1 and
BLEU.

Precision

Recall

IOU threshold

0.6

0.7

1.0

0.8

0.6

s
e
r
o
c
S

0.4

0.2

0.0

Financial

Tender

Law

Scientific

Manual

Patent

Financial

Tender

Law

Scientific

Manual

Patent

Categories

Categories

Fig. 9 Precision and Recall of Table Transformer(TATR) across all document categories for Table detection.

1.0

1.0

Tools

Tools

Camelot

Camelot

0.8

0.8

pdfplumber

pdfplumber

PyMuPDF

PyMuPDF

Tabula

Tabula

0.6

0.6

l
l

a
c
e
R

n
o
i
s
i
c
e
r
P

0.4

0.4

0.2

0.2

0.0

0.0

Financial

Tender

Law

Scientific Manual

Patent

Financial

Tender

Law

Scientific Manual

Patent

Categories

Categories

Fig. 10 Precision of rule-based parsers across all docu-
ment categories for Table detection.

Fig. 11 Recall of rule-based parsers across all document
categories for Table detection.

found that it is insuﬃcient to express the complex
formulas involving vectors, matrices, etc. Also, the
parsers sometimes extract the content of graphs
and it gets mixed in paragraphs which further
worsens the quality of extraction. In our opin-
ion, the better way would be to use parsers that
can extract the texts from scientiﬁc documents
as Latex, Markdown, or MathML formats. As we
show with an example of Nougat, these approaches
are much better for scientiﬁc documents than
the conventional rule-based approaches. In the
DocLayNet dataset, most patents are documents
ﬁlled with images of designs or diagrams of chem-
ical compounds, etc. Parsing such documents is
beyond the scope of rule-based parsers. Hence
OCR based approach would be more suitable for
such documents.

Table detection is a challenging part for all of
the parsers. Rule-based parsers excel in detecting
the table if i) there are clear boundaries in tables
and ii) Spaces between columns’ text are ﬁxed.
However, most of the parsers in this category were
not able to parse the PDF at all. It can be seen
in low recall/high false positive scores. However,
the diversity in table structures across document
categories poses a considerable obstacle for rule-
based parsers. We found that all of these parsers
mainly struggle to detect the tables if i) Tables are
nested ii) There is no table boundary iii) the Table
is in the form of the table of contents iv) Multi-
ple tables on a single page v) Tables using color
diﬀerentiation instead of lines vi) Table columns
are separated by “..” or “ - -”. We found that

11

Table 4 A Comprehensive comparison of various PDF parsing libraries across diﬀerent document categories (Financial,
Law and Regulations, Manual, Patent, Scientiﬁc, and Government tenders). Performance is evaluated using: F1 score,
Precision, Recall, BLEU score, and Local Alignment. Higher values (indicated by ↑) are better for all metrics. Bold values
represent the best performance for each metric within each category. The evaluation used 800 balanced documents per
category, ensuring a fair comparison across diﬀerent document types.

Category Parser

Financial

Law

Manual

Patent

Scientiﬁc

Tender

pdfminer.six
pdfplumber
PyMuPDF
pypdf
pypdﬁum
Unstructured
pdfminer.six
pdfplumber
PyMuPDF
pypdf
pypdﬁum
Unstructured
pdfminer.six
pdfplumber
PyMuPDF
pypdf
pypdﬁum
Unstructured
pdfminer.six
pdfplumber
PyMuPDF
pypdf
pypdﬁum
Unstructured
pdfminer.six
pdfplumber
PyMuPDF
pypdf
pypdﬁum
Unstructured
pdfminer.six
pdfplumber
PyMuPDF
pypdf
pypdﬁum
Unstructured

F1 (↑) Precision (↑) Recall (↑) BLEU (↑) Local Alignment (↑)
0.9979
0.9568
0.9825
0.9542
0.9885
0.9767
0.9814
0.9791
0.9831
0.9698
0.9839
0.9807
0.9857
0.8817
0.9860
0.9601
0.9868
0.9843
0.8703
0.9469
0.9732
0.8548
0.9692
0.8704
0.8510
0.7644
0.8395
0.7641
0.8526
0.8514
0.9908
0.9834
0.9929
0.9691
0.9888
0.9899

0.9649
0.9785
0.9760
0.9612
0.9909
0.9649
0.9796
0.9815
0.9857
0.9746
0.9912
0.9798
0.9882
0.9672
0.9886
0.9765
0.9908
0.9893
0.9672
0.9538
0.9726
0.9291
0.9709
0.9672
0.8918
0.8584
0.8970
0.8810
0.9046
0.8941
0.9915
0.9868
0.9955
0.9565
0.9946
0.9915

0.6827
0.7029
0.9178
0.8978
0.9285
0.8371
0.7996
0.6506
0.9354
0.9358
0.9228
0.8359
0.8617
0.8432
0.9317
0.9343
0.9311
0.8835
0.6141
0.5459
0.8507
0.7842
0.8108
0.5873
0.7222
0.6446
0.8088
0.7968
0.8004
0.7407
0.8333
0.8513
0.9433
0.9404
0.9315
0.8580

0.8191
0.8159
0.9348
0.8321
0.9457
0.9371
0.8748
0.8236
0.9232
0.8732
0.9183
0.8751
0.8950
0.7386
0.9213
0.8645
0.9290
0.8913
0.5301
0.6070
0.8042
0.6117
0.8020
0.4939
0.6577
0.5719
0.6962
0.5832
0.7089
0.6625
0.8971
0.8932
0.9521
0.8544
0.9385
0.8890

0.9912
0.9361
0.9892
0.9474
0.9860
0.9887
0.9832
0.9768
0.9806
0.9650
0.9768
0.9816
0.9832
0.8100
0.9835
0.9442
0.9829
0.9794
0.7910
0.9401
0.9737
0.7916
0.9676
0.7911
0.8137
0.6890
0.7888
0.6746
0.8063
0.8127
0.9901
0.9801
0.9904
0.9821
0.9831
0.9884

the learning-based approach would be more suit-
able for handling complex tables. As can be seen
in Table 5 - TATR although trained for ﬁnan-
cial and scientiﬁc documents also excels in other
categories.

6 Conclusion and Future work

While our study provides valuable insights into
the performance of various PDF parsing tools
across diﬀerent document categories it has a few

limitations - The sample size for comparison of
Nougat is relatively small due to the nature of the
ground truth of the DocLayNet dataset(Ground
truth is not in LaTex format). One major chal-
lenge was dealing with scientiﬁc documents, which
often contain inline equations which are Mathe-
matical expressions embedded within the text and
crucial for the document’s integrity. However, the
dataset we used didn’t support extracting inline
equations, making accurate text comparison diﬃ-
cult. Also, comparison to learning-based methods

12

Table 5 A Comprehensive comparison of various PDF parsers for table detection across diﬀerent document categories.
For Camelot, pdfplumber, PyMuPDF, Tabula, the Jaccard threshold is 0.75. Intersection over Union (IoU) threshold for
TATR @ 60 and TATR @ 70 is 0.60 and 0.70 respectively. The best scores for each category are highlighted in bold.
Higher values (indicated by ↑) are better for all metrics. The evaluation used 400 balanced documents per category,
ensuring a fair comparison across diﬀerent document types.

Category Parser

Financial

Law

Manual

Patent

Scientiﬁc

Tender

Camelot
pdfplumber
PyMuPDF
Tabula
TATR @ 60
TATR @ 70
Camelot
pdfplumber
PyMuPDF
Tabula
TATR @ 60
TATR @ 70
Camelot
pdfplumber
PyMuPDF
Tabula
TATR @ 60
TATR @ 70
Camelot
pdfplumber
PyMuPDF
Tabula
TATR @ 60
TATR @ 70
Camelot
pdfplumber
PyMuPDF
Tabula
TATR @ 60
TATR @ 70
Camelot
pdfplumber
PyMuPDF
Tabula
TATR @ 60
TATR @ 70

Metrics
F1 (↑) Precision (↑) Recall (↑)
0.1012
0.0623
0.1794
0.2432
0.7857
0.7422
0.3861
0.3100
0.3446
0.1956
0.4890
0.4339
0.5975
0.6895
0.7463
0.4837
0.6162
0.5072
0.0181
0.0182
0.0184
0.0894
0.5285
0.4480
0.3392
0.0623
0.1794
0.2432
0.9134
0.8944
0.8279
0.5580
0.6808
0.4619
0.7496
0.6961

0.0555
0.6530
0.1729
0.2186
0.7357
0.6949
0.2466
0.2158
0.2277
0.1681
0.3808
0.3379
0.4338
0.5535
0.6028
0.3859
0.5157
0.4245
0.0094
0.0094
0.0094
0.2186
0.4659
0.3949
0.2500
0.0351
0.0890
0.2974
0.9038
0.8850
0.7224
0.6366
0.6388
0.5042
0.6939
0.6351

0.5763
0.0596
0.1863
0.2740
0.8430
0.7963
0.8869
0.5502
0.7074
0.2339
0.6831
0.6062
0.9595
0.9140
0.9794
0.6478
0.7653
0.6300
0.2692
0.3333
0.5000
0.2740
0.6105
0.5175
0.5274
0.0596
0.1863
0.2740
0.9233
0.9041
0.9696
0.4967
0.7353
0.4262
0.8293
0.7700

was limited to a single tool each for scientiﬁc text
extraction (Nougat) and table detection (TATR).
In Future studies, it would be valuable to inves-
tigate how diﬀerent types of learning methods
perform when trained on samples from these 6 cat-
egories. In particular, We plan to test TATR and
other such models on a wider range of document

types,
including Law and Regulation, Manual,
Government Tenders, and Patents categories. This
will help us understand how well it handles dif-
ferent kinds of tables, like nested or multimodal
ones, tables of contents, etc. During our experi-
ments, we observed that Nougat sometimes hal-
lucinates when parsing Scientiﬁc documents. To

13

address this, we would like to explore combining
rule-based parsers with learning-based models like
Nougat. This hybrid approach might help reduce
errors and lead to more accurate parsing.

In our study, we analyzed and compared the
performance of rule-based parsers in extracting
text and detecting tables across various docu-
ment types. We used the DocLayNet dataset
and compared these tools using multiple met-
rics. Our ﬁndings show that the performance of
these tools is strongly related to the document
type or the document structure, with scientiﬁc
documents presenting the most signiﬁcant chal-
lenges. Based on our ﬁndings, we suggest that
learning-based approaches could be more suitable
for handling scientiﬁc documents. We also inves-
tigated the table detection capabilities of these
parsers and found that their poor text extraction
performance was largely attributable to inade-
quate table detection. Based on our ﬁndings, we
suggest that techniques like TATR could prove
more eﬀective for table detection tasks.
Additionally, we examined and discussed the
underlying factors contributing to the parsers’
subpar performance in Scientiﬁc categories and
table detection. This comprehensive analysis pro-
vides valuable insights into the strengths and limi-
tations of current rule-based parsing tools, paving
the way for future improvements in document
analysis and information extraction technologies.

References

[3] Lewis, P., Perez, E., Piktus, A., Petroni, F.,
Karpukhin, V., Goyal, N., K¨uttler, H., Lewis,
M., Yih, W.-t., Rockt¨aschel, T., Riedel, S.,
Kiela, D.: Retrieval-augmented generation for
knowledge-intensive NLP tasks. In: Proceed-
ings of the 34th International Conference
on Neural Information Processing Systems.
NIPS ’20, pp. 9459–9474. Curran Associates
Inc., Red Hook, NY, USA (2020)

[4] Lin, D.: Revolutionizing retrieval-augmented
generation with enhanced PDF structure
recognition. ArXiv (2024) arXiv:2401.12599

[5] Bast, H., Korzen, C.: A benchmark and
evaluation for text extraction from PDF.
2017 ACM/IEEE Joint Conference
In:
(JCDL), pp. 1–10.
on Digital Libraries
IEEE, Toronto, ON, Canada
(2017).
https://doi.org/10.1109/JCDL.2017.7991564

[6] Alamoudi, A., Alomari, A., Alwarthan, S.: A
rule-based information extraction approach
for extracting metadata from PDF books.
ICIC Express Letters, Part B: Applications
12(2), 121–132 (2021)

[7] Hetzner, E.: A simple method for cita-
extraction using hidden
tion metadata
the
In: Proceedings of
Markov models.
Joint Conference
8th ACM/IEEE-CS
pp.
on Digital Libraries.
280–284.
Computing
Association
Machinery, New York, NY, USA (2008).
https://doi.org/10.1145/1378889.1378937

JCDL ’08,
for

format—Part
Report

[1] ISO: Document management—portable
1: PDF 1.7.
document
ISO 32000–1:2008,
Technical
International Organization
Stan-
for
dardization, Geneva, Switzerland (2008).
http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/PDF32000
structured metadata
2008.pdf

[8] Tkaczyk, D., Szostek, P., Fedoryszak, M.,
et al.: CERMINE: automatic extraction
from scientiﬁc
of
literature.
(2015)
https://doi.org/10.1007/s10032-015-0249-8

IJDAR 18,

317–335

[2] Staar, P.W.J., Dolﬁ, M., Auer, C., Bekas, C.:
Corpus conversion service: A machine learn-
ing platform to ingest documents at scale.
In: Proceedings of the 24th ACM SIGKDD
International Conference
on Knowledge
Discovery & Data Mining. KDD ’18, pp.
774–782. ACM, New York, NY, USA (2018).
https://doi.org/10.1145/3219819.3219834
.
http://doi.acm.org/10.1145/3219819.3219834

14

for

scholarship

[9] Lopez, P.: GROBID: Combining automatic
bibliographic data recognition and term
extraction
publications.
In: Agosti, M., Borbinha, J., Kapidakis,
S., Papatheodorou, C., Tsakonas, G.
(eds.) Research and Advanced Technol-
ogy for Digital Libraries. ECDL 2009, vol.
5714. Springer, Berlin, Heidelberg (2009).
https://doi.org/10.1007/978-3-642-04346-8

62

[10] Shi, B., Bai, X., Yao, C.: An end-to-end train-
able neural network for image-based sequence
recognition and its application to scene text
recognition. IEEE transactions on pattern
analysis and machine intelligence 39(11),
2298–2304 (2016)

[11] Kim, G., Hong, T., Yim, M., Nam, J., Park,
J., Yim, J., et al.: OCR-free document under-
standing transformer. In: European Con-
ference on Computer Vision, pp. 498–517.
Springer, Cham (2022)

[12] Li, M., Lv, T., Chen, J., Cui, L., Lu, Y., Flo-
rencio, D., et al.: TrOCR: Transformer-based
optical character recognition with pre-trained
models. In: Proceedings of the AAAI Con-
ference on Artiﬁcial Intelligence, vol. 37, pp.
13094–13102 (2023)

[13] Pﬁtzmann, B., Auer, C., Dolﬁ, M., Nassar,
A.S., Staar, P.: DocLayNet: A large human-
annotated dataset for document-layout seg-
mentation.
the 28th
In: Proceedings of
ACM SIGKDD Conference on Knowledge
Discovery and Data Mining. KDD ’22,
pp. 3743–3751. Association for Computing
Machinery, New York, NY, USA (2022).
https://doi.org/10.1145/3534678.3539043

[14] Grother, P.J.: NIST special database 19.
handprinted forms and characters database.
Technical report, National Institute of Stan-
dards and Technology (1995)

[15] Phillips,

I.T., Chen, S., Haralick, R.M.:
Cd-rom document database standard. In:
Proceedings of 2nd International Confer-
ence on Document Analysis and Recognition
(ICDAR’93), pp. 478–483 (1993)

[16] Gemelli, A., Marinai, S., Pisaneschi, L., et
al.: Datasets and annotations for layout
analysis of scientiﬁc articles. IJDAR (2024)
https://doi.org/10.1007/s10032-024-00461-2

[17] Zhong, X., Tang, J., Yepes, A.J.: Pub-
LayNet: largest dataset ever for document

layout analysis. In: 2019 International Con-
ference on Document Analysis and Recogni-
tion (ICDAR), pp. 1015–1022 (2019)

[18] Li, M., Xu, Y., Cui, L., Huang, S., Wei, F., Li,
Z., Zhou, M.: DocBank: A benchmark dataset
for document layout analysis. In: Scott, D.,
Bel, N., Zong, C. (eds.) Proceedings of the
28th International Conference on Computa-
tional Linguistics, pp. 949–960. International
on Computational Linguis-
Committee
tics, Barcelona, Spain (Online)
(2020).
https://doi.org/10.18653/v1/2020.coling-main.82
.
main.82

https://aclanthology.org/2020.coling-

[19] Cheng, H., Zhang, P., Wu, S., Zhang, J., Zhu,
Q., Xie, Z., Li, J., Ding, K., Jin, L.: M6Doc:
A large-scale multi-format, multi-type, multi-
layout, multi-language, multi-annotation cat-
egory dataset for modern document layout
analysis. In: CVPR, pp. 15138–15147 (2023)

[20] Smock, B., Pesala, R., Abraham, R.:
PubTables-1M: Towards comprehensive table
extraction from unstructured documents. In:
Proceedings of the IEEE/CVF Conference on
Computer Vision and Pattern Recognition,
pp. 4634–4642 (2022)

[21] Gao, L., et al.: ICDAR 2019 competition on
table detection and recognition (cTDaR). In:
2019 International Conference on Document
Analysis and Recognition (ICDAR), Syd-
ney, NSW, Australia, pp. 1510–1515 (2019).
https://doi.org/10.1109/ICDAR.2019.00243

[22] Li, M., Cui, L., Huang, S., Wei, F., Zhou,
M., Li, Z.: TableBank: Table benchmark for
image-based table detection and recognition.
In: Calzolari, N., B´echet, F., Blache, P.,
Choukri, K., Cieri, C., Declerck, T., Goggi,
S., Isahara, H., Maegaard, B., Mariani, J.,
Mazo, H., Moreno, A., Odijk, J., Piperidis, S.
(eds.) Proceedings of the Twelfth Language
Resources and Evaluation Conference, pp.
1918–1925. European Language Resources
(2020).
Association, Marseille,
https://aclanthology.org/2020.lrec-1.236

France

[23] Grennan, M.,
A., Beel,

Schibel, M.,
J.: GIANT: The

Collins,
1-Billion

15

Synthetic

Bibliographic-
Annotated
Reference-String Dataset for Deep Citation
Parsing [Data]. Harvard Dataverse (2019).
https://doi.org/10.7910/DVN/LXQXAO

[24] Lo, K., Wang, L.L., Neumann, M., Kinney,
R., Weld, D.: S2ORC: The semantic scholar
open research corpus. In: Proceedings of the
58th Annual Meeting of the Association for
Computational Linguistics, pp. 4969–4983.
Association for Computational Linguistics,
Online (2020)

[25] Chi, Z., Huang, H., Xu, H., Yu, H., Yin,
W., Mao, X.: Complicated table structure
recognition. ArXiv (2019) arXiv:1908.04729

[26] Zheng, X., Burdick, D., Popa, L., Zhong,
X., Wang, N.: Global table extractor (gte):
A framework for joint table identiﬁcation
and cell structure recognition using visual
In: 2021 IEEE Winter Confer-
context.
ence on Applications of Computer Vision
(WACV), pp. 697–706.
IEEE Computer
Society, Los Alamitos, CA, USA (2021).
https://doi.org/10.1109/WACV48630.2021.00074

[27] Grijalva, F., Parra, C., Gallardo, M., San-
tos, E., Acu˜na, B., Rodr´ıguez, J.C., Larco,
J.: SciBank: A Large Dataset of Anno-
tated Scientiﬁc Paper Regions for Document
Layout Analysis.
IEEE Dataport (2022).
https://doi.org/10.1109/ACCESS.2021.3125913

[28] Lipinski, M., Yao, K., Breitinger, C., Beel,
J., Gipp, B.: Evaluation of header meta-
data extraction approaches and tools for
scientiﬁc PDF documents. In: Proceedings
of
the 13th ACM/IEEE-CS Joint Con-
ference on Digital Libraries. JCDL ’13,
pp. 385–386. Association for Computing
Machinery, New York, NY, USA (2013).
https://doi.org/10.1145/2467696.2467753

[29] Meuschke, N., Jagdale, A., Spinde, T.,
Mitrovi´c, J., Gipp, B.: A benchmark of
PDF information extraction tools using
a multi-task and multi-domain evalua-
tion framework for academic documents.
In: Sserwanga, I., et al.(eds.) Information

16

for a Better World: Normality, Virtual-
ity, Physicality,
iConference
2023, vol. 13972. Springer, Cham (2023).
https://doi.org/10.1007/978-3-031-28032-0
31

Inclusivity.

[30] Lin, T.-Y., Maire, M., Belongie, S., Hays, J.,
Perona, P., Ramanan, D., Doll´ar, P., Zitnick,
C.L.: Microsoft coco: Common objects in con-
text. In: Computer Vision–ECCV 2014: 13th
European Conference, Zurich, Switzerland,
September 6-12, 2014, Proceedings, Part V
13, pp. 740–755 (2014). Springer

[31] Tashima, K., Aman, H., Amasaki, S.,
Yokogawa, T., Kawahara, M.: Fault-prone
java method analysis
focusing on pair
local variables with confusing names.
of
In: 2018 44th Euromicro Conference on
Software Engineering and Advanced Appli-
cations
(2018).
pp.
https://doi.org/10.1109/SEAA.2018.00033

(SEAA),

154–158

a method for

[32] Papineni, K., Roukos, S., Ward, T., Zhu,
W.-J.: Bleu:
automatic
evaluation of machine translation. In: Pro-
ceedings of the 40th Annual Meeting on
Association for Computational Linguis-
tics. ACL ’02, pp. 311–318. Association for
Computational Linguistics, USA (2002).
.
https://doi.org/10.3115/1073083.1073135
https://doi.org/10.3115/1073083.1073135

[33] Cock, P.J.A., Antao, T., Chang, J.T.,
Chapman, B.A., Cox, C.J., Dalke, A.,
Friedberg,
I., Hamelryck, T., Kauﬀ, F.,
Wilczynski, B., Hoon, M.J.L.: Biopython:
freely available Python tools for computa-
tional molecular biology and bioinformatics.
Bioinformatics 25(11), 1422–1423 (2009)
https://doi.org/10.1093/bioinformatics/btp163
https://academic.oup.com/bioinformatics/article-pdf/25/11/1

[34] Smith, T.F., Waterman, M.S.: Identiﬁcation
of common molecular subsequences. Journal
of Molecular Biology 147(1), 195–197 (1981)
https://doi.org/10.1016/0022-2836(81)90087-5

[35] Blecher, L., Cucurull, G., Scialom, T., Sto-
jnic, R.: Nougat: Neural optical understand-
ing for academic documents. arXiv preprint
arXiv:2308.13418 (2023)

[36] Smock, B., Pesala, R., Abraham, R.:
PubTables-1M: Towards comprehensive table
extraction from unstructured documents. In:
Proceedings of the IEEE/CVF Conference on
Computer Vision and Pattern Recognition
(CVPR), pp. 4634–4642 (2022)

17



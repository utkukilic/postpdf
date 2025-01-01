**DEPARTMENT OF HEALTH &** **HUMAN SERVICES**
**OFFICE OF THE SECRETARY ACCESSIBILITY PROGRAM**

# Adobe PDF Accessibility Reference


➔
**Structure Section Headings**
**Headings offer structure and easy navigation to sections for**
users of assistive technology (AT). Be mindful to use headings
sequentially.

1. In the Tags pane locate the structure tag (P, Span, etc.)
holding the text that needs to structurally be a heading.
2. Activate the context menu (or right click) of the structure tag
and select Properties.
3. In the Object Properties dialog, on the
**Tag tab select a suitable Heading Level**
from the Type drop down.

➔
**Augment Graphics with Descriptions**
Visual elements are categorized as meaningful or decorative.
Meaningful images add value and convey information in addition
to the surrounding content. Meaningful graphics use the
**<Figure> structure tag and require concise textual descriptions.**
A meaningful image can be simple or complex. Determining
simple or complex depends on how much information from the
image needs to be conveyed. Complex images need additional
descriptions placed in surrounding text or in appendices.

1. Select Reading Order from the Accessibility pane.
2. In the document area locate an image that requires

alternate text.
3. Activate the context menu (or right click) on the image and
select Edit Alternate Text.
4. In the Alternate Text dialog, add or edit the description.

Then navigate to and activate OK.


➔
**Remove Repetitive or Decorative Content**
Artifacts are non-distinct header and footer content, decorative
images, drawing remnants, and sometimes blank characters that
do not impact the comprehension of content.

1. Locate and select the content tag to be an artifact, not the
structure tag (P, Figure, Span, etc.)
2. Activate the context menu (or right click)
of the tag and select Change Tag to
**Artifact.**
3. Navigate to and activate OK in the

**Create Artifact dialog.**

➔
**Inject Hyperlinks**
Link structure includes a Link tag with the content tag and a
**Link-OBJR tag nested beneath Link. New links can be created**
by navigating to the Edit PDF pane and selecting Link > **Add /**
**Edit Web or Document Link tool. Then in the document**
highlight the content to be linked and follow the Create Link
wizard. Sometimes content is clickable but missing the
necessary Link-OBJR tag. To add the required tag:

1. In the Tags pane, locate and select the content tag that is

intended to be a link.
2. Activate the context menu (or right click) of the tag and
select Find…
3. In the Find Element dialog, select Unmarked Links from

the Find drop down and activate the Find button.
4. With the content highlighted in the document, navigate to
and activate the Tag Element button followed by
activating the Close button.
5. Confirm a Link-OBJR tag appears next

to the content tag in the Tags pane.


-----

➔
**Configure Lists and Table of Contents**
Proper list structure conveys relationships and hierarchy.
Bulleted or numbered lists must contain L and LI tags. The use
of Lbl and LBody tags are optional. Begin each list with an L tag
and nest an LI tag for each item. Table of Contents structure
includes TOC, TOCI, Reference, and Link tags for linked TOCs.
The item content with page number and Link-OBJR are
placed as a child of the Link tag.

1. In the Tags pane, activate the context menu (or right
click) near a tag where the new list or TOC should be
placed and select New Tag.
2. In the New Tag dialog, from the Type drop down select

**List (L) or Table of Contents (TOC).**
3. Activate the OK button.
4. Activate the context menu (or right click) of the newly
created tag and select New Tag.
5. In the New Tag dialog, from the Type drop down select

**List Item (LI) or Table of Contents Item (TOCI).**
6. If necessary, move the new LI or TOCI tag beneath the L

or TOC (respectively) tag.
7. Repeat the steps to access the New Tag dialog and

select Reference then Link to complete a TOC structure.
Optional for lists: Add Label (Lbl) and List Item Body
(LBody) tags.
8. Move the structure tags and the content tags as

necessary to achieve the desired order of content.


**Adobe PDF Accessibility Reference**

➔
**Nest Sub-Items of Lists and Table of Contents**
The correct arrangement
of sub-items in the tag
structure provides users
with accurate
relationship information.
Sub-lists must begin with
a new L or TOC tag as a
sibling to the content tag
to which the sub-item(s)
relate. Use the steps in
the Configure Lists and
**Table of Contents**
section to create the
sub-list structure.

➔
**Illuminate with Color and Contrast**
Sensible color arrays promote allure yet accessible content.

1. Color cannot be the only means of visually conveying

information or prompting a response. Textured patterns (to
represent data sets) or textual representation (i.e. an
asterisk [*]) must be included to distinguish content.
2. Confirm enough contrast is provided between the

foreground and background colors. A minimum contrast
ratio of 4.5:1 is required. Activate the Edit PDF pane and
highlight text in the document area. Then use the Font
**Color picker under Format to modify the foreground color.**

➔
**Order Content Logically**
Content is presented by the order existing within the Tags pane.

1. Open the Tags pane and activate the context menu (or
right click) of any tag to ensure Highlight Content is
checked. Content of the selected tag will be highlighted in
the document area.
2. Use the arrow keys on the keyboard to navigate and
verify content is in the visually implied and a logical order.


-----

➔
**Manage Data Tables**

Table structure must include Table, TR, TH, and
**TD tags. TH denotes a row or column header. TD**
represents data cells. Use of table structure is
reserved for data tables, not for layout. Avoidance
of blank cells, especially table header cells, is
equally important for accessibility. Simple and
complex data tables elicit the effort their names
suggest. Complex data tables require more
attention to meet compliance.

➔
**Inspect a Simple Table**
A data table is labeled as simple when a data cell relates to only
one row and/or column header.

Header Cell 1 Header Cell 2

_Example Simple Data Table_

Data Cell 1 Data Cell 2

Simple data tables must provide Data Cell 3 Data Cell 4
the proper cell type and scope.

1. To use the Table Editor to identify cell type and scope,

activate Reading Order from the Accessibility pane.
2. Ensure the Touch Up Reading Order dialog is not

covering the table in the document area and activate the
context menu (or right click) over a table cell. Then select
**Table Editor.**
3. Confirm a red outline is around the cells. Then activate

the context menu (or right click) on a cell that is intended
to be a header cell to select Table Cell Properties…
4. In the Table Cell Properties dialog ensure under Type

the Header Cell radio button is selected and the
appropriate option is displayed in the Scope drop down.
5. Navigate to and activate OK.
6. Repeat steps 3-5 for all row and/or column header cells.


**Adobe PDF Accessibility Reference**

➔
**Remediate a Complex Table**
Data cells in a complex table can

Header Cell 1 Header Cell 2

be related to two or more row

Category Sub-Header Cell 1

and/or column headers.

Data Cell 1 Data Cell 2
Category Sub-Header Cell 2

_Example Complex Data Table:_

Data Cell 3 Data Cell 4

_Multiple Column Headers_

Complex tables require IDs on the headers. The data cells then
must list the associated headers.

1. Select Reading Order from the Accessibility pane.
2. Activate the context menu (or right click) over a table cell
in the document area and select Table Editor.
3. Activate the context menu (or right click) of an intended
header cell and select Table Cell Properties.
4. In the Table Cell Properties

dialog enter content in the ID
field. Then navigate to and
activate the OK button.
5. Repeat steps 3 & 4 for all table header cells.
6. For each individual data cell, select Table Cell Properties
from the context menu (or right click).
7. In the Table Cell Properties dialog activate the Add (+)

button for Associated Header Cell IDs.
8. Add the cell’s associated headers in order from bottom to
top of which the headers
should be encountered. The
bottom listed header will be
the first item read.
9. Navigate to and activate OK.

➔
**Enable Fillable Form Fields**

Form elements begin with a <Form> tag that contains
a Field Name – OBJR tag. The <Form> tag needs to
be a peer structurally to the associated content tag.

|Header Cell 1|Header Cell 2|
|---|---|
|Category Sub-Header Cell 1||
|Data Cell 1|Data Cell 2|
|Category Sub-Header Cell 2||
|Data Cell 3|Data Cell 4|

|Header Cell 1|Header Cell 2|
|---|---|
|Data Cell 1|Data Cell 2|
|Data Cell 3|Data Cell 4|


-----

➔
**Offer Descriptive Tooltips on Form Fields**
Tooltips indicate to users what information is expected in the
field. Tooltips need to comprise a meaningful description along
with any constraint, formatting or group information (e.g.,
“required”, “mm/dd/yyyy”, “Billing” versus “Shipping”).

1. Open the Prepare Forms pane. When Form field auto

**detection is ON form fields will automatically be added.**
Activate Start when ready.
2. In the document area activate the context menu (or right
click) of a form element (e.g., text field) and select
**Properties.**
3. In Properties on the General

tab enter a concise description
in the Tooltip field, including
considerations for constraints.
4. Optional: Additional choices from the General, Options,

**Format or Calculate tabs may be useful.**
5. Navigate to and activate Close.
6. Repeat steps 2-5 for each form element.

➔
**Assemble Radio Buttons into Groups**
Radio buttons must be grouped to associate the related choices.

1. Open the Prepare Forms pane.
2. In the document area activate the context menu (or right
click) of a radio button and select Properties.
3. In Properties on the General tab enter a concise

description in the Name and Tooltip fields that can relate
the choices (e.g., “Question 1” or “Gender”).
4. Navigate to and activate the Options tab.
5. In the Radio Button Choice field

enter the unique choice for the radio
button (e.g., “a)” or “Female”).
6. Navigate to and activate Close.
7. Repeat steps 2-6 for each radio button. Note: Each radio

button of a group must have the same Name.


**Adobe PDF Accessibility Reference**

➔
**Prepare the Form for Use**
Verification is necessary to ensure the form properly functions.

_Organize the Tab Order_

1. Within the Prepare Forms pane,

activate the Tab Order menu from the
**Fields area of the pane.**
2. Confirm Order Tabs by Structure and

**Show Tab Numbers are checked.**
3. Re-arrange the objects in the Fields
area as necessary to set the navigation order of the form.

_Populate Fields with Test Data_

1. From the Prepare Forms pane activate Preview.
2. Enter data in the fields, confirm any restrictions are

enforced, and activate Edit upon finishing.
3. Open the More menu and select Clear Form.

_Add Form Structure to the Tags Pane_

1. Open the Tags pane and activate the Options menu to

verify Tag Annotations is checked.
2. Review the tags to determine if <Form> and Field Name

**– OBJR tags are present for each field.**
3. If <Form> is missing activate the context menu (or right

click) of a tag and select New Tag. In the dialog select
**Form from the Type drop down and activate OK.**
4. If a Field Name – OBJR tag is missing activate the

context menu (or right click) of a tag and select Find…
a. From the Find drop down

choose Unmarked
**Annotations and activate Find.**
b. Once the content is highlighted
in the document, navigate to
and activate Tag Element followed by Close.
5. Repeat steps 3 or 4 as necessary to add all crucial tags.
6. Shift and place the tags in a structural and logical order.


-----

➔
**Label the Document**
Document titles inform users of a document’s purpose. The
document language allows for correct interpretation of content.

1. Navigate to File > Properties.
2. Locate the Title field on the Description

tab and enter a descriptive purpose for
the document.
3. Optional: Insert the name of an
organization or office in the Author field.
4. Navigate to and activate the Initial View tab.
5. Locate the Window Options > Show

drop down and select Document Title.
6. Navigate to and activate the Advanced tab.
7. Within Reading Options set the

primary language of the document
using the Language drop down.
8. Navigate to and activate OK.

➔
**Perform a High-Level Accessibility Check**
While a manual inspection is the only method to review the
content for 100% of potential issues, running the Full Check
accessibility checker can identify many potential issues.

1. Open the Accessibility pane and select Full Check.
2. Review the selected Accessibility Checker Options and
then activate Start Checking.
3. Consider the results in the

**Accessibility Report pane.**
4. Activate the context menu (or

right click) of an issue to
**Explain or Check Again among**
other options. Modifications will
likely need to occur in the Tags
pane. In a few instances the
checker assists by offering the
option to Fix the issue.


**Adobe PDF Accessibility Reference**

➔
**Take Additional Measures**

1. Adding bookmarks to lengthy documents can aid
navigation. Open the Bookmarks pane and confirm
bookmarks are present. Insert bookmarks by activating the
**Options menu and selecting New Bookmarks from**
**Structure… Typically heading structure (i.e., H1-H6) is**
used. Bookmarks must be organized and properly nested.
2. When watermarks cannot be avoided, confirm the
contents are repeated in the document body and sufficient
contrast exists against the document text.
3. A few steps are involved to prepare a scanned document
and convert it to screen-readable text.

a. Open Tools > Enhance Scans.
b. Locate the Enhance menu and activated Scanned
**Document. Ensure Recognize Text is checked and**
activate Enhance. This can be run multiple times to
improve the quality of the scanned content.
c. Locate the Recognize Text menu and activate In This
**Document. Activate Recognize Text. Upon**
completion of the recognition process, select
**Recognize Text > Correct Recognized Text. Use the**
provided toolbar to make corrections and activate
**Accept for each item.**

d. Open Tools and select Accessibility > Autotag
**Document. Once tags have been added to the Tags**
pane, review all content and tags to confirm
compliance.

_Content in this document is applicable to Adobe Acrobat 2015_
_through 2020. Newer versions may contain additional features or_
_shortcuts. Instructions were written for the broader audience._


-----


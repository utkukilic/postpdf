let text = "### 2.1 Causes"
// console.log(text.match(/^([^ ]* [^ ]*)/))
// console.log(
//   text.match(
//     /\s(\d+)\s|((?:\d+|\d+[a-zA-Z])(?:\.\d+|\.[a-zA-Z])*(?:\.\d+)?)|([A-Z]\d[A-Z])/
//   )[0]
// );
// let ts = "##III."
// console.log(
//   ts.match(
//     /\s(\d+)\s|((?:\d+|\d+[a-zA-Z])(?:\.\d+|\.[a-zA-Z])*(?:\.\d+)?)|([A-Z]\d[A-Z])/
//   )
// );
let tss = "## 1 Introduction"
let ts2 = "## 2.2 Analysis Of Model Behaviors";
console.log(tss.match(/^#+\s+(\S+)\s/)[1]);

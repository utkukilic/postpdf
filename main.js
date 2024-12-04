import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

const ApiKey = process.env.MISTRAL_API_KEY;

const numbers = [];
let mdPath;
for (let i = 1; i <= 100; i++) {
  numbers.push(i);
}
// all the non-capital characters in latin alphabet
const alphabet = [];
for (let i = 97; i <= 122; i++) {
  alphabet.push(String.fromCharCode(i));
}
// all the capital characters in the latin alphabet
const capitalAlphabet = [];
for (let i = 65; i <= 90; i++) {
  capitalAlphabet.push(String.fromCharCode(i));
}

function readTextFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    mdPath = filePath.split("/");
    mdPath = mdPath[mdPath.length - 1];
    let lines = data.split("\n");
    // const result = lines.map((line, index) => [index + 1, line]);
    return lines;
  } catch (err) {
    console.error(`An error occurred: ${err}`);
    return [];
  }
}
function headingsAndLevels(lines) {
  let headingsMatrix = [[], [], [], []]; //1st row line number,2nd row text,3rd row level(number of #),4th if heading
  for (let k = 0; k < lines.length; k++) {
    headingsMatrix[3].push(false);
  }
  let firstSpaceCharacterIndex, secondSpaceCharacterIndex;
  let headingLevel, existingPoundCount, diff, dotCount;
  for (let i = 0; i < lines.length; i++) {

    if (lines[i].startsWith("#")) {
      // console.log("I;", i);
      headingsMatrix[3][i] = true;
    }
    // } else {
    //   headingsMatrix[3].push(false);
    // }
    headingsMatrix[0].push(i);

    headingsMatrix[1].push(lines[i]);
    headingsMatrix[2].push(0);
  }

  for (let j = 0; j < lines.length; j++) {
    // console.log("J: ", j);
    if (headingsMatrix[3][j] === true) {
      firstSpaceCharacterIndex = lines[j].indexOf(" ");
      secondSpaceCharacterIndex = lines[j].indexOf(
        " ",
        firstSpaceCharacterIndex + 1
      );
    }
    if (firstSpaceCharacterIndex >= 0 && secondSpaceCharacterIndex >= 0) {
      let headingTitle = lines[j].substring(
        firstSpaceCharacterIndex + 1,
        secondSpaceCharacterIndex
      );
      //console.log(headingTitle,firstSpaceCharacterIndex,secondSpaceCharacterIndex,"HEY")
      dotCount = (headingTitle.match(/\./g) || []).length;
      headingsMatrix[2].push(dotCount);
    }
    headingLevel = dotCount + 1;
    existingPoundCount = 0;
    for (let c of headingsMatrix[1][j]) {
      if (c === "#") {
        existingPoundCount = existingPoundCount + 1;
      } else {
        break;
      }
      diff = headingLevel - existingPoundCount;
      if (diff > 0) {
        headingsMatrix[1][j] = "#".repeat(diff) + headingsMatrix[1][j];
      } else if (diff < 0) {
        headingsMatrix[1][j] = headingsMatrix[1][j].slice(-diff);
      }
    }
  }

  return headingsMatrix[1];
}
function checkMultipleHeadingsInARow(lines) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#")) {
      let heading = lines[i]; // for better reading
      let firstDotIndex = heading.indexOf(".");
      let secondDotIndex = heading.indexOf(".", firstDotIndex + 1);
      if (firstDotIndex >= 0 && secondDotIndex > 0) {
        let substring = heading.slice(firstDotIndex, secondDotIndex + 1);
        for (let k = 1; k < substring.length; k++) {
          if (substring[substring.length - k] !== " ") {
            continue;
          } else {
            let splIndex = substring.length - k + firstDotIndex;
            correctLinesAndRestart(splIndex, i); // also line number needed
            break;
          }
        }
      }
    }
  }
  return lines;
}

function correctLinesAndRestart(splIndex, lineIndex, lines) {
  let newHead = lines[lineInd].substring(splIndex);
  lines[lineIndex] = lines[lineInd].substring(0, splIndex);
  lines.splice(lineIndex + 1, 0, newHead);
}
// // start of mozilla js one
// function checkLine(array) {
//   return array.map((line) => {
//     if (/^#+[IiVvXx]*\.$/.test(line)) {
//       return `##${line}`; // line starts with any number of '#' then any number of these characters: 'I,i,V,v,X,x" and then a dot
//     } else if (/^[IiVvXx]*\.$/.test(line)) {
//       return 2; // if does not have a '#' at the start but starts with any number of these characters: 'I,i,V,v,X,x"  then a dot. for testings can be dleeted later
//     } else {
//       return 0; // it is not either
//     }
//   });
// }

function processLines(array) {
  // Step 1: Create the 2D array with '#' counts and "toUpd" markings.
  //toIpd ares that start with '1.' or "A." stzle
  const result = array.map((line) => {
    const hashCount = (line.match(/^#+/) || [""])[0].length;
    if (/^\d+\./.test(line) || /^[A-Za-z]+\./.test(line)) {
      return [line, "toUpd"];
    }
    return [line, hashCount];
  });

  // Step 2: Process each section between `##` lines and also the last segment after the last `##`.
  let lastDoubleHashIndex = -1; // init index for '##' start of a line aka a heading

  for (let index = 0; index <= result.length; index++) {
    if (index === result.length || result[index][1] === 2) {
      // Process the section from ldoubHasInd up to index
      let firstNumberDot = -1;
      let firstLetterDot = -1;

      for (let i = lastDoubleHashIndex + 1; i < index; i++) {
        if (result[i][1] === "toUpd") {
          if (/^\d+\./.test(result[i][0]) && firstNumberDot === -1) {
            firstNumberDot = i;
          } else if (
            /^[A-Za-z]+\./.test(result[i][0]) &&
            firstLetterDot === -1
          ) {
            firstLetterDot = i;
          }
        }
      }

      // Apply updates based on number-dot or letter-dot 
      for (let i = lastDoubleHashIndex + 1; i < index; i++) {
        if (result[i][1] === "toUpd") {
          if (firstNumberDot !== -1 && firstLetterDot !== -1) {
            if (
              firstNumberDot < firstLetterDot &&
              /^\d+\./.test(result[i][0])
            ) {
              result[i][0] = "###" + result[i][0];
            } else if (
              firstNumberDot < firstLetterDot &&
              /^[A-Za-z]+\./.test(result[i][0])
            ) {
              result[i][0] = "####" + result[i][0];
            } else if (
              firstLetterDot < firstNumberDot &&
              /^[A-Za-z]+\./.test(result[i][0])
            ) {
              result[i][0] = "###" + result[i][0];
            } else if (
              firstLetterDot < firstNumberDot &&
              /^\d+\./.test(result[i][0])
            ) {
              result[i][0] = "####" + result[i][0];
            }
          } else if (
            firstLetterDot !== -1 &&
            firstNumberDot === -1 &&
            /^\d+\./.test(result[i][0])
          ) {
            result[i][0] = "###" + result[i][0];
          } else if (
            firstLetterDot === -1 &&
            firstNumberDot !== -1 &&
            /^\d+\./.test(result[i][0])
          ) {
            result[i][0] = "###" + result[i][0];
          }
        }
      }

      // Update the index of the last `##` for the next section
      lastDoubleHashIndex = index < result.length ? index : -1;
    }
  }

  return result.map((row) => row[0]);
}
function listHeadingIndexes(lines) {
  let list = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("##")) {
      
       let matching = lines[i].match(/^#+\s+(\S+)\s/)[1]
      //  console.log(lines[i].match(/^#+\s+(\S+)\s/),i);
      if (matching !== null) {
        list.push([i, matching]);
      }
      // until the second space and then gets the parts with this confioguration:
      // either "2" or "2.1.1" or "2.B.1" etc like the enumariton of heading
    }
  }
  // console.log("LIST; ",list)
  return list;
}

// update in between lost headings
// input is a matrix or creates a matrix with headings and their index
// last step of headings!!
async function inBetweenHeadings(lines, headings2D) {
  for (let i = 0; i < headings2D[0].length; i++) {
    let heading = headings2D[i][1];
    let oneMoreNormal, oneMoreWithDot, twoMoreNormal, twoMoreWithDot;
    let startingIndex, endingIndex;
    // console.log("HEADING: ", heading)
    // console.log(headings2D[1])
    let lastChar = heading.charAt(heading.length - 1);
    // console.log(lastChar)
    let lastCharOneMore = lastChar.charCodeAt(0) + 1;
    let lastCharTwoMore = lastChar.charCodeAt(0) + 2;
    twoMoreNormal = heading.slice(0, -1) + lastCharTwoMore;
    twoMoreWithDot = heading.slice(0, -1) + "." + lastCharTwoMore;
    oneMoreNormal = heading.slice(0, -1) + lastCharOneMore;
    oneMoreWithDot = heading.slice(0, -1) + "." + lastCharOneMore;

    if (
      headings2D[1].includes(twoMoreNormal) &&
      !headings2D[1].includes(oneMoreNormal)
    ) {
      startingIndex = headings2D[i][0];
      let endingIndexFinder = headings2D[1].findIndex(
        (item) => item === twoMoreNormal
      );
      endingIndex = headings2D[0][endingIndexFinder];
      let toApi = lines.slice(startingIndex, endingIndex + 1);
      let missingHeading = oneMoreNormal;
      console.log("API THING1");
      return await api(
        lines,
        toApi,
        missingHeading,
        startingIndex,
        endingIndex + 1
      );
    } else if (
      headings2D[1].includes(twoMoreWithDot) &&
      !headings2D[1].includes(oneMoreWithDot)
    ) {
      startingIndex = headings2D[i][0];
      let endingIndexFinder = headings2D[1].findIndex(
        (item) => item === twoMoreWithDot
      );
      endingIndex = headings2D[0][endingIndexFinder];
      let toApi = lines.slice(startingIndex, endingIndex + 1);
      let missingHeading = oneMoreWithDot;
      console.log("API THING2");
      return await api(
        lines,
        toApi,
        missingHeading,
        startingIndex,
        endingIndex + 1
      );
    }
  }
  return lines;
}
//   while (shouldCheck) {
//     for (let i = 0; i < headings.length - 1; i++) {
//       // get all the headings,their index in the lines and their Number eg 4.2 or 1.b
//       // check for all if eg 4.2 exist check for 4.2+2 if that also exists and 4.2+1 search it in the text turn it into a heading. Check where it ends with gpt
//       // check the same for 3.b, 3.b+2 (3.d) then 3b+1(3c)
//       // if it is done update all the lines by moving them to plus +1 line and set should check True and run inBetweenHeadgings(headings..)
//       // before updating Correct the heading line
//     }
//   }
// }
function checkListings(lines) {}

// Example usage:
const lines = [
  "5.",
  "Some text",
  "10.",
  "A line",
  "## Heading 1",
  "I.",
  "Another line",
  "20.",
  "IX.",
  "1.2 StartHeading",
  "dsijandjksankjdsajkndnjkskjnsdaknnkjsa 1.2.1 Test Heading",
  "1.2.2 endingHeading",
  "## Heading 2 ## 2.Heading",
  "Text here.",
  "15.",
  "III.",
  "## Heading 3.2.4",
  "1. dskoajidaisjdsaji",
  "B.dasmdasmdmasi",
  "##Heading4",
];

// const processed = processLines(lines);
// console.log(processed);
function backToMD(lines) {
  // console.log(lines)
  return lines.map((element) => `${element}`).join("\n");
}

async function api(
  linesArray,
  textApi,
  missingHeading,
  startingIndex,
  endingIndex
) {
  const url = "https://api.mistral.ai/v1/completions";
  const apiKey = ApiKey;
  const requestBody = {
    model: "mistral-8b-latest",
    prompt: `${textApi} This is a markdown file that marks headings with multiple '#'. There is a heading that is not marked with '#' in this text. The first line is a heading, so is the last line. First Heading is on the first line and the last is on the last line. The missing one should have a similar format and the heading name after it. Correct the text with by moving this in between heading the a new line and marking it with proper number of '#' and rewrite the markdown. Missing headings should have the enumartion ${missingHeading} `,
    max_tokens: 10000,
  };
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`, 
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const reply = response.choices[0].message.content;
      return response.json(); 
    })
    .then((data) => {
      console.log("Response from Mistral API:", data);
      // log data, change the form later
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return (
    linesArray.slice(0, startingIndex) +
    reply +
    linesArray.slice(endingIndex + 1)
  );
}
async function handler() {
   let lines = readTextFile(process.argv[2]); // lines of pdf as array
  // let lines = [
  //   "# Knowledge Conflicts For Llms: A Survey",
  //   "## Abstract",
  //   "## 1 Introduction",
  //   "## 2 **Context-Memory Conflict**",
  //   "## 2.1 Causes",
  //   "I.",
  //   "Another line",
  //   "20.",
  //   "IX.",
  //   "##1.2 StartHeading",
  //   "dsijandjksankjdsajkndnjkskjnsdaknnkjsa 1.2.1 Test Heading",
  //   "##1.2.2 endingHeading",
  //   "## Heading 2 ## 2.Heading",
  //   "Text here.",
  //   "15.",
  //   "III.",
  //   "## Heading 3.2.4",
  //   "1. dskoajidaisjdsaji",
  //   "B.dasmdasmdmasi",
  //   "##Heading4",
  // ];
  //console.log(lines)
  const lines2 = checkMultipleHeadingsInARow(lines);
  // console.log(lines2)
  const newLines = processLines(lines2);
   console.log(newLines)
  const newLines2 = headingsAndLevels(newLines);
  // console.log(newLines2)
  let headings = listHeadingIndexes(newLines2); // returns [index,text]
  //  console.log("Headings, ", headings);

  const updatedLines = await inBetweenHeadings(newLines2, headings);
  // console.log(updatedLines)
  const md = backToMD(updatedLines);
  // console.log(md);
  //console.log(lines[48])
}
handler();
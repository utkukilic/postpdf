import fs from "fs";
import dotenv from "dotenv";
import path from "path"
dotenv.config();

const numbers = [];
let mdPath;
for (let i = 1; i <= 100; i++) {
  numbers.push(i);
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
    if (lines[i].startsWith("##")) {
      headingsMatrix[3][i] = true;
    }
    headingsMatrix[0].push(i);
    headingsMatrix[1].push(lines[i]);
    headingsMatrix[2].push(0);
  }

  for (let j = 0; j < lines.length; j++) {
    if (headingsMatrix[3][j] === true) {
      firstSpaceCharacterIndex = lines[j].indexOf(" ");
      secondSpaceCharacterIndex = lines[j].indexOf(
        " ",
        firstSpaceCharacterIndex + 1
      );
      if (firstSpaceCharacterIndex >= 0 && secondSpaceCharacterIndex >= 0) {
        let headingTitle = lines[j].substring(
          firstSpaceCharacterIndex + 1,
          secondSpaceCharacterIndex
        );
        dotCount = 0;

        if (headingTitle.length > 1 && headingTitle.includes(".") === false) {
          dotCount = -1;
        } else if (headingTitle.length === 1) {
          dotCount = 0;
        } else {
          for (let character of headingTitle) {
            if (character === ".") {
              dotCount = dotCount + 1;
            }
          }
        }
        headingsMatrix[2].push(dotCount);
      }
    }

    headingLevel = dotCount + 2;
    existingPoundCount = 0;
    for (let c of headingsMatrix[1][j]) {
      if (c === "#") {
        // console.log("C: ",j)
        existingPoundCount = existingPoundCount + 1;
      } else {
        break;
      }
      0;
    }
    diff = headingLevel - existingPoundCount;
    //  console.log(j, diff, "J AND DIFF");
    if (diff > 0 && headingsMatrix[3][j]) {
      headingsMatrix[1][j] = "#".repeat(diff) + headingsMatrix[1][j];
    }
  }

  return headingsMatrix[1];
}
function checkMultipleHeadingsInARow(lines) {
  let lines2 = lines;
  for (let i = 0; i < lines.length; i++) {
    let match = "";
    if (lines[i].startsWith("#")) {
      let reg = /^(#+\s\d+(\.\d+)*\s).*?\2?\.\d+/;
      if (reg.test(lines[i])) {
        match = lines[i].match(reg)[0];
        let lastSpaceIndex = match.lastIndexOf(" ");
        let newHead = lines[i].substring(lastSpaceIndex);

        lines2[i] = lines[i].substring(0, lastSpaceIndex);
        lines2.splice(i + 1, 0, newHead);
        lines2[i + 1] = "##" + lines2[i + 1];
      }
    }
  }
  // console.log(lines2)
  return lines2;
}

function listHeadingIndexes(lines) {
  let list = [];
  let firstSpace, secondSpace;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("##")) {
      firstSpace = lines[i].indexOf(" ");
      secondSpace = lines[i].indexOf(" ", firstSpace + 1);
      //  console.log(firstSpaceCharacterIndex,secondSpaceCharacterIndex)
      if (firstSpace >= 0 && secondSpace >= 0) {
        let headin = lines[i].substring(firstSpace + 1, secondSpace);

        //  console.log(lines[i].match(/^#+\s+(\S+)\s/),i);
        if (headin !== null && headin.length > 0) {
          // console.log(firstSpaceCharacterIndex,secondSpaceCharacterIndex,headingTitle)
          list.push([i, headin]);
        }
        // until the second space and then gets the parts with this confioguration:
        // either "2" or "2.1.1" or "2.B.1" etc like the enumariton of heading
      }
    }
    // console.log("LIST; ",list)
  }
  return list;
}
// update in between lost headings
// input is a matrix or creates a matrix with headings and their index
// last step of headings!!
function inBetweenHeadings(lines, headings2D) {
  let lines2 = lines;
  for (let i = 0; i < headings2D.length; i++) {
    let missingHeadingText = "";
    let missingHeading = "";
    let heading = headings2D[i][1];
    let oneMoreNormal, oneMoreWithDot, twoMoreNormal, twoMoreWithDot;
    let startingIndex, endingIndex;
    let lastChar = heading.charAt(heading.length - 1);
    let lastCharOneMore = String.fromCharCode(lastChar.charCodeAt(0) + 1);
    let lastCharTwoMore = String.fromCharCode(lastChar.charCodeAt(0) + 2);
    twoMoreNormal = heading.slice(0, -1) + lastCharTwoMore;
    twoMoreWithDot = heading + ".2";
    oneMoreNormal = heading.slice(0, -1) + lastCharOneMore;
    oneMoreWithDot = heading + ".1";
    let listOfHeadings = headings2D.map((e) => e[1]);
    let listOfIndexes = headings2D.map((e) => e[0]);
    if (
      listOfHeadings.includes(twoMoreNormal) &&
      !listOfHeadings.includes(oneMoreNormal)
    ) {
      startingIndex = headings2D[i][0];
      let endingIndexFinder = listOfHeadings.findIndex(
        (item) => item === twoMoreNormal
      );
      endingIndex = listOfIndexes[endingIndexFinder];
      missingHeading = oneMoreNormal;

      for (let k = startingIndex; k <= endingIndex; k++) {
        if (lines[k].includes(missingHeading)) {
          let indo = lines[k].indexOf(missingHeading);
          let searchText = lines[k].slice(indo);
          let firstspaceIndex = searchText.indexOf(" ");
          let lastDotInd = searchText.lastIndexOf(".");
          missingHeadingText = searchText.slice(0, lastDotInd);
          for (let c = firstspaceIndex + 1; c < searchText.length - 1; c++) {
            if (searchText[c] === ".") {
              missingHeadingText = searchText.slice(0, c);
              lines2.splice(k, 0, "## " + missingHeadingText);
              lines2[k + 1] = lines2[k + 1].replace(missingHeadingText, "");
              break;
            } else if (
              searchText[c] === " " &&
              searchText[c + 1] <= "z" &&
              searchText[c + 1] >= "a"
            ) {
              missingHeadingText = searchText.slice(0, c);
              lines2.splice(k, 0, "## " + missingHeadingText);
              lines2[k + 1] = lines2[k + 1].replace(missingHeadingText, "");
              break;
            }
          }
          break;
        }
      }
    } else if (
      listOfHeadings.includes(twoMoreWithDot) &&
      !listOfHeadings.includes(oneMoreWithDot)
    ) {
      startingIndex = headings2D[i][0];
      let endingIndexFinder = listOfHeadings.findIndex(
        (item) => item === twoMoreWithDot
      );
      endingIndex = listOfIndexes[endingIndexFinder];
      let missingHeading = oneMoreWithDot;
      for (let j = startingIndex; j <= endingIndex; j++) {
        if (lines[j].includes(missingHeading)) {
          let indo = lines[j].indexOf(missingHeading);
          let searchText = lines[j].slice(indo);
          let firstspaceIndex = searchText.indexOf(" ");
          let lastDotInd = searchText.lastIndexOf(".");
          missingHeadingText = searchText.slice(0, lastDotInd);
          for (let ch = firstspaceIndex + 1; ch < searchText.length - 1; ch++) {
            if (searchText[ch] === ".") {
              missingHeadingText = searchText.slice(0, ch);
              lines2.splice(k - 1, 0, "##" + missingHeadingText);
              lines2[k + 1] = lines[k + 1].replace(missingHeadingText, "");
              break;
            } else if (
              searchText[ch] === " " &&
              searchText[ch + 1] < "z" &&
              searchText[ch + 1] > "a"
            ) {
              missingHeadingText = searchText.slice(0, ch);
              lines2.splice(j - 1, 0, "##" + missingHeadingText);
              lines2[j + 1] = lines[j + 1].replace(missingHeadingText, "");
              break;
            }
          }
          break;
        }
      }
    }
  }
  return lines2;
}

//check for listing element in another list element
function checkListings(lines) {
  let firstC = "";
  let index;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i][0] === "-" || lines[i][0] === "*") {
      firstC = lines[i][0];
    }
    for (let j = i; j < lines.length; j++) {
      if (!(lines[i][0] === "-") && !(lines[i][0] === "*")) {
        break;
      } else {
        let count = 0;
        for (let c of lines[j]) {
          if (c === firstC) {
            count = count + 1;
          }
        }
        if (count > 1) {
          let text = lines[j].slice(1);
          index = text.indexOf(firstC);
          if (text[index - 1] === " " && text[index + 1] === " ") {
            let listElement = lines[j].substring(index + 1);
            lines[j] = lines[j].slice(0, index + 1);
            lines.splice(j + 1, 0, listElement);
            break;
          }
        }
      }
    }
  }

  return lines;
}
// not showing good results
function missingHeadingEnumaeration(lines) {
  let headingAndIndex = [];
  let startingCharacterRegex = /^\d/;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#")) {
      headingAndIndex.push(lines[i].replaceAll("#", ""), i);
    }
  }
  // console.log(headingAndIndex);
  for (let j = 1; j < headingAndIndex.length; j++) {
    if (!startingCharacterRegex.test(headingAndIndex[0][j])) {
      break;
    }
  }
}
// if a line consists of only italic or bold text it is highly likely a mistake and should be a heading
function italicAndBolToHeading(lines) {
  for (let i = 0; i < lines.length; i++) {
    if (i === 101) {
    }
    let text = lines[i].replaceAll(" ", "");
    if (
      text.startsWith("_") &&
      text.endsWith("_") &&
      (text.match(/_/g) || []).length === 2
    ) {
      lines[i] = "## " + lines[i];
    } else if (
      text.startsWith("**") &&
      text.endsWith("**") &&
      (text.match(/\*/g) || []).length === 4
    ) {
      {
        lines[i] = "## " + lines[i];
      }
    }
  }
  return lines;
}

// const processed = processLines(lines);
// console.log(processed);
function backToMD(lines) {
  // console.log(lines)
  return lines.map((element) => `${element}`).join("\n");
}
function saveToFile(md, path) {
  fs.writeFileSync(path, md);
}

async function handler() {
  let lines = readTextFile(process.argv[2]); // lines of pdf as array
  //console.log(lines)
  const lines2 = italicAndBolToHeading(lines);
  const lines3 = checkMultipleHeadingsInARow(lines2);
  // console.log(lines2)
  // const newLines = processLines(lines2);
  //  console.log(newLines)
  const lines4 = headingsAndLevels(lines3);
  //  console.log(newLines2)
  let headings = listHeadingIndexes(lines4); // returns [index,text]

  const lines5 = inBetweenHeadings(lines4, headings);
  // console.log(updatedLines.slice(309,320))
  // console.log(updatedLines)

  const lines6 = checkListings(lines5);

  //missingHeadingEnumaeration(afterListing);
  // console.log(afterListing)
  const md = backToMD(lines6);
  //console.log(md);
  saveToFile(md, "method_results/pymupdf/block.md");
}
handler();

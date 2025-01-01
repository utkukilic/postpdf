import Replicate from "replicate";
const replicate = new Replicate();

const input = {
  pdf_link: "/Users/victor/Desktop/pdfpost/pdfs/mypdf1.pdf",
};

const output = await replicate.run(
  "awilliamson10/meta-nougat:872fa99400b0eeb8bfc82ef433aa378976b4311178ff64fed439470249902071",
  { input }
);
console.log(output);

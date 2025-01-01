import fs from "fs";
import path from "path";

/**
 * Function to get all filenames in a directory
 * @param {string} dirPath - The path to the directory
 * @returns {Promise<string[]>} - A promise that resolves to a list of filenames
 */
async function getFilenames(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(`Error reading directory: ${err.message}`);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * Function to create files in a directory
 * @param {string} dirPath - The path to the directory
 * @param {string[]} filenames - A list of filenames to create
 * @returns {Promise<void>}
 */
async function createFiles(dirPath, filenames) {
  return new Promise((resolve, reject) => {
    filenames.forEach((file, index) => {
      const filePath = path.join(dirPath, file);
      fs.writeFile(filePath, "", (err) => {
        // Creates an empty file
        if (err) {
          reject(`Error creating file "${file}": ${err.message}`);
          return;
        }
        if (index === filenames.length - 1) {
          resolve();
        }
      });
    });
  });
}

// Example usage
(async () => {
  const directory = "method_results/marker";
  const filenamesToCreate = ["file1.txt", "file2.txt", "file3.txt"];

  try {
      const files = await getFilenames("method_results/marker");
      console.log(`Files in directory:`, files);
    // Create files
    await createFiles("method_results/pymupdf", files);
    console.log(`Files created successfully in ${directory}`);

    // List filenames in the directory
  
  } catch (error) {
    console.error(error);
  }
})();

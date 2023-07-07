const fs = require('fs');
const path = require('path');
const ProgressBar = require('progress');

// Get the current working directory
let directoryPath = process.cwd();

// Read the files in the directory
const files = fs.readdirSync(directoryPath);

// Define the total number of iterations for the loop
const totalIterations = files.length;

// Create a new progress bar with the total iterations
const progressBar = new ProgressBar('[:bar] :percent', {
  total: totalIterations,
  width: 40,
});

// Output the total number of files
console.log(`Total files: ${totalIterations}`);

// Function to create a directory
let mkDir = folder => {
  try {
    fs.mkdirSync(folder);
  } catch (err) {
    if (!(err.code == 'EEXIST')) {
      console.log("Error: " + err);
    }
  }
};

// Function to move a file
let moveFile = (fromPath, moveToPath) => {
  fs.rename(fromPath, moveToPath, (err) => {
    if (err) {
      // Handle error if required
    } else {
      // Handle success if required
    }
  });
};

// Map of folders and their corresponding file extensions
const folders = new Map([
  ['Documents', ['.doc', '.docx', '.pdf', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx']],
  ['Video', ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm']],
  ['Music', ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.wma', '.m4a']],
  ['Code', ['.js', '.java', '.py', '.cpp', '.php', '.html', '.css', '.rb']],
  ['Archives', ['.zip', '.rar', '.tar', '.gz', '.7z']],
  ['Pictures',['.png', '.jpeg', '.jpg', '.gif', '.bmp', '.svg', '.webp', '.tiff']],
  ['Executables', ['.exe', '.app', '.bat', '.sh', '.msi', '.dmg']],
  ['Configuration Files', ['.ini']],
]);

// Main function to organize the files
function mainFunction() {
  files.forEach((file) => {

    progressBar.tick(); // Update the progress bar

    const extension = path.extname(file); // Get the file extension

    // Skip files with no extension or specific filenames
    if (!extension || file == 'fileOrg.js' || file == 'fileOrg.exe') {
      return;
    }

    let extensionExists = false;

    // Iterate over the folders and their associated file extensions
    for (const [folder, fileExtensions] of folders) {
      if (fileExtensions.includes(extension)) {
        extensionExists = true;

        // Create the folder if it doesn't exist
        mkDir(folder);

        const fromPath = path.join(directoryPath, file);
        const moveToPath = path.join(directoryPath, folder, file);

        // Move the file to the corresponding folder
        moveFile(fromPath, moveToPath);

        break; // Break out of the loop once the file is moved
      }
    }

    // If no matching extension is found, move the file to the "Other" folder
    if (!extensionExists) {
      mkDir("Other");

      const fromPath = path.join(directoryPath, file);
      const moveToPath = path.join(directoryPath, "Other", file);

      moveFile(fromPath, moveToPath);
    }
  });
}

// Call the main function to organize the files
mainFunction();

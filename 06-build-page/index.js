const fs = require('fs');
const path = require('path');

const stylesDirs = [
  path.join(__dirname, '/test-files/styles'),
  path.join(__dirname, '/styles'),
];
const distDir = path.join(__dirname, '/project-dist');
const destDir = path.join(distDir, 'style.css');
const templatePath = path.join(__dirname, 'template.html');
// const templatesDir = path.join(__dirname, '/components');
const sourceDir = path.join(__dirname);
// const originDir = path.join(__dirname, '/assets');

function buildPage(sourceDir, distDir, stylesDirs, templatePath) {
  // Step 1, 7: Use the script from task 04-copy-directory to create project-dist folder and move assets folder into it

  CopyDir(path.join(sourceDir, '/assets'), path.join(distDir, '/assets'));

  // Step 2: Read and save the template file
  let templateContent = fs.readFile(templatePath, (err, data) => {
    if (err) throw err;
    console.log(`datA: ${data}`);
  });
  console.log(templateContent);
  // Step 3: Find all tag names in the template file
  // eslint-disable-next-line no-useless-escape
  const tagRegex = /\{\{([^\}]+)\}\}/g;
  const tags = templateContent.match(tagRegex) || [];

  // Step 4: Replace template tags with content of component files
  for (const tag of tags) {
    const componentName = tag.slice(2, -2).trim(); // Remove '{{' and '}}' and trim whitespace
    const componentPath = path.join(
      sourceDir,
      'components',
      `${componentName}.html`,
    );

    try {
      const componentContent = fs.readFile(componentPath, 'utf-8');
      templateContent = templateContent.replace(tag, componentContent);
    } catch (error) {
      console.error(
        `Error reading component file ${componentName}: ${error.message}`,
      );
    }
  }

  // Step 5: Write modified template to index.html in project-dist folder
  const distIndexPath = path.join(distDir, 'index.html');
  fs.writeFile(distIndexPath, templateContent);

  // Step 6: Use the script from task 05-merge-styles to create style.css
  CompileFiles(stylesDirs, destDir, 'css');
}

function CopyDir(originDir, destinationDir) {
  try {
    fs.access(destinationDir);
  } catch (error) {
    fs.mkdir(destinationDir, { recursive: true }, (err) => {
      if (err) console.log(`Mkdir error: ${err}`);
    });
  }

  fs.readdir(originDir, (err, files) => {
    if (err) throw err;
    // console.log(files);
    files.forEach((file) => {
      fs.copyFile(
        path.join(originDir, '/', file),
        path.join(destinationDir, '/', file),
        (err) => {
          if (err) throw err;
        },
      );
      console.log('Copied:', file);
    });
  });
}

function CompileFiles(stylesDirs, destDir, ext) {
  const writer = fs.createWriteStream(destDir);
  stylesDirs.forEach((elem) => {
    fs.readdir(elem, (err, files) => {
      if (err) throw err;
      else {
        files.forEach((file) => {
          if (checkExt(file, ext)) {
            const fileContent = fs.createReadStream(
              path.join(elem, '/', file),
              'utf-8',
            );
            fileContent.on('data', (data) => writer.write(data));
          }
        });
      }
    });
  });

  function checkExt(file, ext) {
    if (file.indexOf(`.${ext}`) !== -1) return file;
    else return false;
  }

  console.log('Compiling style is successful!');
}

// Execute the function
buildPage(sourceDir, distDir, stylesDirs, templatePath);

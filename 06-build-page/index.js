const fs = require('fs');
const path = require('path');

const stylesDirs = [
  path.join(__dirname, '/test-files/styles'),
  path.join(__dirname, '/styles'),
];
const distDir = path.join(__dirname, '/project-dist');
const destDir = path.join(distDir, 'style.css');
const templatePath = path.join(__dirname, 'template.html'); //06-build-page\template.html
const sourceDir = path.join(__dirname);
// const originDir = path.join(__dirname, '/assets');

async function buildPage(sourceDir, distDir, stylesDirs, templatePath) {
  // Step 1, 7: Use the script from task 04-copy-directory to create project-dist folder and move assets folder into it

  await CopyDir(path.join(sourceDir, '/assets'), path.join(distDir, '/assets'));

  // Step 2: Read and save the template file

  // try {
  //   () => {
  //     let templateContent = fs.readFile(templatePath, 'utf-8', (err, data) => {
  //       if (err) throw err;
  //       console.log(data);
  //     });
  //   };
  // } catch (error) {
  //   console.error(`Error reading template file: ${error.message}`);
  //   // Handle the error accordingly, e.g., exit the script or return from the function
  // }
  // // Step 3: Find all tag names in the template file

  // // eslint-disable-next-line no-useless-escape
  // const tagRegex = /\{\{([^\}]+)\}\}/g;
  // const tags = templateContent.match(tagRegex) || [];

  // // Step 4: Replace template tags with content of component files
  // for (const tag of tags) {
  //   const componentName = tag.slice(2, -2).trim(); // Remove '{{' and '}}' and trim whitespace
  //   const componentPath = path.join(
  //     sourceDir,
  //     'components',
  //     `${componentName}.html`,
  //   );

  //   try {
  //     const componentContent = fs.readFile(componentPath, 'utf-8');
  //     templateContent = templateContent.replace(tag, componentContent);
  //   } catch (error) {
  //     console.error(
  //       `Error reading component file ${componentName}: ${error.message}`,
  //     );
  //   }
  // }

  // Step 5: Write modified template to index.html in project-dist folder

  try {
    // Step 1: Create project-dist folder
    const distDir = path.join(__dirname, 'project-dist');
    // await fs.mkdir(distDir, { recursive: true });
    await fs.mkdir(path.join(distDir, '/assets/fonts'), { recursive: true });

    // Step 2: Read and save the template file
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    // Step 3: Find all tag names in the template file
    // eslint-disable-next-line no-useless-escape
    const tagRegex = /\{\{([^\}]+)\}\}/g;
    const tags = templateContent.match(tagRegex) || [];

    // Step 4: Replace template tags with content of component files
    for (const tag of tags) {
      const componentName = tag.slice(2, -2).trim(); // Remove '{{' and '}}' and trim whitespace
      const componentPath = path.join(
        __dirname,
        '06-build-page',
        'components',
        `${componentName}.html`,
      );

      try {
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        templateContent = templateContent.replace(tag, componentContent);
      } catch (error) {
        console.error(
          `Error reading component file ${componentName}: ${error.message}`,
        );
      }
    }
    const distIndexPath = path.join(distDir, 'index.html');
    await fs.writeFile(distIndexPath, templateContent);

    // Step 6: Use the script from task 05-merge-styles to create style.css
    await CompileFiles(stylesDirs, destDir, 'css');
  } catch (error) {
    console.error(`Error building page: ${error.message}`);
  }
}

function CopyDir(originDir, destinationDir) {
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

// function getContent(path) {
//   let templateContent;
//   try {
//     () => {
//       templateContent = fs.readFile(path, 'utf-8', (err, data) => {
//         if (err) throw err;
//         console.log(data);
//       });
//     };
//   } catch (error) {
//     console.error(`Error reading template file: ${error.message}`);
//     // Handle the error accordingly, e.g., exit the script or return from the function
//   }
//   return templateContent;
// }
// Execute the function
buildPage(sourceDir, distDir, stylesDirs, templatePath);

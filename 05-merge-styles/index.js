const fs = require('fs');
const path = require('path');
const stylesDirs = [
  path.join(__dirname, '/styles'),
  path.join(__dirname, '/test-files/styles'),
];
const destDir = path.join(__dirname, '/project-dist/', 'bundle.css');

// function CompileStyles(stylesDirs, destDir) {
//   const writer = fs.createWriteStream(destDir);
//   stylesDirs.forEach((elem) => {
//     fs.readdir(elem, (err, files) => {
//       if (err) throw err;
//       else {
//         files.forEach((file) => {
//           if (checkExt(file)) {
//             const fileContent = fs.createReadStream(
//               path.join(elem, '/', file),
//               'utf-8',
//             );
//             fileContent.on('data', (data) => writer.write(data));
//           }
//         });
//       }
//     });
//   });

//   function checkExt(file) {
//     if (file.indexOf('.css') !== -1) return file;
//     else return false;
//   }

//   console.log('Compiling style is successful!');
// }

// CompileStyles(stylesDirs, destDir);

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

CompileFiles(stylesDirs, destDir, 'css');

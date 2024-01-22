const fs = require('fs'),
  path = require('path'),
  originDir = path.join(__dirname, '/files'),
  destinationDir = path.join(__dirname, 'files-copy');

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

CopyDir(originDir, destinationDir);

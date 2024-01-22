const fs = require('fs');
const { access } = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error while reading directory:', err);
    return;
  }

  files.forEach((file) => {
    let currentPath = path.join(folderPath, file);
    fs.stat(currentPath, (err, stats) => {
      if (err) {
        console.error('Error getting file stats:', err);
        return;
      }
      if (isDir(currentPath)) {
        fs.readdir(currentPath, (err, files) => {
          if (err) {
            console.error('Error while reading directory:', err);
            return;
          }

          files.forEach((file) => {
            let currentPath = path.join(folderPath, file);
            fs.stat(path.join(currentPath, file), (err, stats) => {
              if (err) {
                console.error('Error getting file stats:', err);
                return;
              } else
                console.log(
                  `${file}-${path.extname(file).slice(1)}-${stats.size}Bytes`,
                );
            });
          });
        });
      } else {
        console.log(
          `${file}-${path.extname(file).slice(1)}-${stats.size}Bytes`,
        );
      }
    });
  });
});

function isDir(path) {
  fs.stat(path, (err, stats) => {
    if (err) {
      console.error('Error getting file stats:', err);
      return;
    }
    if (stats.isDirectory()) {
      return true;
    }
    return false;
  });
}

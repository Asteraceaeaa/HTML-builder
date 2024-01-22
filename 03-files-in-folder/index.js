const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error while reading directory:', err);
    return;
  }

  files.forEach((file) => {
    fs.stat(folderPath, (err, stats) => {
      if (err) {
        console.error('Error getting file stats:', err);
        return;
      }

      const fileSizeInBytes = stats.size;
      const fileSizeInKB = fileSizeInBytes / 1024;

      console.log(
        `${file}-${path.extname(file).slice(1)}-${fileSizeInKB.toFixed()}kb`,
      );
    });
  });
});

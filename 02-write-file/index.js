const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writer = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function writeToFile(text) {
  writer.write(`${text}\n`, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });
}

function farewellAndExit() {
  console.log('Goodbye! Exiting the process...');
  process.exit();
}

console.log('Hello! Write here');

rl.prompt();

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    farewellAndExit();
  } else {
    writeToFile(input);
    rl.prompt();
  }
});

rl.on('close', () => {
  farewellAndExit();
});

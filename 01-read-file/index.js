const fs = require('fs');
const path = require('path');
const { stdout } = require('process'); //The process.stdout property returns a stream connected tostdout (fd 1). It is a net.Socket (which is a Duplex stream) unless fd 1 refers to a file, in which case it is a Writable stream.
const input = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
input.on('data', (data) => stdout.write(data));

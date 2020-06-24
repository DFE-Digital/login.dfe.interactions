const path = require('path');
const fs = require('fs');

let filename = `${process.argv[2]}/index.html`;

const indexFile = path.resolve(filename);
fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Something went wrong:', err);
    }

    let newFile = data.replace(/rel="stylesheet"/g, 'rel="stylesheet" data-preload="true"');

    fs.writeFile(filename, newFile, (err) => {
        if (err) {
            console.error(err);
        }
    });
});
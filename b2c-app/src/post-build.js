const path = require('path');
const fs = require('fs');
var glob = require("glob")

let filename = `${process.argv[2]}/index.html`;

const indexFile = path.resolve(filename);
fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Something went wrong:', err);
    }

    let newFile = data.replace(/rel="stylesheet"/g, 'rel="stylesheet" data-preload="true"');
    // newFile = newFile.replace(/\/__--b2cPath--__/g, process.env.B2C_ROOT_PATH);

    fs.writeFile(filename, newFile, (err) => {
        if (err) {
            console.error(err);
        }
    });
});

glob(`${process.argv[2]}/static/js/main.*.chunk.js`, null, function (er, files) {
    files.forEach((filename) => {
        const mainJsFile = path.resolve(filename);
        fs.readFile(mainJsFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Something went wrong:', err);
            }

            let newFile = data.replace(/__--changeEmailAPI--__/g, process.env.B2C_CHANGE_EMAIL_ENDPOINT);

            fs.writeFile(filename, newFile, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });
    })
})
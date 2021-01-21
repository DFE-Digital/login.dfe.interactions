'use strict';

import App from './App';

const path = require('path');
const fs = require('fs');
const cors = require('cors');
const url = require('url');

const express = require('express');
const router = express.Router({ mergeParams: true });

const React = require('react');
const ReactDOMServer = require('react-dom/server');
import { StaticRouter } from 'react-router-dom';

function getComponent(req) {

    let route = req.url;

    return new Promise((resolve, reject) => {
        let html;
        let context = {};
        try {
            html = ReactDOMServer.renderToString(
                <StaticRouter location={route} context={context}>
                    <App />
                </StaticRouter>
            );
            resolve(html);
        } catch (e) {
            reject(e)
        }
    });
}

function getHTML(app, req) {

    let reqURL = url.format({
        protocol: req.protocol,
        host: req.header('X-Forwarded-Host') || req.get('host')
    });

    return new Promise((resolve, reject) => {
        const indexFile = path.resolve(`${process.cwd()}/b2c-app/build/index.html`);
        fs.readFile(indexFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Something went wrong:', err);
                reject('Oops, better luck next time!');
            }

            //replace b2cPath placeholder, used to have absolute paths to static assets in index.html
            data = data.replace(/\/__--b2cPath--__/g, reqURL);

            //replace serverSideQueryString placeholder with the query we got in server side
            let queryJson = JSON.stringify(req.query);
            var escapedQueryJson = JSON.stringify(queryJson);
            data = data.replace(/"__--serverSideQueryString--__"/g, escapedQueryJson);
            //embed react app in the root element
            data = data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)

            resolve(data);
        });
    });
}

module.exports = (csrf) => {
    router.use('/assets', cors(), express.static(`${process.cwd()}/b2c-app/build`));
    router.use('/images', cors(), express.static(`${process.cwd()}/b2c-app/static-assets`));

    router.get('*', cors(), csrf, (req, res) => {
        getComponent(req)
            .then((comp) => {
                return getHTML(comp, req);
            })
            .then((html) => {
                res.status(200).send(html).end();
            })
            .catch((e) => {
                res.status(500).json({ msg: e.message, stack: e.stack }).end();
            });
    });

    console.log('ready');

    return router;
}
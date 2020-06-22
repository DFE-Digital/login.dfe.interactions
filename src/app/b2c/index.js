require('ignore-styles');

require('@babel/register')({
    ignore: [/(node_modules)/],
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: ['@babel/transform-runtime']
});

const router = require('../../../b2c-app/src/server');

module.exports = router;
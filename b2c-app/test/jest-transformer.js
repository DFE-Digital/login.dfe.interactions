const config = {
    babelrc: false,
    presets: [
        [
            "@babel/env",
            {
                modules: false
            }
        ],
        "@babel/react"
    ],
    plugins: [
        ["./b2c-app/node_modules/@babel/plugin-proposal-decorators", { legacy: true }],
        ["./b2c-app/node_modules/@babel/plugin-proposal-class-properties", { loose: true }],
        "./b2c-app/node_modules/babel-plugin-transform-es2015-modules-commonjs"
    ]
};
module.exports = require("babel-jest").createTransformer(config);
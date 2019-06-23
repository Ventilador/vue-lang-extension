//@ts-check

'use strict';

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
/**@type {import('webpack').Configuration[]}*/
const config = ['plugin', 'extension'].map(dest => {
    return {
        optimization: {
            minimizer: [new UglifyJsPlugin()],
        },
        target: 'node',
        entry: path.join(__dirname, `./${dest}/src/index.ts`),
        output: {
            // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
            path: path.join(__dirname, 'dist'),
            filename: dest + '.js',
            libraryTarget: 'commonjs2',
            devtoolModuleFilenameTemplate: '../[resource-path]'
        },
        context: path.join(__dirname, dest),
        externals: {
            vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
        },
        resolve: {
            // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
            extensions: ['.ts', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: path.join(__dirname, `${dest}/tsconfig.json`)
                            }
                        }
                    ]
                }
            ]
        }
    }
});
module.exports = config;
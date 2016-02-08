"use strict";
const webpackConfig = require('./webpack.config');
const serverLauncher = require('webpack-focus').serverLauncher;


/*****************************************
********* Webpack dev server *************
******************************************/

webpackConfig.externals = undefined; // Remove externals to make the app run in the dev server
serverLauncher(webpackConfig);
require('./api');

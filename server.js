"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const faker = require('faker');

const webpackConfig = require('./webpack.config');
const serverLauncher = require('webpack-focus').serverLauncher;

const NB_GENERATED_ENTITY = 10;
let entityJSON = [];//require('./api-mock/notifs.json');

function createEntity(){
  return        {
          uuid: faker.random.uuid(),
          name: faker.name.lastName()
        };

}
//let entityJSON = [];
for(let i = 0; i < NB_GENERATED_ENTITY; i++){
   entityJSON.push(createEntity());
}


console.log('LLLLLLLLLLL')
console.log('%j', entityJSON);
console.log('LLLLLLLLLLL')


const MOCKED_API_PORT = process.env.API_PORT || 9999;

/*****************************************
********* Webpack dev server *************
******************************************/

webpackConfig.externals = undefined; // Remove externals to make the app run in the dev server
serverLauncher(webpackConfig);

/*****************************************
************** Mocked API ****************
******************************************/

const app = express();
const API_ROOT = '/x/entity';



// Middlewares

app.use(function corsMiddleware(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,DELETE');
    res.header('Content-Type', 'application/json');
    next();
});
app.use(bodyParser.json());

app.get(API_ROOT  + '/entity', function getAllNotifications(req, res) {
    res.json(entityJSON);}
);

app.get(API_ROOT  + '/entity/create', function createNotifs(req, res) {
    entityJSON.push(createEntity())
    res.json(entityJSON);}
);
app.delete(API_ROOT  + '/entity', function deleteNotifs(req, res) {
    res.json(JSON.stringify(req.body));

});
app.delete(API_ROOT  + '/entity/:id', function deleteNotif(req, res) {
    res.json({id: req.params.id});
 // res.send('DELETE request to homepage'+req.params.id );
});




const server = app.listen(MOCKED_API_PORT, function serverCallback() {
    console.log('Mocked entity API listening at http://localhost:%s', MOCKED_API_PORT);
  }
);

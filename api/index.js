"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const faker = require('faker');
const isEmpty = require('lodash/isEmpty');

const NB_GENERATED_ENTITY = 10;

let childOneJSON = {
    firstName : 'FirstChildOne',
    lastName: 'LastChildOne'
}

let childTwoJSON = {
    firstName : 'FirstChildTwo',
    lastName: 'LastChildTwo'
}

let entityJSON = [{
  uuid: '1234',
  firstName: 'Don Diego',
  lastName: 'De Libercourt',
  childs : [childOneJSON, childTwoJSON]

}];//require('./api-mock/notifs.json');



let adressJSON = [{
    uuid: '1234',
    city: faker.address.city()
  }
];
function createEntity(){
  return        {
          uuid: faker.random.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          childs: [childOneJSON, childTwoJSON]
        };

}
//let entityJSON = [];
for(let i = 0; i < NB_GENERATED_ENTITY; i++){
   entityJSON.push(createEntity());
}


const MOCKED_API_PORT = process.env.API_PORT || 9999;
/*****************************************
************** Mocked API ****************
******************************************/

const API_ROOT = '/x';
const app = express();
//middleware
//app.use(express.static(staticFolder));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use((req, res, next) => {
    console.log(new Date() + ', ' + req.method + ', ' + req.url);
    if (!isEmpty(req.body)) {
        console.log(req.body);
    }
    next();
});
//CORS middleware
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS,DELETE');
    res.header('Content-Type', 'application/json');
    next();
}
app.use(allowCrossDomain);


app.get(API_ROOT  + '/entity', function getAllNotifications(req, res) {
    res.json(entityJSON);
  }
);

app.get(API_ROOT  + '/entity/:id', function getSingleEntity(req, res) {
    res.json(entityJSON.find(d => d.uuid === req.params.id));
  }
);

app.get(API_ROOT  + '/mixed/:id', function getSingleEntity(req, res) {
    res.json({
      information: entityJSON.find(d => d.uuid === req.params.id),
      address: adressJSON.find(d => d.uuid = req.params.id)
    });
  }
);

app.put(API_ROOT  + '/entity/:id', (req, res) => {
    var savedData = req.body;
    //console.log(Object.keys(req.body))
    //console.log('saved', JSON.stringify(req.body  ));
    savedData.isSaved = true;
    res.json(savedData);
  }
);

app.post(API_ROOT  + '/entity/:id', (req, res) => {
    var savedData = req.body;
    //console.log(req.params.id, Object.keys(req))
    //console.log('saved', JSON.stringify(req.body  ));
    savedData.isSaved = true;
    res.json(savedData);
  }
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

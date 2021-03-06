'use strict';

const debug = require('debug')('http:server');
const Car = require('../model/vehicles.js');
const storage = require('../lib/storage');

module.exports = function(router){
  router.get('/api/car', function(req, res){
    console.log(req.url.query.id, 'heres the id');
    debug('GET /api/car');
    if(req.url.query.id){
      storage.fetchCar('car', req.url.query.id)
      .then(data => {
        res.writeHead(200, {'Content-Type': 'application.json'});
        res.write(JSON.stringify(data));
        res.end();
      })
      .catch(err => {
        console.error(err);
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('bad request');
        res.end();
      });
      return;
    }
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.write('bad request');
    res.end();
  });

  router.post('/api/car', function(req, res){
    debug('POST /api/car');
    try {
      let car = new Car(req.body.name, req.body.type);
      storage.createCar('car', car);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(car));
      res.end();
    } catch(e) {
      console.error(e);
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write('bad request');
      res.end();
    }
  });

  router.put('/api/car', function(req, res){
    debug('PUT /api/car');

    if(req.body.id){
      storage.updateCar('car', req.body.id, req.body)
      .then((data) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(data));
        res.end();
      })
      .catch(err => {
        console.error(err);
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('not found');
        res.end();
      });
    } else {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write('bad request');
      res.end();
    }
  });

  router.delete('/api/car', function(req, res){
    debug('DELETE /api/car');
    if(req.url.query.id){
      storage.removeCar('car', req.url.query.id)
      .then(() => {
        res.writeHead(204, {'Content-Type': 'text/plain'});
        // res.write(JSON.stringify(car));
        res.end();
      })
      .catch(err => {
        console.error(err);
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('bad request');
        res.end();
      });
    }
  });
};

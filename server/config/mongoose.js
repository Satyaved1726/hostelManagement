const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');
const config = require('../config/config');

const mongoUri = config.mongo.uri;

// Set strictQuery explicitly to avoid deprecation warning from mongoose v7 migration
mongoose.set('strictQuery', false);

// Use boolean keepAlive and unified topology to avoid driver deprecation warnings
mongoose.connect(mongoUri, { keepAlive: true, useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once('open', () =>{
    console.log(`connected to the database: ${mongoUri}`);
});

db.on('error', ()=>{
    throw new Error(`Error connecting to the database: ${mongoUri}`);
});

if(config.mongo.isDebug) {
    mongoose.set('debug',(collectionName, method, query, doc) =>{
        debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
}

module.exports = db;

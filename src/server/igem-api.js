/**
 * Api Controller - distrubutes requests to files
 */

const express = require('express');
const api = express();
const morgan = require('morgan');
const parser = require('body-parser');

const mongo_client = require('./mongo_client');

const codes = require('./server_codes'); // imports codes

const teamHandler = require('./handlers/teamHandler');
const biobricksHandler = require('./handlers/biobrickHandler');

api.use(morgan('dev'));
api.use(parser.json());

api.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', '*');

    next();
})

api.use('/teams', teamHandler);
api.use('/biobricks', biobricksHandler);

api.use((request, response, next) => {
    const e = Error("Request location not found. See: help");
    e.status = codes.NOT_FOUND;
    next(e);
});

api.use((error, request, response, next) => {
    const status = error.status || codes.SERVER_ERROR;

    response.status(status).json({
        message : error.message,
        code : response.status
    });
});

module.exports = api;
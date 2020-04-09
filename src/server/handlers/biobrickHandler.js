/**
 * Handles requests for biobricks
 */

const express = require('express');
const router = express.Router();
const codes = require('../server_codes');
const elasticSearch = require('elasticsearch');

let client = new elasticSearch.Client({
    host : 'https://elasticsearch.kusik.net',
    log: 'trace'
});
let indexString = "biobricks";

router.post('/', (request, response, next) => {
    client.index({
        index : indexString,
        body : request.body
    }, (err, req, res) => {
        if(err) {
            response.status(codes.SERVER_ERROR).json({
                code : err.status,
                message : err.message
            });
        } else {
            response.status(codes.CREATED).json({
                message : "Object created",
                code : codes.CREATED,
                object : request.body
            });
        }
    });
});

module.exports = router;
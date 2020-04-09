/**
 * Handles requests for iGEM teams.
 */

const express = require('express');
const router = express.Router();
const codes = require('../server_codes');
const elasticSearch = require('elasticsearch');
const buildQuery = require('./query_builder');

let client = new elasticSearch.Client({
    host : 'https://elasticsearch.kusik.net',
    log: 'trace'
});
let indexString = "team";


router.get('/', (request, response, next) => {
    client.search({
        index: indexString,
        scroll: '20s',
        body: {
            query: {
                match_all:{}
            }
        }
    }, (err, res) => {
        if(err) {
            response.status(codes.NOT_FOUND).json({
                code : err.status,
                message : err.message,
            });
        } else {
            let allHits = [];
            res.hits.hits.forEach(function (hit) {
                allHits.push({
                    id: hit._id,
                    ...hit._source
                });
            });

            if (res.hits.total !== allHits.length) {
                client.scroll({
                    scrollId: res._scroll_id,
                    scroll: '10s'
                }, () => {console.log("There are more results")});
            } else {
                console.log('all done', allHits);
            }

            response.status(codes.OK).json(allHits);
        }
    });
});

router.get('/match', (request, response, next) => {
    client.search({
        index: indexString,
        scroll: '20s',
        body: {
            query: buildQuery(request.body)
        }
    }, (err, res) => {
        if(err) {
            response.status(codes.NOT_FOUND).json({
                code : err.status,
                message : err.message,
            });
        } else {
            let allHits = [];
            res.hits.hits.forEach(function (hit) {
                allHits.push({
                    id: hit._id,
                    ...hit._source
                });
            });

            if (res.hits.total !== allHits.length) {
                client.scroll({
                    scrollId: res._scroll_id,
                    scroll: '10s'
                }, () => {console.log("There ara more results")});
            } else {
                console.log('all done', allHits);
            }

            response.status(codes.OK).json(allHits);
        }
    });
});

router.post('/', (request, response, next) => {
    /*const team = {
        id : 6,
        name : request.body.name,
        year: request.body.year,
        description: request.body.description,
        wiki : request.body.wiki
    };*/

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
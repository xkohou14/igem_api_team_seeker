/**
 * Handles requests for iGEM teams.
 */

const express = require('express');
const router = express.Router();
const codes = require('../server_codes');
const buildQuery = require('./query_builder');
const shared = require('./shared');
const checkAuth = require('./auth_checker');

let client = shared.client;
let indexString = "team";
let structure = ["teamId",
    "name",
    "region",
    "country",
    "track",
    "section",
    "size",
    "status",
    "year",
    "kind",
    "teamCode",
    "division",
    "schoolAddress",
    "title",
    "abstract",
    "primaryPi",
    "secondaryPi",
    "instructors",
    "studentLeaders",
    "studentMembers",
    "advisors"];

/**
 * Checks if tea element with teamCode exists
 * @param teamCode of team
 * @param exists action to do if it's exists
 * @param nonExist action to do if it doesn't exist
 */
function teamExists (teamCode, exists, nonExist) {
    client.search({
        index: indexString,
        scroll: '1s',
        body: {
            query: {
                bool : {
                    must : {
                        match : {
                            teamCode : teamCode
                        }
                    }
                }
            }
        }
    }, (err, res) => {
        if(err) {
            nonExist();
        } else {
            let allHits = [];
            res.hits.hits.forEach((hit) => {
                if (hit._source.teamCode == teamCode) {
                    allHits.push({
                        id: hit._id,
                        ...hit._source
                    });
                }
            });

            if (allHits.length > 0)  {
                exists();
            } else {
                nonExist();
            }
        }
    });
}

function containsAttribute (object, attr) {
    return object.hasOwnProperty(attr);
}

function checkStructure(object) {
    for (var el of structure) {
        if (!containsAttribute(object, el)) {
            return false;
        }
    }
    return true;
}

router.get('/', (request, response, next) => {
    client.search({
        index: indexString,
        scroll: '20s',
        size : 600,
        body: {
            query: {
                match_all:{}
            }
        }
    }, function getAllToTheEnd(err, res) {
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

router.get('/structure', (request, response, next) => {
    response.status(codes.OK).json(structure);
});

router.post('/match', (request, response, next) => {
    client.search({
        index: indexString,
        size : 600,
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

router.post('/', checkAuth, (request, response, next) => {
    if(!checkStructure(request.body)) {
        return response.status(codes.SERVER_ERROR).json({
            code : codes.SERVER_ERROR,
            message : "Object does not contain required structure : " + structure
        });
    }

    let nonExist = () => {client.index({
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
    });};

    let exist = () => {
        response.status(codes.UNPROCESSABLE_ENTITY).json({
            code : codes.UNPROCESSABLE_ENTITY,
            message : "Team under code " + request.body.teamCode + " already exists"
        })
    };

    teamExists(request.body.teamCode, exist, nonExist);
});

router.delete('/:teamCode', checkAuth, (request, response, next) => {
    teamExists(request.params.teamCode,
        () => {
            client.search({
                index: indexString,
                scroll: '1s',
                body: {
                    query: buildQuery({
                        teamCode: [{contain: true, value: request.params.teamCode}]
                    })
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

                    if (allHits.length >= 1) {
                        client.delete({
                            index: indexString,
                            id : allHits[0].id
                        }, (err, req, res) => {
                            if(err) {
                                response.status(codes.SERVER_ERROR).json({
                                    code : err.status,
                                    message : err.message
                                });
                            } else {
                                response.status(codes.OK).json({
                                    message : "Object deleted",
                                    code : codes.OK
                                });
                            }
                        });
                    }
                }
            });
        },
        () => {
            response.status(codes.UNPROCESSABLE_ENTITY).json({
                code : codes.UNPROCESSABLE_ENTITY,
                message : "Team under " + request.params.teamCode + " doesn't exists"
            })
        });
});

module.exports = router;
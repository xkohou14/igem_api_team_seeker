/**
 * Handles requests for Users
 */

const express = require('express');
const router = express.Router();
const codes = require('../server_codes');
const elasticSearch = require('elasticsearch');
const buildQuery = require('./query_builder');
const bcrypt = require('bcrypt');

let client = new elasticSearch.Client({
    host : 'https://elasticsearch.kusik.net',
    log: 'trace'
});
let indexString = "users";

function encrypt (pwd) {
    return bcrypt.hashSync(pwd, bcrypt.genSaltSync(12));
}

function userExists (email, exists, nonExist) {
    client.search({
        index: indexString,
        scroll: '1s',
        body: {
            query: {
                bool : {
                    must : {
                        match : {
                            email : email
                        }
                    }
                }
            }
        }
    }, (err, res) => {
        if(err) {
            return false;
        } else {
            let allHits = [];
            res.hits.hits.forEach((hit) => {
                if (hit._source.email == email) {
                    allHits.push({
                        id: hit._id,
                        ...hit._source
                    });
                }
            });

            /*if (res.hits.total !== allHits.length) {
                client.scroll({
                    scrollId: res._scroll_id,
                    scroll: '10s'
                }, () => {console.log("There ara more results")});
            } else {
                console.log('all done', allHits);
            }*/

            if (allHits.length > 0)  {
                exists();
            } else {
                nonExist();
            }
        }
    });
}

router.post('/signup', (request, response, next) => {
    let hashPwd = encrypt(request.body.password);

    if (hashPwd == -1) {
        return response.status(codes.SERVER_ERROR).json({
            code : codes.SERVER_ERROR,
            message : "bcrypt error"
        })
    }

    let nonExist = () => {
        client.index({
            index : indexString,
            body : {
                email : request.body.email,
                password : hashPwd,
                trusted : false
            }
        }, (err, req, res) => {
            if(err) {
                response.status(codes.SERVER_ERROR).json({
                    code : err.status,
                    message : err.message
                });
            } else {
                response.status(codes.CREATED).json({
                    message : "User created",
                    code : codes.OK,
                    object : request.body
                });
            }
        });
    };

    let exist = () => {
        response.status(codes.SERVER_ERROR).json({
            code : codes.UNPROCESSABLE_ENTITY,
            message : "User under " + request.body.email + " already exists"
        })
    };

    userExists(request.body.email, exist, nonExist);
});

router.delete('/', (request, response, next) => {
    let hashPwd = encrypt(request.body.password);

    if (hashPwd == -1) {
        return response.status(codes.SERVER_ERROR).json({
            code : codes.SERVER_ERROR,
            message : "bcrypt error"
        })
    }

    userExists(request.body.email,
        () => {
            client.search({
                index: indexString,
                scroll: '1s',
                body: {
                    query: buildQuery({
                        email: [{contain: true, value: request.body.email}],
                        password: [{contain: true, value: hashPwd}]
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

                    /*if (res.hits.total !== allHits.length) {
                        client.scroll({
                            scrollId: res._scroll_id,
                            scroll: '1s'
                        }, () => {console.log("There are more results")});
                    } else {
                        console.log('all done', allHits);
                    }*/

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
                                response.status(codes.CREATED).json({
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
            response.status(codes.SERVER_ERROR).json({
                code : codes.UNPROCESSABLE_ENTITY,
                message : "User under " + request.body.email + " doesn't exists"
            })
        });
});

module.exports = router;
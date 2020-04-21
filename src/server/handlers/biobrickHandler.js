/**
 * Handles requests for biobricks
 */

const express = require('express');
const router = express.Router();
const codes = require('../server_codes');
const buildQuery = require('./query_builder');
const shared = require('./shared');
const checkAuth = require('./auth_checker');

let client = shared.client;
let indexString = "biobricks";
let structure = ["content", "title", "url"];

/**
 * Checks if biobricks element with title exists
 * @param title of biobricks
 * @param exists action to do if it's exists
 * @param nonExist action to do if it doesn't exist
 */
function biobricksExists (title, exists, nonExist) {
    client.search({
        index: indexString,
        scroll: '1s',
        body: {
            query: {
                bool : {
                    must : {
                        match : {
                            title : title
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
                if (hit._source.title == title) {
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

/**
 * Checks if object contains attribute
 * @param object to check
 * @param attr which should be contained in object
 * @returns {boolean}
 */
function containsAttribute (object, attr) {
    return object.hasOwnProperty(attr);
}

/**
 * Extract structure of objects in DB
 * @param action (properties) => {}, function to do with list of properties
 * @param errHandler (err) => {}, function to execute on error or if structure is not met
 */
function doWithStructure (action, errHandler) {
    client.indices.getMapping({
        index: indexString
    }, (err, res) => {
        if(err) {
            errHandler(err);
        } else {
            console.log("Mappings:\n",JSON.stringify(res, ' ', 4));
            let properties = [];
            let obj = res[indexString]["mappings"]["properties"];
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    properties.push(prop);
                }
            }
            console.log("Properties: " + properties);
            action(properties);
        }
    });
}

/**
 *
 * @param object to check
 * @param stopWith (err) => {}, function to execute on error or if structure is not met
 */
function checkStructure (object, stopWith) {
    doWithStructure(
        (properties) => {
            for (var el of properties) {
                if (!containsAttribute(object, el)) {
                    stopWith(new Error("Structure is not same"))
                }
            }
        },
        (err) => {
            stopWith(err);
        }
    )
}

router.get('/', (request, response, next) => {
    client.search({
        index: indexString,
        size : 600,
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


router.get('/structure', (request, response, next) => {
    doWithStructure(
        (properties) => {
            response.status(codes.OK).json(properties);
    },
    (err) => {
        response.status(codes.NOT_FOUND).json({
            code : err.status,
            message : err.message,
        });
    });
});

router.post('/', checkAuth, (request, response, next) => {
    if(!containsAttribute(request.body,"title")) {
        return response.status(codes.SERVER_ERROR).json({
            code : codes.SERVER_ERROR,
            message : "Object does not contain required property : title"
        });
    }

    checkStructure(request.body, (err) => {
        response.status(codes.SERVER_ERROR).json({
            code : codes.SERVER_ERROR,
            message : err.message
        });
    });

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

router.delete('/:title', checkAuth, (request, response, next) => {
    biobricksExists(request.params.title,
        () => {
            client.search({
                index: indexString,
                scroll: '1s',
                body: {
                    query: buildQuery({
                        title: [{contain: true, value: request.params.title}]
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
                message : "Biobricks under " + request.params.title + " doesn't exists"
            })
        });
});

module.exports = router;
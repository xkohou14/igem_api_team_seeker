/**
 * Handles requests for Users
 */

const express = require('express');
const router = express.Router();
const codes = require('../server_codes');
const buildQuery = require('./query_builder');
const bcrypt = require('bcrypt');
const shared = require('./shared');
const jwt = require('jsonwebtoken');
const checkAuth = require('./auth_checker');
const mailer = require('nodemailer');

let client = shared.client;
let indexString = "users";

function encrypt (pwd) {
    return bcrypt.hashSync(pwd, bcrypt.genSaltSync(12));
}

/**
 * Checks if biobricks element with email exists
 * @param email of email
 * @param exists action to do if it's exists
 * @param nonExist action to do if it doesn't exist
 */
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
            nonExist();
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

router.post('/signup', (request, response, next) => {
    if(!containsAttribute(request.body,"email")) {
        return response.status(codes.UNPROCESSABLE_ENTITY).json({
            code : codes.UNPROCESSABLE_ENTITY,
            message : "Object does not contain required property : email"
        });
    }
    if(!containsAttribute(request.body,"password")) {
        return response.status(codes.UNPROCESSABLE_ENTITY).json({
            code : codes.UNPROCESSABLE_ENTITY,
            message : "Object does not contain required property : password"
        });
    }

    let hashPwd = encrypt(request.body.password);

    if (hashPwd == -1) {
        return response.status(codes.SERVER_ERROR).json({
            code : codes.SERVER_ERROR,
            message : "bcrypt error"
        })
    }

    const randomstring = shared.randomstring.generate(16);

    let nonExist = () => {
        client.index({
            index : indexString + "-to-confirm",
            body : {
                email : request.body.email,
                password : hashPwd,
                trusted : true,
                link: randomstring
            }
        }, (err, req, res) => {
            if(err) {
                response.status(codes.SERVER_ERROR).json({
                    code : err.status,
                    message : err.message
                });
            } else {
                let mailOptions = {
                    from: shared.wap_mail,
                    to: request.body.email,
                    subject: '(iGEM) Team seeker account',
                    text: '<html><body style="text-align: center">Your account was successfully created. Go to <a href="' + shared.url + 'user/confirm/' + randomstring + '">this link</a> to confirm it.<br><br><br>Team seeker team.</body></html>'
                };
                shared.mail_transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        response.status(codes.SERVER_ERROR).json({
                            code : error.status,
                            message : error.message
                        });
                    } else {
                        response.status(codes.CREATED).json({
                            message : "User created - check your e-mail: " + request.body.email,
                            code : codes.OK,
                            object : request.body,
                            info: info
                        });
                    }
                });
            }
        });
    };

    let exist = () => {
        response.status(codes.UNPROCESSABLE_ENTITY).json({
            code : codes.UNPROCESSABLE_ENTITY,
            message : "User under " + request.body.email + " already exists"
        })
    };

    userExists(request.body.email, exist, nonExist);
});

router.get('/confirm/:id', (request, response, next) => {
    client.search({
        index: indexString + "-to-confirm",
        scroll: '1s',
        body: {
            query: buildQuery({
                link: [{contain: true, value: request.params.id}],
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
                //if(hit.link == request.params.id) {
                    allHits.push({
                        id: hit._id,
                        ...hit._source
                    });
                //}
            });

            if (allHits.length >= 1) {
                client.index({
                    index : indexString,
                    body : {
                        email : allHits[0].email,
                        password : allHits[0].password,
                        trusted : true
                    }
                }, (err, req) => {
                    if(err) {
                        return response.status(codes.SERVER_ERROR).json({
                            code : err.status,
                            message : err.message
                        });
                    } else {
                        client.delete({
                            index: indexString + "-to-confirm",
                            id: allHits[0].id
                        }, (err, res) => {
                            if(err) {
                                return response.status(codes.NOT_FOUND).json({
                                    code : err.status,
                                    message : err.message,
                                });
                            } else {
                                return response.status(codes.OK).json({
                                    message : "User activated",
                                    code : codes.OK,
                                    object : req.body
                                });
                            }
                        });
                    }
                });
            } else {
                return response.status(codes.NOT_FOUND).json({
                    code : codes.NOT_FOUND,
                    message : "User ("+ request.params.id +") for activation not found"
                });
            }
        }
    });
});

router.delete('/confirm', checkAuth, (request, response, next) => {
    client.indices.delete({
        index: indexString + "-to-confirm"
    }, (err, res) => {
        if(err) {
            response.status(codes.NOT_FOUND).json({
                code : err.status,
                message : err.message,
            });
        } else {
            response.status(codes.OK).json({
                message: "Activation request deleted",
                code: codes.OK
            });
        }
    });
});

router.post('/login', (request, response, next) => {
    if(!containsAttribute(request.body,"email")) {
        return response.status(codes.UNPROCESSABLE_ENTITY).json({
            code : codes.UNPROCESSABLE_ENTITY,
            message : "Object does not contain required property : email"
        });
    }
    if(!containsAttribute(request.body,"password")) {
        return response.status(codes.UNPROCESSABLE_ENTITY).json({
            code : codes.UNPROCESSABLE_ENTITY,
            message : "Object does not contain required property : password"
        });
    }

    let hashPwd = encrypt(request.body.password);

    if (hashPwd == -1) {
        return response.status(codes.AUTH_FAILED).json({
            code : codes.AUTH_FAILED,
            message : "Login failed (bcrypt error)"
        })
    }

    client.search({
        index : indexString,
        scroll: '1s',
        body: {
            query: {
                bool : {
                    must : [
                        {match : {
                            email : request.body.email
                        }},
                        {match : {
                            trusted : true
                        }}
                    ]
                }
            }
        }
    }, (err, res) => {
        if(err) {
            response.status(codes.SERVER_ERROR).json({
                code : err.status,
                message : err.message
            });
        } else {
            let allHits = [];
            res.hits.hits.forEach(function (hit) {
                if (
                    bcrypt.compareSync(request.body.password, hit._source.password) &&
                    request.body.email == hit._source.email
                ) {
                    allHits.push({
                        id: hit._id,
                        ...hit._source
                    });
                }
            });

            if (allHits.length >= 1) {
                const token = jwt.sign({
                    email: allHits[0].email,
                    id: allHits[0].id
                }, shared.JWT_KEY, {
                    expiresIn: "1h"
                });
                response.status(codes.OK).json({
                    message : "Auth successful",
                    code : codes.OK,
                    token : token
                });
            } else {
                response.status(codes.AUTH_FAILED).json({
                    code : codes.AUTH_FAILED,
                    message : "Login failed"
                })
            }
        }
    });
});

router.delete('/', checkAuth,(request, response, next) => {
    if(!containsAttribute(request.body,"email")) {
        return response.status(codes.UNPROCESSABLE_ENTITY).json({
            code : codes.UNPROCESSABLE_ENTITY,
            message : "Object does not contain required property : email"
        });
    }
    if(!containsAttribute(request.body,"password")) {
        return response.status(codes.UNPROCESSABLE_ENTITY).json({
            code : codes.UNPROCESSABLE_ENTITY,
            message : "Object does not contain required property : password"
        });
    }
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
                message : "User under " + request.body.email + " doesn't exists"
            })
        });
});

module.exports = router;
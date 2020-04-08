/**
 * Handles requests for iGEM teams.
 */

const express = require('express');
const router = express.Router();
const codes = require('../server_codes');

const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    year: Number,
    description: String,
    wiki: String
});

const Team  = mongoose.model('Team', schema);

router.get('/', (request, response, next) => {
    response.status(200).json({
        message : "You asked for team"
    });
});

router.post('/', (request, response, next) => {
    const team = new Team({
        _id : new mongoose.Types.ObjectId(),
        name : request.body.name,
        year: request.body.year,
        description: request.body.description,
        wiki : request.body.wiki
    });

    team.save();

    response.status(codes.CREATED).json({
        message : "Successfully created",
        code : codes.CREATED,
        object: team
    })
});

module.exports = router;
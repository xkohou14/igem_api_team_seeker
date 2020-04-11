/**
 * shared enviroments and so on
 */

const elasticSearch = require('elasticsearch');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

module.exports = {
    JWT_KEY : 'myPrivateKeyiGemSeeker',
    client : new elasticSearch.Client({
        host : 'https://elasticsearch.kusik.net',
        log: 'trace'
    }),
    mail_transporter : nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'info.wap.fit@gmail.com',
            pass: 'wap-sender'
        }
    }),
    wap_mail: 'info.wap.fit@gmail.com',
    url: "localhost:3001/",
    randomstring : randomstring
}
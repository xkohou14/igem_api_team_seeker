/**
 * shared enviroments and so on
 */

const elasticSearch = require('elasticsearch');

module.exports = {
    JWT_KEY : 'myPrivateKeyiGemSeeker',
    client : new elasticSearch.Client({
        host : 'https://elasticsearch.kusik.net',
        log: 'trace'
    })
}
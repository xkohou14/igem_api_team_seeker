/**
 * Api for iGEM search app
 */
const http = require('http');
const port = process.env.PORT || 3001;

const api = require('./igem-api');

const server = http.createServer(api);
server.listen(port);
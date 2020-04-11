const shared = require('./shared');
const codes = require('../server_codes');
const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    try {
        const decoded = jwt.verify(request.headers.authorization.split(" ")[1], shared.JWT_KEY);
        request.userData = decoded;
        next();
    } catch (e) {
        return response.status(codes.AUTH_FAILED).json({
            code: codes.AUTH_FAILED,
            message : "Auth failed - token is not valid"
        });
    }
};
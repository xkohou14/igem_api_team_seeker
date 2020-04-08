/**
 * Mongo client connection
 */

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://wap-api:wap-igem@wap-cluster-l2iqd.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose;
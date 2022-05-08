const mongoose = require('mongoose');

const otherDataSchema = new mongoose.Schema({
});

module.exports = mongoose.model('otherData', otherDataSchema);
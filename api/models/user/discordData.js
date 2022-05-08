const mongoose = require('mongoose');

const discordDataSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    discordUsername: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('discordData', discordDataSchema);
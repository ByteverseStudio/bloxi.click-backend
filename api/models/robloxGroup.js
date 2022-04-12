const mongoose = require('mongoose');

const robloxGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    robloxId: {
        type: Number,
        required: true,
        unique: true,
        match: /^[0-9]$/
    },
    role: {
        type: String,
        required: true,
        unique: false,
    },
});

module.exports = mongoose.model('roblox_group', robloxGroupSchema);
const mongoose = require('mongoose');

const robloxAccountSchema = new mongoose.Schema({
    robloxId: {
        type: Number,
        required: true,
        unique: true,
        match: /^[0-9]$/
    },
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^(?=^[^_]+_?[^_]+$)\w{3,20}$/
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roblox_group'
    },
});

module.exports = mongoose.model('roblox_account', roblox_accountSchema); 
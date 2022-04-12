const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: {
        type: Number,
        required: true,
        unique: true,
        match: /^[0-9]{17,22}$/
    },
    discord_username: {
        type: String,
        required: true,
        unique: true,
        match: /^((.+?)#\d{4})/
    },
    roblox_accounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roblox_account'
    }],
    discord_servers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discord_server'
    }]
});

module.exports = mongoose.model('user', userSchema);



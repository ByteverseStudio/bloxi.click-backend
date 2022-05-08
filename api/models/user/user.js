const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roblox_id: {
        type: Number,
        required: true,
        unique: true,
        default: -1
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    roblox_verified: {
        type: Boolean,
        default: false
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    robloxData: {
        groups: [{
            group_id: {
                type: String,
                required: true,
                unique: true
            },
            group_name: {
                type: String,
                required: true,
                unique: true
            },
            group_url: {
                type: String,
                required: true,
                unique: true
            },
            group_role: {
                type: String,
                required: true,
                unique: true
            }
        }],
    },
    discord_data: {
        discord_id: {
            type: String,
            required: true,
            unique: true
        },
        discord_username: {
            type: String,
            required: true,
            unique: true
        },
        discord_discriminator: {
            type: String,
            required: true
        },
        token_data: {
            access_token: String,
            refresh_token: String,
            expires_in: Date,
            token_type: String,
            scope: String
        }
    },
    other_data: {
        
    }
});

module.exports = mongoose.model('user', userSchema);



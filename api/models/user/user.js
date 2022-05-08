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
    robloxId: {
        type: Number,
        required: true,
        unique: true,
        default: -1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['created','emailverified', 'robloxverified', 'active'],
        default: 'created'
    },
    verifyToken: {
        type: String,
        default: null
    },
    robloxData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'robloxData'
    },
    discordData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discordData'
    },
    otherData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'otherData'
    }
});

module.exports = mongoose.model('user', userSchema);



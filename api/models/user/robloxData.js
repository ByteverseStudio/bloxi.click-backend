const mongoose = require('mongoose');

const robloxDataSchema = new mongoose.Schema({
    robloxGroups: [{
        groupId: {
            type: String,
            required: true,
            unique: true
        },
        groupName: {
            type: String,
            required: true,
            unique: true
        },
        groupUrl: {
            type: String,
            required: true,
            unique: true
        },
        groupRole: {
            type: String,
            required: true,
            unique: true
        }
    }],
    

});

module.exports = mongoose.model('robloxData', robloxDataSchema);
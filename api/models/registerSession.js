const mongoose = require('mongoose');

const registerSessionSchema = new mongoose.Schema({
    indetifier: {
        type: String,
        required: true,
        unique: true
    },
    roblox_id: {
        type: Number,
        required: true,
        unique: true,
        default: -1
    },
    roblox_name: {
        type: String,
        required: true,
        unique: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}
);

module.exports = mongoose.model('registerSession', registerSessionSchema);
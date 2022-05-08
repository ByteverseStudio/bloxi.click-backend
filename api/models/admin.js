const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        minlength: 64,
    }
}
);

module.exports = mongoose.model('admin', adminSchema);
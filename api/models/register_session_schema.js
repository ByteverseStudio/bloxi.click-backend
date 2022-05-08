import mongoose from 'mongoose';

const register_session_schema = new mongoose.Schema({
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

export default mongoose.model('register_session', register_session_schema);
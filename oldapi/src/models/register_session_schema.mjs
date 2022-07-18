import mongoose from 'mongoose';

const register_session_schema = new mongoose.Schema({
    indetifier: {
        type: String,
        required: true,
        unique: true
    },
    roblox_id: {
        type: String,
        required: true,
        unique: true,
    },
    roblox_username: {
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
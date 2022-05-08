import mongoose from 'mongoose';

const admin_schema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        minlength: 64,
    }
}
);

export default mongoose.model('admin', admin_schema);
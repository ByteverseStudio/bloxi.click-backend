import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        minlength: 64,
    }
}
);

export default mongoose.model('admin', adminSchema);
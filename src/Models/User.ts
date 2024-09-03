// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String },
    image: { type: String },
    mobile: { type: String },
    createdAt: { type: Date, default: Date.now },
    connectors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Connector' }], // Reference to connectors
    features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' }] // Reference to other features
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

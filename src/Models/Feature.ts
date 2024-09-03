// models/Feature.js
import mongoose from 'mongoose';

const FeatureSchema = new mongoose.Schema({
    connector: { type: mongoose.Schema.Types.ObjectId, ref: 'Connector' }, 
    mmm: { type: mongoose.Schema.Types.ObjectId, ref: 'MMM' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Feature || mongoose.model('Feature', FeatureSchema);

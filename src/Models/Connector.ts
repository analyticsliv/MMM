// models/Connector.js
import mongoose from 'mongoose';

const ConnectorSchema = new mongoose.Schema({
    ga4: {
        type: Object,
    },
    facebook: {
        type: Object,
    },
    dv360: {
        type: Object,
    },
    googleAds: {
        type: Object,
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Connector || mongoose.model('Connector', ConnectorSchema);

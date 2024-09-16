const mongoose = require('mongoose');

const connectorJobSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    connectorType: { type: String, required: true },
    status: { type: String, default: 'initialized' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


export default mongoose.models.JobDetail || mongoose.model('JobDetail', connectorJobSchema);
const mongoose = require('mongoose');

const connectorJobSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    connectorType: { type: String, required: true },
    status: { type: String, default: 'initialized' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // New fields for file handling
    fileName: { type: String },
    fileContent: { type: String },
    fileType: { type: String },
    fileSize: { type: Number }
});


export default mongoose.models.JobDetail || mongoose.model('JobDetail', connectorJobSchema);
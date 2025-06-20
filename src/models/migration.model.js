import mongoose from 'mongoose';

const migrationSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        unique: true,
    },
    executedAt: {
        type: Date,
        default: Date.now,
    },
    batch: {
        type: Number,
        required: true,
    },
});

export default mongoose.model('Migration', migrationSchema);

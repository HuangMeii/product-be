import mongoose from 'mongoose';
import { runMigrations } from '../migrations/migration-runner.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        await runMigrations();
    } catch (error) {
        console.error('Lỗi kết nối MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;

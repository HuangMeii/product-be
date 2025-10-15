import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên người dùng là bắt buộc'],
            trim: true,
            maxlength: [100, 'Tên không được vượt quá 100 ký tự'],
        },
        email: {
            type: String,
            required: [true, 'Email là bắt buộc'],
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Mật khẩu là bắt buộc'],
        },
        role: {
            type: String,
            enum: ['admin', 'client'],
            default: 'client',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index to find users by email quickly
userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);

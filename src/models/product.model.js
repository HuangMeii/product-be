import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên sản phẩm là bắt buộc'],
            trim: true,
            maxlength: [100, 'Tên sản phẩm không được vượt quá 100 ký tự'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Mô tả không được vượt quá 500 ký tự'],
        },
        price: {
            type: Number,
            required: [true, 'Giá sản phẩm là bắt buộc'],
            min: [0, 'Giá sản phẩm phải lớn hơn hoặc bằng 0'],
        },
        stock: {
            type: Number,
            required: [true, 'Số lượng tồn kho là bắt buộc'],
            min: [0, 'Số lượng tồn kho phải lớn hơn hoặc bằng 0'],
            default: 0,
        },
        image: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

// Index để tìm kiếm nhanh hơn
productSchema.index({ name: 1 });

export default mongoose.model('Product', productSchema);

import Product from '../models/product.model.js';

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query;
        const filter = {};

        // Lọc theo danh mục
        if (category) {
            filter.category = category;
        }

        // Tìm kiếm theo tên
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách sản phẩm',
            error: error.message,
        });
    }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm',
            });
        }

        res.json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thông tin sản phẩm',
            error: error.message,
        });
    }
};

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();

        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm thành công',
            data: savedProduct,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo sản phẩm',
            error: error.message,
        });
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm',
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: product,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật sản phẩm',
            error: error.message,
        });
    }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm',
            });
        }

        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa sản phẩm',
            error: error.message,
        });
    }
};

export {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};

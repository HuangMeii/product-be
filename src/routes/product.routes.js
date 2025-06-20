import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

// GET /api/products - Lấy tất cả sản phẩm (có phân trang và tìm kiếm)
router.get('/', getAllProducts);

// GET /api/products/:id - Lấy sản phẩm theo ID
router.get('/:id', getProductById);

// POST /api/products - Tạo sản phẩm mới
router.post('/', createProduct);

// PUT /api/products/:id - Cập nhật sản phẩm
router.put('/:id', updateProduct);

// DELETE /api/products/:id - Xóa sản phẩm
router.delete('/:id', deleteProduct);

export default router;

import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller.js';
import { authenticate, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/products - Lấy tất cả sản phẩm (có phân trang và tìm kiếm)
router.get('/', getAllProducts);

// GET /api/products/:id - Lấy sản phẩm theo ID
router.get('/:id', getProductById);

// POST /api/products - Tạo sản phẩm mới (chỉ admin)
router.post('/', authenticate, authorizeRole('admin'), createProduct);

// PUT /api/products/:id - Cập nhật sản phẩm (chỉ admin)
router.put('/:id', authenticate, authorizeRole('admin'), updateProduct);

// DELETE /api/products/:id - Xóa sản phẩm (chỉ admin)
router.delete('/:id', authenticate, authorizeRole('admin'), deleteProduct);

export default router;

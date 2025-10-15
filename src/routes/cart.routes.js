import express from 'express';
import {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
} from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/cart - Lấy giỏ hàng của user
router.get('/', authenticate, getCart);

// POST /api/cart - Thêm sản phẩm vào giỏ
router.post('/', authenticate, addItem);

// PUT /api/cart/:productId - Cập nhật số lượng
router.put('/:productId', authenticate, updateItem);

// DELETE /api/cart/:productId - Xóa 1 sản phẩm khỏi giỏ
router.delete('/:productId', authenticate, removeItem);

// DELETE /api/cart - Xóa toàn bộ giỏ
router.delete('/', authenticate, clearCart);

export default router;

import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Lấy giỏ hàng của user (tạo mới nếu chưa có)
const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }
        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Thêm sản phẩm vào giỏ
const addItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) return res.status(400).json({ success: false, message: 'productId is required' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        let cart = await Cart.findOne({ user: userId });
        if (!cart) cart = await Cart.create({ user: userId, items: [] });

        const existingIndex = cart.items.findIndex((i) => i.product.toString() === productId.toString());
        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += quantity;
        } else {
            cart.items.push({ product: product._id, name: product.name, price: product.price, quantity });
        }

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Cập nhật số lượng một item
const updateItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!productId) return res.status(400).json({ success: false, message: 'productId is required' });
        if (quantity == null || quantity < 1) return res.status(400).json({ success: false, message: 'quantity must be >= 1' });

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const idx = cart.items.findIndex((i) => i.product.toString() === productId.toString());
        if (idx === -1) return res.status(404).json({ success: false, message: 'Item not found in cart' });

        cart.items[idx].quantity = quantity;
        await cart.save();
        await cart.populate('items.product');

        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Xóa 1 item khỏi giỏ
const removeItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        cart.items = cart.items.filter((i) => i.product.toString() !== productId.toString());
        await cart.save();
        await cart.populate('items.product');

        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Xóa toàn bộ giỏ
const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        cart.items = [];
        await cart.save();

        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export { getCart, addItem, updateItem, removeItem, clearCart };

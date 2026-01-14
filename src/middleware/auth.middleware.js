import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;

        if (!token)
            return res
                .status(401)
                .json({ success: false, message: 'No token provided' });

        const secret = process.env.JWT_SECRET || 'change_this_secret';
        const decoded = jwt.verify(token, secret);

        // Attach user to request (fetch fresh data)
        const user = await User.findById(decoded.id).select('-password');
        if (!user)
            return res
                .status(401)
                .json({ success: false, message: 'Invalid token' });

        req.user = user;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({
                success: false,
                message: 'Unauthorized',
                error: error.message,
            });
    }
};

const authorizeRole = (role) => (req, res, next) => {
    if (!req.user)
        return res
            .status(401)
            .json({ success: false, message: 'Unauthorized' });
    if (req.user.role !== role)
        return res
            .status(403)
            .json({
                success: false,
                message: 'Forbidden: insufficient rights',
            });
    next();
};

export { authenticate, authorizeRole };

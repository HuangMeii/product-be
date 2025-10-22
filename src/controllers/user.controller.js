import User from '../models/user.model.js';

// Get user by id (public info)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// Update user (self or admin)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // only allow self or admin
        if (!req.user)
            return res
                .status(401)
                .json({ success: false, message: 'Unauthorized' });
        if (req.user._id.toString() !== id && req.user.role !== 'admin') {
            return res
                .status(403)
                .json({ success: false, message: 'Forbidden' });
        }

        const payload = { ...req.body };
        // prevent changing password directly here (use dedicated route)
        delete payload.password;

        const updated = await User.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        }).select('-password');
        if (!updated)
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        res.json({ success: true, data: updated });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((e) => e.message);
            return res
                .status(400)
                .json({ success: false, message: 'Validation error', errors });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// Delete user (admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

export { getUserById, updateUser, deleteUser };

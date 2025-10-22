import express from 'express';
import { getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authenticate, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/users/:id - public (returns user without password)
router.get('/:id', getUserById);

// PUT /api/users/:id - update user (self or admin)
router.put('/:id', authenticate, updateUser);

// DELETE /api/users/:id - admin only
router.delete('/:id', authenticate, authorizeRole('admin'), deleteUser);

export default router;

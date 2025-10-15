import express from 'express';
import {
    getStatus,
    runMigrationsAPI,
    rollbackMigrationAPI,
    resetDatabaseAPI,
} from '../controllers/migration.controller.js';

const router = express.Router();

// GET /api/migrations/status - Lấy trạng thái migrations
router.get('/status', getStatus);

// POST /api/migrations/run - Chạy migrations
router.post('/run', runMigrationsAPI);

// POST /api/migrations/rollback - Rollback migration cuối cùng
router.post('/rollback', rollbackMigrationAPI);

// POST /api/migrations/reset - Reset database và seed
router.post('/reset', resetDatabaseAPI);

export default router;

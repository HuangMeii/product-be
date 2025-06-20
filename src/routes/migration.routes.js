import express from 'express';
import {
    getStatus,
    runMigrationsAPI,
    rollbackMigrationAPI,
} from '../controllers/migration.controller.js';

const router = express.Router();

// GET /api/migrations/status - Lấy trạng thái migrations
router.get('/status', getStatus);

// POST /api/migrations/run - Chạy migrations
router.post('/run', runMigrationsAPI);

// POST /api/migrations/rollback - Rollback migration cuối cùng
router.post('/rollback', rollbackMigrationAPI);

export default router;

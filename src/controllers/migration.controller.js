import {
    runMigrations,
    rollbackMigration,
    getMigrationStatus,
} from '../migrations/migration-runner.js';

// Lấy trạng thái migrations
export const getStatus = async (req, res) => {
    try {
        const status = await getMigrationStatus();

        res.json({
            success: true,
            message: 'Trạng thái migrations',
            data: status,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy trạng thái migrations',
            error: error.message,
        });
    }
};

// Chạy migrations
export const runMigrationsAPI = async (req, res) => {
    try {
        await runMigrations();

        res.json({
            success: true,
            message: 'Migrations đã được chạy thành công',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi chạy migrations',
            error: error.message,
        });
    }
};

// Rollback migration
export const rollbackMigrationAPI = async (req, res) => {
    try {
        await rollbackMigration();

        res.json({
            success: true,
            message: 'Rollback migration thành công',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi rollback migration',
            error: error.message,
        });
    }
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Migration from '../models/migration.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runMigrations = async () => {
    try {
        const migrationsDir = path.join(__dirname, 'files');

        // Kiểm tra nếu thư mục migrations không tồn tại
        if (!fs.existsSync(migrationsDir)) {
            console.log('📁 Tạo thư mục migrations...');
            fs.mkdirSync(migrationsDir, { recursive: true });
        }

        // Lấy danh sách file migration
        const migrationFiles = fs
            .readdirSync(migrationsDir)
            .filter((file) => file.endsWith('.js'))
            .sort();

        if (migrationFiles.length === 0) {
            console.log('📂 Không có migration nào để chạy');
            return;
        }

        // Lấy danh sách migration đã chạy
        const executedMigrations = await Migration.find({}).sort({ batch: 1 });
        const executedFilenames = executedMigrations.map((m) => m.filename);

        // Lọc ra các migration chưa chạy
        const pendingMigrations = migrationFiles.filter(
            (file) => !executedFilenames.includes(file)
        );

        if (pendingMigrations.length === 0) {
            console.log('✅ Tất cả migrations đã được chạy');
            return;
        }

        // Lấy batch number tiếp theo
        const lastMigration = await Migration.findOne({}).sort({ batch: -1 });
        const nextBatch = lastMigration ? lastMigration.batch + 1 : 1;

        console.log(`🚀 Chạy ${pendingMigrations.length} migration(s)...`);

        // Chạy từng migration
        for (const filename of pendingMigrations) {
            const migrationPath = path.join(migrationsDir, filename);
            console.log(`⏳ Đang chạy: ${filename}`);

            try {
                const migration = await import(`file://${migrationPath}`);

                if (typeof migration.up === 'function') {
                    await migration.up();

                    // Lưu record migration
                    await Migration.create({
                        filename,
                        batch: nextBatch,
                    });

                    console.log(`✅ Hoàn thành: ${filename}`);
                } else {
                    console.log(`⚠️  Migration ${filename} không có hàm up()`);
                }
            } catch (error) {
                console.error(
                    `❌ Lỗi khi chạy migration ${filename}:`,
                    error.message
                );
                throw error;
            }
        }

        console.log('🎉 Tất cả migrations đã được chạy thành công!');
    } catch (error) {
        console.error('❌ Lỗi khi chạy migrations:', error.message);
        throw error;
    }
};

export const rollbackMigration = async () => {
    try {
        // Lấy migration cuối cùng
        const lastMigration = await Migration.findOne({}).sort({ batch: -1 });

        if (!lastMigration) {
            console.log('📂 Không có migration nào để rollback');
            return;
        }

        // Lấy tất cả migration trong batch cuối cùng
        const migrationsToRollback = await Migration.find({
            batch: lastMigration.batch,
        }).sort({ executedAt: -1 });

        console.log(
            `🔄 Rollback ${migrationsToRollback.length} migration(s) từ batch ${lastMigration.batch}...`
        );

        const migrationsDir = path.join(__dirname, 'files');

        // Rollback từng migration theo thứ tự ngược lại
        for (const migrationRecord of migrationsToRollback) {
            const migrationPath = path.join(
                migrationsDir,
                migrationRecord.filename
            );
            console.log(`⏳ Đang rollback: ${migrationRecord.filename}`);

            try {
                if (fs.existsSync(migrationPath)) {
                    const migration = await import(
                        `file://${migrationPath}?t=${Date.now()}`
                    );

                    if (typeof migration.down === 'function') {
                        await migration.down();

                        // Xóa record migration
                        await Migration.deleteOne({ _id: migrationRecord._id });

                        console.log(
                            `✅ Rollback hoàn thành: ${migrationRecord.filename}`
                        );
                    } else {
                        console.log(
                            `⚠️  Migration ${migrationRecord.filename} không có hàm down()`
                        );
                    }
                } else {
                    console.log(
                        `⚠️  File migration ${migrationRecord.filename} không tồn tại`
                    );
                    // Vẫn xóa record nếu file không tồn tại
                    await Migration.deleteOne({ _id: migrationRecord._id });
                }
            } catch (error) {
                console.error(
                    `❌ Lỗi khi rollback migration ${migrationRecord.filename}:`,
                    error.message
                );
                throw error;
            }
        }

        console.log('🎉 Rollback thành công!');
    } catch (error) {
        console.error('❌ Lỗi khi rollback:', error.message);
        throw error;
    }
};

export const getMigrationStatus = async () => {
    try {
        const migrationsDir = path.join(__dirname, 'files');

        // Lấy danh sách file migration
        const migrationFiles = fs.existsSync(migrationsDir)
            ? fs
                  .readdirSync(migrationsDir)
                  .filter((file) => file.endsWith('.js'))
                  .sort()
            : [];

        // Lấy danh sách migration đã chạy
        const executedMigrations = await Migration.find({}).sort({
            batch: 1,
            executedAt: 1,
        });
        const executedFilenames = executedMigrations.map((m) => m.filename);

        const status = migrationFiles.map((filename) => ({
            filename,
            status: executedFilenames.includes(filename)
                ? 'executed'
                : 'pending',
            batch:
                executedMigrations.find((m) => m.filename === filename)
                    ?.batch || null,
            executedAt:
                executedMigrations.find((m) => m.filename === filename)
                    ?.executedAt || null,
        }));

        return {
            total: migrationFiles.length,
            executed: executedFilenames.length,
            pending: migrationFiles.length - executedFilenames.length,
            migrations: status,
        };
    } catch (error) {
        console.error('❌ Lỗi khi lấy trạng thái migration:', error.message);
        throw error;
    }
};

export const resetDatabase = async () => {
    try {
        console.log('🔄 Đang reset database...');

        // Drop collections
        const collections = ['products', 'users', 'carts', 'migrations'];
        for (const col of collections) {
            try {
                await mongoose.connection.db.dropCollection(col);
                console.log(`✅ Dropped collection: ${col}`);
            } catch (e) {
                console.log(`⚠️ Collection ${col} không tồn tại hoặc lỗi: ${e.message}`);
            }
        }

        // Chạy migrations
        await runMigrations();

        console.log('🎉 Reset database thành công!');
    } catch (error) {
        console.error('❌ Lỗi khi reset database:', error.message);
        throw error;
    }
};

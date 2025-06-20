#!/usr/bin/env node

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
    runMigrations,
    rollbackMigration,
    getMigrationStatus,
} from '../migrations/migration-runner.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔗 Kết nối MongoDB thành công');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        process.exit(1);
    }
};

const main = async () => {
    const command = process.argv[2];

    await connectDB();

    try {
        switch (command) {
            case 'migrate':
                console.log('🚀 Bắt đầu chạy migrations...');
                await runMigrations();
                break;

            case 'rollback':
                console.log('🔄 Bắt đầu rollback migration...');
                await rollbackMigration();
                break;

            case 'status':
                console.log('📊 Trạng thái migrations:');
                const status = await getMigrationStatus();
                console.log(`\n📈 Tổng quan:`);
                console.log(`   Tổng số migrations: ${status.total}`);
                console.log(`   Đã chạy: ${status.executed}`);
                console.log(`   Chưa chạy: ${status.pending}\n`);

                if (status.migrations.length > 0) {
                    console.log('📋 Chi tiết:');
                    status.migrations.forEach((migration) => {
                        const statusIcon =
                            migration.status === 'executed' ? '✅' : '⏳';
                        const batchInfo = migration.batch
                            ? ` (batch: ${migration.batch})`
                            : '';
                        const dateInfo = migration.executedAt
                            ? ` - ${new Date(
                                  migration.executedAt
                              ).toLocaleString()}`
                            : '';
                        console.log(
                            `   ${statusIcon} ${migration.filename}${batchInfo}${dateInfo}`
                        );
                    });
                }
                break;

            default:
                console.log(
                    '❓ Sử dụng: node scripts/migrate.js [migrate|rollback|status]'
                );
                console.log('\n📚 Các lệnh có sẵn:');
                console.log(
                    '   migrate  - Chạy tất cả migrations chưa được thực hiện'
                );
                console.log('   rollback - Rollback batch migration cuối cùng');
                console.log(
                    '   status   - Xem trạng thái của tất cả migrations'
                );
                break;
        }
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Đã ngắt kết nối MongoDB');
    }
};

main();

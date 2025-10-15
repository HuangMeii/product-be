import User from '../../models/user.model.js';
import bcrypt from 'bcryptjs';

export const up = async () => {
    console.log('\u{1F464} Đang seed dữ liệu user (admin + client)...');

    // Kiểm tra nếu đã có user
    const existing = await User.countDocuments();
    if (existing > 0) {
        console.log('\u{1F4E6} Dữ liệu user đã tồn tại, bỏ qua seed');
        return;
    }

    const saltRounds = 10;
    const adminPassword = bcrypt.hashSync('Admin@123', saltRounds);
    const clientPassword = bcrypt.hashSync('Client@123', saltRounds);

    const users = [
        {
            name: 'Administrator',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin',
        },
        {
            name: 'Sample Client',
            email: 'client@example.com',
            password: clientPassword,
            role: 'client',
        },
    ];

    try {
        const created = await User.insertMany(users);
        console.log(`\u2705 Đã tạo ${created.length} user(s)`);
    } catch (error) {
        console.error('\u274C Lỗi khi seed users:', error.message);
        throw error;
    }
};

export const down = async () => {
    console.log('\u{1F504} Đang xóa user seed...');

    try {
        const res = await User.deleteMany({
            email: { $in: ['admin@example.com', 'client@example.com'] },
        });
        console.log(`\u2705 Đã xóa ${res.deletedCount} user(s)`);
    } catch (error) {
        console.error('\u274C Lỗi khi xóa users:', error.message);
        throw error;
    }
};

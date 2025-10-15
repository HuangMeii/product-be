import Product from '../../models/product.model.js';

// Migration: Seed dữ liệu sản phẩm mẫu
export const up = async () => {
    console.log('🌱 Đang seed dữ liệu sản phẩm mẫu...');

    // Kiểm tra xem đã có dữ liệu chưa
    const existingProducts = await Product.countDocuments();

    if (existingProducts > 0) {
        console.log('📦 Dữ liệu sản phẩm đã tồn tại, bỏ qua seed');
        return;
    }

    const sampleProducts = [
        {
            name: 'iPhone 15 Pro Max',
            description:
                'Điện thoại thông minh cao cấp với chip A17 Pro và camera 48MP',
            price: 29990000,
            stock: 50,
            image: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            description:
                'Smartphone Android flagship với S Pen và camera zoom 100x',
            price: 31990000,
            stock: 30,
            image: 'https://cdn.tgdd.vn/Products/Images/42/320720/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg',
        },
        {
            name: 'MacBook Air M3',
            description: 'Laptop siêu mỏng với chip M3 mạnh mẽ, pin 18 giờ',
            price: 28990000,
            stock: 25,
            image: 'https://cdn.tgdd.vn/Products/Images/44/322096/macbook-air-13-inch-m3-2024-space-gray-thumbnew-600x600.jpg',
        },
        {
            name: 'Dell XPS 13 Plus',
            description: 'Laptop Windows cao cấp với màn hình 4K OLED',
            price: 35990000,
            stock: 20,
            image: 'https://cdn.tgdd.vn/Products/Images/44/288004/dell-xps-13-plus-9320-i7-71003200-1-org.jpg',
        },
        {
            name: 'iPad Air M2',
            description: 'Máy tính bảng đa năng với chip M2 và Apple Pencil',
            price: 16990000,
            stock: 40,
            image: 'https://cdn.tgdd.vn/Products/Images/522/325570/ipad-air-13-inch-m2-wifi-blue-thumbnew-600x600.jpg',
        },
        {
            name: 'AirPods Pro (3rd Gen)',
            description:
                'Tai nghe không dây với chống ồn chủ động và âm thanh spatial',
            price: 5990000,
            stock: 100,
            image: 'https://cdn.tgdd.vn/Products/Images/54/289779/airpods-pro-gen-2-usb-c-apple-thumbnew-600x600.jpg',
        },
        {
            name: 'Sony WH-1000XM5',
            description: 'Tai nghe over-ear cao cấp với chống ồn tuyệt vời',
            price: 8990000,
            stock: 35,
            image: 'https://cdn.tgdd.vn/Products/Images/54/289816/sony-wh-1000xm5-den-thumbnew-600x600.jpg',
        },
        {
            name: 'Apple Watch Series 9',
            description:
                'Đồng hồ thông minh với GPS, theo dõi sức khỏe toàn diện',
            price: 9990000,
            stock: 60,
            image: 'https://cdn.tgdd.vn/Products/Images/7077/325020/apple-watch-s9-gps-41mm-pink-sport-band-thumbnew-600x600.jpg',
        },
        {
            name: 'Samsung Galaxy Watch 6',
            description:
                'Smartwatch Android với theo dõi giấc ngủ và tập luyện',
            price: 6990000,
            stock: 45,
            image: 'https://cdn.tgdd.vn/Products/Images/7077/309831/samsung-galaxy-watch-6-40mm-bac-thumbnew-600x600.jpg',
        },
        {
            name: 'Nintendo Switch OLED',
            description: 'Máy chơi game cầm tay với màn hình OLED 7 inch',
            price: 8990000,
            stock: 30,
            image: 'https://cdn.tgdd.vn/Products/Images/5195/250542/nintendo-switch-oled-trang-1-org.jpg',
        },
        {
            name: 'PlayStation 5 Slim',
            description: 'Console gaming thế hệ mới với SSD tốc độ cao',
            price: 13990000,
            stock: 15,
            image: 'https://cdn.tgdd.vn/Products/Images/5195/325570/ps5-slim-thumbnew-600x600.jpg',
        },
        {
            name: 'Canon EOS R6 Mark II',
            description:
                'Máy ảnh mirrorless chuyên nghiệp với cảm biến full-frame',
            price: 45990000,
            stock: 10,
            image: 'https://cdn.tgdd.vn/Products/Images/1475/290654/canon-eos-r6-mark-ii-body-thumbnew-600x600.jpg',
        },
        {
            name: 'GoPro Hero 12 Black',
            description: 'Action camera 4K với chống rung HyperSmooth 6.0',
            price: 12990000,
            stock: 25,
            image: 'https://cdn.tgdd.vn/Products/Images/1475/325570/gopro-hero-12-black-thumbnew-600x600.jpg',
        },
        {
            name: 'Dyson V15 Detect',
            description:
                'Máy hút bụi không dây với công nghệ laser phát hiện bụi',
            price: 18990000,
            stock: 20,
            image: 'https://cdn.tgdd.vn/Products/Images/1985/235464/dyson-v15-detect-vang-1-org.jpg',
        },
        {
            name: 'Xiaomi Robot Vacuum S10+',
            description: 'Robot hút bụi thông minh với trạm làm sạch tự động',
            price: 12990000,
            stock: 15,
            image: 'https://cdn.tgdd.vn/Products/Images/1985/325570/xiaomi-robot-vacuum-s10-plus-thumbnew-600x600.jpg',
        },
    ];

    try {
        const insertedProducts = await Product.insertMany(sampleProducts);
        console.log(
            `✅ Đã seed ${insertedProducts.length} sản phẩm mẫu thành công!`
        );

    } catch (error) {
        console.error('❌ Lỗi khi seed dữ liệu:', error.message);
        throw error;
    }
};

export const down = async () => {
    console.log('🗑️  Đang xóa dữ liệu sản phẩm mẫu...');

    try {
        const result = await Product.deleteMany({});
        console.log(`✅ Đã xóa ${result.deletedCount} sản phẩm`);
    } catch (error) {
        console.error('❌ Lỗi khi xóa dữ liệu:', error.message);
        throw error;
    }
};

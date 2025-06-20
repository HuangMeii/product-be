# Product CRUD API

API CRUD đơn giản cho quản lý sản phẩm sử dụng Express.js, MongoDB và Mongoose.

## Tính năng

- ✅ Tạo sản phẩm mới
- ✅ Lấy danh sách sản phẩm (có phân trang)
- ✅ Lấy chi tiết sản phẩm theo ID
- ✅ Cập nhật thông tin sản phẩm
- ✅ Xóa sản phẩm
- ✅ Tìm kiếm sản phẩm theo tên
- ✅ Lọc sản phẩm theo danh mục
- ✅ **Migration tự động** - Tự động tạo DB và seed dữ liệu mẫu
- ✅ **CORS configured** - Hỗ trợ frontend từ localhost:3000, localhost:5173

## Cài đặt

1. Clone project và cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` và cấu hình:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/product_crud_db
```

3. Chạy server development (sẽ tự động chạy migrations):
```bash
npm run dev
```

4. Chạy server production:
```bash
npm start
```

## CORS Configuration

Server đã được cấu hình CORS để hỗ trợ các frontend development server:

- **React/Next.js:** `http://localhost:3000`
- **Vite/Vue:** `http://localhost:5173`
- **Credentials:** Được phép gửi cookies và authentication headers
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization, x-requested-with

Nếu cần thêm domain khác, cập nhật mảng `origin` trong `server.js`.

## Migration System

Hệ thống migration tự động tạo database và seed dữ liệu mẫu khi lần đầu chạy project.

### CLI Commands:
```bash
# Chạy tất cả migrations
npm run migrate

# Rollback migration cuối cùng
npm run migrate:rollback

# Xem trạng thái migrations
npm run migrate:status
```

### API Endpoints cho Migrations:
- **GET** `/api/migrations/status` - Xem trạng thái migrations
- **POST** `/api/migrations/run` - Chạy migrations
- **POST** `/api/migrations/rollback` - Rollback migration cuối cùng

## API Endpoints

### Base URL: `http://localhost:3000`

### 1. Lấy tất cả sản phẩm
- **GET** `/api/products`
- **Query Parameters:**
  - `page` (optional): Số trang (mặc định: 1)
  - `limit` (optional): Số sản phẩm mỗi trang (mặc định: 10)
  - `category` (optional): Lọc theo danh mục
  - `search` (optional): Tìm kiếm theo tên sản phẩm

**Ví dụ:**
```
GET /api/products?page=1&limit=5&category=electronics&search=laptop
```

### 2. Lấy sản phẩm theo ID
- **GET** `/api/products/:id`

### 3. Tạo sản phẩm mới
- **POST** `/api/products`
- **Body:**
```json
{
  "name": "iPhone 15",
  "description": "Điện thoại thông minh cao cấp",
  "price": 25000000,
  "category": "electronics",
  "stock": 100,
  "image": "https://example.com/image.jpg"
}
```

### 4. Cập nhật sản phẩm
- **PUT** `/api/products/:id`
- **Body:** (có thể cập nhật một phần)
```json
{
  "price": 24000000,
  "stock": 95
}
```

### 5. Xóa sản phẩm
- **DELETE** `/api/products/:id`

## Schema sản phẩm

```javascript
{
  name: String (required, max: 100 chars),
  description: String (max: 500 chars),
  price: Number (required, min: 0),
  category: String (required),
  stock: Number (required, min: 0, default: 0),
  image: String,
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Response Format

### Thành công:
```json
{
  "success": true,
  "message": "Thông báo thành công",
  "data": { ... }
}
```

### Lỗi:
```json
{
  "success": false,
  "message": "Thông báo lỗi",
  "error": "Chi tiết lỗi"
}
```

## Công nghệ sử dụng

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Nodemon** - Development tool
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Cấu trúc thư mục

```
curd-be/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── product.controller.js
│   │   └── migration.controller.js
│   ├── middleware/
│   │   └── error.middleware.js
│   ├── migrations/
│   │   ├── files/
│   │   │   └── 001_seed_products.js
│   │   └── migration-runner.js
│   ├── models/
│   │   ├── product.model.js
│   │   └── migration.model.js
│   ├── routes/
│   │   ├── product.routes.js
│   │   └── migration.routes.js
│   └── scripts/
│       └── migrate.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js
```
├── README.md
└── server.js
```

## Migration Features

### Tự động khi start server:
- Kiểm tra và tạo database nếu chưa tồn tại
- Seed 15 sản phẩm mẫu đa dạng (điện thoại, laptop, tablet, tai nghe, v.v.)
- Chỉ seed dữ liệu khi database còn trống
- Tracking các migration đã chạy

### Dữ liệu mẫu bao gồm:
- iPhone 15 Pro Max, Samsung Galaxy S24 Ultra
- MacBook Pro M3, Dell XPS 13
- iPad Pro, Samsung Galaxy Tab S9
- Sony WH-1000XM5, AirPods Pro 2
- Apple Watch Series 9, Samsung Galaxy Watch 6
- Nintendo Switch OLED, PlayStation 5
- Canon EOS R5, Sony A7 IV
- LG OLED C3 55 inch

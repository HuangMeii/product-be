import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import { notFound, errorHandler } from './src/middleware/error.middleware.js';

// Cấu hình dotenv
dotenv.config();

// Kết nối database
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true, // Cho phép gửi cookies
    optionsSuccessStatus: 200, // Support legacy browsers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Product CRUD API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                button { padding: 10px 20px; font-size: 16px; background: #f44336; color: white; border: none; cursor: pointer; }
                button:hover { background: #d32f2f; }
                .message { margin-top: 20px; padding: 10px; border-radius: 4px; }
                .success { background: #4caf50; color: white; }
                .error { background: #f44336; color: white; }
            </style>
        </head>
        <body>
            <h1>Chào mừng đến với Product CRUD API</h1>
            <p>Version: 1.0.0</p>
            <p>Endpoints:</p>
            <ul>
                <li>Products: /api/products</li>
                <li>Auth: /api/auth</li>
                <li>Cart: /api/cart</li>
                <li>Migrations: /api/migrations</li>
            </ul>
            <h2>Reset Database</h2>
            <p>Click để drop hết data và seed lại từ đầu:</p>
            <button onclick="resetDatabase()">Reset Database & Seed</button>
            <div id="message"></div>
            <script>
                async function resetDatabase() {
                    if (!confirm('Bạn có chắc muốn reset database? Tất cả data sẽ bị xóa!')) return;
                    try {
                        const response = await fetch('/api/migrations/reset', { method: 'POST' });
                        const data = await response.json();
                        const msgDiv = document.getElementById('message');
                        if (data.success) {
                            msgDiv.innerHTML = '<div class="message success">' + data.message + '</div>';
                        } else {
                            msgDiv.innerHTML = '<div class="message error">' + data.message + '</div>';
                        }
                    } catch (error) {
                        document.getElementById('message').innerHTML = '<div class="message error">Lỗi: ' + error.message + '</div>';
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// API Routes
import productRoutes from './src/routes/product.routes.js';
import migrationRoutes from './src/routes/migration.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import cartRoutes from './src/routes/cart.routes.js';
import userRoutes from './src/routes/user.routes.js';

app.use('/api/products', productRoutes);
app.use('/api/migrations', migrationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

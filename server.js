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
    res.json({
        message: 'Chào mừng đến với Product CRUD API',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            migrations: '/api/migrations',
        },
    });
});

// API Routes
import productRoutes from './src/routes/product.routes.js';
import migrationRoutes from './src/routes/migration.routes.js';

app.use('/api/products', productRoutes);
app.use('/api/migrations', migrationRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

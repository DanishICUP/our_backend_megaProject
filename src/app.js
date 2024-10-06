import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// routes import
import UserRouter from './routes/user.routes.js'

// router declaration
app.use('/api/users',UserRouter); // constant in any route only change router directory
// http://localhost:3000/api/users/register

export { app };
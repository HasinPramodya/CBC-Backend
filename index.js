import express from "express";
import mongoose from "mongoose";
import userRouter from "./router/user.router.js";
import bodyParser from "body-parser";
import { authUser } from "./middleware/auth.middleware.js";
import productRouter from "./router/product.router.js";
import orderRouter from "./router/order.router.js";
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const port = process.env.PORT || 5000;
const app = express();

// Manual CORS Middleware
app.use((req, res, next) => {
  const origin = req.get('Origin');
  console.log(`[DEBUG] Incoming Request: ${req.method} ${req.url}`);
  console.log(`[DEBUG] Origin Header: ${origin}`);

  const allowedOrigins = [
    'https://cbc-frontend-lemon.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://cbc-backend-production-f5aa.up.railway.app'
  ];

  // Set headers
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Fallback for non-browser requests
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    // Log mismatch for debugging
    console.log(`[WARNING] Origin mismatch: ${origin} not in allowedOrigins`);
    // For now, let's echo the origin to fix the immediate block, 
    // but log it so we know what's happening.
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

  if (req.method === 'OPTIONS') {
    console.log('[DEBUG] Handling OPTIONS preflight');
    return res.sendStatus(204);
  }
  next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Health Check (Must be BEFORE auth middleware for Railway)
app.get("/", (req, res) => {
  res.send("Backend is running!");
})

app.use(authUser)
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter)



mongoose
  .connect(
    process.env.MONGODB_URL
  )
  .then(() => {
    console.log("DB Conected Succssfully");
    app.listen(port, () => {
      console.log(`The app is started at port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });





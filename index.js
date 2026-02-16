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
app.use(cors());

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


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(authUser)
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter)


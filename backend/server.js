import express from "express";
import dotenv from "dotenv";

import bodyParser from 'body-parser';
import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.routes.js";
import subscriptionsRoutes from './routes/subscriptions.routes.js';
import cartRoutes from "./routes/cart.routes.js";
import userProductRoutes from './routes/userProduct.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import protectedRoutes from './routes/protected.routes.js';
import statsRoutes from "./routes/statsRoutes.js";
import leaderboardRoutes from './routes/leaderboard.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();
const app = express();

const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user-products", userProductRoutes);
app.use("/api/feedback",feedbackRoutes);
app.use('/api/protected', protectedRoutes);
app.use("/api/stats", statsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/products/image', express.static(path.join(__dirname, '../uploads/products')));
app.use('/api/users/image', express.static(path.join(__dirname, '../uploads/users')));
app.use('/uploads', express.static('uploads'));



console.log(process.env.MONGO_URI);

app.listen(PORT, ()=>{
    connectDB();
    console.log("server started at http://localhost:"+PORT);

});

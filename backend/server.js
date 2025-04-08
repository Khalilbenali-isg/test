import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.routes.js";
import subscriptionsRoutes from './routes/subscriptions.routes.js';
import cartRoutes from "./routes/cart.routes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json()); 

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use("/api/cart", cartRoutes);


console.log(process.env.MONGO_URI);

app.listen(PORT, ()=>{
    connectDB();
    console.log("server started at http://localhost:"+PORT);

});

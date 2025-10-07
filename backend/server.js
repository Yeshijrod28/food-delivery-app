import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config.js'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"


//app config
const app = express()
const port = process.env.port || 4000

//middleware
app.use(express.json())
const allowedOrigins = [
    "https://your-frontend.vercel.https://food-delivery-app-frontend-h3nftfehf-yeshi-dorjis-projects.vercel.app/",
    "https://food-delivery-app-admin-git-main-yeshi-dorjis-projects.vercel.app/"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // allows cookies if you use them
}));

//db connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter);
app.use("/images",express.static('uploads'));
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

app.get("/",(req,res)=>{
    res.send("API working")

})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)

})
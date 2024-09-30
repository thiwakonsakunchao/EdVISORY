import express, { Express, Request, Response } from "express";
import session from "express-session";
import "dotenv/config";
import MongoStore from "connect-mongo";
import { AppDataSource } from "./config/configDB";
import userRoute from "../src/routes/authRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

 
// ตั้งค่า session
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// ใช้เส้นทาง userRoute
app.use("/api/user", userRoute);


AppDataSource.initialize()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error: any) => console.error('MongoDB connection error:', error));



  //กำหนก token เป็น string ใน express-session
declare module 'express-session' {
  interface SessionData  {
     token: string;
     userId: string | null;
   }
 }

 // สร้าง interface ใหม่ที่เพิ่ม user เข้าไปใน Request
declare global {
  namespace Express {
    interface Request {
      user?: string; // หรือ type ที่เหมาะสม เช่น ObjectId หรือ type อื่นๆ
    }
  }
}
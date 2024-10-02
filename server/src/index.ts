import express, { Express, Request, Response } from "express";
import session from "express-session";
import "dotenv/config";
import MongoStore from "connect-mongo";
import { AppDataSource } from "./config/configDB";
import userRoute from "../src/routes/authRoutes";
import categoryRoute from "./routes/categoryRoutes";
import accountRoutes from "./routes/accountRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import portRoutes from "./routes/portRoutes";
import calculateRoutes from "./routes/calculateRoutes";

const app = express();
const port = process.env.PORT || 3000;
const key_secret:string = process.env.MY_SECRET!;

app.use(express.json());

 

app.use(
  session({
    secret: key_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

app.use("/api/user", userRoute);
app.use("/api/accounts", accountRoutes);
app.use("/api/category", categoryRoute);
app.use("/api/transaction", transactionRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/port", portRoutes);
app.use("/api/calculate", calculateRoutes)


AppDataSource.initialize()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error: any) => console.error('MongoDB connection error:', error));




declare module 'express-session' {
  interface SessionData  {
     token: string;
     userId: string | null;
   }
 }


declare global {
  namespace Express {
    interface Request {
      user?: string; 
    }
  }
}
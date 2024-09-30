import express, { Express, Request, Response } from "express";
import "dotenv/config";
import { AppDataSource } from "./config/configDB";
import { User } from './entities/user';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("MongoDB connected");

    // สร้าง route สำหรับเพิ่มผู้ใช้
    app.post('/users', async (req: Request, res: Response) => {
      const userRepository = AppDataSource.getMongoRepository(User);
      const newUser = new User();
      newUser.name = req.body.name;
      newUser.email = req.body.email;

      await userRepository.save(newUser);
      res.status(201).json({ message: 'User created successfully', user: newUser });
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error: any) => console.error('MongoDB connection error:', error));

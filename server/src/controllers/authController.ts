import { Request, Response } from "express";
import { AppDataSource } from "../config/configDB"; // นำเข้า DataSource จาก TypeORM
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../entities/user";
import { ObjectId } from "mongodb";

// ฟังก์ชันสำหรับสมัครสมาชิก
export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
  const existingUser = await AppDataSource.getRepository(User).findOneBy({ username });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(password, 10);

  // สร้างผู้ใช้ใหม่
  const user = AppDataSource.getRepository(User).create({ username, password: hashedPassword });
  await AppDataSource.getRepository(User).save(user);

  return res.status(201).json({ message: "User registered successfully" });
};

// ฟังก์ชันสำหรับเข้าสู่ระบบ
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
  const user = await AppDataSource.getRepository(User).findOneBy({ username });
  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // เก็บ userId ลงใน session
  req.session.userId = user._id?.toString(); 

  return res.status(200).json({ message: "Logged in successfully" });
};



// ฟังก์ชันสำหรับตรวจสอบสถานะการเข้าสู่ระบบ
export const status = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // ตรวจสอบข้อมูลผู้ใช้จาก session
  const user = await AppDataSource.getRepository(User).findOneBy({ _id: new ObjectId(req.session.userId) });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "Authenticated", user });
};



// ฟังก์ชันสำหรับออกจากระบบ
export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};










import { Request, Response } from "express";
import { AppDataSource } from "../config/configDB"; // นำเข้า DataSource จาก TypeORM
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../entities/user";
import { Token } from "../entities/session";
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

  // สร้าง token แบบสุ่ม
  const token = crypto.randomBytes(64).toString("hex");

  // ลบ token เก่าที่มีอยู่ (ถ้ามี)
  await AppDataSource.getRepository(Token).delete({ userId: user._id?.toString() });

  // บันทึก token ใหม่ใน MongoDB
  const newToken = AppDataSource.getRepository(Token).create({ userId: user._id?.toString(), token, createdAt: new Date() });
  await AppDataSource.getRepository(Token).save(newToken);

  return res.status(200).json({ message: "Logged in successfully", token });
};


// ฟังก์ชันสำหรับตรวจสอบสถานะการเข้าสู่ระบบ
export const status = async (req: Request, res: Response) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // ตรวจสอบ token ในฐานข้อมูล
  const foundToken = await AppDataSource.getRepository(Token).findOneBy({ token });
  if (!foundToken) {
    return res.status(401).json({ message: "Invalid token" });
  }

  return res.status(200).json({ message: "Authenticated", userId: foundToken.userId });
};


// ฟังก์ชันสำหรับออกจากระบบ
export const logout = async (req: Request, res: Response) => {
  const userId = req.user; // ดึง userId ที่ถูกตั้งค่าใน middleware

  console.log("Logging out user:", userId); // เพิ่ม log ที่นี่

  if (!userId) {
    return res.status(200).json({ message: "Logged out successfully" }); // ส่งข้อความ logout โดยไม่มี token
  }

  // ลบ token ออกจากฐานข้อมูล
  await AppDataSource.getRepository(Token).delete({ userId });

  return res.status(200).json({ message: "Logged out successfully" });
};









// ฟังก์ชันสำหรับทดสอบ
export const test = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const foundToken = await AppDataSource.getRepository(Token).findOneBy({ token });
    if (!foundToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ตรวจสอบ userId
    const userId = foundToken.userId;
    const user = await AppDataSource.getRepository(User).findOneBy({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User data retrieved successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
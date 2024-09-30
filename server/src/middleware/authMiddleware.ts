import { Request, Response, NextFunction } from "express";
import { Token } from "../entities/session"; // นำเข้า entity Token
import { AppDataSource } from "../config/configDB"; // นำเข้า DataSource

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers['authorization']?.split(' ')[1]; // ดึง token จาก header

  // ถ้าไม่มี token จะไปที่ middleware ถัดไป
  if (!token) {
    return next(); // หากไม่มี token ให้เรียกใช้ next() โดยตรง
  }

  // ตรวจสอบ token ในฐานข้อมูล
  const foundToken = await AppDataSource.getRepository(Token).findOneBy({ token });
  if (!foundToken) {
    // หาก token ไม่ถูกต้องให้ส่งสถานะ 401
    res.status(401).json({ message: "Invalid token" });
    return; // ยุติการทำงานของฟังก์ชัน
  }

  // หาก token ถูกต้อง ให้เพิ่มข้อมูลผู้ใช้ใน req
  req.user = foundToken.userId; // เก็บ userId ใน req

  next(); // เรียกใช้ next() เพื่อไปยัง middleware ถัดไป
};

import { Request, Response, NextFunction } from "express";

// Middleware สำหรับตรวจสอบการเข้าสู่ระบบ
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.userId) {
    res.status(401).json({ message: "Not authenticated" });
    return; // คืนค่าเพื่อไม่ให้มีการดำเนินการต่อ
  }
  
  // ถ้ามี userId ให้ส่งไปยัง middleware ถัดไป
  next(); // เรียก next() เพื่อดำเนินการต่อ
};

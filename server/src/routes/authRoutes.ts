import { Router, Request, Response } from "express";
import { register, login, logout, status } from "../controllers/authController"; 
import { authenticate } from "../middleware/authMiddleware"; // นำเข้า middleware authenticate

const router = Router();

// เส้นทางสำหรับการสมัครสมาชิก
router.post("/register", (req: Request, res: Response) => {
  register(req, res);
});

// เส้นทางสำหรับเข้าสู่ระบบ
router.post("/login", (req: Request, res: Response) => {
  login(req, res);
});

// เส้นทางสำหรับตรวจสอบสถานะการเข้าสู่ระบบ (ต้องมีการ authenticate)
router.get("/status", authenticate, (req: Request, res: Response) => {
  status(req, res);
});

// เส้นทางสำหรับออกจากระบบ
router.post("/logout", authenticate, (req: Request, res: Response) => {
  logout(req, res);
});




export default router;

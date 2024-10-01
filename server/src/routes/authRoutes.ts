import { Router, Request, Response } from "express";
import { register, login, logout, status } from "../controllers/authController"; 
import { authenticate } from "../middleware/authMiddleware"; 

const router = Router();

router.post("/register", (req: Request, res: Response) => {
  register(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  login(req, res);
});

router.get("/status", authenticate, (req: Request, res: Response) => {
  status(req, res);
});

router.post("/logout", authenticate, (req: Request, res: Response) => {
  logout(req, res);
});




export default router;

import { Router } from "express";
import { addAccount, deleteAccount } from "../controllers/accountController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();


// เพิ่มบัญชี
router.post("/add", authenticate, addAccount);

// ลบบัญชี
router.delete("/delete/:id", authenticate, deleteAccount);

// ส่งออก Router
export default router;

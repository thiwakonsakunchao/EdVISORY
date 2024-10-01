import { Router } from "express";
import { addCategory, deleteCategory } from "../controllers/categoryController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();


// เพิ่มบัญชี
router.post("/add", authenticate, addCategory);

// ลบบัญชี
router.delete("/delete/:id", authenticate, deleteCategory);

// ส่งออก Router
export default router;

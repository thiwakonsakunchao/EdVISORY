import { Router } from "express";
import { addCategory, deleteCategory } from "../controllers/categoryController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();



router.post("/add", authenticate, addCategory);


router.delete("/delete/:id", authenticate, deleteCategory);


export default router;

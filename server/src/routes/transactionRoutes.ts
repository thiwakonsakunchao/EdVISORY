import { Router } from "express";
import { addTransaction, deleteTransaction } from "../controllers/transactionController";
import { authenticate } from "../middleware/authMiddleware"; 

const router = Router();

router.post("/add", authenticate, addTransaction);

router.delete("/:id", authenticate, deleteTransaction);

export default router;

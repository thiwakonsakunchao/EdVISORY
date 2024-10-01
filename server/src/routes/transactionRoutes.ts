import { Router } from "express";
import { addTransaction, deleteTransaction, getAllTransactions } from "../controllers/transactionController";
import { authenticate } from "../middleware/authMiddleware"; 

const router = Router();

router.post("/add", authenticate, addTransaction);

router.delete("/:id", authenticate, deleteTransaction);

router.get("/", authenticate, getAllTransactions);

export default router;

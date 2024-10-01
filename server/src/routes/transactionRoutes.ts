import { Router } from "express";
import { addTransaction, deleteTransaction } from "../controllers/transactionController";
import { authenticate } from "../middleware/authMiddleware"; 

const router = Router();

// Create a new transaction
router.post("/add", authenticate, addTransaction);

// Delete a transaction
router.delete("/:id", authenticate, deleteTransaction);

export default router;

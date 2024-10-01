import { Router } from "express";
import { addSlipToTransaction, addTransaction, deleteTransaction, getAllTransactions, removeSlipFromTransaction } from "../controllers/transactionController";
import { authenticate } from "../middleware/authMiddleware"; 
import { uploadSingle } from "../middleware/slipMiddleware";

const router = Router();

router.post("/add", authenticate, uploadSingle, addTransaction);

router.delete("/:id", authenticate, deleteTransaction);

router.get("/", authenticate, getAllTransactions);

router.post("/add-slip/:id", authenticate, uploadSingle, addSlipToTransaction);

router.delete("/remove-slip/:id", authenticate, removeSlipFromTransaction);

export default router;

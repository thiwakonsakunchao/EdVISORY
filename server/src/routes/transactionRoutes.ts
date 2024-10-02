import { Router } from "express";
import { addSlipToTransaction, addTransaction, changeAccount, changeCategory, deleteTransaction, getAllTransactions, removeSlipFromTransaction, updateDescription } from "../controllers/transactionController";
import { authenticate } from "../middleware/authMiddleware"; 
import { uploadSingle } from "../middleware/slipMiddleware";

const router = Router();

router.post("/add", authenticate, uploadSingle, addTransaction);

router.delete("/delete/:id", authenticate, deleteTransaction);

router.get("/", authenticate, getAllTransactions);

router.post("/add-slip/:id", authenticate, uploadSingle, addSlipToTransaction);

router.delete("/remove-slip/:id", authenticate, removeSlipFromTransaction);

router.post("/:id/description", authenticate, updateDescription);

router.patch("/:id/change/account", authenticate, changeAccount)

router.patch("/:id/change/category", authenticate, changeCategory)

export default router;

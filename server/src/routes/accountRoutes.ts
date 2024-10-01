import { Router } from "express";
import { addAccount, deleteAccount } from "../controllers/accountController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();


router.post("/add", authenticate, addAccount);

router.delete("/delete/:id", authenticate, deleteAccount);



export default router;

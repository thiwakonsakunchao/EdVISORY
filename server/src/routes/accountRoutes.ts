import { Router } from "express";
import { addAccount, deleteAccount, getAllAccount } from "../controllers/accountController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();


router.post("/add", authenticate, addAccount);

router.delete("/delete/:id", authenticate, deleteAccount);

router.get("/", authenticate, getAllAccount)



export default router;

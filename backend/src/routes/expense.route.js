import express from "express"
import { verifyToken } from "../middlewares/authMiddleware.js";
import { addExpense, getGroupExpenses } from "../controllers/expense.controller.js";

const router = express.Router();

router.post("/:groupId", verifyToken, addExpense);
router.get("/:groupId", verifyToken, getGroupExpenses);

export default router;
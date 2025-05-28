import express from "express"
import { getUserId, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

const router=express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/me",verifyToken,getUserId)

export default router
import express from "express"
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createGroup, deleteGroup, editGroup, getGroupDetails, getUserGroups, inviteMember } from "../controllers/group.controller.js";


const router = express.Router();

router.post("/", verifyToken, createGroup);
router.get("/groups", verifyToken, getUserGroups);
router.put("/:groupId", verifyToken, editGroup);
router.delete("/:groupId", verifyToken, deleteGroup);
router.post("/:groupId/invite", verifyToken, inviteMember);
router.get("/:groupId", verifyToken, getGroupDetails);

export default router;
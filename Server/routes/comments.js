import express from "express"
const router = express.Router()
import {createComment, updateComment, deleteComment, getAllPostComments } from "../controllers/comments.js";
import { verifyToken } from "../middleware/auth.js";

router.post("/create", verifyToken, createComment );
router.put("/:id", verifyToken, updateComment )
router.delete("/:id", verifyToken, deleteComment)
router.get("/post/:postId", getAllPostComments )




export default router;
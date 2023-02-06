import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
import * as comment from "./comment.controller";

const commentRouter = Router();

commentRouter.post("/create-comment", verifyToken, comment.createComment);

commentRouter.get("/:postId", verifyToken, comment.getAllCommentsUnderAPost);

commentRouter.delete("/:commentId", verifyToken, comment.deleteComment);

commentRouter.get("/:commentId", verifyToken, comment.getSingleComment);

export default commentRouter;

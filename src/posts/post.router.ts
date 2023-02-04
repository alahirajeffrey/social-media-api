import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
import * as post from "./posts.contoller";

const postRouter = Router();

postRouter.post("/create-post", verifyToken, post.createPost);

postRouter.delete("/:postId", verifyToken, post.deletePost);

postRouter.get("/profile-posts/:profileId", verifyToken, post.getAllUsersPosts);

postRouter.get("/:postId", verifyToken, post.getPostById);

export default postRouter;

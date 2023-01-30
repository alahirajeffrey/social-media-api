import { Router } from "express";
import * as profile from "./profile.controller";
import { verifyToken } from "../utils/verifyToken";

const profileRouter = Router();

profileRouter.post("/create-profile", verifyToken, profile.createProfile);

profileRouter.get("/:email", profile.getProfileByEmail);

profileRouter.patch(
  "/follow/:profileId/:followerId",
  verifyToken,
  profile.followProfile
);

profileRouter.patch(
  "/unfollow/:profileId/:followingId",
  verifyToken,
  profile.unfollowProfile
);

// profileRouter.get("/followers/:profileId", verifyToken, profile.getFollowers);

// profileRouter.get(
//   "/following/:profileId",
//   verifyToken,
//   profile.getPeopleFollowed
// );

export default profileRouter;

import { Router } from "express";
import * as profile from "./profile.controller";

const profileRouter = Router();

profileRouter.post("/create-profile", profile.createProfile);

profileRouter.get("/:profileId", profile.getProfileById);

profileRouter.patch("/follow/:profileId/:followerId", profile.followProfile);

profileRouter.patch(
  "/unfollow/:profileId/:followingId",
  profile.unfollowProfile
);

profileRouter.get("/followers/:profileId", profile.getFollowers);

profileRouter.get("/following/:profileId", profile.getPeopleFollwed);

export default profileRouter;

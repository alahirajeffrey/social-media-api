import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../interfaces/response.interface";
import { json } from "stream/consumers";

const prisma = new PrismaClient();

// use pagination for response
// create a middleware to check if a profile exists

/**
 * creates a profile for a user
 * @param req : request
 * @param res :response
 * @returns :  status code and profile object
 */
export const createProfile = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { mobileNumber, profilePicUri, fullname, userId, bio, email } =
      req.body;

    //check if user already has a profile
    const profileAlreadyExists = await prisma.profile.findFirst({
      where: { userId: userId },
    });
    if (profileAlreadyExists)
      return res.status(400).json({ message: "user already has a profile" });

    // create profile
    const newProfile = await prisma.profile.create({
      data: {
        bio: bio,
        mobileNumber: mobileNumber,
        profilePicUri: profilePicUri,
        userId: userId,
        fullname: fullname,
        email: email,
      },
    });
    return res.status(201).json(newProfile);
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

/**
 * get user profile by id
 * @param req : request object
 * @param res : response object
 * @returns : status code and profile object
 */
export const getProfileByEmail = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const email = req.params.email;

    const profile = await prisma.profile.findFirst({ where: { email: email } });
    if (!profile)
      return res.status(404).json({ message: "profile does not exist" });
    return res.status(200).json(profile);
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

/**
 * follow another profile
 * @param req : request object
 * @param res : rsponse object
 * @returns : status code and message
 */
export const followProfile = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { profileId, followerId } = req.params;

    // check if profile exists
    const profileExists = await prisma.profile.findFirst({
      where: { id: profileId },
    });

    const follower = await prisma.profile.findFirst({
      where: { id: followerId },
    });

    if (profileExists) {
      // get current followers of the profile
      const profileFollowers = profileExists.followers;
      const numberOfFollowersBefore = profileFollowers.length;

      // check to see if the profile is already followed
      const alreadyFollowiingProfile = profileFollowers.find(
        (id) => id === profileId
      );
      if (alreadyFollowiingProfile)
        return res.status(400).json({
          message: `you can only follow ${profileExists.fullname} once`,
        });

      // add followeId to the list of the profile followers
      profileExists.followers.push(followerId);
      const numberOfFollowersAfter = profileExists.followers.length;

      // update profile
      await prisma.profile.update({
        where: { id: profileExists.id },
        data: { followers: profileExists.followers },
      });

      follower.following.push(profileExists.id);
      await prisma.profile.update({
        where: { id: followerId },
        data: { following: follower.following },
      });

      return res.status(200).json({
        message: `you are now following ${profileExists.fullname}`,
        numberOfFollowersBefore: numberOfFollowersBefore,
        numberOfFollowersAfter: numberOfFollowersAfter,
      });
    }
    return res.status(404).json({ message: "profile does not exist" });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

/**
 * unfollows another profile
 * @param req : request object
 * @param res : response object
 * @returns : status code and message
 */
export const unfollowProfile = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { profileId, followingId } = req.params;

    // check if profile exists
    const followingExists = await prisma.profile.findFirst({
      where: { id: followingId },
    });

    if (!followingExists)
      return res.status(404).json({ message: "profile does not exist" });

    // get profiles being followed
    const profile = await prisma.profile.findFirst({
      where: { id: profileId },
    });

    const following = profile.following;
    const numberOfFollowingBefore = following.length;

    // check if user follows the profile
    const isProfileFollowed = following.find((id) => id === followingId);

    if (!isProfileFollowed)
      return res
        .status(400)
        .json({ message: `you are not following ${followingExists.fullname}` });

    // update list of followers and following both profiles
    const followerRemoved = followingExists.followers.filter(
      (id) => id !== profileId
    );
    await prisma.profile.update({
      where: { id: followingExists.id },
      data: { following: followerRemoved },
    });

    const unfollowed = profile.following.filter((id) => id !== followingId);
    const numberOfFollowingAfter = unfollowed.length;

    await prisma.profile.update({
      where: { id: profileId },
      data: { following: unfollowed },
    });

    return res.status(200).json({
      message: `you are no longer following ${followingExists.fullname}`,
      numberOfFollowingBefore: numberOfFollowingBefore,
      numberOfFollowingAfter: numberOfFollowingAfter,
    });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

// /**
//  * get all people currently following profile
//  * @param req : request object
//  * @param res : response object
//  * @returns : status code and list of profiles
//  */
// export const getFollowers = async (
//   req: Request,
//   res: Response
// ): Promise<Response<ApiResponse>> => {
//   try {
//     const profileExists = await prisma.profile.findFirst({
//       where: { id: req.body.profileId },
//     });

//     if (!profileExists)
//       return res.status(404).json({ message: "profile does not exist" });

//     // get list of follower ids
//     const followerIds = profileExists.followers;
//     const followers = [];

//     // loop through list of followerIds and get profile of followers
//     for (let follower = 0; follower <= followerIds.length - 1; follower++) {
//       followers.push(
//         await prisma.profile.findFirst({ where: { id: followerIds[follower] } })
//       );
//     }

//     return res.status(200).json(followers);
//   } catch (error: any) {
//     return res.status(500).send({ error: error.message });
//   }
// };

// /**
//  * gets profiles of people followed
//  * @param req : request object
//  * @param res : response object
//  * @returns : profile of people followed
//  */
// export const getPeopleFollowed = async (
//   req: Request,
//   res: Response
// ): Promise<Response<ApiResponse>> => {
//   try {
//     const profileExists = await prisma.profile.findFirst({
//       where: { id: req.body.profileId },
//     });

//     if (!profileExists)
//       return res.status(404).json({ message: "profile does not exist" });

//     // get list of profiles followed
//     const followingIds = profileExists.following;
//     const follows = [];

//     // loop through list of people followed and get profiles
//     for (let following = 0; following <= followingIds.length - 1; following++) {
//       follows.push(
//         await prisma.profile.findFirst({
//           where: { id: followingIds[following] },
//         })
//       );
//     }

//     return res.status(200).json(follows);
//   } catch (error: any) {
//     return res.status(500).send({ error: error.message });
//   }
// };

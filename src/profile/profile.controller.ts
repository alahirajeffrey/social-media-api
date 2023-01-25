import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../interfaces/response.interface";

const prisma = new PrismaClient();

// use pagination for response
// protect routes
// remember to sanitize and validate income data
// create a seperate file for prisma client use to make queries through application

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
    const { mobileNumber, profilePicUri, fullname, userId, bio } = req.body;
    const newProfile = prisma.profile.create({
      data: {
        bio: bio,
        mobileNumber: mobileNumber,
        profilePicUri: profilePicUri,
        userId: userId,
        fullname: fullname,
      },
    });
    return res.status(201).send(newProfile);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * get user profile by id
 * @param req : request object
 * @param res : response object
 * @returns : status code and profile object
 */
export const getProfileById = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const profileId = req.params.profileId;
    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
      },
    });
    return res.status(20).send(profile);
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

/**
 * follow another profile
 * @param req : request object
 * @param res : rsponse object
 * @returns : status code and profile object
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

    if (profileExists) {
      // get current followers of the profile
      const profileFollowers = profileExists.followers;

      // check to see if the profile is already followed
      const alreadyFollowiingProfile = profileFollowers.find(
        (id) => id === profileId
      );
      if (alreadyFollowiingProfile)
        return res.status(400).json({
          message: `you cannot follow ${profileExists.fullname} once`,
        });

      // add followeId to the list of the profile followers
      profileExists.followers.push(followerId);
      return res
        .status(200)
        .json({ message: `you are now following ${profileExists.fullname}` });
    }
    return res.status(404).json({ message: "profile does not exist" });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

export const unfollowProfile = async (req: Request, res: Response) => {
  try {
    //check if profile to be followed exists
    //
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

export const getPeopleFollwed = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

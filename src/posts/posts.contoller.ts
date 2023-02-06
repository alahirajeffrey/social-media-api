import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ApiResponse } from "../interfaces/response.interface";

const prisma = new PrismaClient();

/**
 * create a post
 * @param req : request object
 * @param res : response object
 * @returns : a post object and status code
 */
export const createPost = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { profileId, title, content } = req.body;
    const post = await prisma.post.create({
      data: {
        profileId: profileId,
        title: title,
        content: content,
      },
    });
    return res.status(201).json(post);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * get a post by id
 * @param req : request object
 * @param res : response object
 * @returns : post object and status code
 */
export const getPostById = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const postId = req.params.postId;
    const post = await prisma.post.findFirst({ where: { id: postId } });
    if (!post) return res.status(404).json({ message: "post not found" });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * get all posts belonging to a user
 * @param req: request object
 * @param res: response object
 * @returns: returns a list of posts and status code
 */
export const getAllUsersPosts = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const profileId = req.params.profileId;

    const posts = await prisma.post.findMany({
      where: { profileId: profileId },
    });
    if (!posts)
      return res.status(404).json({ message: "there are no posts to show" });

    return res.status(200).send(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * delete a post
 * @param req : request object
 * @param res : response object
 * @returns : status code and message
 */
export const deletePost = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const postId = req.params.postId;
    const profileId = req.body.profileId;

    const post = await prisma.post.findFirst({ where: { id: postId } });
    //ensure only a post owner can delete a post
    if (post.profileId !== profileId)
      return res
        .status(403)
        .json({ message: "you can only delete your own post" });

    await prisma.post.delete({ where: { id: postId } });
    return res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

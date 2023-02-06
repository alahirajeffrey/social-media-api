import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../interfaces/response.interface";

const prisma = new PrismaClient();

/**
 * create a comment under a post
 * @param req : request object
 * @param res : response object
 * @returns : status code and comment object
 */
export const createComment = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { postId, content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        postId: postId,
        content: content,
      },
    });
    return res.status(201).json(comment);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * return all comments under a post
 * @param req : request object
 * @param res : response object
 * @returns : status code and list of comments
 */
export const getAllCommentsUnderAPost = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const postId = req.params.postId;

    const postExists = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!postExists)
      return res.status(404).json({ message: "post does not exist" });

    const commentsUnderPost = await prisma.comment.findMany({
      where: { postId: postId },
    });

    return res.status(200).json(commentsUnderPost);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * delete a comment
 * @param req : request object
 * @param res : response object
 * @returns : status code and message
 */
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const commentId = req.params.commentId;
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.status(400).json({ message: "comment deleted" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * get a single comment
 * @param req : request object
 * @param res : response object
 * @returns : status code and comment object
 */
export const getSingleComment = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const commentId = req.params.commentId;
    const comment = await prisma.comment.findFirst({
      where: { id: commentId },
    });

    return res.status(200).json(comment);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

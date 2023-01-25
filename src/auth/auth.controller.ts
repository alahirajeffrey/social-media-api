import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { ApiResponse } from "../interfaces/response.interface";
import * as jwt from "jsonwebtoken";

const JWTSECRET = process.env.JWT_SECRET || "secret";
const EXPIRESIN = process.env.EXPIRESIN || "15m";

// remember to sanitize and validate income data

const prisma = new PrismaClient();

/**
 * checks if user exists or not
 * @param userEmail : string
 * @returns user object or null
 */
const checkUserExistsByEmail = async (userEmail: string) => {
  return await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
  });
};

/**
 * registers a new user
 * @param req : Request
 * @param res : Response
 * @returns status code and user object
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const userExists = await checkUserExistsByEmail(email);
    if (userExists)
      return res
        .status(403)
        .json({ message: "A user with that email already exists" });

    // hash user password
    const hashedPassword = await bcrypt.hash(password, 12);

    // save user to db
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    // ensure only required details are returned
    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      isVerified: newUser.isVerified,
    });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

/**
 * logs a user into his account
 * @param req : Requets
 * @param res : Response
 * @returns : status code and jwt access token
 */
export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { email, password } = req.body;
    //check if user exists
    const userExists = await checkUserExistsByEmail(email);
    if (!userExists)
      return res.status(400).send({ message: "User does not exist" });

    // check if password is correct
    const passwordMatches = await bcrypt.compare(password, userExists.password);
    if (!passwordMatches)
      return res.status(403).send({ message: "Incorrect password" });

    //generate access token
    const accessToken = jwt.sign(
      { id: userExists.id, email: userExists.email },
      JWTSECRET,
      { expiresIn: EXPIRESIN }
    );

    return res.status(200).send({ accessToken: accessToken });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

/**
 * changes password of a logged in user
 * @param req : Request
 * @param res : response
 * @returns : status code and message
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword, email } = req.body;
    // check if user exists
    const userExists = await checkUserExistsByEmail(email);
    if (!userExists)
      return res.status(400).send({ message: "User does not exist" });

    // compare passwords
    const passwordMatches = await bcrypt.compare(
      oldPassword,
      userExists.password
    );
    if (!passwordMatches)
      return res.status(403).send({ message: "Incorrect password" });

    // hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // update password
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: newPasswordHash,
      },
    });

    return res.status(200).send({ message: "Password successfully changed" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).send({ error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {};

export const sendVerificationMail = async (req: Request, res: Response) => {};

export const verifyEmail = async (req: Request, res: Response) => {};

export const logoutUser = async (req: Request, res: Response) => {};

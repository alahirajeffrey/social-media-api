import { check, body } from "express-validator";

export const registrationValidation = [
  check("email", "email address must be valid")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  check("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
    .withMessage(
      "Password must be atleast 8 characters and contain atleast one uppercase, one lowercase and one special character"
    ),
];

export const loginValidation = [
  check("email", "email address must be valid")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
];

export const changePasswordValidation = [
  check("newPassword")
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
    .withMessage(
      "Password must be atleast 8 characters and contain atleast one uppercase, one lowercase and one special character"
    ),
  check("email", "email address must be valid").isEmail(),
];

export const createProfileValidation = [
  check("fullname").isString(),
  check("mobileNumber").isString(),
  check("bio").isString(),
  check("profilePicUri").isURL(),
  check("email").isEmail(),
  check("userId").isString(),
];

export const createPostValidation = [
  check("profileId").isString(),
  check("title").isString(),
  check("content").isString(),
];

export const createCommentValidation = [
  check("postId").isString(),
  check("content").isString(),
];

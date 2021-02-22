import express from "express";
import Joi from "joi";
import { validate } from "../helpers/validate.js";
import { avatarUpdate } from "../helpers/avatarUpdate.js";
import {
  updateSubscription,
  getCurrentUser,
  updateAvatar,
} from "./user.controller.js";
import { authorize } from "../auth/auth.controller.js";

const router = express.Router();

const userSchema = Joi.object({
  subscription: Joi.string().valid("free", "pro", "premium").required(),
});

const updateUserAvatarSchema = Joi.object({
  avatar: Joi.string().required(),
});

router.get("/current", authorize, getCurrentUser);
router.patch("/", authorize, validate(userSchema), updateSubscription);
router.patch(
  "/avatars",
  authorize,
  validate(updateUserAvatarSchema),
  avatarUpdate().single("avatar"),
  updateAvatar
);

export const userRouter = router;

import express from "express";
import Joi from "joi";
import { validate } from "../helpers/validate.js";
import { register, logIn, logOut, authorize } from "./auth.controller.js";

const router = express.Router();

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/register", validate(authSchema), register);

router.post("/login", validate(authSchema), logIn);

router.post("/logout", authorize, logOut);

export const authRouter = router;

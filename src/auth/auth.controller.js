import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { userModel } from "../users/user.model.js";
import { sendMail } from "../email/email.js";
import { generateAvatar } from "../helpers/avatarGenerator.js";
import { v4 } from "uuid";

export async function register(req, res, next) {
  try {
    const token = v4();
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }
    await sendMail(token, email);

    const passwordHash = await bcryptjs.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );
    const newUser = await userModel.create({
      email,
      password: passwordHash,
      avatarURL: await generateAvatar(next),
      verificationToken: token,
    });
    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function logIn(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    if (!user.verify) {
      return res.status(400).json({
        message:
          "User is not verificated. Please check your email for verificate",
      });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const loggedInUser = await userModel.findByIdAndUpdate(
      user._id,
      { token },
      {
        new: true,
      }
    );
    res.status(200).json({
      token,
      user: {
        email: loggedInUser.email,
        subscription: loggedInUser.subscription,
        avatarURL: loggedInUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function authorize(req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(payload.uid);
    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
}
export async function logOut(req, res, next) {
  try {
    await userModel.findByIdAndUpdate(
      req.user._id,
      { token: "" },
      {
        new: true,
      }
    );
    return res.status(204).json();
  } catch (error) {
    return res.status(401).json({ message: error });
  }
}
export async function verify(req, res, next) {
  try {
    const { verificationToken } = req.params;
    const user = await userModel.findOne({ verificationToken });
    if (user) {
      await user.updateOne({ verify: true, verificationToken: null });
      return res.status(200).json({
        message: "Verification successful",
      });
    }
    return res.status(404).json({
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
}

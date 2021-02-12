import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { userModel } from "../users/user.model.js";

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }
    const passwordHash = await bcryptjs.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );
    const newUser = await userModel.create({
      email,
      password: passwordHash,
    });
    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
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

import { userModel } from "./user.model.js";
import path from "path";
import fs from "fs/promises";
import { getPaths } from "../helpers/utils.js";
const { __dirname } = getPaths(import.meta.url);

export async function updateSubscription(req, res, next) {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
}
export async function getCurrentUser(req, res, next) {
  try {
    const user = req.user;
    const { email, subscription, avatarURL } = user;
    return res.status(200).json({
      email: email,
      subscription: subscription,
      avatarURL: avatarURL,
    });
  } catch (error) {
    next(error);
  }
}
export async function updateAvatar(req, res, next) {
  try {
    const {
      file: { filename },
      user: { _id, avatarURL },
    } = req;
    const oldAvatar = path.parse(avatarURL).base;

    await fs.unlink(path.join(__dirname, `../../public/images/${oldAvatar}`));

    const newAvatar = `http://localhost:${process.env.PORT}/images/${filename}`;
    const updatedUser = await userModel.findByIdAndUpdate(
      _id,
      { $set: { avatarURL: newAvatar } },
      { new: true }
    );

    return res.status(200).json({ avatarURL: updatedUser.avatarURL });
  } catch (error) {
    next(error);
  }
}

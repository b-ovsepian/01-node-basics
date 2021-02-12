import { userModel } from "./user.model.js";

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
    const { email, subscription } = user;
    return res.status(200).json({
      email: email,
      subscription: subscription,
    });
  } catch (error) {
    next(error);
  }
}

import AvatarGenerator from "avatar-generator";
import { getPaths } from "./utils.js";
import fs from "fs/promises";
import { join } from "path";
const { __dirname } = getPaths(import.meta.url);

export async function generateAvatar(next) {
  try {
    const avatar = new AvatarGenerator();
    const fileName = `${Date.now()}.png`;
    const image = await avatar.generate(fileName, "male");

    await image.png().toFile(join(__dirname, `../../tmp/${fileName}`));

    await fs.copyFile(
      join(__dirname, `../../tmp/${fileName}`),
      join(__dirname, `../../public/images/${fileName}`)
    );

    await fs.unlink(join(__dirname, `../../tmp/${fileName}`));

    return `http://localhost:${process.env.PORT}/images/${fileName}`;
  } catch (error) {
    next(error);
  }
}

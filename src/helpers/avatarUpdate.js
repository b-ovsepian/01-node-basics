import multer from "multer";
import path from "path";
const { join } = path;
const { diskStorage } = multer;
import { getPaths } from "./utils.js";
const { __dirname } = getPaths(import.meta.url);

export function avatarUpdate() {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      cb(null, join(__dirname, "../../public/images"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}.png`);
    },
  });

  return multer({ storage });
}

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { getPaths } from "./helpers/utils.js";
import path from "path";

import { contactsRouter } from "./contacts/contacts.router.js";
import { userRouter } from "./users/user.router.js";
import { authRouter } from "./auth/auth.router.js";

export class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initConfig();
    await this.initDatabase();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initConfig() {
    const { __dirname } = getPaths(import.meta.url);
    dotenv.config({ path: path.join(__dirname, "../.env") });
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });

      console.log("Database connection successful");
    } catch (error) {
      console.log(`MongoDB error: ${error.message}`);
      process.exit(1);
    }
  }

  initMiddlewares() {
    this.server.use(cors());
    this.server.use(morgan("dev"));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
  }

  initRoutes() {
    const { __dirname } = getPaths(import.meta.url);

    this.server.use(`/public/images`, express.static(__dirname + "../public"));
    this.server.use("/contacts", contactsRouter);
    this.server.use("/auth", authRouter);
    this.server.use("/users", userRouter);
  }

  initErrorHandling() {
    this.server.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      res.status(statusCode).send(err.message);
    });
  }

  startListening() {
    const { PORT } = process.env;
    this.server.listen(PORT, () => {
      console.log("Server started listening on port", PORT);
    });
  }
}

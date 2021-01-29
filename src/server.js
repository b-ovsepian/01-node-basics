import express from "express";
import cors from "cors";
import morgan from "morgan";

import { contactsController } from "./contacts/contacts.controller.js";

export class ContactsServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(cors());
    this.server.use(morgan("dev"));
    this.server.use(express.json());
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsController);
  }

  initErrorHandling() {
    this.server.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      res.status(statusCode).send(err.message);
    });
  }

  startListening() {
    this.server.listen(3000, () => {
      console.log("Server started listening on port", 3000);
    });
  }
}

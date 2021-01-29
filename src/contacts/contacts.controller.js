import express from "express";
import * as contactModel from "./contact.model.js";
import { validate } from "../helpers/validate.js";
import Joi from "joi";

const controller = express.Router();

const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

controller.get("/", contactModel.listContacts);
controller.get("/:id", contactModel.getContactById);
controller.post("/", validate(createContactSchema), contactModel.addContact);
controller.delete("/:id", contactModel.removeContact);
controller.patch(
  "/:id",
  validate(updateContactSchema),
  contactModel.updateContact
);

export const contactsController = controller;

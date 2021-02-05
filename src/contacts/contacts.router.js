import express from "express";
import * as contactsController from "./contacts.controller.js";
import * as validate from "./contacts.validator.js";

const router = express.Router();

router.get("/", contactsController.listContacts);
router.get(
  "/:id",
  validate.validateContactID,
  contactsController.getContactById
);
router.post("/", validate.validateNewContact, contactsController.addContact);
router.delete(
  "/:id",
  validate.validateContactID,
  contactsController.removeContact
);
router.patch(
  "/:id",
  validate.validateUpdateContact,
  contactsController.updateContact
);

export const contactsRouter = router;

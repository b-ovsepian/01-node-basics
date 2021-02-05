import Joi from "joi";
import mongoose from "mongoose";
const {
  Types: { ObjectId },
} = mongoose;

function validateNewContact(req, res, next) {
  const createContactRules = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(8).required(),
    subscription: Joi.string().required(),
    password: Joi.string().min(6).max(20).required(),
    token: Joi.string().token(),
  });

  const validatedContact = createContactRules.validate(req.body);

  if (validatedContact.error) {
    return res
      .status(400)
      .send({ message: validatedContact.error.details[0].message });
  }

  next();
}

function validateUpdateContact(req, res, next) {
  const updateContactRules = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().min(8),
    subscription: Joi.string(),
    password: Joi.string().min(6).max(20),
  }).min(1);

  const validatedContact = updateContactRules.validate(req.body);

  if (validatedContact.error) {
    return res
      .status(400)
      .send({ message: validatedContact.error.details[0].message });
  }

  next();
}

function validateContactID(req, res, next) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "invalid id" });
  }

  next();
}

export { validateNewContact, validateUpdateContact, validateContactID };

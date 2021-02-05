import { contactModel } from "./contacts.model.js";

async function listContacts(req, res, next) {
  try {
    const data = await contactModel.find();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  try {
    const { id } = req.params;
    const contact = await contactModel.findOne({ _id: id });

    return contact
      ? res.status(200).json(contact)
      : res.status(404).send({ message: "Not found" });
  } catch (error) {
    next(error);
  }
}

async function removeContact(req, res, next) {
  try {
    const { id } = req.params;
    const removedContact = await contactModel.findByIdAndDelete(id);

    if (removedContact) {
      return res.status(200).json({ message: "contact deleted" });
    }
    return res.status(404).send({ message: "Not found" });
  } catch (error) {
    next(error);
  }
}

async function addContact(req, res, next) {
  try {
    const newContact = await contactModel.create(req.body);

    return res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    const updatedContact = await contactModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (updatedContact) {
      return res.status(200).send(updatedContact);
    }
    return res.status(404).send({ message: "Not found" });
  } catch (error) {
    next(error);
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

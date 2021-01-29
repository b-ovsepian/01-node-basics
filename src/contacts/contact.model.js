import { default as fsWithCallbacks } from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const fs = fsWithCallbacks.promises;
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = path.join(__dirname, "../db/contacts.json");

async function listContacts(req, res, next) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const parsedData = JSON.parse(data);

    return res.status(200).json(parsedData);
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  try {
    const { id } = req.params;
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const contact = contacts.find((contact) => contact.id == id);

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
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const contact = contacts.find((contact) => contact.id == id);

    if (contact) {
      const newContactsList = contacts.filter((contact) => contact.id !== id);
      fs.writeFile(contactsPath, JSON.stringify([...newContactsList]));
      return res.status(200).json({ message: "contact deleted" });
    }
    return res.status(404).send({ message: "Not found" });
  } catch (error) {
    next(error);
  }
}

async function addContact(req, res, next) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const newContact = {
      id: uuidv4(),
      ...req.body,
    };
    const contacts = [...JSON.parse(data), newContact];
    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");

    return res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const contact = contacts.find((contact) => contact.id == id);

    if (contact) {
      const updatedContacts = contacts.map((contact) =>
        contact.id == id ? { ...contact, ...req.body } : contact
      );
      fs.writeFile(
        contactsPath,
        JSON.stringify(updatedContacts, null, 2),
        "utf-8"
      );

      return res
        .status(200)
        .send(updatedContacts.find((contact) => contact.id == id));
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

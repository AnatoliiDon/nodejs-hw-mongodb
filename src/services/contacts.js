import ContactCollection from '../db/models/contacts.js';

export const getContacts = () => ContactCollection.find();
export const getContactById = (id) => ContactCollection.findById(id);

export const addData = (payload) => ContactCollection.create(payload);

export const updateContact = async (_id, payload, options = {}) => {
  const { upsert = false } = options;
  const contact = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
    upsert,
    includeResultMetadata: true,
  });

  if (!contact || !contact.value) {
    return null;
  }
  const isNew = Boolean(contact.lastErrorObject.upserted);

  return {
    isNew,
    data: contact.value,
  };
};

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);

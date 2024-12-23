import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: String,
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', (error, doc, next) => {
  error.status = 400;
  next();
});

contactSchema.pre('findOneAndUpdate', function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
});

contactSchema.post('findOneAndUpdate', (error, doc, next) => {
  error.status = 400;
  next();
});

const ContactCollection = model('contact', contactSchema);

export default ContactCollection;

import Joi from 'joi';

export const contactAddSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  phoneNumber: Joi.string().required(),
  email: Joi.string(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .default('personal'),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string(),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

// name: {
//       type: String,
//       required: true,
//     },
//     phoneNumber: {
//       type: String,
//       required: true,
//     },
//     email: String,
//     isFavourite: {
//       type: Boolean,
//       default: false,
//     },
//     contactType: {
//       type: String,
//       enum: ['work', 'home', 'personal'],
//       required: true,
//       default: 'personal',
//     },

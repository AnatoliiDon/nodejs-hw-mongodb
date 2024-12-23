import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (request, result, next) => {
  const { id } = request.params;
  if (!isValidObjectId(id)) {
    throw createHttpError(400, `The contact id: ${id} isn't valid`);
  }

  next();
};

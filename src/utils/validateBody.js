import createError from 'http-errors';

export const validateBody = (schema) => {
  const func = async (request, result, next) => {
    try {
      await schema.validateAsync(request.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      next(createError(400, error.message));
    }
  };

  return func;
};

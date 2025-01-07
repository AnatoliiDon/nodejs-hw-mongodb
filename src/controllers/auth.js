import * as authServices from '../services/auth.js';

export const registerController = async (request, response) => {
  const { name, email, _id, createdAt, updatedAt } =
    await authServices.register(request.body);
  response.status(201).json({
    status: 201,
    message: 'Successfully registrated user',
    user: {
      name: name,
      email: email,
      _id: _id,
      createdAt: createdAt,
      updatedAt: updatedAt,
    },
  });
};

export const loginController = async (request, response) => {
  const session = await authServices.login(request.body);
  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  response.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  response.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

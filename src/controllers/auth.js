import * as authServices from '../services/auth.js';

const setupSession = (response, session) => {
  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  response.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

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
  setupSession(response, session);
  response.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshTokenController = async (request, response) => {
  const { refreshToken, sessionId } = request.cookies;
  const session = await authServices.refreshToken({
    sessionId: sessionId,
    refreshToken: refreshToken,
  });

  setupSession(response, session);

  response.json({
    status: 200,
    message: 'Successfully refresh session',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (request, response) => {
  if (request.cookies.sessionId) {
    await authServices.logout(request.cookies.sessionId);
  }

  response.clearCookie('sessionId');
  response.clearCookie('refreshToken');

  response.status(204).send();
};

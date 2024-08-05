const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const validateToken = async (request, h) => {
  const token = request.headers.authorization;
  if (!token) {
    throw Boom.unauthorized('Missing authentication token');
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    request.user = decoded;
    return h.continue;
  } catch (error) {
    throw Boom.unauthorized('Invalid token');
  }
};

module.exports = { validateToken };
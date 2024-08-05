const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');


const AuthController = {
  async login(request, h) {
    try {
      const { username, password } = request.payload;

    const mockUser = {
      id: 1,
      username: 'admin',
      passwordHash: await bcrypt.hash('password123', 10)
    };

    if (username !== mockUser.username) {
      throw Boom.unauthorized('Invalid username or password');
    }

    const isValidPassword = await bcrypt.compare(password, mockUser.passwordHash);
    if (!isValidPassword) {
      throw Boom.unauthorized('Invalid username or password');
    }

    const token = Jwt.token.generate(
      {
        aud: 'urn:audience:test',
        iss: 'urn:issuer:test',
        id: mockUser.id,
        username: mockUser.username
      },
      {
        key: process.env.JWT_SECRET,
        algorithm: 'HS256'
      },
      {
        ttlSec: 14400
      }
    );

    return h.response({ token }).code(200);
    } catch (error) {
      console.log(error)
    }
  }
};

module.exports = AuthController;
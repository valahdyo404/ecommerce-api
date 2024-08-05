const Jwt = require('@hapi/jwt');

const authPlugin = {
  name: 'app/auth',
  register: async function (server) {
    await server.register(Jwt);

    server.auth.strategy('jwt', 'jwt', {
      keys: process.env.JWT_SECRET,
      verify: {
        aud: 'urn:audience:test',
        iss: 'urn:issuer:test',
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 14400,
        timeSkewSec: 15
      },
      validate: (artifacts, request, h) => {
        return {
          isValid: true,
          credentials: { user: artifacts.decoded.payload }
        };
      }
    });

    server.auth.default('jwt');
  }
};

module.exports = authPlugin;
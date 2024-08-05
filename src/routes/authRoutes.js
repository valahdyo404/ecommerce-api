const AuthController = require('../controllers/authController');
const Joi = require('@hapi/joi');

module.exports = [
  {
    method: 'POST',
    path: '/login',
    handler: AuthController.login,
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required()
        }),
      },
    }
  }
];
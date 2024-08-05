require("dotenv").config()
const Hapi = require('@hapi/hapi');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const authPlugin = require('./plugins/auth');
const laabr = require('laabr');
const db = require('./config/database');

const init = async () => {
  await db.initialize();
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.SERVER_HOST || '0.0.0.0',
  });

  // Register the authentication plugin
  // await server.register(authPlugin);
  await server.register({
    plugin: laabr,
    options: {
      hapiPino: {
        logPayload: false,
      },
      formats: { onPostStart: ':time :start :level :message' },
      tokens: { start:  () => '[start]' },
      indent: 0
    }
  });

  // Error handling
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (!response.isBoom) {
      return h.continue;
    }

    const error = response;
    return h.response({
      statusCode: error.output.statusCode,
      error: error.output.payload.error,
      message: error.output.payload.message
    }).code(error.output.statusCode);
  });
  

  server.realm.modifiers.route.prefix = '/api'
  server.route([
    ...authRoutes,
    ...productRoutes,
    ...transactionRoutes
  ]);
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
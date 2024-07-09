const Hapi = require('@hapi/hapi');
const serverless = require('serverless-http');
const Jwt = require('@hapi/jwt');
const auth = require('./Auth');
const { productServices, userServices, reviewServices } = require('./services')
const db = require('./DB')

const init = async () => {
    const server = Hapi.server({
        port: 1810,
        host: 'localhost',
        routes: {
            cors: {
                origin: ["http://localhost:3000"],
                headers: ["Accept", "Content-Type", "Authorization"],
                additionalHeaders: ["X-Requested-With"]
            }
        }
    });


    await server.register(Jwt);

    server.auth.strategy('jwt', 'jwt', {
        keys: 'secret',
        validate: auth.validateToken,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400,
            timeSkewSec: 15
        }
    });

    server.auth.default('jwt');
    server.route({
        method: 'GET',
        path: '/.netlify/functions/app',
        handler: (request, h) => {
            return 'App is running..';
        }
    });
    userServices(server, db)
    productServices(server, db)
    reviewServices(server, db)
    try {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

init();

module.exports.handler = serverless(init);

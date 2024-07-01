const bcrypt = require('bcryptjs');
const auth = require('../Auth')
const webpush = require('web-push');
require('dotenv').config()

const apiKeys = {
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
}

webpush.setVapidDetails(
    'mailto:sgsanjay044@gmail.com',
    apiKeys.publicKey,
    apiKeys.privateKey
)


const userServices = (server, db) => {

    server.route({
        method: 'POST',
        path: '/notification/subscription',
        handler: async (request, h) => {
            try {
                const { email, subscription } = request.payload;
                console.log(subscription);
                const res = await db.query(
                    'INSERT INTO notification (email, subscription) VALUES ($1, $2) RETURNING id', [email, JSON.stringify(subscription)]
                );
                return h.response({ id: res[0].id, email, subscription }).code(201);
            } catch (err) {
                console.error('Error In subscription:', err);
                return Boom.badRequest(err);
            }
        }
    });

    server.route({
        method: 'post',
        path: '/notification/push',
        handler: async (request, h) => {
            try {
                const { email, message } = request.payload;
                const res = await db.query(
                    'SELECT * FROM notification WHERE email = $1', [email]
                );
                webpush.sendNotification(JSON.parse(res[0].subscription), message);
                return h.response({ "statue": "Success", "message": "Message sent to push service" }).code(201);
            } catch (err) {
                console.error('Error In subscription:', err);
                return Boom.badRequest(err);
            }
        }
    });


    server.route({
        method: 'POST',
        path: '/signup',
        options: {
            auth: false
        },
        handler: async (request, h) => {
            try {
                const { email, password } = request.payload;
                const hashedPassword = await bcrypt.hash(password, 10);
                const res = await db.query(
                    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id', [email, hashedPassword]
                );
                return h.response({ id: res[0].id, email }).code(201);
            } catch (err) {
                console.error('Error In signup:', err);
                return Boom.badRequest(err);
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/login',
        options: {
            auth: false
        },
        handler: async (request, h) => {
            try {
                const { email, password } = request.payload;
                const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
                if (res.length === 0) {
                    return h.response({ message: 'User not found' }).code(404);
                }
                const user = res[0];
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return h.response({ message: 'Invalid credentials' }).code(401);
                }
                const token = auth.generateToken({ id: user.id, username: user.username });
                console.log(res);
                return { token };
            }
            catch (err) {
                console.error('Error In Login:', err);
                return Boom.badRequest('Failed to Login');
            }
        }
    });
}
module.exports = userServices
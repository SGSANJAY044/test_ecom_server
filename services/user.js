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
                const res = await db.Notification.create(
                    { email: email, subscription: JSON.stringify(subscription) }
                );
                return h.response({ id: res.id, email, subscription }).code(201);
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
                const res = await db.Notification.findOne({ where: { email: email } })
                webpush.sendNotification(JSON.parse(res[0].subscription), message);
                return h.response({ "statue": "Success", "message": "Message sent to push service" }).code(201);
            } catch (err) {
                console.error('Error In push:', err);
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
                const existingUser = await db.User.findOne({ where: { email: email } })
                if (!existingUser) {
                    const res = await db.User.create({ email: email, password: hashedPassword })
                    return h.response({ id: res.id, email }).code(201);
                }
                else {
                    return h.response({ msg: 'User Alreay Exists' }).code(409);
                }
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
                const { email, password, valid } = request.payload;
                const res = await db.User.findOne({ where: { email: email } })
                if (!res) {
                    return h.response({ message: 'User not found' }).code(404);
                }
                const user = res;
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid && !valid) {
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
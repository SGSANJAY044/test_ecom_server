const jwt = require('jsonwebtoken');
const db = require('../DB')

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, 'secret');
};

const validateToken = async (decoded, request, h) => {
    console.log(decoded);
    const res = await db.User.findOne({ where: { id: decoded.decoded.payload.id } });

    if (!res) {
        return { isValid: false };
    }

    return { isValid: true };
};

module.exports = {
    generateToken,
    validateToken,
};

const jwt = require('jsonwebtoken');
const db = require('../DB')

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, 'secret');
};

const validateToken = async (decoded, request, h) => {
    const res = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

    if (res.rowCount === 0) {
        return { isValid: false };
    }

    return { isValid: true };
};

module.exports = {
    generateToken,
    validateToken,
};

const jwt = require('jsonwebtoken');
const SECRET_TOKEN = process.env.SESSION_SECRET;

const generateAuthTokenRegister = async (user) => {
    const token = jwt.sign({ user: user }, SECRET_TOKEN, {
        expiresIn: '10m'
    });

    return token;
};

const generateAuthToken = async (user) => {
    const token = jwt.sign({ user: user }, SECRET_TOKEN, {
        expiresIn: '360m'
    });

    return token;
};


module.exports = {
    generateAuthToken,
    generateAuthTokenRegister
};
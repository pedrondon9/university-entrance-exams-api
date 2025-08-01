const jwt = require('jsonwebtoken');
const SECRET_TOKEN = process.env.SESSION_SECRET;
const User = require("../modelos/userRegistro");
const bcrypt = require("bcrypt")

const generateAuthTokenRegister = async (user) => {
    const token = jwt.sign({ user: user }, SECRET_TOKEN, {
        expiresIn: '5m'
    });

    return token;
};

const generateAuthToken = async (user) => {
    const token = jwt.sign({ user: user }, SECRET_TOKEN, {
        expiresIn: '5m'
    });

    return token;
};


module.exports = {
    generateAuthToken,
    generateAuthTokenRegister
};
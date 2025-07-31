const jwt = require('jsonwebtoken');
const SECRET_TOKEN = process.env.SESSION_SECRET;
const User = require("../modelos/userRegistro");
const bcrypt = require("bcrypt")


const generateAuthTokenRegister = async (user) => {
    const token = jwt.sign({ user: user }, SECRET_TOKEN, {
        expiresIn: '1m'
    });

    return token;
};



const registerUser = async (req, res) => {

    const email = req.body.email;

    const role = req.body.role || "user";
    const contact = req.body.contact || "";
    const password = req.body.password;
    const newUser = new User();

    const passwortEcryp = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    newUser.fullname = req.body.fullname;
    newUser.email = email;
    newUser.contact = contact;
    newUser.password = passwortEcryp;
    newUser.state = true;
    newUser.role = role;
    newUser.isVerify = true;

    console.log(newUser);


    const token = await generateAuthToken(newUser);

    newUser.token = token;


    const user = await newUser.save();

    return {
        user,
        token
    };


};



module.exports = {
    generateAuthTokenRegister,
    registerUser,
};
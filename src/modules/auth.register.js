const User = require("../models/users");
const bcrypt = require("bcrypt");
const { generateAuthToken } = require('./generate.token');



const registerUser = async (req, res) => {


    const { fullname, password, email } = req.body.user.user;

    console.log(req.body.user, "req.body.user",password, "password", email, "email", fullname, "fullname");

    const role = req.body.role || "user";
    const contact = req.body.contact || "";


    const newUser = new User();

    const passwortEcryp = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    newUser.fullname = fullname;
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
    registerUser,
};
const secretToken = process.env.SESSION_SECRET;
const express = require("express")

const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
//configurar cloudinary



//modelos

const User = require("../modelos/userRegistro");
const SendEmail = require("./sendEmail");
const { generateAuthTokenRegister } = require("./generateToken");

const changePassword = async (req, res) => {
    try {

        const { passwordRepeat, password, email } = req.body;

        console.log(req.body, "req.body", passwordRepeat === password);


        //const user = await User.findOne({ email });
        if (password !== passwordRepeat) {
            return res.status(403).json({ message: "Las contraseñas no coinciden", success: false });
        }

        if (false) {

            return res.status(403).json({ message: "El usuario ya existe", success: false });
        }

        if (!(email && passwordRepeat && password)) {

            return res.status(403).json({ message: "Comprueba que has rellenado todos los campos", success: false });
        }

        const token = await generateAuthTokenRegister(req.body)

        //console.log(user, "user", token, "token");
        const verificationLink = `http://localhost:3000/${token}`;
        const constentEmail = `<p>Hi ${email},</p>
                     <p>Please verify your email by clicking the link below:</p>
                     <a href="${verificationLink}">Verify Email</a>`;

        await SendEmail(email, constentEmail);

        res.status(200).json({ message: "Por favor, activa la modificacion atravez del link que hemos enviado en tu correo", success: true, token: token });

    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Hay un problema", success: false });
    }
};

module.exports = changePassword;
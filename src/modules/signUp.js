const secretToken = process.env.SESSION_SECRET;
const express = require("express")

const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
//configurar cloudinary



//modelos

const User = require("../modelos/userRegistro");
const SendEmail = require("./sendEmail");
const {  generateAuthTokenRegister } = require("./authRegister");

const signUpUser = async (req, res) => {
    try {
        console.log(req.body);
        const email = req.body.email;
        const usuario = req.body.fullname

        const role = req.body.role || "user";
        const contact = req.body.contact || "";
        const password = req.body.password;

        const validar = email && usuario && password;

        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            if (validar) {

                const token = await generateAuthTokenRegister(req.body)

                console.log(user, "user",token, "token");
                const verificationLink = `http://localhost:3000/${token}`;
                const constentEmail = `<p>Hi ${usuario},</p>
                     <p>Please verify your email by clicking the link below:</p>
                     <a href="${verificationLink}">Verify Email</a>`;

                await SendEmail(email, constentEmail);

                res.status(200).json({ message: "La cuenta ha sido creada con exito, activa tu cuenta atravez del link que hemos enviado en tu correo", success: true, token:token });
            } else {
                res.status(403).json({ message: "Comprueba que has rellenado todos los campos", success: false });
            }
        } else {
            res.status(403).json({ message: "El usuario ya existe", success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Hay un problema", success: false });
    }
};




module.exports = signUpUser
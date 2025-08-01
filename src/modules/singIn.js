const express = require("express")

const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
//configurar cloudinary


//crear el secret del token
const secretToken = process.env.SESSION_SECRET

//modelos


const User = require("../modelos/userRegistro");
const { generateAuthToken } = require("./generateToken");

const singInUser = async (req, res) => {

    try {
        const { email, password } = req.body.email


        //verificar si el email existe en la base de datos
        const user = await User.findOne({ email: email });
        console.log(user)

        if (!user) {
            return res.status(403).json({ message: "usuario o contraseña  no valido", success: false })
        }

        if (!user.state) {
            return res.status(403).json({ success: false, message: "Tu cuenta no esta activada , por favor activa tu cuenta atravez del link que hemos enviado en tu correo" })
        }

        //comparar la contraseña del inicio de sesion con la que esta guardada en la base de datos si son iguales
        const comparePass = bcrypt.compareSync(password, user.password)

        if (!comparePass) {
            return res.status(403).json({ message: "usuario o contraseña  no valido", success: false })
        }

        //creacion del token
        const token = await generateAuthToken(user)


        //enviar respuesta al cliente con sus datos
        res.status(200).json({ success: true, token: token, userData: user, message: 'Cuenta activada' })

    } catch (error) {
        console.log(error)
        res.status(403).json({ message: "hay un problema", success: false })
    }
}

module.exports = singInUser
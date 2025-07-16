const express = require("express")

const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
//configurar cloudinary


//crear el secret del token
const secretToken = process.env.SESSION_SECRET

//modelos


const User = require("../modelos/userRegistro")

const singInUser = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.contrasena
        console.log(email, "bbbbbb", password)


        //verificar si el email existe en la base de datos
        const user = await User.findOne({ email: email });
        console.log(user)

        if (user) {
            if (user["estado"] != false/*verificando si ya se activoo la cuenta */) {

                //comparar la contraseña del inicio de sesion con la que esta guardada en la base de datos si son iguales
                const comparePass = bcrypt.compareSync(password, user["password"])
                if (comparePass) {

                    //creacion del token
                    const newToken = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                        user: user['nombre'],
                        id: user['_id']
                    }, secretToken)


                    // Store access token in session
                    req.session.authorization = {
                        newToken
                    }

                    console.log(req.session.authorization)
                    //enviar respuesta al cliente con sus datos
                    const respuesta = { 'user': user['nombre'], 'id': user['_id'], "code": newToken, "mens": "" }
                    res.status(200).json(respuesta)
                } else {
                    res.status(403).json({ "mens": "usuario o contraseña  no valido" })
                }
            } else {
                res.status(403).json({ "mens": "Tu cuenta no esta activada , por favor activa tu cuenta atravez del link que hemos enviado en tu correo" })
            }
        } else {
            res.status(403).json({ "mens": "usuario o contraseña  no valido" })
        }
    } catch (error) {
        console.log(error)
        res.status(403).json({ "mens": "hay un problema" })
    }
}

module.exports = singInUser
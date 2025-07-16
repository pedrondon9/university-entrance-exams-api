const express = require("express")

const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
//configurar cloudinary


//crear el secret del token
const secretToken = process.env.SESSION_SECRET

//modelos


const User = require("../modelos/userRegistro")


const signUpUser = async (req, res) => {
    try {
        console.log(req.body)
        const email = req.body.email
        const usuario = req.body.nombre
        //const paiz = req.body.paiz
        //const genero = req.body.genero

        if (req.body.role) {
            var role = req.body.role
        } else {
            var role = "user"
        }

        if (req.body.contact) {
            var contact = req.body.contact
        } else {
            var contact = ""
        }
        const password = req.body.contrasena
        const validar = email && usuario && password

        const user = await User.findOne({ 'email': email })//verificar si el email existe antes del nuevo registro para que no se dublique
        console.log(user)
        if (!user) {

            if (validar) {

                const newUser = new User();//el modelo de registro de usuarios

                /************************* */
                //encriptando la contraseña
                /****************************************** */
                const passwortEcryp = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

                /******************************* */
                //Asignando valores a cada variable del modelo de registro de usuarios para su posterior almacenamiento en la base de datos
                /******************************************************************* */
                newUser.nombre = req.body.nombre
                newUser.email = email
                newUser.contact = contact
                newUser.password = passwortEcryp
                //newUser.paiz = paiz
                //newUser.genero = genero
                //newUser.role = role
                newUser.estado = true

                /*************************************** */




                //***********************/
                //crear el token
                /************************ */
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    user: usuario,
                    id: newUser["_id"],
                }, secretToken)

                //console.log(token)

                /***********************************/
                //Para enviar el link de verificacion de email 
                /******************************************* */
                //<img src=${linkImg} alt=''>


                /******* fin para enviar  link */
                /******************************************* */
                /*******************/
                //guardar datos 
                /************************ */
                const datosUser = await newUser.save();
                console.log(datosUser)
                /************************** */

                res.status(200).json("La cuenta ha sido creada con exito")
            } else {
                res.status(403).json("Comprueba que has rellenado todos los campos")
            }

        } else {
            res.status(403).json("el usuario ya existe")
        }
    } catch (error) {
        console.log(error)
        res.status(503).json("hay un problema")
    }
}

module.exports = signUpUser
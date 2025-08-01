const express = require("express")
const cloudinary = require("cloudinary")
const public_users = express.Router();
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
//configurar cloudinary


//crear el secret del token
const secretToken = process.env.SESSION_SECRET

//modelos

const Comment = require("../modelos/coments")
const UploadExamen = require("../modelos/uploadExamen")
const User = require("../modelos/userRegistro")
const ResponseComment = require("../modelos/reponseComment")
const ResponseResponse = require("../modelos/responseRespon")
const { Console } = require("console")
const { nextTick } = require("process")
const ExamenDatos = require("../modelos/examenDatos")
const { verifyToken, verifyTokenRegister } = require("../modules/verifyToken");


//POST DE REGISTRO DE USUARIOS
const RegisterUser = require('../modules/signUp')
public_users.post('/registro_post', async (req, res) => {
    await RegisterUser(req, res)
})

/********** */
/******************************************************** */

//POST DE ENVIO DE EMAILS
const ResendEmail = require('../modules/resendEmail')
public_users.post('/resend-email',verifyTokenRegister, async (req, res) => {
    await ResendEmail(req, res)
})


//POST RUTA PARA CAMBIAR LA CONTRASEÑA
const changePassword = require('../modules/changePassword')
public_users.post('/change-pasword', async (req, res) => {
    await changePassword(req, res)
})

/********** */
/******************************************************** */

//POST DE LOGEO DE USUARIOS
const Login = require("../modules/singIn");
public_users.post('/login_post', async (req, res) => {
    await Login(req, res)
})

/********** */
/******************************************************** */

//POST PARA ACTIVAR LA CUENTA
const ActiveCount = require("../modules/active.count");
public_users.post('/active-count',verifyTokenRegister, async (req, res) => {
    await ActiveCount(req, res)
})

/********** */
/******************************************************** */

//RUTA PARA CONFIRMAR Y VALIDAR EMAIL

public_users.post("/confirmar", async (req, res) => {
    try {
        const { tokenId } = req.body
        console.log(tokenId)

        const userData = await jwt.verify(tokenId, secretToken)
        const token = await User.findOne({ token: userData.id });
        console.log(token)
        if (token) {
            var estado = { "$set": { 'tado': true } };
            const datos = await User.findByIdAndUpdate({ "_id": token._id }, estado)
            if (datos) {
                console.log(datos, "datos", datos._id, "gggggggggggggggggggggggggggggg")

                //crear el token
                const newToken = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    user: datos['nombre'],
                    id: datos['_id']
                }, secretToken)

                res.json({
                    code: newToken,
                    user: datos['nombre'],
                    id: datos['_id'],
                })
            } else {
                res.json(false)
            }

        } else {
            res.json(false)
        }
    } catch {
        res.json(false)
    }
})
/********** */
/******************************************************** */

//confirmar inicio "en prueba"
/*
si el usuario intenta acceder a su cuenta primero verificaran
si los datos almacenados en su cachee son validos
*/
public_users.post("/user_confirm_init", async (req, res) => {
    try {
        const { id } = req.body
        const userData = await jwt.verify(id, secretToken)
        const user = await User.findById(userData.id);
        if (user) {
            res.json({
                user: user.nombre,
                id: user._id,
                code: id
            })
        } else {
            res.json(false)
        }
    } catch (error) {
        res.json(false)
    }

})






/*********************************************** */
/* RUTA PARA OBTENER COMENTARIOS CON INFINITY SCRO */
/********************************************** */


public_users.post("/getComentInfinityScroll/:id", async (req, res) => {
    const { id } = req.params
    const { paginaNext, examenId } = req.body
    try {
        const comment = await Comment.paginate({ examenId: id }, { limit: 5, page: paginaNext, sort: { createdAt: -1 } })
        console.log(comment)
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json("hay un problema")
    }

})

/*********************************************** */
/* FIN RUTA PARA OBTENER COMENTARIOS CON INFINITY SCROLL */
/********************************************** */



/***************************************************************************************************** */


/*********************************************** */
/* RUTA PARA OBTENER COMENTARIOS DEL EXAMEN SELECCIONADO */
/********************************************** */
public_users.get("/getComent/:id", async (req, res) => {
    const { id } = req.params
    try {
        const comment = await Comment.paginate({ examenId: id }, { limit: 5, sort: { createdAt: -1 } })
        console.log(comment)
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json("hay un problema")
    }

})

/*********************************************** */
/* FIN RUTA PARA OBTENER COMENTARIOS */
/********************************************** */


/***************************************************************************************************** */


/*********************************************** */
/* RUTA PARA OBTENER RESPUESTAS_COMENTARIO SELECCIONADO */
/********************************************** */
public_users.get("/getComentResp/:id", async (req, res) => {
    try {
        const { body, method } = req
        const { id } = req.params
        //const { id } = body
        const comment = await ResponseComment.paginate({ comentId: id }, { limit: 10, sort: { createdAt: 1 } })
        console.log(comment)
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json("hay un problema")
    }
})

/*********************************************** */
/* FIN RUTA PARA OBTENER RESPUESTAS_COMENTARIOS */
/********************************************** */


/***************************************************************************************************** */


/*********************************************** */
/* RUTA PARA OBTENER RESPUESTAS_DE_LAS_RESPUESTAS_DEL_COMENTARIOS SELECCIONADO */
/********************************************** */
public_users.get("/getRespComentResp/:id", async (req, res) => {

    try {
        //const { body, method } = req
        const { id } = req.params
        /*const { id } = req.body*/
        const comment = await ResponseResponse.paginate({ comentId: id }, { limit: 10, sort: { createdAt: 1 } })
        console.log(comment)
        res.status(200).json(comment)
    } catch (error) {
        console.log(error)
        res.status(500).json("hay un problema")
    }
})

/*********************************************** */
/* FIN RUTA PARA AGREGAR RESPUESTAS_DE_LAS_RESPUESTAS_DEL_COMENTARIOS */
/********************************************** */


/******************************************************************************************************** */



/*********************************************** */
/* RUTA PARA CARGAR EXAMENES EN EL HOME */
/********************************************** */
public_users.get("/getExamenList", async (req, res) => {
    try {
        const examenList = await UploadExamen.find()
        console.log(examenList)
        res.status(200).json(examenList)
    } catch (error) {
        console.log(error)
        res.status(500).json("hay un problema")
    }
})

/*********************************************** */
/* FIN DE LA RUTA PARA CAEGAR EXAMENES*/
/********************************************** */






//exportar rutas
module.exports.public = public_users;

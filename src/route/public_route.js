const express = require("express")
const cloudinary = require("cloudinary")
const public_users = express.Router();
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
//configurar cloudinary


//crear el secret del token
const secretToken = "1234GDGjbfsdsknfjksf134ewewrwrrwr"

//modelos

const Comment = require("../modelos/coments")
const UploadExamen = require("../modelos/uploadExamen")
const User = require("../modelos/userRegistro")
const ResponseComment = require("../modelos/reponseComment")
const ResponseResponse = require("../modelos/responseRespon")
const { Console } = require("console")
const { nextTick } = require("process")
const ExamenDatos = require("../modelos/examenDatos")


//POST DE REGISTRO DE USUARIOS

public_users.post('/registro_post', async (req, res) => {
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
        newUser.token = newUser["_id"]

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

        res.json("La cuenta ha sido creada con exito")
      } else {
        res.json("Comprueba que has rellenado todos los campos")
      }

    } else {
      res.send("el usuario ya existe")
    }
  } catch (error) {
    res.json("hay un problema")
  }
})

/********** */
/******************************************************** */


//POST DE LOGEO DE USUARIOS

public_users.post('/login_post', async (req, res) => {
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
          //enviar respuesta al cliente con sus datos
          const respuesta = { 'user': user['nombre'], 'id': user['_id'], "code": newToken, "mens": "" }
          res.json(respuesta)
        } else {
          res.json({ "mens": "usuario o contraseña  no valido" })
        }
      } else {
        res.json({ "mens": "Tu cuenta no esta activada , por favor activa tu cuenta atravez del link que hemos enviado en tu correo" })
      }
    } else {
      res.json({ "mens": "usuario o contraseña  no valido" })
    }
  } catch (error) {
    res.json({ "mens": "hay un problema" })
  }


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
      var estado = { "$set": { 'estado': true } };
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

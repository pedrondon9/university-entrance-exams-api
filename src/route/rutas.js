const express = require("express")
const cloudinary = require("cloudinary")
const route = express.Router()
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
//configurar cloudinary

cloudinary.config({
  cloud_name: "mumbex",
  api_key: "161341185562788",
  api_secret: "tzxjgjRrPBozhQJL4ciXiUXct3U"
})

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


const emailPassworld = "woycuqzocxrsyudc"
const jwtHast = "abcdefghigdfdtdgbsojlvkshfjkhjfsvfskfhjkf"








//ruta para iniciar sesion backend formulario
// route.get("/", async (req, res) => {
//   res.send("ok")
// })





//POST DE REGISTRO DE USUARIOS


route.post('/registro_post', async (req, res) => {
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
        newUser.estado = false
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
        const correo = email
        const linkImg = 'https://res.cloudinary.com/mumbe/image/upload/c_thumb,w_200,g_face/v1639482203/kisspng-shopping-cart-computer-icons-online-shopping-buy-5abedd9c448d14.1345528515224580122808_fnfo0p.png'
        const linkConfir = token
        const html = "<head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Document</title></head>"
        const html1 = "<body>" + `<p style='text-align: center;'>Hola ${usuario} , bienvenido a selectividad.site para poder activar tu cuenta haz click en el siguiente boton</p>`
        const html2 = `<div  style='display: flex;width: 100%;height: 100px;justify-content: center;align-items: center;'><a href = '${"https://selectividad.site/#/confirm/" + linkConfir}'style='font-size: 20px;' >Has click para verificar tu cuenta !</a></div>`
        const html3 = `<div style='width: 100%;display: flex;justify-content: center;'></div>`
        const html4 = "<h3 style='font-size: 17px;font-weight: 400;text-align: center;color: #212121 ;'></h3>" + "<a style='text-align: center;' href='https://mumbx.com'>desarrollado por mumbeX software developer</a>" + "</body>"

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // 
          auth: {
            user: "pedronnd689@gmail.com", // 
            pass: emailPassworld, // 
          },
        });

        try {
          const resEmail = await transporter.sendMail({
            from: '"selectividad.site" <pedronnd689@gmail.com>', //el email que va emitar
            to: correo, // lista de email que van a resibir
            subject: "Activacion de cuenta", //
            text: "hola", // 
            html: html + html1 + html2 + html3 + html4, // html body
          });
          console.log(resEmail)
        } catch {
          res.json("el correo no existe")
        }



        /******* fin para enviar  link */
        /******************************************* */
        /*******************/
        //guardar datos 
        /************************ */
        const datosUser = await newUser.save();
        console.log(datosUser)
        /************************** */

        res.json("activa tu cuenta mediante el link enviado en tu correo")
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

route.post('/login_post', async (req, res) => {
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

route.post("/confirmar", async (req, res) => {
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
route.post("/user_confirm_init", async (req, res) => {
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


route.post("/getComentInfinityScroll/:id", async (req, res) => {
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
route.get("/getComent/:id", async (req, res) => {
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


/*********************************************** */
/* RUTA PARA AGREGAR COMENTARIOS */
/********************************************** */
route.post("/addComent", async (req, res) => {
  var imagenes = []
  const imagen1 = req.files["imagen1"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen1"][0].filename : null
  const imagen2 = req.files["imagen2"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen2"][0].filename : null
  const imagen3 = req.files["imagen3"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen3"][0].filename : null
  const imagen4 = req.files["imagen4"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen4"][0].filename : null

  if (imagen1) {
    imagenes.push(imagen1)
  }
  if (imagen2) {
    imagenes.push(imagen2)
  }
  if (imagen3) {
    imagenes.push(imagen3)
  }
  if (imagen4) {
    imagenes.push(imagen4)
  }
  try {
    const { body, method } = req
    const comment = new Comment()

    const { userName, userId, userPhoto, coment, comentActive, comentRepons,
      comentAddRepons, comentArrayRepons, comentCategory, comentLike, examenId } = body;


    comment.userName = userName
    comment.userId = userId
    comment.userPhoto = userPhoto
    comment.examenId = examenId
    comment.coment = coment

    comment.imagen1 = imagen1
    comment.imagen2 = imagen2
    comment.imagen3 = imagen3
    comment.imagen4 = imagen4
    comment.imagenes = imagenes


    comment.comentLike = 0
    comment.comentRepons = 0
    comment.comentActive = true
    comment.comentAddRepons = true
    comment.comentArrayRepons = []
    comment.comentCategory = comentCategory

    const guardarComentario = await comment.save()

    //console.log(comentArrayRepons)
    res.status(200).json("publicado")
  } catch (error) {
    res.status(500).json("hay un problema")
  }
})

/*********************************************** */
/* FIN RUTA PARA AGREGAR COMENTARIOS */
/********************************************** */


/******************************************************************************************************** */













/***************************************************************************************************** */
/*********************************************** */
/* RUTA PARA OBTENER RESPUESTAS_COMENTARIO SELECCIONADO */
/********************************************** */
route.get("/getComentResp/:id", async (req, res) => {
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


/*********************************************** */
/* RUTA PARA AGREGAR RESPUESTAS_COMENTARIOS SELECCIONADO */
/********************************************** */
route.post("/addComentResp", async (req, res) => {
  var imagenes = []
  const imagen1 = req.files["imagen1"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen1"][0].filename : null
  const imagen2 = req.files["imagen2"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen2"][0].filename : null
  const imagen3 = req.files["imagen3"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen3"][0].filename : null
  const imagen4 = req.files["imagen4"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen4"][0].filename : null

  if (imagen1) {
    imagenes.push(imagen1)
  }
  if (imagen2) {
    imagenes.push(imagen2)
  }
  if (imagen3) {
    imagenes.push(imagen3)
  }
  if (imagen4) {
    imagenes.push(imagen4)
  }
  try {
    const { body, method } = req
    const comment = new ResponseComment()

    const { userName, userId, userPhoto, coment, comentId, comentActive, comentRepons,
      comentAddRepons, comentArrayRepons, comentCategory, comentLike } = body;

    comment.userName = userName
    comment.userId = userId
    comment.userPhoto = userPhoto
    comment.coment = coment

    comment.imagen1 = imagen1
    comment.imagen2 = imagen2
    comment.imagen3 = imagen3
    comment.imagen4 = imagen4
    comment.imagenes = imagenes

    comment.comentId = comentId
    comment.comentLike = 0
    comment.comentRepons = 0
    comment.comentActive = true
    comment.comentAddRepons = true
    comment.comentArrayRepons = []
    comment.comentCategory = comentCategory

    const guardarComentario = await comment.save()

    console.log(comentArrayRepons)
    res.status(200).json("publicado")
  } catch (error) {
    res.status(500).json("hay un problema")
  }
})

/*********************************************** */
/* FIN RUTA PARA AGREGAR RESPUESTAS_COMENTARIOS */
/********************************************** */


/*****************************************************************************************************/









/***************************************************************************************************** */
/*********************************************** */
/* RUTA PARA OBTENER RESPUESTAS_DE_LAS_RESPUESTAS_DEL_COMENTARIOS SELECCIONADO */
/********************************************** */
route.get("/getRespComentResp/:id", async (req, res) => {

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
/* FIN RUTA PARA OBTENER RESPUESTAS_DE_LAS_RESPUESTAS_DEL_COMENTARIOS */
/********************************************** */


/*********************************************** */
/* RUTA PARA AGREGAR RESPUESTAS_DE_LAS_RESPUESTAS_DEL_COMENTARIOS SELECCIONADO */
/********************************************** */
route.post("/addRespComentResp", async (req, res) => {
  var imagenes = []
  const imagen1 = req.files["imagen1"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen1"][0].filename : null
  const imagen2 = req.files["imagen2"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen2"][0].filename : null
  const imagen3 = req.files["imagen3"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen3"][0].filename : null
  const imagen4 = req.files["imagen4"] ? "https://qwayt.selectividad.site/pdf/" + req.files["imagen4"][0].filename : null

  if (imagen1) {
    imagenes.push(imagen1)
  }
  if (imagen2) {
    imagenes.push(imagen2)
  }
  if (imagen3) {
    imagenes.push(imagen3)
  }
  if (imagen4) {
    imagenes.push(imagen4)
  }
  try {
    const { body, method } = req
    console.log(body)
    const comment = new ResponseResponse()

    const { userName, userId, userPhoto, coment, comentId, comentActive, comentRepons,
      comentAddRepons, comentArrayRepons, comentCategory, comentLike } = body;
    comment.userName = userName
    comment.userId = userId
    comment.userPhoto = userPhoto
    comment.coment = coment
    comment.imagen1 = imagen1
    comment.imagen2 = imagen2
    comment.imagen3 = imagen3
    comment.imagen4 = imagen4
    comment.imagenes = imagenes
    comment.comentId = comentId
    comment.comentLike = 0
    comment.comentRepons = 0
    comment.comentActive = true
    comment.comentAddRepons = true
    comment.comentArrayRepons = []
    comment.comentCategory = comentCategory

    const guardarComentario = await comment.save()

    console.log(guardarComentario, "jskaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    res.status(200).json("publicado")
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
/* RUTA PARA AGREGAR EXAMEN */
/********************************************** */
route.post("/addExamen", async (req, res) => {
  const { body, method } = req
  const { userName, userId, userPhoto, año, mes, face, materia, numComent, estado } = body;
  var examenList = await UploadExamen.findOne({ 'materia': materia })
  if (examenList) {//probar si la materia ya existe en la base de datos
    //si la materia ya existe solo se va agregar el examen en el array de los examenes
    var probarSiExiste = await ExamenDatos.findOne({ 'materia': materia, "año": año, "face": face, "estado": estado, "mes": mes })//probar si el examen ya existe
    var dataUpdate = examenList
    var addNew = examenList.info[0].info_año
    var probarAño = examenList.info
    const id = examenList._id
    var años = []//array de todos los años que ya se ha subido la materia ya que una materia puede tener distintas convocatoria
    for (let i = 0; i < probarAño.length; i++) {
      console.log(probarAño[i].año)
      años.push(probarAño[i].año)//añadiendo todos los años en el  caso que exista el examen

    }

    if (probarSiExiste) {//probar si ya existe el examen
      console.log(userName, userId, userPhoto, año, mes, face, materia, numComent, estado)
      console.log(probarSiExiste)
      res.status(200).json("el examen ya fué agregado")
    } else {
      const verificar_año = años.includes(año)
      if (verificar_año) {
        //en el caso que no exista el examen o el año de la convocatoria este se va añadir en el array de examenes perteneciente a la materia y 
        //tambien se va guardar el examen en la colleccion de examenes


        /****
         *GUARDANDO EXAMEN EN LA COLLECTION DE EXAMENES
         */
        const exame_data = new ExamenDatos()

        exame_data.userName = userName
        exame_data.userId = userId
        exame_data.userPhoto = userPhoto
        exame_data.estado = estado
        exame_data.año = año
        exame_data.mes = mes
        exame_data.materia = materia
        exame_data.face = face
        exame_data.numComment = numComent
        exame_data.pdfLink = "https://select.mxmxlogin.xyz/pdf/" + req.files.pdf[0].filename

        const examenData = await exame_data.save()
        console.log(examenData)

        /****
         *FIN
        */

        /****
         *GUARDANDO EXAMEN EN EL ARRAY DE EXAMENES
         */
        var addItem = {
          "mes": mes,
          "estado": estado,
          "examenId": exame_data._id,//El id que relacionara el examen con sus comentarios
          "face": face,
          "userName": userName,
          "userId": userId,
          "userPhoto": userPhoto,
          "numComent": 0,
          "pdfLink": "https://select.mxmxlogin.xyz/pdf/" + req.files.pdf[0].filename,
        }

        for (let i = 0; i < dataUpdate.info.length; i++) {
          if (dataUpdate.info[i].año === año) {
            dataUpdate.info[i].info_año.push(addItem)
          } else {

          }

        }


        const update = await UploadExamen.findByIdAndUpdate(id, dataUpdate)
        console.log(dataUpdate.info[0].info_año, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

        /****
         *FIN
         */



        res.status(200).json("publicado1235555")
      } else {
        const examen = new UploadExamen()
        const exame_data = new ExamenDatos()
        exame_data.userName = userName
        exame_data.userId = userId
        exame_data.userPhoto = userPhoto
        exame_data.estado = estado
        exame_data.año = año
        exame_data.mes = mes
        exame_data.materia = materia
        exame_data.face = face
        exame_data.numComment = numComent
        exame_data.pdfLink = "https://select.mxmxlogin.xyz/pdf/" + req.files.pdf[0].filename

        const examenData = await exame_data.save()
        console.log(examenData)
        const new_info = {
          "año": año,
          "info_año": [
            {
              "mes": mes,
              "estado": estado,
              "examenId": exame_data._id,//El id que relacionara el examen con sus comentarios
              "face": face,
              "userName": userName,
              "userId": userId,
              "userPhoto": userPhoto,
              "numComent": numComent,
              "pdfLink": "https://select.mxmxlogin.xyz/pdf/" + req.files.pdf[0].filename,
            }
          ]
        }

        dataUpdate.info.push(new_info)
        const new_update = await UploadExamen.findByIdAndUpdate(id, dataUpdate)
        console.log(new_update, "nuevo año")



        res.status(200).json("publicado ")
      }


    }

  } else {
    const examen = new UploadExamen()
    const exame_data = new ExamenDatos()
    exame_data.userName = userName
    exame_data.userId = userId
    exame_data.userPhoto = userPhoto
    exame_data.estado = estado
    exame_data.año = año
    exame_data.mes = mes
    exame_data.materia = materia
    exame_data.face = face
    exame_data.numComment = numComent
    exame_data.pdfLink = "https://select.mxmxlogin.xyz/pdf/" + req.files.pdf[0].filename
    console.log(exame_data, "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

    const examenData = await exame_data.save()
    console.log(examenData)

    examen.materia = materia
    examen.info = [
      {
        "año": año,
        "info_año": [
          {
            "mes": mes,
            "estado": estado,
            "examenId": exame_data._id,//El id que relacionara el examen con sus comentarios
            "face": face,
            "userName": userName,
            "userId": userId,
            "userPhoto": userPhoto,
            "numComent": numComent,
            "pdfLink": "https://select.mxmxlogin.xyz/pdf/" + req.files.pdf[0].filename,
          }
        ]
      }
    ]

    const guardarExamen = await examen.save()


    res.status(200).json("publicado")
  }
  /*
  console.log(req.files.pdf[0].filename)
  
  try {
    const { body, method } = req
    console.log(body)
    const examen = new UploadExamen()

    const {userName, userId, userPhoto,año ,mes,face,materia,numComent} = body;

    examen.userName = userName
    examen.userId = userId
    examen.userPhoto = userPhoto
    examen.año = año
    examen.mes = mes
    examen.materia = materia
    examen.face = face
    examen.numComment = numComent
    examen.pdfLink= "http://localhost:5000/pdf/"+ req.files.pdf[0].filename

    const guardarExamen = await examen.save()

    console.log(guardarExamen ,"jskaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    res.status(200).json("publicado")
  } catch (error) {
    console.log(error)
    res.status(500).json("hay un problema")
  }
  */
})

/*********************************************** */
/* FIN DE LA RUTA PARA AGREGAR EXAMEN */
/********************************************** */

/*********************************************** */
/* RUTA PARA CARGAR EXAMENES EN EL HOME */
/********************************************** */
route.get("/getExamenList", async (req, res) => {
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

/******************************************************************************************************** */
route.post("/deleteExam", async (req, res) => {
  const { id, año, mes, estado,face } = req.body
  try {
    const examen = await UploadExamen.findById(id)//obtener la colleccion de examenes a la que pertenece el id
    for (let i = 0; i < examen.info.length; i++) {
      if (examen.info[i].año === año) {
        for (let y = 0; y < examen.info[i].info_año.length; y++) {
          if (examen.info[i].info_año[y].mes===mes&&examen.info[i].info_año[y].face===face&&examen.info[i].info_año[y].estado===estado) {
            let arr = examen.info[i].info_año.splice(y,1)//borrar el examen de la array
            //console.log(año,face,mes,estado)
            const new_update = await UploadExamen.findByIdAndUpdate(id, examen)//guardar ek array de exemenes actualizando
            const deleteExamen = await ExamenDatos.findByIdAndDelete(arr[0]["examenId"])//borrar el examen de la colleccion de examenes 
          } else {
            
          }
        }
      } else {

      }

    }
   
    res.status(200).json("borrado")
  } catch (error) {
    //console.log(error)
    res.status(500).json(`Hay un problema`)
  }
})

/************************************************************************* */

/*********************************************** */
/* RUTA PARA BORRAR EXAMENES */
/********************************************** */



/*********************************************** */
/* FIN DE LA RUTA PARA BORRAR EXAMENES */
/********************************************** */

/************************************************************************************ */





//exportar rutas
module.exports = route
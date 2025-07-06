const express = require("express")
const cloudinary = require("cloudinary")
const route = express.Router()
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
const auth_users = express.Router();

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



/*********************************************** */
/* RUTA PARA AGREGAR COMENTARIOS */
/********************************************** */
auth_users.post("/addComent", async (req, res) => {
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

/*********************************************** */
/* RUTA PARA AGREGAR RESPUESTAS_COMENTARIOS SELECCIONADO */
/********************************************** */
auth_users.post("/addComentResp", async (req, res) => {
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


/*********************************************** */
/* RUTA PARA AGREGAR RESPUESTAS_DE_LAS_RESPUESTAS_DEL_COMENTARIOS SELECCIONADO */
/********************************************** */
auth_users.post("/addRespComentResp", async (req, res) => {
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
auth_users.post("/addExamen", async (req, res) => {
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

})
/*********************************************** */
/* FIN DE LA RUTA PARA AGREGAR EXAMEN */
/********************************************** */


/************************************************************************* */

/*********************************************** */
/* RUTA PARA BORRAR EXAMENES */
/********************************************** */
auth_users.post("/deleteExam", async (req, res) => {
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


/*********************************************** */
/* FIN DE LA RUTA PARA BORRAR EXAMENES */
/********************************************** */

/************************************************************************************ */





//exportar rutas
module.exports.authorization = auth_users
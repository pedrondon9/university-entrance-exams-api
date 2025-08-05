//modelos
const UploadExamen = require("../models/upload.exam")
const ExamenDatos = require("../models/exame.data");
URL_UPLOAD = process.env.URL_UPLOAD || "http://localhost:5500/pdf/"
const AddTest = async (req, res) => {
try {
      const { body, method } = req
  console.log(body)
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
      res.status(200).json({ message: "El examen ya existe", success: false })
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
        exame_data.pdfLink = URL_UPLOAD + req.files.pdf[0].filename

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
          "pdfLink": URL_UPLOAD + req.files.pdf[0].filename,
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
        exame_data.pdfLink = URL_UPLOAD + req.files.pdf[0].filename

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
              "pdfLink": URL_UPLOAD + req.files.pdf[0].filename,
            }
          ]
        }

        dataUpdate.info.push(new_info)
        const new_update = await UploadExamen.findByIdAndUpdate(id, dataUpdate)
        console.log(new_update, "nuevo año")



        res.status(200).json({message: "publicado", success: true})
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
    exame_data.pdfLink = URL_UPLOAD + req.files.pdf[0].filename
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
            "pdfLink": URL_UPLOAD + req.files.pdf[0].filename,
          }
        ]
      }
    ]

    const guardarExamen = await examen.save()


    res.status(200).json({message: "publicado", success: true})
  }
} catch (error) {

        res.status(500).json({message: "Error interno del servidor" ,success:false})

}

}

module.exports = AddTest;
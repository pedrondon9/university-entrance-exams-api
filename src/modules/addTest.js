//modelos
const UploadExamen = require("../models/upload.exam")
const Materias = require("../models/materia");
URL_UPLOAD = process.env.URL_UPLOAD || "http://localhost:5500/pdf/"




const AddExam = async (req, res) => {
  try {
    const { body, method } = req
    //console.log(body,'Body')
    const { userName, userId, userPhoto, año, mes, face, materia, numComent, estado } = body;

    if (!(userId && año && mes && face && materia && estado && userName)) {
      return res.status(200).json({ message: "Faltan datos porfavor revisa el formulario", success: false })
    }

    var Materia = await Materias.findOne({ 'materia': materia })
    
    if (!Materia) {
      return res.status(200).json({ message: "La materia todavia no existe", success: false })
    }

    var testExist = await UploadExamen.findOne({ 'materia': materia, "año": año, "face": face, "estado": estado, "mes": mes })//probar si el examen ya existe

    if (testExist) {
      return res.status(200).json({ message: "El examen ya existe", success: false })
    }

    const exame_data = new UploadExamen()

    exame_data.userName = userName
    exame_data.userId = userId
    exame_data.idUser = userId
    exame_data.userPhoto = userPhoto
    exame_data.estado = estado
    exame_data.examenId = Materia._id
    exame_data.año = año
    exame_data.mes = mes
    exame_data.materia = materia
    exame_data.face = face
    exame_data.numComment = numComent
    exame_data.pdfLink = URL_UPLOAD + req.files.pdf[0].filename

    const examenData = await exame_data.save()

    console.log(examenData)


    const update = await Materias.findByIdAndUpdate(
      Materia._id,
      { $addToSet: { examenUploadId: exame_data._id } },
      { new: true }
    );

    console.log(update, "update")

    return res.status(200).json("publicado")

  } catch (error) {

    res.status(500).json({ message: "Error interno del servidor", success: false })

  }

}

module.exports = AddExam;
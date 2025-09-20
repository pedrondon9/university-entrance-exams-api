
/**
 * @file auth_route.js
 * @description Defines authentication and exam-related routes for the University Entrance Exams API.
 */

const express = require("express");

/**
 * Express Router instance for authentication and user-related routes.
 * @type {express.Router}
 */
const auth_users = express.Router();

/**
 * Base URL for uploaded files.
 * @type {string}
 */
URL_UPLOAD = process.env.URL_UPLOAD || "http://localhost:5500/pdf/";

/**
 * Mongoose model for comments.
 * @type {import('mongoose').Model}
 */
const Comment = require("../models/coments");

/**
 * Mongoose model for uploaded exams.
 * @type {import('mongoose').Model}
 */
const UploadExamen = require("../models/upload.exam");

/**
 * Mongoose model for response comments.
 * @type {import('mongoose').Model}
 */
const ResponseComment = require("../models/reponse");

/**
 * Mongoose model for response to response comments.
 * @type {import('mongoose').Model}
 */
const ResponseResponse = require("../models/response.respon");

/**
 * Mongoose model for exam data.
 * @type {import('mongoose').Model}
 */
const ExamenDatos = require("../models/materia");

/**
 * Module for adding a test/exam.
 * @type {Function}
 */
const AddTest = require("../modules/addTest");

/**
 * Adds a comment or response using the provided model instance.
 * @function
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {Object} modelInstance - Mongoose model instance to save.
 */
const addCommentAndResp = require("../modules/add.comment.and.resp");

/**
 * Route to add a new comment.
 * @route POST /addComent
 * @group Comments
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */


auth_users.post("/add_coment_resp", async (req, res) => {
  await addCommentAndResp(req, res)
});


/**
 * Route to add a new exam.
 * @route POST /addExamen
 * @group Exams
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
auth_users.post("/addExamen", async (req, res) => {
  await AddTest(req, res)
});

/**
 * Route to delete an exam by its ID and related parameters.
 * @route POST /deleteExam
 * @group Exams
 * @param {express.Request} req - Express request object containing exam details.
 * @param {express.Response} res - Express response object.
 */
auth_users.post("/deleteExam", async (req, res) => {
  const { id, año, mes, estado, face } = req.body
  try {
    const examen = await UploadExamen.findById(id)
    for (let i = 0; i < examen.info.length; i++) {
      if (examen.info[i].año === año) {
        for (let y = 0; y < examen.info[i].info_año.length; y++) {
          if (examen.info[i].info_año[y].mes === mes && examen.info[i].info_año[y].face === face && examen.info[i].info_año[y].estado === estado) {
            let arr = examen.info[i].info_año.splice(y, 1)
            const new_update = await UploadExamen.findByIdAndUpdate(id, examen)
            const deleteExamen = await ExamenDatos.findByIdAndDelete(arr[0]["examenId"])
          }
        }
      }
    }
    res.status(200).json("borrado")
  } catch (error) {
    res.status(500).json(`Hay un problema`)
  }
});


auth_users.get("/getExamenList/:id", async (req, res) => {
  console.log(req.params.id, 'ID')
  try {
    const examenList = await ExamenDatos.paginate({ userId: req.params.id }, {
      limit: 100,
      sort: { createdAt: -1 }
    })
    console.log(examenList)
    res.status(200).json(examenList)
  } catch (error) {
    console.log(error)
    res.status(500).json("hay un problema")
  }
})

const getExamsUploadUserId = require("../modules/getExamsUploadUserId");
auth_users.get("/get_exams_upload_iduser/:id", async (req, res) => {
  await getExamsUploadUserId(req, res)
})

/**
 * Exports the authorization router.
 * @type {express.Router}
 */
module.exports.authorization = auth_users
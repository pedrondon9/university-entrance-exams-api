const express = require("express")
const public_users = express.Router();


const Comment = require("../models/coments")
const UploadExamen = require("../models/upload.exam")
const User = require("../models/users")
const ResponseComment = require("../models/reponse")
const ResponseResponse = require("../models/response.respon")
const { verifyTokenRegister } = require("../modules/verify.token");



const RegisterUser = require('../modules/sign.up')
public_users.post('/registro_post', async (req, res) => {
    await RegisterUser(req, res)
})



const ResendEmail = require('../modules/resend.email')
public_users.post('/resend-email', verifyTokenRegister, async (req, res) => {
    await ResendEmail(req, res)
})



const changePassword = require('../modules/change.password')
public_users.post('/change-pasword', async (req, res) => {
    await changePassword(req, res)
})


const Login = require("../modules/sing.in");
public_users.post('/login_post', async (req, res) => {
    await Login(req, res)
})

const ActiveCount = require("../modules/active.count");
public_users.post('/active-count', verifyTokenRegister, async (req, res) => {
    await ActiveCount(req, res)
})




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


public_users.get("/getComent/:id", async (req, res) => {
    const { id } = req.params
    try {
        const comment = await Comment.paginate({ examenId: id }, {
            limit: 5,
            populate: {
                path: "userId",//referencia definida en el schema
            },
            populate: {
                path: "examenId",//referencia definida en el schema
            },
            sort: { createdAt: -1 }
        })
        console.log(comment)
        res.status(200).json({ sucess: true, response: comment, message: "comentarios obtenidos correctamente" })
    } catch (error) {
        res.status(500).json("hay un problema")
    }

})


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


public_users.get("/getExamenList", async (req, res) => {
    try {
        const examenList = await UploadExamen.find()
        //console.log(examenList)
        res.status(200).json(examenList)
    } catch (error) {
        //console.log(error)
        res.status(500).json("hay un problema")
    }
})

const GetMateriasPopulate = require("../modules/getMateriasPopulate");
public_users.get("/getExamen", async (req, res) => {
    await GetMateriasPopulate(req, res)
})

const GetMaterias = require("../modules/getMaterias");
public_users.get("/getMaterias", async (req, res) => {
    await GetMaterias(req, res)
})

const getComment = require("../modules/get.comment");
public_users.get("/get_comment/:id", async (req, res) => {
    await getComment(req, res)
})

const uploadImgs = require("../modules/upload.images");
public_users.post("/upload_imgs", async (req, res) => {
    await uploadImgs(req, res)
})





module.exports.public = public_users;

const secretToken = process.env.SESSION_SECRET
const Comentario = require("../models/coments");

async function  addCommentAndResp (req, res) {
    const { examenId, userId, content,parentId } = req.body;
    try {

        if (!(examenId && userId && content)) {
            return res.status(200).json({ message: "Faltan datos porfavor revisa el formulario", success: false })
        }

        const comment = await Comentario.create({
            examenId,
            userId,
            content,
            parentId:JSON.parse(parentId)
        });

        console.log(comment)

        return res.status(200).json({ message: "Comentario agregado", success: true, response:comment })


    } catch (error) {
        console.log(error)
        res.status(500).json("hay un problema")
    }
}

module.exports = addCommentAndResp

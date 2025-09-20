const secretToken = process.env.SESSION_SECRET
const Comentario = require("../models/coments");

async function GetComment(req, res) {
    try {

        const comentarios = await Comentario.find({ examenId:req.params.id })
            .populate({
                path: "userId",
            })
            .lean();

        // Función para armar el árbol de respuestas
        function buildTree(comments, parentId = null) {
            return comments
                .filter(c => String(c.parentId) === String(parentId))
                .map(c => ({
                    ...c,
                    respuestas: buildTree(comments, c._id)
                }));
        }

        const comentariosEnArbol = buildTree(comentarios);

        return res.status(200).json({ message: "Comentario agregado", success: true, response: comentariosEnArbol })


    } catch (error) {
        console.log(error)
        res.status(500).json("hay un problema")
    }
}

module.exports = GetComment
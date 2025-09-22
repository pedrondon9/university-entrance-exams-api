const secretToken = process.env.SESSION_SECRET
const Comentario = require("../models/coments");

async function GetComment(req, res) {
    try {

        //const comentarios = await Comentario.find({ examenId: req.params.id })
            //.populate({
                //path: "userId",
            //})
            //.lean();

        // Función para armar el árbol de respuestas
        //function buildTree(comments, parentId = null) {
            //return comments
                //.filter(c => String(c.parentId) === String(parentId))
                //.map(c => ({
                    //...c,
                    //respuestas: buildTree(comments, c._id)
                //}));
        //}




        // Suponiendo que Comentario tiene plugin mongoose-paginate-v2
        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            populate: { path: "userId" },
            lean: true
        };

        const result = await Comentario.paginate({ examenId: req.params.id }, options);

        // Función para armar el árbol de respuestas
        function buildTree(comments, parentId = null) {
            return comments
                .filter(c => String(c.parentId || "") === String(parentId || ""))
                .map(c => ({
                    ...c,
                    respuestas: buildTree(comments, c._id)
                }));
        }

        // Solo tomamos los docs para el árbol
        const comentariosEnArbol = buildTree(result.docs);

        // Retornamos el paginado + árbol
        res.json({
            totalDocs: result.totalDocs,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            totalPages: result.totalPages,
            page: result.page,
            limit: result.limit,
            success: true,
            response: comentariosEnArbol
        });

        //const comentariosEnArbol = buildTree(comentarios);

        //return res.status(200).json({ message: "Comentario agregado", success: true, response: comentariosEnArbol })


    } catch (error) {
        console.log(error)
        res.status(500).json("hay un problema")
    }
}

module.exports = GetComment
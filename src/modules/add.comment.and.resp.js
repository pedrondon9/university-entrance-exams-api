const secretToken = process.env.SESSION_SECRET


const addCommentAndResp = async (req, res, comment) => {
    var imagenes = []
    const imagen1 = req.files["imagen1"] ? URL_UPLOAD + req.files["imagen1"][0].filename : null
    const imagen2 = req.files["imagen2"] ? URL_UPLOAD + req.files["imagen2"][0].filename : null
    const imagen3 = req.files["imagen3"] ? URL_UPLOAD + req.files["imagen3"][0].filename : null
    const imagen4 = req.files["imagen4"] ? URL_UPLOAD + req.files["imagen4"][0].filename : null

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
        //const comment = new Comment()

        const { userName, userId, userPhoto, coment, comentActive, comentRepons,
            comentAddRepons, comentArrayRepons, comentCategory, comentLike, examenId, comentId } = body;


        comment.userName = userName
        comment.userId = userId
        comment.userPhoto = userPhoto
        if (examenId) {
            comment.examenId = examenId
        }
        comment.coment = coment

        if (comentId) {
            comment.comentId = comentId
        }

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
}

module.exports = {
    addCommentAndResp
};
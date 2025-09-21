
const upload = require("../models/upload.images")
URL_UPLOAD = process.env.URL_UPLOAD || "http://localhost:5500/pdf/"


async function UploadImages(req, res) {

    const logo = req.files?.["imagen1"]?.[0]
        ? URL_UPLOAD + req.files["imagen1"][0].filename
        : '';

    try {

        const data = new upload({ url: logo })
        /******************************** */
        //registrar
        /********************************* */

        const add_data = await data.save()

        return res.status(200).json({ success: true, message: 'ok', url: add_data.url })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error interno del servidor", success: false })
    }
}

module.exports = UploadImages
const materia = require("../models/materia");


async function GetMateriaPopulate(req, res) {
    try {
        const result = await materia.paginate({}, {
            limit: 100,
            sort: { createdAt: -1 }
        })
        return res.status(200).json({ success: true, message: '', response: result })

    } catch (error) {
        console.log(error)
        res.status(500).json("hay un problema")
    }
}

module.exports = GetMateriaPopulate
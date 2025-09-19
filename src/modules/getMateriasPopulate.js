const materia = require("../models/materia");


async function GetMaterias(req, res) {
    try {
        const result = await materia.find()
            .populate({
                path: "examenUploadId",
                options: { sort: { año: -1 } }
            })
            .lean();

        const materiasYExamenes = result.map(materia => {
            const agrupados = materia.examenUploadId.reduce((acc, examen) => {
                if (!acc[examen.año]) {
                    acc[examen.año] = [];
                }
                acc[examen.año].push(examen);
                return acc;
            }, {});

            return {
                ...materia,
                examenesPorYear: agrupados
            };
        });

        return res.status(200).json({ success: true, message: '', response: materiasYExamenes })

    } catch (error) {
        console.log(error)
        res.status(500).json("hay un problema")

    }
}

module.exports = GetMaterias
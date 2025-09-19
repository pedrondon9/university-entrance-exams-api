const materia = require("../models/materia");


async function GetMaterias(req, res) {
    try {
        const result = await materia.find()
            .populate({
                path: "examenUploadId",
                options: { sort: { año: -1 } }
            })
            .lean();

        const materiasYExamenes = result.map(m => {
            const exams = Array.isArray(m.examenUploadId) ? m.examenUploadId : []; // <-- guard
            const agrupados = exams.reduce((acc, examen) => {
                const year = examen && examen.año ? String(examen.año) : "unknown";
                if (!acc[year]) acc[year] = [];
                acc[year].push(examen);
                return acc;
            }, {});

            return {
                ...m,
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
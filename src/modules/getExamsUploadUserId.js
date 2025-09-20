const Materia = require("../models/materia");


async function GetExamsUploadUserId(req, res) {
    try {

        const materias = await Materia.find()
            .populate({
                path: "examenUploadId",      // relación con UploadExamen
                match: { userId: req.params.id },   // 👈 solo exámenes de ese usuario
                options: { sort: { año: -1 } } // opcional: ordenar por año
            })
            .lean();

        const materiasYExamenes = materias.map(m => {
            const exams = Array.isArray(m.examenUploadId) ? m.examenUploadId : [];

            const agrupados = Object.values(
                exams.reduce((acc, examen) => {
                    const year = examen?.año ? String(examen.año) : "unknown";
                    if (!acc[year]) {
                        acc[year] = { year, exams: [] };
                    }
                    acc[year].exams.push(examen);
                    return acc;
                }, {})
            ).sort((a, b) => b.year.localeCompare(a.year)); // 👈 orden descendente por año

            return {
                ...m,
                examenUploadId: agrupados
            };
        });
        return res.status(200).json({ success: true, message: '', response: materiasYExamenes })
    } catch (error) {

        console.log(error)
        res.status(500).json("hay un problema")

        
    }
}

module.exports = GetExamsUploadUserId
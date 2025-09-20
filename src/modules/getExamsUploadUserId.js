const Materia = require("../models/materia");


async function GetExamsUploadUserId(req, res) {
    try {

        const materias = await Materia.find()
            .populate({
                path: "examenUploadId",      // relación con UploadExamen
                match: { userId: req.params.id },   //solo exámenes de ese usuario
                options: { sort: { año: -1 } } // opcional: ordenar por año
            })
            .lean();

        const materiasYExamenesTestt = materias.map(m => {
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
            ).sort((a, b) => b.year.localeCompare(a.year)); //orden descendente por año

            return {
                ...m,
                examenUploadId: agrupados
            };
        });

        const materiasYExamenes = materias
            .map(m => {
                const exams = Array.isArray(m.examenUploadId) ? m.examenUploadId : [];

                if (exams.length === 0) return null; //si no hay exámenes, descartamos

                const agrupados = Object.values(
                    exams.reduce((acc, examen) => {
                        const year = examen?.año ? String(examen.año) : "unknown";
                        if (!acc[year]) {
                            acc[year] = { year, cantitie: 0, exams: [] };
                        }
                        acc[year].exams.push(examen);
                        acc[year].cantitie = acc[year].exams.length;
                        return acc;
                    }, {})
                ).sort((a, b) => b.year.localeCompare(a.year)); // ordenar descendente por año

                return {
                    ...m,
                    examenUploadId: agrupados
                };
            })
            .filter(m => m !== null); //eliminar materias sin exámenes
        return res.status(200).json({ success: true, message: '', response: materiasYExamenes })
    } catch (error) {

        console.log(error)
        res.status(500).json("hay un problema")


    }
}

module.exports = GetExamsUploadUserId
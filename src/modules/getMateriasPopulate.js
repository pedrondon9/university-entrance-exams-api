const materia = require("../models/materia");


async function GetMaterias(req, res) {
    try {
        const result = await materia.find()
            .populate({
                path: "examenUploadId",
                options: { sort: { año: -1 } }
            })
            .lean();

        const materiasYExamenesTest = result.map(m => {
            const exams = Array.isArray(m.examenUploadId) ? m.examenUploadId : []; // <-- guard

            const agrupados = Object.values(
                exams.reduce((acc, examen) => {
                    const year = examen?.año ? String(examen.año) : "unknown";
                    if (!acc[year]) {
                        acc[year] = { year, exams: [] };
                    }
                    acc[year].exams.push(examen);
                    return acc;
                }, {})
            );

            return {
                ...m,
                examenUploadId: agrupados // ahora es un array [{year, exams:[]}, ...]
            };
        });


        const materiasYExamenesTestt = result.map(m => {
            const exams = Array.isArray(m.examenUploadId) ? m.examenUploadId : [];

            const agrupados = Object.values(
                exams.reduce((acc, examen) => {
                    const year = examen?.año ? String(examen.año) : "unknown";
                    if (!acc[year]) {
                        acc[year] = { year, cantitie: 0, exams: [] };
                    }
                    acc[year].exams.push(examen);
                    acc[year].cantitie = acc[year].exams.length; // 👈 contador actualizado
                    return acc;
                }, {})
            ).sort((a, b) => b.year.localeCompare(a.year)); // ordenar descendente por año

            return {
                ...m,
                examenUploadId: agrupados
            };
        });


        const materiasYExamenesTTTT = result.map(m => {
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
        }).filter(m => m !== null); //eliminar materias sin exámenes


        const materiasYExamenes = result
            .map(m => {
                const exams = Array.isArray(m.examenUploadId) ? m.examenUploadId : [];

                if (exams.length === 0) return null; // descartar materias sin exámenes

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
                ).sort((a, b) => b.year.localeCompare(a.year));

                return {
                    name: m.name || m.materia || "unknown", // aseguro nombre
                    cantitie: exams.length, // total exámenes en la materia
                    examenUploadId: agrupados
                };
            })
            .filter(m => m !== null); // solo materias con exámenes


        return res.status(200).json({ success: true, message: '', response: materiasYExamenes })

    } catch (error) {
        console.log(error)
        res.status(500).json("hay un problema")

    }
}

module.exports = GetMaterias
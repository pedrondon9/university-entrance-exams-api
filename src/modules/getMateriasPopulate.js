const materia = require("../models/materia");


async function GetMaterias(req, res) {
    try {
        const result = await materia.paginate({}, {
            limit: 100,
            populate: {
                path: "examenUploadId",//referencia definida en el schema
              },
            sort: { createdAt: -1 }
        })

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
    }
}

module.exports = GetMaterias
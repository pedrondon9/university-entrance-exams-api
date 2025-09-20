// modelo de almacenaje de las noticias
const { Schema, model, models } = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

//PARA AÑADIR COMENTARIOS

const Comment = new Schema({
    examenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UploadExamen",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },

    // Si es null → comentario raíz
    // Si tiene valor → es respuesta a otro comentario
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comentario",
        default: null,
    },
}, {
    timestamps: true // para guardar el tiempo de la creacion y actualizacion
}
);

Comment.plugin(mongoosePaginate)
module.exports = model("commentS", Comment)

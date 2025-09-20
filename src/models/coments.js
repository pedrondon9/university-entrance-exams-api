// modelo de almacenaje de las noticias
const { Schema, model, models } = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

//PARA AÑADIR COMENTARIOS

const Comment = new Schema({
    examenId: {
        type: Schema.Types.ObjectId,
        ref: "UploadExamen",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: "commentS",
        default: null,
    },
}, {
    timestamps: true // para guardar el tiempo de la creacion y actualizacion
}
);

Comment.plugin(mongoosePaginate)
module.exports = model("commentS", Comment)

const {Schema , model , models} = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

//RESPONDER AL COMENTARIO PRINCIPAL
const upload_images =  new Schema({
    url: { type: String, trim: true },
},{
    timestamps:true // para guardar el tiempo de la creacion y actualizacion
}
);

upload_images.plugin(mongoosePaginate)
module.exports = model("uploadimages" , upload_images)
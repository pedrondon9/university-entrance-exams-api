// modelo de almacenaje de las noticias
const {Schema , model , models} = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")



const Noticia =  new Schema({
    titulo:{type:String,trim:true},
    descripcion:{type:String,trim:true},
    linkFuente:{type:String,trim:true},
    foto1:{type:String},
    foto2:{type:String},
    foto3:{type:String},
    video1:{type:String},
    video2:{type:String},
    video3:{type:String},
    autor:{type:String},
    comentarios:{type:Array,trim:true},
    categoria:{type:String,trim:true},
    subcategoria:{type:String,trim:true},
},{
    timestamps:true // para guardar el tiempo de la creacion y actualizacion
}
);

Noticia.plugin(mongoosePaginate)
export default models.noticia || model("noticia" , Noticia)
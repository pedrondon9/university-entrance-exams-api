const {Schema , model} = require("mongoose")
const data = new Date()
const bcrypt = require("bcrypt")

//registrar usuario

const users =  new Schema({
    fullname:{type:String},
    email:{type:String},
    password:{type:String},
    roles:[{type:Schema.Types.ObjectId,ref:"Role"}],
    examenUploadId: [{ type: Schema.Types.ObjectId, ref: 'uploadExamen' }],//El id que relacionara el examen con sus comentarios
    state:{type:Boolean},
    token:{type:String},
    contact:{type:String},
    country:{type:String},
    sex:{type:String},
    role:{type:String},
    isVerified:{type:Boolean}
});

users.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
  
users.methods.comparePassword= function (password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = model("user" , users)
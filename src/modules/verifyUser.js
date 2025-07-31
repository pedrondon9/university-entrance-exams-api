const { RES_NO_PERMISION, RES_TOKEN_EXPIRED } = require("../../config")
const Users = require("../modelos/userRegistro");
const bcrypt = require("bcrypt")



const verifyUsers = async (tokenData,token,res) => {
    if (!tokenData) return res.status(405).json({ verify: false, message: '' })

    const user = await Users.findOne({
        _id: tokenData._id,
        //'tokens.token': token  // Notación para buscar en array de objetos
    })

    if (!user) {

        return res.status(403).json({ verify: false, messege: '' })
    }

    return user

}

module.exports = {
    verifyUsers
}
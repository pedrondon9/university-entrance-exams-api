const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")




/********************************* */
/**PARA IMPORTAR MODELOS*****************/
/********************************* */


const User = require("../modelos/userRegistro");
const SendEmail = require("./sendEmail");
const { registerUser } = require("./authRegister");




/********************************* */
/**FIN DE IMPORTAR MODELOS*****************/
/********************************* */



async function ResendEmail(req, res) {

    try {
        const {user,token} = await registerUser(req, res)

        console.log(user, "user", token, "token");

        res.status(200).json({ success: true, token: token,userData:user, message: 'Cuenta activada' })

    } catch (error) {

        console.log(error)

        res.status(403).json({ success: false, message: "hay un problema" })

    }
}

module.exports = ResendEmail
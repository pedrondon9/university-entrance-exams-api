/********************************* */
/**PARA IMPORTAR MODELOS*****************/
/********************************* */
const jwt = require('jsonwebtoken');
const SECRET_TOKEN = process.env.SESSION_SECRET;
const { registerUser } = require("./auth.register");

async function ResendEmail(req, res) {
    const { token, user } = req.body;

    try {

        const { user, token } = await registerUser(req, res)

        console.log(user, "user", token, "token");

        res.status(200).json({ success: true, token: token, userData: user, message: 'Cuenta activada, inicia sesion en la pagina principal' })

    } catch (error) {

        console.log(error)

        res.status(403).json({ success: false, message: "hay un problema" })

    }
}

module.exports = ResendEmail
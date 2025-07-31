const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")




/********************************* */
/**PARA IMPORTAR MODELOS*****************/
/********************************* */


const User = require("../modelos/userRegistro");
const SendEmail = require("./sendEmail");




/********************************* */
/**FIN DE IMPORTAR MODELOS*****************/
/********************************* */



async function ResendEmail(req, res) {
    const { user , token } = req.body


    try {


        const verificationLink = `http://localhost:3000/${token}`;        
        const constentEmail = `<p>Hi ${user.fullname},</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${verificationLink}">Verify Email</a>`;

        await SendEmail(user.email, constentEmail);

        console.log(user,'hhhh')

        res.status(200).json({ success: true, token: token, message: 'Nuevo codigo enviado' })



    } catch (error) {

        res.status(403).json({ success: false, message: "hay un problema" })

    }
}

module.exports = ResendEmail
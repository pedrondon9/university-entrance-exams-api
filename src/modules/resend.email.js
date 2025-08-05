const SendEmail = require("./send.email");

async function ResendEmail(req, res) {
    const { user , token } = req.body


    try {

        const verificationLink = `http://localhost:3000/${token}`;        
        const constentEmail = `<p>Hi ${user.fullname},</p>
             <p>Porfavor verifica tu correo haciendo clik en el siguiente enlace:</p>
             <a href="${verificationLink}">Verifica Correo</a>`;

        await SendEmail(user.email, constentEmail);

        console.log(user,'hhhh')

        res.status(200).json({ success: true, token: token, message: 'Nuevo codigo enviado' })



    } catch (error) {

        res.status(500).json({ success: false, message:  "Error interno del servidor"  })

    }
}

module.exports = ResendEmail
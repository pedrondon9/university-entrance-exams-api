const SendEmail = require("./send.email");

async function ResendEmail(req, res) {
    const { user , token } = req.body


    try {

        const verificationLink = `https://selectividad.mumbx.com/#/confirm/${token}`; 

        const constentEmail = `<p>Hi ${user.user.fullname},</p>
             <p>Porfavor verifica tu correo haciendo clik en el siguiente enlace:</p>
             <a href="${verificationLink}">Verifica Correo</a>`;

        const resend  = await SendEmail(user.user.email, constentEmail);

        //console.log(user.user,'hhhh')

        //console.log(resend,'gggg')

        res.status(200).json({ success: true, token: token, message: 'Nuevo link de verificacion enviado' })



    } catch (error) {
        console.log(error)

        res.status(500).json({ success: false, message:  "Error interno del servidor"  })

    }
}

module.exports = ResendEmail
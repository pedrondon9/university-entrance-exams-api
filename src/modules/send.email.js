const nodemailer = require("nodemailer");
const { EMAIL_CODE } = process.env;



async function SendEmail(email, content) {
    try {
        const html = "<head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Document</title></head>"
        const html1 = "<body>" + `${content}` + "</body>"

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // 
            auth: {
                user: "pedronnd689@gmail.com", // 
                pass: EMAIL_CODE, // 
            },
        });

        const resEmail = await transporter.sendMail({
            from: '"SELECTIVIDAD" <noreply@selectividad.site>', //el email que va emitar
            to: email, // lista de email que van a resibir
            subject: "Verifica tu correo", //
            text: "Hola", // 
            html: html + html1, // html body
        });


    } catch (error) {

    }

}

module.exports = SendEmail
const jwt = require('jsonwebtoken');
const SECRET_TOKEN = process.env.SESSION_SECRET;
const { verifyUsers } = require('./verify.user'); // asumo que tienes esto

const verifyToken = async (req, res, next) => {
    try {
        const headerToken = req.headers["x-access-token"] || req.headers.authorization;

        if (!headerToken) {
            return res.status(401).json({ verify: false, message: "Toekn no encontrado" });
        }

        const token = headerToken.startsWith("Bearer ")
            ? headerToken.split(" ")[1]
            : headerToken;

        jwt.verify(token, SECRET_TOKEN, async (err, tokenData) => {
            if (err) {
                return res.status(401).json({ verify: false, message: "Token expirado inicia sesion" });
            }

            try {
                console.log(tokenData, "tokenData en verifyToken");
                const user = await verifyUsers(tokenData.user, token, res);
                if (!user) {
                    return res.status(403).json({ verify: false, message: "Porfavor inicia sesion" });
                }
                req.body.user = user;
                req.body.token = token;
                return next();

            } catch (err) {
                console.error("Error al verificar el usuario:", err);
                return res.status(500).json({ verify: false, message: "Error interno del servidor" });
            }
        });
    } catch (err) {
        console.error("Error general en middleware:", err);
        return res.status(500).json({ verify: false, message: "Error interno del servidor" });
    }
};




const verifyTokenRegister = async (req, res, next) => {
    console.log(req.body, "req.body en verifyTokenRegister");
    try {
        const headerToken = req.body.token;
        if (!headerToken) {
            return res.status(401).json({ verify: false, message: "Token no encontrado" });
        }
        const token = headerToken.startsWith("Bearer ")
            ? headerToken.split(" ")[1]
            : headerToken;


        jwt.verify(token, SECRET_TOKEN, async (err, tokenData) => {
            if (err) {
                return res.status(401).json({ verify: false, message: "Token expirado inicia sesion" });
            }

            try {
                
                req.body.user = tokenData;
                return next();

            } catch (err) {
                console.error("Error al verificar el usuario:", err);
                return res.status(500).json({ verify: false, message: "Error interno del servidor" });
            }
        });
    } catch (err) {
        console.log(err , "Error general en verifyTokenRegister");
        return res.status(500).json({ verify: false, message: "Error interno del servidor" });
    }
};


module.exports = {
    verifyToken,
    verifyTokenRegister
}

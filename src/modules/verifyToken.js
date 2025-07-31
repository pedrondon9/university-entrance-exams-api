const jwt = require('jsonwebtoken');
const secretToken = process.env.SESSION_SECRET;
const { verifyUsers } = require('./verifyUser'); // asumo que tienes esto
const User = require("../modelos/userRegistro");

const verifyToken = async (req, res, next) => {
    console.log('Verifying token...', req.body);
    try {
        const token = req.body.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'Token no suministrado' });
        }

        const decoded = jwt.verify(token, secretToken);

        req.body.user = decoded;
        req.body.tokenData = decoded;

        next();
        return
    } catch (err) {

        console.error('Error verifying token:', err);

        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {

            return res.status(401).json({ success: false, message: 'Token expirado, por favor inicia sesión nuevamente' });

        }

        return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }
};

module.exports = {
    verifyToken
}

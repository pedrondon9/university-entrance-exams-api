// Limpieza programada cada hora
const moment = require("moment");
const User = require("../modelos/userRegistro");

const cleanupUnverifiedUsers = async () => {
  try {
    const threshold = moment().subtract(20, 'minute').toDate();
    
    const result = await User.deleteMany({
      isVerified: false,
      createdAt: { $lte: threshold }
    });
    
    console.log(`Limpiados ${result.deletedCount} usuarios no verificados`);
  } catch (error) {
    console.error('Error en limpieza de usuarios:', error);
  }
};

module.exports = {
    cleanupUnverifiedUsers
}
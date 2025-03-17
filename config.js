const path = require("path");

/*
 * Toma las variables de .env. Asi otro desarrollador sabra que variables
 * debe incluir su version de archivo .env
 */

const DIGI_DB_OCEAN = process.env.DIGI_DB_OCEAN;


const PUBLIC_DIR_GNOP = path.join(__dirname, "public");



module.exports = {
  DIGI_DB_OCEAN
};

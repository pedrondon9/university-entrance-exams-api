// jwtCache.js
const Redis = require("ioredis");
const redis = new Redis();

const secretToken = process.env.SESSION_SECRET 

// Guardar token en cache con expiración
async function cacheData(key, data, ttl = 3600) { // ttl en segundos
  await redis.setex(`token:${key}`, ttl, JSON.stringify(data));
}

// Obtener token de cache
async function getCachedData(key) {

  const data = await redis.get(`token:${key}`);

  return data ? JSON.parse(data) : null;


}

// Eliminar token de cache
async function deleteCachedData(key) {
  await redis.del(`token:${key}`);
}




module.exports = { cacheData, getCachedData, deleteCachedData };
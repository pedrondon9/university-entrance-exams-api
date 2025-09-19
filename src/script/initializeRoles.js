const { ROLES } = require('../config/roles');
const { PERMISSIONS } = require('../config/permissions');
const Role = require('../models/Role');
const Exame = require('../models/materia');
const Permission = require('../models/Permission');

const initializeRoles = async () => {
  
    const categoriesEvents = [
        { name: 'lengua y literatura española', description: 'lengua y literatura española', tags: ['lengua', 'Lengua', 'literatura', 'española'] },
        { name: 'frances', description: 'Frances', tags: ['frances', 'Francés', 'idioma'] },
        { name: 'ingles', description: 'Ingles', tags: ['ingles', 'Inglés', 'idioma'] },
        { name: 'historia de africa y de G.E', description: 'historia de Africa y de G.E', tags: ['historia', 'África', 'G.E', 'historia de africa y de G.E'] },
        { name: 'matematicas II', description: 'Matematicas II', tags: ['matemáticas', 'Matematicas II', 'mates'] },
        { name: 'Electrotecnia', description: 'Electrotecnia', tags: ['electrotecnia', 'electricidad', 'tecnología'] },
        { name: 'Tecnología industrial', description: 'Tecnología industrial', tags: ['tecnología', 'industrial', 'tecnología industrial'] },
        { name: 'Química', description: 'Química', tags: ['química', 'ciencia', 'quimica'] },
        { name: 'Física', description: 'Física', tags: ['física', 'ciencia', 'fisica'] },
        { name: 'Geologia', description: 'Geologia', tags: ['geología', 'geologia', 'ciencia'] },
        { name: 'Dibujo técnico II', description: 'Dibujo técnico II', tags: ['dibujo', 'técnico', 'dibujo técnico II'] },
        { name: 'Economía de la Empresa', description: 'Economía de la Empresa', tags: ['economía', 'empresa', 'economía de la empresa'] },
        { name: 'Ciencias de la tierra y m.a', description: 'Ciencias de la tierra y m.a', tags: ['ciencias', 'tierra', 'medio ambiente', 'ciencias de la tierra y m.a'] },
        { name: 'Biología', description: 'Biología', tags: ['biología', 'ciencia', 'biologia'] },
        { name: 'Ciencias de la nat. y salud', description: 'Ciencias de la nat. y salud', tags: ['ciencias', 'naturaleza', 'salud', 'ciencias de la naturaleza y salud'] },
        { name: 'Historia del mundo actual', description: 'Historia del mundo actual', tags: ['historia', 'mundo actual', 'historia del mundo actual'] },
        { name: 'Historia de la filosofía', description: 'Historia de la filosofía', tags: ['historia', 'filosofía', 'historia de la filosofía'] },
        { name: 'Griego', description: 'Griego', tags: ['griego', 'idioma clásico', 'lengua griega'] },
        { name: 'Latín', description: 'Latín', tags: ['latín', 'idioma clásico', 'lengua latina'] },
        { name: 'Historia del Arte', description: 'Historia del Arte', tags: ['historia', 'arte', 'historia del arte'] },
        { name: 'Geografía de los grandes espacios', description: 'Geografía de los grandes espacios', tags: ['geografía', 'espacios', 'geografía de los grandes espacios'] },
        { name: 'Matemáticas Aplicadas a las C.S II', description: 'Matemáticas Aplicadas a las C.S II', tags: ['matemáticas', 'ciencias sociales', 'mates aplicadas', 'Matemáticas Aplicadas a las C.S II'] }
      ];
      

    for (const categorie of categoriesEvents) {
        await Exame.findOneAndUpdate(
            { name: categorie.name },
            categorie,
            { upsert: true, new: true }
        );
    }


    // Crear roles con sus permisos
    const adminPermissions = Object.values(PERMISSIONS);
    const userPermissions = ['content_read'];
    const roles = [
        {
            name: ROLES.ADMIN,
            description: 'Administrador con todos los permisos',
            permissions: await Permission.find({ name: { $in: adminPermissions } }).select('_id'),
            isDefault: false
        },
        {
            name: ROLES.USER,
            description: 'Usuario básico',
            permissions: await Permission.find({ name: { $in: userPermissions } }).select('_id'),
            isDefault: true
        },
    ];

    for (const role of roles) {
        await Role.findOneAndUpdate(
            { name: role.name },
            role,
            { upsert: true, new: true }
        );
    }

    console.log('Roles y permisos inicializados correctamente');
};

module.exports = {
    initializeRoles
}


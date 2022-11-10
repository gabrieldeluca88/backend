const Config = require('../config/index')

const admin = (req, res, next) => {
    if(!Config.administrador){
        return res.status(401).json({
            error: -1,
            descripcion: "Metodo no autorizado"
        })
    }
    next()
}

module.exports = admin;
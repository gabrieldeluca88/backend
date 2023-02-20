const {ClientMongo} = require ("./mongodb/productosMongo.js")
const sqlController = require ("./SQL/BDproductos.js")

let dao;
let argv = process.argv[2];

switch (argv) {
    case "sql":
        dao = new ClientMongo;
        console.log(`Se eligio SQL a partir de los comandos: ${argv}`);
        break;
    default:
        dao = new ClientMongo;
        console.log(argv);
        break;
}

function getDao() {
    return dao;
}

module.exports = {getDao};
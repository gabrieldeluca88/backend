require('dotenv').config()
const server = require ("./services/server")
const {initConnection} = require ("./db/database.js")
const minimist = require  ('minimist');
const cluster = require ('cluster');
const os = require ('os');


const PORT = process.env.PORT || 8080;

const init = async () => {
        await initConnection();
    
        server.listen(PORT, () => {
        console.log(`servidor listo, puerto: ${PORT}`)
    })
}

init();


//parametros a pasar que el servidor se ejecute en modo FOLK o CLUSTER
// Folk: FOLK // Cluster: CLUSTER

/* const numCPUs = os.cpus().length;

const objetoConfiguracion = {
    alias: {
        p: "port",
        m: "modo"
    },
    default: {
        port: 8080,
        modo: "FOLK"
    }
}

const args = minimist(process.argv, objetoConfiguracion);

const puerto = args.port;
const modo = args.modo

const init = async () => {
    await initConnection();

    server.listen(puerto, () => {
    console.log(`servidor listo, puerto: ${puerto}`)
})
}

if(modo == "CLUSTER" && cluster.isPrimary){
    console.log(`cantidad de nucleos ${numCPUs}`);
    console.log(process.pid);
    for (let i = 0; i < numCPUs; i++){
        cluster.fork()
    }
    
    cluster.on("exit", (worker, code) => {
        console.log(`worker ${worker.process.pid} termino con el codigo ${code}`)
        cluster.fork()
    })
} else {
    init();
}
 */
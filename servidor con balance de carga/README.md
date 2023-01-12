la ruta "/login" tiene el metodo de get, lo cual significa que funciona desde el navegador, mostrando un front basico en donde esta un formulario, en el cual debes poner el nombre del usuario y la contraseña. Dos ejemplos los cuales se pueden probar son:

nombre: rodolfo, contraseña: 1234
nombre: pedro, conreaseña: 123456
Al probar con uno de los dos usuarios se podra ver como aparece un mensaje de bienvenida arriba del contenido




/// "prueba": "nodemon .src/index --p 8000 --m CLUSTER", "pruebaForever": "forever start .src/index.js", "listForever": "forever list"

para hacer el servidor de modo cluster se debe ejecutar "npm run prueba" mientras que para un servidor de modo folk seria "npm run dev"

probando forever se debe usar los comandos de "npm run pruebaForever"

Comandos usados en consola para usar PM2:

Modo Folk: pm2 start src/index.js

Modo Cluster: pm2 start src/index.js --name="server" --watch -i max

PM2 Ecosystem: pm2 start ecosystem.config.js

el archivo nginx1.conf muestra la solucion del primer inciso

# __Proyecto final de Backend__

Desarrollo de una API basada en las operaciones de CRUD de un ecommerce. 

En el archivo .env está la variable DATABASE para entorno de producción y desarrrollo. Por defecto está en el de producción (Mongo Atlas). 

Para trabajar en desarrollo (Mongo Local) se debe descomentar y dejar comentada la de producción.

Trabajando por defecto sobre el puerto 8080: http://localhost:8080 utilizamos los métodos GET, POST, PUT y DELETE para realizar las operaciones.

Se creó el front para facilitar las pruebas.

- [DEPLOY EN RAILWAY]()


## __API Reference__

### __Productos__
#### Get All

```http
  GET /api/productos
```
Devuelve todos los productos almacenados en la base de datos.

#### Get By ID

```http
  GET /api/productos/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID del producto|

Devuelve el producto con ese ID y en caso de no existir devuelve que no se encontró.

#### Get By Category

```http
  POST /api/productos/:category
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `category`      | `string` | **Required**. Categoría del producto|

Devuelve todos los productos que coincidan con la categoría.

Ejemplo: Madera y Ceramica




#### Save

```http
  POST /api/productos/
```
Recibe los datos del producto y devuelve el ID.

Producto de ejemplo: 

  { 
    "name": "alfombra bordo",
    "description": "alfombra de color bordo decorado",
    "code": 15923824,
    "thumbnail": "https://i.postimg.cc/bNNVvkYM/alfombra-bordo.webp",
    "price": 4500,
    "stock": 15,
    "category": "alfombra" 
  }

![App Screenshot](https://i.postimg.cc/hjnv8SfJ/prueba-2.png)

#### Update By ID

```http
  PUT /api/productos/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID del producto|

Recibe los datos del producto a modificar y devuelve nombre y ID.

![App Screenshot](https://i.postimg.cc/ZRnFSFxF/prueba-3.png)

#### Delete By ID
```http
  DELETE /api/productos/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID del producto|

Se elimina el producto de la base de datos.

![App Screenshot](https://i.postimg.cc/Lsn3d3Tk/prueba-4.png)



### __Carritos__
#### Save

```http
  POST /api/carrito
```
Se crea un carrito para el usuario.

#### Delete by ID

```http
  DELETE /api/carrito/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID del carrito|

Se elimina el carrito con el ID informado.

![App Screenshot](https://i.postimg.cc/Qxhz2vWp/prueba-5.png)


#### Get All

```http
  GET /api/carrito/:id/productos
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID del carrito|

Devuelve los productos incluidos en el carrito.



#### Save products

```http
  POST /api/carrito/:id/productos
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID del carrito|

Se agregan productos al carrito con el ID informado.

#### Delete product by ID

```http
  DELETE /api/carrito/:id/productos/:id_prod
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID del carrito|
| `id_prod`      | `string` | **Required**. ID del producto|

Se elimina del carrito el producto con el ID informado.

![App Screenshot](https://i.postimg.cc/wBnJCt07/prueba-7.png)


#### Find user´s cart

```http
  GET /api/carrito/idCarrito/:id_user
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id_user`      | `string` | **Required**. ID del usuario|

Devuelve el carrito del usuario que está sin finalizar.

#### Update cart

```http
  PUT /api/carrito/:id_user
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id_user`      | `string` | **Required**. ID del usuario|

Actualiza el estado del carrito a "finalizado" para crear la orden de compra.

### __Ordenes__
#### Get All

```http
  GET /ordenes
```

Devuelve las ordenes de compra.

#### Create order

```http
  POST /ordenes/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID del carrito|

Se genera la orden de compra con los productos del carrito.

### __Chat__
#### Get All

```http
  GET /chat
```

Devuelve los mensajes del chat.

#### Get by email

```http
  GET /chat/:email
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. Mail del usuario|

Devuelve los mensajes del usuario según su email.

### __Variables de entorno__

```http
  GET /variables
```

Devuelve la información de las variables de entorno.

## __Front__

Se crean las vistas con ejs:
- **Registro:** Permite crear un usuario para iniciar sesión. 
![App Screenshot](https://i.postimg.cc/Hsy3ZgzY/pag-registro.png)


Cuando se registra un nuevo usuario se crea un carrito vacío y se envía un mail al administrador utilizando Nodemailer y Ethereal.


- **Inicio de sesión:** debe colocar el mail y contraseña. 

![App Screenshot](https://i.postimg.cc/T1y5PT1p/pag-login.png)

- **Productos:** Página a la que es redirigido cuando inicia sesión, se muestran los productos y permite agregarlos al carrito. 



- **Carrito:** Se muestran los productos del carrito con sus respectivos precios, cantidades y suma del total.



- **Chat:** Permite al usuario enviar mensajes que serán visibles por todos y filtrar los mensajes propios.

![App Screenshot](https://i.postimg.cc/nhcL0HKg/pag-mensajes.png)

- **Mi Cuenta:** Muestra los datos del usuario (mail, nombre, dirección y celular).


## __Run Locally__


Instalar dependencias:

```bash
  npm install
```

Iniciar el servidor:

```bash
  node .
```


## __Environment Variables__

Para correr el proyecto, necesitarás agregar las siguientes variables al archivo .env:

`TIPO`

`DATABASE`

`SMTP_USER`

`SMTP_PASS`

`ADMIN_MAIL`


## __Tecnologías__

Teconologías utilizadas en el proyecto:
* [express]: Version 4.18.1
* [dotenv]:  Version 16.0.3
* [mongoose]: Version 6.7.0
* [connect-mongo]: Version 4.6.0
* [express-session]: Version 1.17.3
* [bcrypt]: Version 5.1.0
* [ejs]: Version 3.1.8
* [log4js]: Version 6.7.1
* [mongodb]: Version 4.11.0
* [nodemon]: Version 2.0.20
* [minimist]: Version 1.2.7
* [passport]: Version 0.6.0
* [passport-local]: Version 1.0.0
* [nodemailer]: Version 6.9.0
* [socket.io]: Version 4.6.1




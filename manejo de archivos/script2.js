const fs = require("fs");
const nombreArchivo = "productos.json";


class Contenedor {
    constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo;
    }

    async validateExistFile() {
    try {
        await fs.promises.stat(this.nombreArchivo);
        return 1;
    } catch (error) {
        console.log("El archivo no existe!");
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify([]));
        return 0;
    }
    }

    async getAll() {
    try {
        const data = await fs.promises.readFile(this.nombreArchivo, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.log("No se pudo traer los productos!", error);
    }
    }

    async saveProducts(products) {
    try {
        const data = JSON.stringify(products, null, "\t");
        await fs.promises.writeFile(this.nombreArchivo, data);
    } catch (error) {
        console.log("No se guardaron los productos!", error);
    }
    }

    async getById(idBuscado) {
    try {
        const products = await this.getAll();
        const index = products.findIndex((product) => product.id === idBuscado);
        if (index < 0) {
        throw new Error("No existe el producto!");
        }
        return products[index];
    } catch (error) {
        console.log("Error al buscar producto!", error);
    }
    }

    async saveProduct(data) {
    if (
        !data.title || !data.price || !data.thumbnail || typeof data.title !== "string" || typeof data.price !== "number" ||
        typeof data.thumbnail !== "string") throw new Error("datos inválidos!");

    try {
        const products = await this.getAll();

        let id = 1;

        if (products.length) {
        id = products[products.length - 1].id + 1;
        }

        const newProduct = {
        title: data.title,
        price: data.price,
        thumbnail: data.thumbnail,
        id: id,
        };

        products.push(newProduct);

        await this.saveProducts(products);
    } catch (error) {
        console.log("Error no se guardo el producto!", error);
    }
    }

    async deleteAll() {
    try {
        await this.saveProducts([]);
    } catch (error) {
        console.log("Error no se borraron los productos!", error);
    }
    }

    async deleteById(idBuscado) {
    try {
        const products = await this.getAll();

        const index = products.findIndex((product) => product.id === idBuscado);

        if (index < 0) {
        throw new Error("El producto a eliminar no existe!");
        }

        products.splice(index, 1);

        await this.saveProducts(products);
    } catch (error) {
        console.log("Error al borrar el producto seleccionado!", error);
    }
    }
}

const file = new Contenedor(nombreArchivo);

const main = async () => {
    try {
    let exist = await file.validateExistFile();
    if (exist === 1) {
        console.log("El archivo ya existe!");
    }

    let products = await file.getAll();

    if (products.length == 0) {
        console.log("El archivo no tiene productos");
    } else {
        console.log(products);
        console.log('1) Llamado a los productos getAll ');
    }

    const product = await file.getById(1);
    if (product != null) {
        console.log(product);
        console.log('2) Llamado a producto por id ');
    }

    const newProduct = {
        title: "mochila",
        price: 5000,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/bag-pack-container-school-128.png",
    };

    await file.saveProduct(newProduct);
    products = await file.getAll();
    console.log(products);
    console.log('3) crea nuevo producto y lo guarda en el array ')

    try {
        await file.deleteById(2);
        products = await file.getAll();
        console.log(products);
        console.log('4) borra un producto por id ')
    } catch (error) {
        console.log(error);
    }

    await file.deleteAll();
    products = await file.getAll();
    console.log(products);
    console.log('5) borra todo ')
    } catch (error) {
    console.log("Error", error);
    }
};

main();
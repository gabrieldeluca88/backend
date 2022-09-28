class Usuario {
    constructor(nombre,apellido,libros,mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName() {
        console.log(`${this.nombre} ${this.apellido}`)
    }

    addMascota(mascota) {
        this.mascotas.push(mascota)
    }

    countMascotas(){
        let cantidadMascotas = this.mascotas.length
        console.log(cantidadMascotas)
    }

    addBook(nombre, autor){
        this.libros.push({
            nombre: nombre,
            autor: autor,});
    }

    getBookNames(){
        let arraybookName = [];
        this.libros.forEach((libro) => arraybookName.push(libro.nombre));
        return arraybookName;
    }

}



const usuario1 = new Usuario(
    "bruce", "wayne", [
    { nombre : "dune", autor: "frank herbert"}
    ],
    ["gato", "conejo", "pez"]);


// prueba: traer nombre de usuario1
usuario1.getFullName()

// prueba: traer la cantidad de mascotas
usuario1.countMascotas()

//prueba: añadir una nueva mascota
usuario1.addMascota("perro")

//prueba: agregar un nuevo libro
usuario1.addBook("carrie", "stephen king")

//prueba: traer nombres de libros
usuario1.getBookNames();
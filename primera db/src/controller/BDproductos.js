import knex from "knex";
import { options } from "../options/mySql"

class ClientSql {
    constructor(config) {
        this.knex = knex(config)
    }

    async createTable() {
        await this.knex.schema.dropTableIfExists("productos")
        await this.knex.schema.createTable("productos", table => {
            table.increments("id").primary();
            table.string("title", 50).notNullable();
            table.integer("price").notNullable();
            table.string("thumbnail").notNullable();
            table.string("timestamp")
            table.string("descripcion").notNullable()
            table.string("codigo")
            table.integer("stock").notNullable()
        })
    }

    getAllProducts() {
        return this.knex.from("productos").select("*")
    }

    async insertProduct(product) {
        await this.knex.from("productos").insert(product)
    }

    async deleteProductById(id) {
        await this.knex.from("productos").where("id", id).del();
    }

    async updateProduct(id, newProd){
        await this.knex.from("productos").where("id", id).update({title: newProd.title, price: newProd.price, thumbnail: newProd.thumbnail, descripcion: newProd.descripcion, stock: newProd.stock})
    }


    async close(){
        await this.knex.destroy()
    }
}

const sql = new ClientSql(options);

export {sql}
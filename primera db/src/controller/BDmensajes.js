import knex from "knex";
import { options } from "../options/mySql";

class ClientSqlite {
    constructor(config) {
        this.knex = knex(config)
    }

    async createTable() {
        await this.knex.schema.dropTableIfExists("mensajes")
        await this.knex.schema.createTable("mensajes", table => {
            table.increments("id").primary();
            table.string("email", 50).notNullable();
            table.string("message"),
            table.string("time")
        })
    }

    getAllMessages() {
        return this.knex.from("mensajes").select("*")
    }

    async insertMessage(mensaje) {
        await this.knex.from("mensajes").insert(mensaje)
    }

    async close(){
        await this.knex.destroy()
    }
}

const sqlite = new ClientSqlite(options);

export {sqlite}
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

mongoose.set('strictQuery', true);

const DATABASE = process.env.DATABASE;

export const DBConnect = (cb) =>{
    mongoose.connect (`${DATABASE}`, {useNewUrlParser: true},
        (err)=> {
            if (err) {
                throw new Error(err)
            }
            cb();
        })
}


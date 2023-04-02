import mongoose from "mongoose";

const Users = mongoose.model("users", {
    name: String,
    address: String,
    phone: String,
    username: String,
    password: String,
});

export default Users;

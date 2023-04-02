import path from "path";

const authMW = (req,res, next) =>{
    req.isAuthenticated() ?
    next () 
    : res.render(path.join(process.cwd(), "/public/views/noSession.ejs"))
};

export default authMW;
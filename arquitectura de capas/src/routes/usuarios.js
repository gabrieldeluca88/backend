const { Router } = require ("express")
const passport = require ("passport");
const { signUp, login, getHome } = require ('../controller/userController.js');
const info = require ("../middlewares/logger.js")

const rutaUsuarios = Router();

const passportOptions = { badRequestMessage: "Falta email / password"}

const isLoggedIn = (req, res, next) => {
    console.log(req.isAuthenticated());
    if(!req.isAuthenticated()) return res.status(401).json({msg: 'Unauthorized'});
    next();
}

rutaUsuarios.post('/signup', info, signUp)

rutaUsuarios.post('/login',info, passport.authenticate('login', passportOptions), login);

// rutaUsuarios.post("/logout", info, )

rutaUsuarios.get('/home',info, isLoggedIn, getHome )

module.exports = rutaUsuarios;
const { Router } = require ("express")
const passport = require ("passport");
const { signUp, login, getHome } = require ('../controller/userController.js');

const rutaUsuarios = Router();

const passportOptions = { badRequestMessage: "Falta email / password"}

const isLoggedIn = (req, res, next) => {
    console.log(req.isAuthenticated());
    if(!req.isAuthenticated()) return res.status(401).json({msg: 'Unauthorized'});
    next();
}

rutaUsuarios.post('/signup', signUp)

rutaUsuarios.post('/login', passport.authenticate('login', passportOptions), login);

rutaUsuarios.get('/home', isLoggedIn, getHome )

module.exports = rutaUsuarios;
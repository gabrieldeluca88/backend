const passport = require ('passport');

const passportOptions = { badRequestMessage: 'falta username / password' };

const signUp = (req, res, next) => {
    passport.authenticate('signup', passportOptions, (err, user, info) => {
        if(err) {
            return next(err)
        }
        if(!user) return res.status(401).json(info);
        res.json({msg: 'signup OK'})
    })(req, res, next);
}

const login = (req, res) => {
    res.cookie("password", req.body.password).json({ msg: 'Bienvenido!', user: req.user });
}

const getHome = (req, res) => {
    res.json(req.session)
}  


module.exports = {signUp, login, getHome}
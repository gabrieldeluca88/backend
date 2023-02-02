const passport = require ('passport');
const LocalStrategy  = require ('passport-local').Strategy;
const { usuariosModel } = require ('../schemas/user.js');

const strategyOptions = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
};

const signup = async (req, username, password, done) => {
  console.log('SIGNUP!');
  try {
    const {email} = req.body
    const user = await usuariosModel.findOne({email});
    if (user) {
      return done(null, false, { message: 'Este email ya esta en uso' });;
    }
    const newUser = new usuariosModel({username, email, password});
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    console.log(error);
    return done(null, false, { message: 'Error inesperado' });
  }
};

const login = async (req, username, password, done) => {
  console.log('LOGIN!');
  const {email} = req.body
  const user = await usuariosModel.findOne({email});
  if (!user) {
    return done(null, false, { message: 'User not found' });
  } else {
    const match = await user.matchPassword(password);
    match ? done(null, user) : done(null, false);
  }
  console.log('USUARIO ENCONTRADO!');
};

const loginFunc = new LocalStrategy(strategyOptions, login);
const signUpFunc = new LocalStrategy(strategyOptions, signup);

passport.serializeUser((user, done)=>{
  console.log('ejecuta serialize');
  done(null, user._id);
});

passport.deserializeUser( async(userId, done)=>{
  console.log('ejecuta deserialize');
  const user = await usuariosModel.findById(userId);
  return done(null, user);
});

module.exports ={loginFunc, signUpFunc}
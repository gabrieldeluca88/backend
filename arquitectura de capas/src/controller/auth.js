const passport = require ('passport');
const LocalStrategy  = require ('passport-local').Strategy;
const { usuariosModel } = require ('../persistence/mongodb/schemas/user.js');
const { transporter, emailOptions } = require ("../services/emailService.js")

const strategyOptions = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
};

const signup = async (req, username, password, done) => {
  console.log('SIGNUP!');
  try {
    const {email, direccion, edad, numero, foto} = req.body
    const user = await usuariosModel.findOne({email});
    if (user) {
      return done(null, false, { message: 'Este email ya esta en uso' });;
    }
    const newEdad = Math.floor(edad);
    const newNumero = Math.floor(numero)
    const newUser = new usuariosModel({username, email, password, direccion, newEdad, newNumero, foto});
    newUser.password = await newUser.encryptPassword(password);

    const texto = "Se acaba de registrar un nuevo usuario:\n" + newUser

    const emailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "¡Se unio un nuevo usuario!",
      text: texto,
    }
    try{
      const response = await transporter.sendMail(emailOptions);
      console.log('Email enviado!');
    }catch(error){
      console.log(error);
    }
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
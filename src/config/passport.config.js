import passport from 'passport';
import passportLocal from 'passport-local';
import GitHubStrategy from 'passport-github2';
import { userModel } from '../service/db/models/user.model.js'
import { createHash, isValidPassword } from '../util.js'
import { getNewCartId } from '../service/cart.service.js';

export const checkAuth = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/users/login')
}

export const checkAdmin = (req, res, next) => {
    if(req.user.role === "admin") {
        return next()
    }
    res.status(401).send({status: "error", message: "unauthorized access"})
    res.redirect('/users/login')
}

const localStrategy = passportLocal.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField: "email"}, async(req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try {
                const exist = await userModel.findOne({email});
                if(exist){
                    console.log("El usuario ya existe");
                    return done("El usuario ya existe", false);
                }

                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password : createHash(password),
                    cart : await getNewCartId()
                };
                const result = await userModel.create(user);
                return done(null, result);
            } catch (error) {
                return done("Error registrando el usuario" + error)
            }
        }
    ))

    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
          try {
            const user = await userModel.findOne({ email: username });
            if (!user) {
              console.warn("El usuario con el username: " + username + " es inexistente");
              return done(null, false, { message: 'Usuario inexistente' });
            }
            if (!isValidPassword(user, password)) {
              console.warn("Credenciales invalidas para el usuario " + username);
              return done(null, false, { message: 'Credenciales inválidas' });
            }
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      ));

    /*
    passport.use('login', new localStrategy(
        {passReqToCallback: true, usernameField: "email"}, async(req, username, password, done) => {
            try {
                const user = await userModel.findOne({email: username});
                if(!user){
                    console.warn("El usuario con el username : " + username + " es inexistente");
                    return done(null,false);
                }
                if(!isValidPassword(user, password)){
                    console.warn("Credenciales invalidas para el usuario " + username)
                    return done(null, false)
                }
                return done(null, user);
            } catch (error) {
                return done(error)
            }
        }
    ));
    */

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserealizando el usuario: " + error)
        }
    })
}

export default initializePassport;
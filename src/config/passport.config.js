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
        {passReqToCallback: true, usernameField: "email"}, async(req, username, password, done) => {
            try {
                const user = await userModel.findOne({email: username});
                if(!user){
                    console.warn("El usuario con el username : " + username + " es inexistente");
                    return done(null, false);
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

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.91c10217956b3564', 
            clientSecret: 'c6dd8a97714da15584b80c143d6272bcd604883b',
            callbackUrl: 'http://localhost:8080/api/sessions/githubcallback' 
        },
        async(accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario: ");
            console.log(profile);
            try {
                const user = await userModel.findOne({email: profile._json.email});
                console.log("Usuario encontrado para login: ");
                console.log(user);
                if(!user){
                    console.warn(`El usuario con el username ${profile._json.email} es inexistente`);
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 18,
                        email: profile._json.email,
                        passport: '',
                    };
                    const result = await userModel.create(newUser);
                    return done(null, result);
                } else {
                    return done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

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
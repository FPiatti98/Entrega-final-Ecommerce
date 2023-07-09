import { Router } from "express";
import passport from "passport";
import UserDTO from "../DTO/user.dto.js";
import { addLogger } from "../config/logger.js";
// import { userModel } from "../db/mongodb/models/user.model.js";
// import { createHash, isValidPassword } from "../util.js";

const router = Router();

router.use(addLogger);
/*

session routes without passport

router.post("/register", async(req, res) => {
    const {first_name, last_name, email, age, password} = req.body;
    let rol = ""
    console.log("Registrando usuario");

    const exist = await userModel.findOne({email});

    if(exist){
        return res.status(400).send({status: "error", message: `El usuario con el email ${email} ya existe`})
    };

    //agregar role y si el email es "ejemplo@gmail.com" ponerle admin, sino ponerle user

    if(email === 'adminCoder@coder.com'){
        rol = "admin"
    } else {
        rol = "user"
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        role: rol,
        password : createHash(password)
    };

    console.log(user)

    const result = await userModel.create(user);
    res.status(200).send({status: "success", message: "Usuario creado con extito con ID: " + result.id});
});

router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(401).send({status:"error", message: "Credenciales incorrectas"})
    }
    if(!isValidPassword(user, password)){
        return res.status(401).send({status:"error", error: "password incorrecta"})
    }
    
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }
    res.status(200).send({status:"success", payload:req.session.user, message:"Usuario logueado con exito" });
});


*/

router.post("/register", passport.authenticate(
    'register', {failureRedirect: '/api/sessions/fail-register'})
    , async (req, res) => {
        console.log("registrando nuevo usuario");
        req.logger.info("Usuario creado con exito")
        res.status(201).send({status: "success", message: "Usuario creado con exito"});
});

router.post("/login", (req, res, next) => {
    passport.authenticate('login', async(err, user, info) => {
      if (err) {
        // Handle internal server error
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        if (info.message === 'Usuario inexistente') {
          // Handle inexistent user
          return res.status(404).json({ status: "error", error: "El usuario es inexistente" });
        } else if (info.message === 'Credenciales inválidas') {
          // Handle incorrect password
          return res.status(401).json({ status: "error", error: "El usuario y la contraseña no coinciden" });
        }
      }
      // Authentication successful, proceed with desired action
      req.logIn(user, async(err) => {
        if (err) {
          // Handle error during session creation
          return res.status(500).json({ error: "Error al iniciar sesión" });
        }
        req.user.lastLogin = new Date(); // Update lastLogin field to current date and time
        await req.user.save(); // Save the updated user
        req.session.user = new UserDTO(user);
        return res.status(200).json({ status: "success", payload: req.session.user, message: "Usuario logueado con éxito" });
      });
    })(req, res, next);
  });


/*
router.post("/login", passport.authenticate('login', (info), {failureRedirect: '/api/sessions/fail-login'}), async(req, res) => {
    console.log("User found to login");
    const user = req.user;
    req.logger.info(user);
    if(info.message === 'Usuario inexistente'){
        return res.status(404).send({status: "error", error: "El usuario es inexistente"});
    } else if(info.message === 'Credenciales inválidas') {
        return res.status(401).send({status: "error", error: "El usuario y la contraseña no coinciden "});
    }
    req.session.user = new UserDTO(user);
    res.send({status: "success", payload: req.session.user, message: "Usuario logueado con exito"});
});
*/

    
router.get("/fail-register", (req, res) => {
    res.status(401).send({error: "el register no se pudo procesar"});
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({error: "el login no se pudo procesar"});
})

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        }
        res.status(200).send("Sesion cerrada correctamente.");
    });
});

export default router
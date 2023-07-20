import { Router } from "express";
import passport from "passport";
import UserDTO from "../DTO/user.dto.js";
import { addLogger } from "../config/logger.js";

const router = Router();

router.use(addLogger);

/*
router.post("/register", passport.authenticate(
    'register', {failureRedirect: '/api/sessions/fail-register'})
    , async (req, res) => {
        console.log("registrando nuevo usuario");
        req.logger.info("Usuario creado con exito")
        res.status(201).send({status: "success", message: "Usuario creado con exito"});
});
*/

router.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        if (info.message === 'Usuario ya existe') {
          return res.status(400).json({ message: 'El usuario ya existe' });
        }
      }
      return res.status(201).json({ message: 'Usuario registrado con éxito' });
    })(req, res, next);
  });

router.post("/login", (req, res, next) => {
    passport.authenticate('login', async(err, user, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        if (info.message === 'Usuario inexistente') {
          return res.status(404).json({ status: "error", error: "El usuario es inexistente" });
        } else if (info.message === 'Credenciales inválidas') {
          return res.status(401).json({ status: "error", error: "El usuario y la contraseña no coinciden" });
        }
      }
      req.logIn(user, async(err) => {
        if (err) {
          return res.status(500).json({ error: "Error al iniciar sesión" });
        }
        req.user.lastLogin = new Date();
        await req.user.save();
        req.session.user = new UserDTO(user);
        return res.status(200).json({ status: "success", payload: req.session.user, message: "Usuario logueado con éxito" });
      });
    })(req, res, next);
  });
    
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
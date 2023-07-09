import { Router } from "express";
import { updateUser , deleteUser } from '../controllers/users.controller.js';
import { addLogger } from "../config/logger.js";
import { checkAdmin } from "../config/passport.config.js";

const router = Router();

router.use(addLogger);

//Controller
router.delete('/:email', checkAdmin, deleteUser);
router.put('/:email', checkAdmin, updateUser);

export default router
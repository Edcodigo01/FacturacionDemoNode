import { Router } from "express";
import { crearUsuarioPrueba, login } from "../controllers/auth.controller";
const router = Router();

router.post("/iniciar-sesion", login);
router.post("/crear-usuario-prueba", crearUsuarioPrueba);

export default router;

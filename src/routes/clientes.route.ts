import { Router } from "express";
import {
  deshabilitarCliente,
  deshabilitarLoteCliente,
  getClientes,
  habilitarCliente,
  habilitarLoteCliente,
  postCliente,
} from "../controllers/clientes.controller";

const router = Router();

router.get("/", getClientes);
router.post("/", postCliente);
router.post("/habilitar/:id", habilitarCliente);
router.delete("/deshabilitar/:id", deshabilitarCliente);
router.post("/habilitar-lote", habilitarLoteCliente);
router.post("/deshabilitar-lote", deshabilitarLoteCliente);

export default router;

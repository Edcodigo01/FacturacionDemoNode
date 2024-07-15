import { Router } from "express";

import {
  deshabilitarLoteProducto,
  deshabilitarProducto,
  getProductos,
  habilitarLoteProducto,
  habilitarProducto,
  postProducto,
  recursosProductos,
} from "../controllers/productos.controller";

import { deshabilitarLoteCliente } from "../controllers/clientes.controller";

const router = Router();

router.get("/", getProductos);
router.get("/recursos", recursosProductos);
router.post("/", postProducto);

router.delete("/deshabilitar/:id", deshabilitarProducto);
router.post("/habilitar/:id", habilitarProducto);
router.post("/deshabilitar-lote", deshabilitarLoteProducto);
router.post("/habilitar-lote", habilitarLoteProducto);

export default router;

import { Router } from "express";

import {
  getAlmacenes,
  postAlmacen,
  habilitarAlmacen,
  deshabilitarAlmacen,
  habilitarLoteAlmacen,
  deshabilitarLoteAlmacen,
} from "../controllers/almacenes.controller";

const router = Router();
router.get("/", getAlmacenes);
router.post("/", postAlmacen);
router.delete("/deshabilitar/:id", deshabilitarAlmacen);
router.post("/habilitar/:id", habilitarAlmacen);
router.post("/habilitar-lote", habilitarLoteAlmacen);
router.post("/deshabilitar-lote", deshabilitarLoteAlmacen);

export default router;

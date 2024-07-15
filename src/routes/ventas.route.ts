import { Router } from "express";
import {
  deshabilitarLoteVenta,
  deshabilitarVenta,
  getVenta,
  getVentas,
  habilitarLoteVenta,
  habilitarVenta,
  postVenta,
} from "../controllers/ventas.controller";

const router = Router();

router.get("/", getVentas);

router.post("/habilitar/:id", habilitarVenta);

router.delete("/deshabilitar/:id", deshabilitarVenta);
router.post("/habilitar-lote", habilitarLoteVenta);
router.post("/deshabilitar-lote", deshabilitarLoteVenta);

router.get("/:id?", getVenta);
router.post("/:id?", postVenta);
export default router;

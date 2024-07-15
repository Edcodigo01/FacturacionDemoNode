import { Router } from "express";

import {
  getPreciosAds,
  postPreciosAds,
  deshabilitarPreciosAds,
  habilitarPreciosAds,
  deshabilitarLotePreciosAds,
  habilitarLotePreciosAds,
} from "../controllers/preciosAdicionales.controller";

const router = Router();

router.get("/", getPreciosAds);
router.post("/", postPreciosAds);
router.delete("/deshabilitar/:id", deshabilitarPreciosAds);
router.post("/habilitar/:id", habilitarPreciosAds);
router.post("/habilitar-lote", habilitarLotePreciosAds);
router.post("/deshabilitar-lote", deshabilitarLotePreciosAds);

export default router;

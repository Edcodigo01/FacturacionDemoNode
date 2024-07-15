import { Router } from "express";
import {
  getEmpresa,
  postEmpresa,
  subirImagen,
} from "../controllers/empresa.controller";

const router = Router();
router.get("/", getEmpresa);
router.post("/", postEmpresa);
router.post("/subir-imagen", subirImagen);

export default router;

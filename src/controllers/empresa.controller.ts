import { Request, Response } from "express";
import { Empresa } from "../models/empresa.model";
import { resizeImg } from "../helpers/resizeImg";
import fs from "fs";

export const getEmpresa = async (req: Request, res: Response) => {
  const { uid: user_id } = req.body;
  try {
    const empresa = await Empresa.findOne({
      where: {
        user_id,
      },
    });

    return res.json(empresa);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const postEmpresa = async (req: Request, res: Response) => {
  const { uid: user_id } = req.body;
  const body = req.body;

  try {
    if (!body.id) {
      body.user_id = user_id;
      await Empresa.create(body);
    } else {
      await Empresa.update(body, {
        where: {
          user_id,
        },
      });
    }
    return res.json({ message: "Datos guardados con éxito" });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const subirImagen = async (req: Request, res: Response) => {
  const { uid: user_id } = req.query;

  let empresa = await Empresa.findOne({
    where: {
      user_id,
    },
  });

  const pathSave = `src/assets/imgs-empresas/${user_id}`;

  if (empresa) {
    let path: any = empresa.path_img;
    if (path) {
      path = path.split("src");
      path = path[1];
      path = "src" + path;
      if (fs.existsSync(path)) {
        await fs.unlinkSync(path);
      }
    }

    empresa.path_img = `${req.protocol}://${req.get("host")}/${pathSave}/${
      req.file?.filename
    }`;
    empresa.save();
  }

  resizeImg(req.file?.path, pathSave, req.file?.filename, 300);

  res.json({ msg: "éxito" });
};

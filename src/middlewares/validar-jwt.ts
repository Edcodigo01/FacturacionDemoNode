import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const validarJWT = async (req: Request, res: Response, next: any) => {
  let tokenBearer = req.header("Authorization");
  if (!tokenBearer) {
    return res.status(401).json({
      msg: "Debe iniciar sesión antes de continuar.",
    });
  }
  let token: any = tokenBearer?.split(" ")[1];
  const privatekey: any = process.env.PRIVATEKEYJWT;

  try {
    const payload: any = await jwt.verify(token, privatekey);
    req.body.uid = payload.id;
    req.query.uid = payload.id;

    return next();
  } catch (error: any) {
    return res.status(401).json({
      msg: "Debe iniciar sesión antes de continuar.",
    });
  }
};

export default validarJWT;

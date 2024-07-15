import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import randomize from "randomatic";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuario.model";

export const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  let usuario = await Usuario.findOne({ where: { name: name } });

  if (!usuario) {
    return res.status(401).json({
      msg: "Las credenciales son incorrectas.",
    });
  }

  const validarPassword = bcryptjs.compareSync(
    password.toString(),
    usuario?.password
  );

  if (!validarPassword) {
    return res.status(401).json({
      msg: "Las credenciales son incorrectas.",
    });
  }

  const accessToken = await generarJWT(usuario.id.toString());

  res.json({
    msg: "Inicio de sesión éxitoso",
    accessToken,
    token_type: "Bearer",
    user: usuario,
  });
};

const generarJWT = (id: string) => {
  const payload = { id };
  return new Promise((resolve, reject) => {
    const privatekey: any = process.env.PRIVATEKEYJWT;
    jwt.sign(payload, privatekey, { expiresIn: "4h" }, (err, token) => {
      if (err) {
        reject("Fallo el proceso de creación del token de autenticación");
      }
      resolve(token);
    });
  });
};

export const crearUsuarioPrueba = async (req: Request, res: Response) => {
  const { user } = req.body;

  let usuario = await Usuario.findOne({ where: { name: user } });
  if (usuario) {
    return res.status(422).json({
      errors: [{ user: "Ya existe un usuario con el nombre: " + user }],
    });
  }

  var salt = bcryptjs.genSaltSync(10);
  let password = randomize("Aa0", 10);
  password = bcryptjs.hashSync(password, salt);
  const email = user + "@test.com";

  usuario = await Usuario.create({
    name: user,
    email: email,
    password,
  });

  res.json({
    msg: "ok",
    password,
  });
};

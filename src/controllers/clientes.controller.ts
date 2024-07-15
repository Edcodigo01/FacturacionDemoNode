import { Request, Response } from "express";
import { Cliente } from "../models/cliente.model";
import { getPagination, getPagingData } from "../helpers/pagination";
import Sequelize from "sequelize";

export const getClientes = async (req: Request, res: Response) => {
  const { uid } = req.body;
  let { page, pageSize, busqueda, estado, sortDirection, sortId } = req.query;

  const { limit, offset } = getPagination(page, pageSize);
  const Op = Sequelize.Op;
  let buscar: any = {};

  if (busqueda) {
    buscar.razon_social = {
      [Op.like]: "%" + busqueda + "%",
    };
    buscar.nombre_comercial = {
      [Op.like]: "%" + busqueda + "%",
    };
    buscar.email = {
      [Op.like]: "%" + busqueda + "%",
    };
    buscar.identificacion = {
      [Op.like]: "%" + busqueda + "%",
    };
    buscar = { [Op.or]: buscar };
  }

  let deshabilitado = 0;
  if (estado && estado != "Activos") {
    deshabilitado = 1;
  }
  const order: any = [
    sortId ?? "id",
    sortDirection ? sortDirection.toString().toUpperCase() : "DESC",
  ];
  await Cliente.findAndCountAll({
    where: [{ user_id: uid }, buscar, { deshabilitado }],
    limit,
    offset,
    order: [order],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      return res.json(response);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
};

export const postCliente = async (req: Request, res: Response) => {
  const { uid, id } = req.body;
  const body = req.body;
  // actualizar
  if (id) {
    try {
      const cliente = await Cliente.findOne({
        where: {
          user_id: uid,
          id,
        },
      });
      if (cliente) {
        cliente.update(body);
      }
      res.json({
        message: "Cliente actualizado con éxito.",
        cliente,
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  } else {
    // nuevo
    body.user_id = uid;
    try {
      const cliente = await Cliente.create(body);
      res.json({
        message: "Cliente creado con éxito.",
        cliente,
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  }
};

export const habilitarCliente = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const { id } = req.params;
  try {
    await Cliente.update(
      { deshabilitado: 0 },
      {
        where: {
          user_id: uid,
          id,
        },
      }
    );

    res.json({ message: "El elemento ha sido habilitado." });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const deshabilitarCliente = async (req: Request, res: Response) => {
  const { uid, selected } = req.body;
  const { id } = req.params;

  try {
    await Cliente.update(
      { deshabilitado: 1 },
      {
        where: {
          user_id: uid,
          id,
        },
      }
    );
    return res.json({ message: "Elementos habilitados con éxito." });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const habilitarLoteCliente = async (req: Request, res: Response) => {
  const { uid, selected } = req.body;

  try {
    await Cliente.update(
      { deshabilitado: 0 },
      {
        where: {
          user_id: uid,
          id: selected,
        },
      }
    );
    return res.json({ message: "Elementos deshabilitados con éxito." });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const deshabilitarLoteCliente = async (req: Request, res: Response) => {
  const { uid, selected } = req.body;

  try {
    await Cliente.update(
      { deshabilitado: 1 },
      {
        where: {
          user_id: uid,
          id: selected,
        },
      }
    );
    return res.json({ message: "Elementos deshabilitados con éxito." });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
// deshabilitado;

import { Request, Response } from "express";
import { Producto } from "../models/inventario/producto.model";
import { getPagination, getPagingData, getOrder } from "../helpers/pagination";
import Sequelize, { Association, Op } from "sequelize";
import { Almacen } from "../models/inventario/almacen.model";
import { AlmacenesProducto } from "../models/inventario/almacenesProducto.model";
import db from "../db/conection";

export const recursosProductos = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const order: any = ["nombre", "ASC"];

  try {
    const almacenes = await Almacen.findAll({
      where: {
        user_id: uid,
      },
      order: [order],
    });

    return res.json({
      almacenes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al consultar base de datos.",
      error,
    });
  }
};

export const getProductos = async (req: Request, res: Response) => {
  const { uid } = req.body;
  let { page, pageSize, estado, almacen_id, busqueda, codigo } = req.query;
  estado;

  const { limit, offset } = getPagination(page, pageSize);
  const Op = Sequelize.Op;
  let buscar: any = {};

  if (busqueda) {
    buscar.codigo = {
      [Op.like]: "%" + busqueda + "%",
    };
    buscar.descripcion = {
      [Op.like]: "%" + busqueda + "%",
    };
    buscar = { [Op.or]: buscar };
  }

  let buscarcodigo = {};
  if (codigo) {
    buscarcodigo = { codigo: codigo };
  }

  let deshabilitado = 0;
  if (estado && estado != "Activos") {
    deshabilitado = 1;
  }

  const order: any = getOrder(req.query);

  await Producto.findAndCountAll({
    where: [{ user_id: uid }, { deshabilitado }, buscar, buscarcodigo],
    attributes: [
      [Sequelize.col("almacen.cantidad"), "stock"],
      "id",
      "descripcion",
      "precio_venta",
      "codigo",
      "precio_compra",
      "grabaiva",
      "precio_venta_sin_iva",
      "ganancia",
      "porcentaje_ganancia",
      "editar_precio",
    ],
    include: [
      {
        model: AlmacenesProducto,
        as: "almacen",
        where: {
          almacen_id,
        },
      },
      {
        model: AlmacenesProducto,
        as: "almacenes",
        required: false,
      },
    ],
    limit,
    offset,
    order: [order],
    distinct: true,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      return res.json(response);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error al consultar base de datos.",
        err,
      });
    });
};

export const postProducto = async (req: Request, res: Response) => {
  const { uid, id, almacenes } = req.body;
  const body = req.body;

  if (id) {
    try {
      await Producto.update(body, {
        where: {
          user_id: uid,
          id,
        },
      });
      let asignados: any = await asignarAlmacen(almacenes, id);
      if (asignados.length != 0) {
        AlmacenesProducto.destroy({
          where: {
            almacen_id: { [Op.notIn]: asignados },
            producto_id: id,
          },
        });
      }
      return res.json({
        message: "Producto actualizado con éxito.",
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  } else {
    body.user_id = uid;
    try {
      const producto: any = await Producto.create(body);
      await asignarAlmacen(almacenes, producto.id);
      return res.json({
        message: "Producto creado con éxito.",
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  }
};

const asignarAlmacen = (almacenes: any, producto_id: any) => {
  return new Promise((resolve, reject) => {
    try {
      let almacenesSelect: any = [];

      almacenes.forEach(async (al: any, i: number) => {
        let alm_p = await AlmacenesProducto.findOne({
          where: {
            almacen_id: al.almacen_id,
            producto_id,
          },
        });

        if (!alm_p) {
          alm_p = await new AlmacenesProducto();
          alm_p.almacen_id = al.almacen_id;
          alm_p.producto_id = producto_id;
        }
        alm_p.cantidad = al.cantidad;
        await alm_p.save();
        almacenesSelect[i] = al.almacen_id;

        if (almacenes.length - 1 == i) {
          resolve(almacenesSelect);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const habilitarProducto = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const { id } = req.params;
  try {
    await Producto.update(
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
      message: "Error al consultar base de datos.",
      error,
    });
  }
};

export const deshabilitarProducto = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const { id } = req.params;

  try {
    await Producto.update(
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
      message: "Error al consultar base de datos.",
      error,
    });
  }
};

export const habilitarLoteProducto = async (req: Request, res: Response) => {
  const { uid, selected } = req.body;

  try {
    const Productos = await Producto.update(
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
      message: "Error al consultar base de datos.",
      error,
    });
  }
};

export const deshabilitarLoteProducto = async (req: Request, res: Response) => {
  const { uid, selected } = req.body;

  try {
    const Productos = await Producto.update(
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
      message: "Error al consultar base de datos.",
      error,
    });
  }
};

// deshabilitado;

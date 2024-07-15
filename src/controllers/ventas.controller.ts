import { Request, Response } from "express";
import { Almacen } from "../models/inventario/almacen.model";
import { PreciosAddProducto } from "../models/inventario/preciosAddProducto.model";
import { Venta } from "../models/comercio/venta.model";
import { SecuencialesVenta } from "../models/comercio/secuencialesVenta.model";
import { DetalleVenta } from "../models/comercio/detalleVenta.model";
import { AlmacenesProducto } from "../models/inventario/almacenesProducto.model";
import { FormaPago } from "../models/comercio/formaPago.model";
import { Empresa } from "../models/empresa.model";
import {
  getOrder,
  getPagination,
  getPagination2,
  getPagingData,
} from "../helpers/pagination";
import { Op, Sequelize } from "sequelize";
import { Cliente } from "../models/cliente.model";

export const getVenta = async (req: Request, res: Response) => {
  const { uid: user_id } = req.body;
  const { id } = req.params;

  const categoriasProducto: any[] = [];

  const almacenes = await Almacen.findAll({
    where: { user_id, deshabilitado: 0 },
    order: [["nombre", "ASC"]],
  }).catch((error) => {
    return res.status(500).json({
      message: "Error al consultar base de datos.",
      error,
    });
  });

  const preciosadicionales = await PreciosAddProducto.findAll({
    where: { user_id, deshabilitado: 0 },
    order: [["descripcion", "ASC"]],
  }).catch((error) => {
    return res.status(500).json({
      message: "Error al consultar base de datos.",
      error,
    });
  });

  let venta: any = "";
  let detalles: any = [];
  let cliente: any;
  let formaPagos: any;

  if (id) {
    venta = await Venta.findOne({ where: { id, user_id } });
    if (venta) {
      detalles = await DetalleVenta.findAll({ where: { venta_id: id } });
      cliente = venta.data_cliente;
      formaPagos = await FormaPago.findAll({ where: { venta_id: id } });
    }
  }

  const empresa = await Empresa.findOne({ where: { user_id } });

  
  return res.json({
    id,
    user_id,
    almacenes,
    categoriasProducto,
    preciosadicionales,
    venta,
    detalles,
    cliente,
    formaPagos,
    empresa,
  });
};

export const getVentas = async (req: Request, res: Response) => {
  const { uid: user_id } = req.body;
  let { page, cliente_id, secuencial, desde, hasta, tipoFecha, estado } =
    req.query;
  const { limit, offset } = getPagination2(req.query);
  const order: any = getOrder(req.query);

  let busqueda: any = {};

  if (estado == "Activas") {
    busqueda.deshabilitado = 0;
  } else {
    busqueda.deshabilitado = 1;
  }
  if (cliente_id) {
    busqueda.cliente_id = cliente_id;
  }
  if (secuencial) {
    busqueda.secuencial = {
      [Op.like]: "%" + secuencial + "%",
    };
  }

  let fdesde: any = desde;
  let fhasta: any = hasta;
  if (tipoFecha == "Creación") {
    busqueda.created_at = {
      [Op.between]: [new Date(fdesde), new Date(fhasta)],
    };
  }
  if (tipoFecha != "Creación") {
    busqueda.updated_at = {
      [Op.between]: [new Date(fdesde), new Date(fhasta)],
    };
  }

  await Venta.findAndCountAll({
    where: {
      user_id,
      [Op.and]: busqueda,
    },

    limit,
    offset,
    order: [order],
    attributes: [
      [Sequelize.col("clientes.razon_social"), "cliente"],
      "id",
      "secuencial",
      "total",
    ],
    include: [
      {
        model: Cliente,
        as: "clientes",
        required: false,
      },
    ],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      return res.json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

// POST START
export const postVenta = async (req: Request, res: Response) => {
  let {
    uid: user_id,
    id,
    totales,
    observaciones,
    cliente,
    detalles,
    formaPagos,
  } = req.body;

  if (id == 0) {
    id = "";
  }
  let dataV = totales;

  let secuencial: any;
  if (!id) {
    secuencial = await generarSecuencial(user_id);
    dataV.secuencial = secuencial;
  }

  dataV.deshabilitado = 0;
  dataV.estab = "001";
  dataV.ptoEmi = "001";
  dataV.user_id = user_id;
  dataV.observaciones = observaciones;

  if (cliente) {
    dataV.data_cliente = JSON.stringify(cliente);
    dataV.cliente_id = cliente["id"];
  } else {
    dataV.data_cliente = "";
    dataV.cliente_id = "";
  }

  // validar detalles
  if (id) {
    let errorsValid: any = {};
    try {
      errorsValid = await validarDetalles(detalles, id, res);
      if (Object.keys(errorsValid).length != 0) {
        return res.status(422).json({
          errors: errorsValid,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  let venta_id: any = "";
  let venta: any = "";
  if (id) {
    try {
      venta = await Venta.update(dataV, {
        where: {
          id,
        },
      });

      venta = await Venta.findByPk(id);
      venta_id = venta.id;
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  } else {
    try {
      venta = await Venta.create(dataV);
      venta_id = venta.id;
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  }

  try {
    await guardarDetalles(detalles, venta_id, res);
    await guardarFormaPagos(formaPagos, venta_id);
  } catch (error) {
    return res.status(500).json({
      msg: "error fpagos",
      error,
    });
  }
  // Se guarda el nuevo secuencial si es nueva venta en bd para calcular el de futuras ventas
  if (secuencial) {
    await SecuencialesVenta.create({
      user_id,
      secuencial,
    }).catch((error) => {
      return res.status(500).json({
        msg: "error en bd",
        error,
      });
    });
  }

  return res.json({
    venta,
    id: venta.id,
  });
};

const generarSecuencial = async (user_id: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      let secuencial: any = await SecuencialesVenta.findOne({
        where: {
          user_id,
        },
        order: [["id", "DESC"]],
      });
      if (!secuencial?.secuencial) {
        secuencial = "000000001";
      } else {
        secuencial = parseInt(secuencial.secuencial) + 1;
        secuencial = secuencial.toString().padStart(9, "0");
      }
      resolve(secuencial);
    } catch (error) {
      reject(error);
    }
  });
};

const validarDetalles = async (detalles: any[], id: number, res: Response) => {
  return new Promise(async (resolve, reject) => {
    let errores: any = [];
    let detallesAnt;
    try {
      detallesAnt = await DetalleVenta.findAll({
        where: { venta_id: id },
      });

      errores = await getErroresDetalles(detalles, detallesAnt);
      resolve(errores);
    } catch (error) {
      return reject(error);
    }
  });
};

const getErroresDetalles = async (detalles: any, detallesAnt: any) => {
  const promesa = new Promise((resolve, reject) => {
    try {
      let errores: any = {};
      detalles.forEach(async (el: any, i: any) => {
        let error: any = await productoDisponible(el, detallesAnt);
        if (error?.error) {
          errores["cantidad_" + i] = error.message;
        }
        if (i == detalles.length - 1) {
          resolve(errores);
        }
      });
    } catch (error) {
      reject(error);
    }
  });

  return promesa;
};

const productoDisponible = async (detalle: any, detallesAnt: any) => {
  try {
    let cantAnt = await getCantAnt(detallesAnt, detalle);

    const almacen: any = await AlmacenesProducto.findOne({
      where: {
        producto_id: detalle["producto_id"],
        almacen_id: detalle["almacen_id"],
      },
    });

    let disponible = 0;
    if (almacen) {
      disponible = almacen.cantidad + cantAnt;
    }
    if (detalle["cantidad"] > disponible) {
      return { error: true, message: `Max. disponible:${disponible}` };
    }
    return { error: false };
  } catch (error) {
    throw error;
  }
};

const getCantAnt = async (detallesAnt: any, pro: any) => {
  return new Promise((resolve, reject) => {
    const id = pro["producto_id"];
    const almacen_id = pro["almacen_id"];

    let cantAnt = 0;
    detallesAnt.forEach((el: any, i: number) => {
      if (el.producto_id == id && el.almacen_id == almacen_id) {
        cantAnt = el.cantidad;

        resolve(cantAnt);
        return;
      }
    });
  });
};

const guardarDetalles = async (detalles: any, id: number, res: Response) => {
  return new Promise(async (resolve, reject) => {
    try {
      const detallesAnt: any = await DetalleVenta.findAll({
        where: { venta_id: id },
      });
      await borrarDetallesAnt(detallesAnt);

      detalles.forEach(async (prod: any, i: number) => {
        let data;
        if (prod.grabaiva) {
          prod.grabaiva = 1;
        } else {
          prod.grabaiva = 0;
        }
        prod.venta_id = id;
        prod.id = null;
        await DetalleVenta.create(prod);

        let almacenP: any = await AlmacenesProducto.findOne({
          where: { producto_id: prod.producto_id, almacen_id: prod.almacen_id },
        });

        if (almacenP) {
          almacenP.cantidad = almacenP.cantidad - prod.cantidad;
          almacenP.save();
        }
        if (i == detalles.length - 1) {
          resolve("ok");
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const borrarDetallesAnt = (detallesAnt: any) => {
  return new Promise((resolve, reject) => {
    try {
      if (detallesAnt.length == 0) {
        resolve("ok");
      }
      detallesAnt.forEach(async (prod: any, i: number) => {
        await borrarDetalle(prod);
        if (i == detallesAnt.length - 1) {
          resolve("ok");
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const borrarDetalle = async (d: any) => {
  try {
    let alma: any = await AlmacenesProducto.findOne({
      where: {
        producto_id: d.producto_id,
        almacen_id: d.almacen_id,
      },
    });

    await AlmacenesProducto.update(
      { cantidad: alma.cantidad + d.cantidad },
      {
        where: {
          producto_id: d.producto_id,
          almacen_id: d.almacen_id,
        },
      }
    );

    await DetalleVenta.destroy({ where: { id: d.id } });
  } catch (error) {
    throw error;
  }
};

const guardarFormaPagos = async (pagos: any, id: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await FormaPago.destroy({
        where: { venta_id: id },
      });

      pagos.forEach(async (fp: any, i: number) => {
        fp.venta_id = id;
        await FormaPago.create(fp);
        if (pagos.length - 1 == i) {
          resolve("ok");
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// POST END

export const habilitarVenta = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const { id } = req.params;
  try {
    await Venta.update(
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

export const deshabilitarVenta = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const { id } = req.params;

  try {
    await Venta.update(
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
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

export const habilitarLoteVenta = async (req: Request, res: Response) => {
  const { uid, selected } = req.body;

  try {
    await Venta.update(
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

export const deshabilitarLoteVenta = async (req: Request, res: Response) => {
  const { uid, selected } = req.body;

  try {
    await Venta.update(
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

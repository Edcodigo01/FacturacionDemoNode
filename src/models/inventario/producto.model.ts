import { DataTypes, Model } from "sequelize";
import db from "../../db/conection";
import { AlmacenesProducto } from "./almacenesProducto.model";

interface Attributes {
  id: any;
  user_id: number;
  imagenes: string;
  descripcion: string;
  codigo: string;
  precio_compra: number;
  porcentaje_ganancia: number;
  ganancia: number;
  precio_venta_sin_iva: number;
  editar_precio: number;
  iva: number;
  grabaiva: number;
  precio_venta: number;
  deshabilitado: number;
  categoria_producto_id: number;
}

interface ModelInstance extends Model<Attributes>, Attributes {}

export const Producto = db.define<ModelInstance>("Producto", {
  categoria_producto_id: {
    type: DataTypes.BIGINT,
  },
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  imagenes: {
    type: DataTypes.STRING,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio_compra: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  porcentaje_ganancia: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  ganancia: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  precio_venta_sin_iva: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  editar_precio: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
  },
  iva: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 12,
  },
  grabaiva: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
  },
  precio_venta: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  deshabilitado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
  },
});

Producto.hasMany(AlmacenesProducto, {
  foreignKey: "producto_id",
  sourceKey: "id",
  as: "almacenes",
});

Producto.hasOne(AlmacenesProducto, {
  foreignKey: "producto_id",
  sourceKey: "id",
  as: "almacen",
});

AlmacenesProducto.belongsTo(Producto, {
  foreignKey: "producto_id",
  targetKey: "id",
});

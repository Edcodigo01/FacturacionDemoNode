import { DataTypes, Model } from "sequelize";
import db from "../../db/conection";

interface attributes {
  id: any;
  venta_id: number;
  producto_id: number;
  imagenes: string;
  descripcion: string;
  codigo: string;
  precio_compra: number;
  total_sin_descuento: number;
  porcentaje_ganancia: number;
  ganancia: number;
  precio_venta_sin_iva: number;
  editar_precio: number;
  grabaiva: number;
  precio_venta: number;
  cantidad: number;
  precioOriginal: number;
  tipo_descuento: number;
  descuento_porcentaje: number;
  descuento_moneda: number;
  tipo_precio: string;
  total_iva: number;
  total_sin_iva: number;
  total: number;
  almacen_id: number;
  almacen: number;
}

interface ModelInstance extends Model<attributes>, attributes {}

export const DetalleVenta = db.define<ModelInstance>("DetalleVenta", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  venta_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  producto_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  imagenes: {
    type: DataTypes.TEXT("long"),
  },
  descripcion: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING,
  },
  precio_compra: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  total_sin_descuento: {
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
  },
  grabaiva: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  precio_venta: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  precioOriginal: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  tipo_descuento: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  descuento_porcentaje: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  descuento_moneda: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  tipo_precio: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  total_iva: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  total_sin_iva: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  total: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  almacen_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  almacen: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

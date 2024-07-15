import { DataTypes, Model } from "sequelize";
import db from "../../db/conection";
import { Cliente } from "../cliente.model";

interface attributes {
  id: any;
  user_id: number;
  estab: string;
  ptoEmi: string;
  secuencial: string;
  subtotal_iva: number;
  iva: number;
  no_iva: number;
  tipo_descuento_general: string;
  descuento_porcentaje: number;
  descuento_moneda: number;
  total_sin_iva: number;
  total: number;
  data_cliente: string;
  cliente_id: number;
  observaciones: string;
  deshabilitado: number;
  // created_at: Date;
  // updated_at: Date;


}

interface ModelInstance extends Model<attributes>, attributes {}

export const Venta = db.define<ModelInstance>("Venta", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  estab: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  ptoEmi: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  secuencial: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  subtotal_iva: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  iva: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  no_iva: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  tipo_descuento_general: {
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
  total_sin_iva: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  total: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  data_cliente: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  cliente_id: {
    type: DataTypes.BIGINT,
  },
  observaciones: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  deshabilitado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  // created_at: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  // updated_at: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  
});

Venta.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  // sourceKey: "id",
  as: "clientes",
});

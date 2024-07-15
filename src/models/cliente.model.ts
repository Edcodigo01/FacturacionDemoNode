import { DataTypes, Model } from "sequelize";
import db from "../db/conection";

interface Attributes {
  id: any;
  user_id: number;
  identificacion: string;
  tipo_ident: string;
  razon_social: string;
  nombre_comercial: string;
  email: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  deshabilitado: number;
}

interface ModelInstance extends Model<Attributes>, Attributes {}

export const Cliente = db.define<ModelInstance>("Cliente", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  identificacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_ident: {
    type: DataTypes.ENUM("RUC", "CÉDULA", "PASAPORTE", "CONSUMIDOR FINAL"),
  },
  razon_social: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre_comercial: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },

  telefono: {
    type: DataTypes.STRING,
  },
  ciudad: {
    type: DataTypes.STRING,
  },
  direccion: {
    type: DataTypes.CHAR,
  },
  deshabilitado: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
});

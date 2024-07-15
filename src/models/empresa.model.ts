import { DataTypes, Model } from "sequelize";
import db from "../db/conection";

interface UserAttributes {
  id: any;
  user_id: any;
  ruc: string;
  razon_social: string;
  nombre_comercial: string;
  direccion: string;
  telefono: string;
  email: string;
  path_img: string;
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {}

export const Empresa = db.define<UserInstance>("Empresa", {
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
  ruc: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  razon_social: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  nombre_comercial: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.TEXT,
  },
  telefono: {
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.TEXT,
  },
  path_img: {
    type: DataTypes.TEXT("long"),
  },
});

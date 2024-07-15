import { DataTypes, Model } from "sequelize";
import db from "../../db/conection";

interface attributes {
  id: any;
  user_id: number;
  nombre: string;
  deshabilitado: any;
}

interface ModelInstance extends Model<attributes>, attributes {}

export const Almacen = db.define<ModelInstance>("Almacen", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  deshabilitado: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
    allowNull: false,
  },
});

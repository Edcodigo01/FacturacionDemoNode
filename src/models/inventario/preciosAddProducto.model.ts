import { DataTypes, Model } from "sequelize";
import db from "../../db/conection";

interface attributes {
  id: any;
  user_id: number;
  descripcion: string;
  porcentaje_ganancia: number;
  deshabilitado: number;
}

interface ModelInstance extends Model<attributes>, attributes {}

export const PreciosAddProducto = db.define<ModelInstance>(
  "PreciosAddProducto",
  {
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    porcentaje_ganancia: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    deshabilitado: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    },
  }
);

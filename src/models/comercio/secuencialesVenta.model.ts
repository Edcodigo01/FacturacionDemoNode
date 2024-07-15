import { DataTypes, Model } from "sequelize";
import db from "../../db/conection";

interface attributes {
  id: any;
  user_id: number;
  secuencial: string;
}

interface ModelInstance extends Model<attributes>, attributes {}

export const SecuencialesVenta = db.define<ModelInstance>("SecuencialesVenta", {
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
  secuencial: {
    type: DataTypes.CHAR(9),
    allowNull: false,
  },
});

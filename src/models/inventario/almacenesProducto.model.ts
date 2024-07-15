import { DataTypes, Model } from "sequelize";
import db from "../../db/conection";

interface attributes {
  id: any;
  producto_id: number;
  almacen_id: number;
  cantidad: number;
}

interface ModelInstance extends Model<attributes>, attributes {}

export const AlmacenesProducto = db.define<ModelInstance>(
  "AlmacenesProducto",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    producto_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    almacen_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }
);

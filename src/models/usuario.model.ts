import { DataTypes, Model } from "sequelize";
import db from "../db/conection";

interface UserAttributes {
  id: any;
  name: string;
  email: string;
  password: string;
  deshabilitado: any;
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {}

export const Usuario = db.define<UserInstance>(
  "Usuario",
  {
   
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deshabilitado: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  },
  // {
  //   defaultScope: {
  //     attributes: {
  //       exclude: ["password"],
  //     },
  //   },
  // }
);

Usuario.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

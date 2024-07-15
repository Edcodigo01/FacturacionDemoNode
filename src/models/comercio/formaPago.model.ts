import { DataTypes, Model } from "sequelize";
import db from "../../db/conection";

interface attributes {
  id: any;
  venta_id: number;
  monto: number;
  tipo: string;
  metodo: string;
  fecha_emision: Date;
  fecha_cobro: Date;
  banco: string;
  nro_de_cuenta: string;
  nro_documento: string;
  descripcion_documento: string;
  procesador_tarjeta: string;
  tarjeta: string;
  nro_de_tarjeta: string;
  fecha_tarjeta: Date;
  fecha_primer_pago_credito: Date;
  cuotas_credito: number;
  porcentaje_interes_credito: number;
  porcentaje_mora_credito: number;
  dias_cobro_mora_credito: number;
}

interface ModelInstance extends Model<attributes>, attributes {}

export const FormaPago = db.define<ModelInstance>(
  "FormaPago",
  {
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
    monto: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("Crédito", "Contado"),
    },
    metodo: {
      type: DataTypes.STRING,
      defaultValue: "Crédito",
    },
    fecha_emision: {
      type: DataTypes.DATE,
    },
    fecha_cobro: {
      type: DataTypes.DATE,
    },
    banco: {
      type: DataTypes.TEXT,
    },
    nro_de_cuenta: {
      type: DataTypes.TEXT,
    },
    nro_documento: {
      type: DataTypes.TEXT,
    },
    descripcion_documento: {
      type: DataTypes.TEXT,
    },
    procesador_tarjeta: {
      type: DataTypes.TEXT,
    },
    tarjeta: {
      type: DataTypes.TEXT,
    },
    nro_de_tarjeta: {
      type: DataTypes.TEXT,
    },
    fecha_tarjeta: {
      type: DataTypes.DATE,
    },
    fecha_primer_pago_credito: {
      type: DataTypes.DATE,
    },
    cuotas_credito: {
      type: DataTypes.BIGINT,
    },
    porcentaje_interes_credito: {
      type: DataTypes.DOUBLE,
    },
    porcentaje_mora_credito: {
      type: DataTypes.DOUBLE,
    },
    dias_cobro_mora_credito: {
      type: DataTypes.DOUBLE,
    },
  }
);

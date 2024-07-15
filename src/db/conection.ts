import { Sequelize } from "sequelize";
const dbname: any = process.env.DB_NAME;
const dbuser: any = process.env.DB_USER;
const dbpass: any = process.env.DB_PASS;

const db = new Sequelize(dbname, dbuser, dbpass, {
  host: "localhost",
  dialect: "mysql",
  define: {
    underscored: true,
  },
  logging: false,
});

export default db;

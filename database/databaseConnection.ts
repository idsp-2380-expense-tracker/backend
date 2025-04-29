import mysql from "mysql2/promise";

const is_hosted = process.env.IS_HOSTED || false;

const dbConfigHosted = {
  host: "mysql-montro-idsp-montro.j.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_FIpVYwSOtgz-0_7ytfA",
  database: "montro",
  port: 22664,
  multipleStatements: false,
  namedPlaceholders: true,
};

const dbConfigLocal = {
  host: "localhost",
  user: "root",
  password: "test",
  database: "montro",
  multipleStatements: false,
  namedPlaceholders: true,
};

const database: mysql.Pool = mysql.createPool(
  is_hosted ? dbConfigHosted : dbConfigLocal
);

export default database;

const { Pool } = require("pg");

let pool;

const getPool = () => {
  const connectionString = process.env.GROUPSCHOLAR_DB_URL;
  if (!connectionString) return null;
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
};

module.exports = { getPool };

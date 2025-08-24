const { Pool } = require("pg");

let pool;

const getPool = () => {
  const connectionString = process.env.GROUPSCHOLAR_DB_URL;
  if (!connectionString) return null;
  if (!pool) {
    const sslSetting = (process.env.GROUPSCHOLAR_DB_SSL || "").toLowerCase();
    const shouldUseSsl = ["true", "1", "require", "required"].includes(sslSetting);
    const poolConfig = { connectionString };
    if (shouldUseSsl) {
      poolConfig.ssl = { rejectUnauthorized: false };
    }
    pool = new Pool(poolConfig);
  }
  return pool;
};

module.exports = { getPool };

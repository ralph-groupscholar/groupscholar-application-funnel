let pool;

const getPool = async () => {
  if (pool) {
    return pool;
  }

  const { Pool } = require("pg");
  const connectionString = process.env.GROUPSCHOLAR_DB_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Missing database connection string");
  }

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  return pool;
};

const ensureTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS groupscholar_application_funnel_briefs (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      cohort TEXT NOT NULL,
      summary TEXT NOT NULL,
      metrics JSONB NOT NULL,
      generated_at TIMESTAMPTZ NOT NULL
    );
  `);
};

const parseBody = (req) => {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return {};
    }
  }

  return req.body;
};

module.exports = async (req, res) => {
  if (req.method !== "GET" && req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, POST");
    res.json({ error: "Method not allowed" });
    return;
  }

  let client;

  try {
    const poolInstance = await getPool();
    client = await poolInstance.connect();
    await ensureTable(client);

    if (req.method === "POST") {
      const payload = parseBody(req);
      const cohort = payload.cohort;
      const summary = payload.summary;
      const metrics = payload.metrics || {};
      const generatedAt = payload.generatedAt || new Date().toISOString();

      if (!cohort || !summary) {
        res.statusCode = 400;
        res.json({ error: "Missing cohort or summary" });
        return;
      }

      const result = await client.query(
        `
          INSERT INTO groupscholar_application_funnel_briefs (cohort, summary, metrics, generated_at)
          VALUES ($1, $2, $3, $4)
          RETURNING id, created_at, generated_at;
        `,
        [cohort, summary, metrics, generatedAt]
      );

      res.statusCode = 201;
      res.json({
        ok: true,
        brief: result.rows[0]
      });
      return;
    }

    const result = await client.query(
      `
        SELECT id, cohort, summary, metrics, generated_at, created_at
        FROM groupscholar_application_funnel_briefs
        ORDER BY created_at DESC
        LIMIT 3;
      `
    );

    res.statusCode = 200;
    res.json({
      ok: true,
      briefs: result.rows
    });
  } catch (error) {
    res.statusCode = 503;
    res.json({
      ok: false,
      error: "Database unavailable",
      detail: error.message
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

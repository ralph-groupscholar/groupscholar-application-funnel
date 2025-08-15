const { getPool } = require("./_db");

const ensureSchema = async (client) => {
  await client.query("CREATE SCHEMA IF NOT EXISTS application_funnel;");
  await client.query(`
    CREATE TABLE IF NOT EXISTS application_funnel.briefs (
      id BIGSERIAL PRIMARY KEY,
      cohort TEXT NOT NULL,
      summary TEXT NOT NULL,
      generated_at TIMESTAMPTZ NOT NULL,
      metrics JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(
    "CREATE INDEX IF NOT EXISTS application_funnel_briefs_created_idx ON application_funnel.briefs (created_at DESC);"
  );
};

const parseBody = (req) => {
  if (!req.body) return null;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return null;
    }
  }
  return req.body;
};

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const pool = getPool();
  if (!pool) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  if (req.method === "GET") {
    try {
      const client = await pool.connect();
      try {
        await ensureSchema(client);
        const result = await client.query(
          "SELECT id, cohort, summary, generated_at, metrics, created_at FROM application_funnel.briefs ORDER BY created_at DESC LIMIT 5;"
        );
        res.status(200).json({ briefs: result.rows });
      } finally {
        client.release();
      }
    } catch (error) {
      res.status(503).json({ error: "Unable to fetch briefs" });
    }
    return;
  }

  if (req.method === "POST") {
    const payload = parseBody(req);
    if (!payload) {
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    try {
      const client = await pool.connect();
      try {
        await ensureSchema(client);
        const result = await client.query(
          `
          INSERT INTO application_funnel.briefs (cohort, summary, generated_at, metrics)
          VALUES ($1, $2, $3, $4)
          RETURNING id, cohort, summary, generated_at, metrics, created_at;
          `,
          [payload.cohort, payload.summary, payload.generatedAt, payload.metrics]
        );
        res.status(200).json({ brief: result.rows[0] });
      } finally {
        client.release();
      }
    } catch (error) {
      res.status(503).json({ error: "Unable to save brief" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};

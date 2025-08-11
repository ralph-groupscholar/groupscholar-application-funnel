const { Client } = require("pg");

const fallbackSnapshot = () => ({
  capturedAt: new Date().toISOString(),
  totalApplications: 0,
  activeApplications: 0,
  stalledApplications: 0,
  conversionRate: 0,
  source: "fallback",
  note: "Database credentials not configured."
});

const ensureSchema = async (client) => {
  await client.query("CREATE SCHEMA IF NOT EXISTS groupscholar_application_funnel");
  await client.query(`
    CREATE TABLE IF NOT EXISTS groupscholar_application_funnel.funnel_snapshots (
      id SERIAL PRIMARY KEY,
      captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      total_applications INTEGER NOT NULL,
      active_applications INTEGER NOT NULL,
      stalled_applications INTEGER NOT NULL,
      conversion_rate NUMERIC(5, 4) NOT NULL,
      notes TEXT
    )
  `);
};

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env;
  if (!PGHOST || !PGPORT || !PGUSER || !PGPASSWORD || !PGDATABASE) {
    res.status(200).json(fallbackSnapshot());
    return;
  }

  const client = new Client({
    host: PGHOST,
    port: Number(PGPORT),
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await ensureSchema(client);

    const result = await client.query(`
      SELECT captured_at, total_applications, active_applications, stalled_applications, conversion_rate, notes
      FROM groupscholar_application_funnel.funnel_snapshots
      ORDER BY captured_at DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      res.status(200).json({
        ...fallbackSnapshot(),
        source: "database",
        note: "No snapshots stored yet. Seed the table to activate live sync."
      });
      return;
    }

    const row = result.rows[0];
    res.status(200).json({
      capturedAt: row.captured_at,
      totalApplications: row.total_applications,
      activeApplications: row.active_applications,
      stalledApplications: row.stalled_applications,
      conversionRate: Number(row.conversion_rate),
      source: "database",
      note: row.notes || "Latest persisted snapshot from the funnel ops pipeline."
    });
  } catch (error) {
    res.status(200).json({
      ...fallbackSnapshot(),
      note: "Database connection failed. Live snapshot unavailable."
    });
  } finally {
    await client.end();
  }
};

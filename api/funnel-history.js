const { getPool } = require("./_db");

const fallbackHistory = () => [
  {
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    totalApplications: 48,
    activeApplications: 19,
    stalledApplications: 5,
    conversionRate: 0.57,
    notes: "Baseline pulse for the week."
  },
  {
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    totalApplications: 50,
    activeApplications: 20,
    stalledApplications: 6,
    conversionRate: 0.59,
    notes: "Interview throughput improving."
  },
  {
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    totalApplications: 52,
    activeApplications: 21,
    stalledApplications: 6,
    conversionRate: 0.61,
    notes: "Eligibility backlog stable."
  }
];

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

const seedSnapshotsIfEmpty = async (client) => {
  const countResult = await client.query(
    "SELECT COUNT(*)::int AS count FROM groupscholar_application_funnel.funnel_snapshots;"
  );
  if (countResult.rows[0].count > 0) {
    return false;
  }

  const seeds = fallbackHistory();
  for (const snapshot of seeds) {
    await client.query(
      `
      INSERT INTO groupscholar_application_funnel.funnel_snapshots
        (captured_at, total_applications, active_applications, stalled_applications, conversion_rate, notes)
      VALUES
        ($1, $2, $3, $4, $5, $6);
      `,
      [
        snapshot.capturedAt,
        snapshot.totalApplications,
        snapshot.activeApplications,
        snapshot.stalledApplications,
        snapshot.conversionRate,
        snapshot.notes
      ]
    );
  }

  return true;
};

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.setHeader("Content-Type", "application/json");

  const pool = getPool();
  if (!pool) {
    res.status(200).json({
      source: "fallback",
      history: fallbackHistory(),
      note: "Database credentials not configured."
    });
    return;
  }

  try {
    const client = await pool.connect();
    try {
      await ensureSchema(client);
      await seedSnapshotsIfEmpty(client);

      const result = await client.query(`
        SELECT captured_at, total_applications, active_applications, stalled_applications, conversion_rate, notes
        FROM groupscholar_application_funnel.funnel_snapshots
        ORDER BY captured_at DESC
        LIMIT 6
      `);

      if (result.rows.length === 0) {
        res.status(200).json({
          source: "database-empty",
          history: [],
          note: "No snapshots stored yet. Seed the table to activate trend tracking."
        });
        return;
      }

      const history = result.rows
        .map((row) => ({
          capturedAt: row.captured_at,
          totalApplications: row.total_applications,
          activeApplications: row.active_applications,
          stalledApplications: row.stalled_applications,
          conversionRate: Number(row.conversion_rate),
          notes: row.notes || ""
        }))
        .reverse();

      res.status(200).json({
        source: "database",
        history,
        note: "Recent snapshots from the funnel pipeline."
      });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(200).json({
      source: "fallback",
      history: fallbackHistory(),
      note: "Database connection failed. Using fallback history."
    });
  }
};

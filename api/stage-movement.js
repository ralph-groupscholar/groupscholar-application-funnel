const { getPool } = require("./_db");

const sampleEvents = [
  {
    id: "GS-2042",
    name: "Jalen Ortiz",
    cohort: "Spring 2026",
    fromStage: "Review",
    toStage: "Interview",
    reviewer: "L. Webb",
    movedAt: "2026-02-07T13:30:00Z",
    daysInStage: 9,
    reason: "Strong rubric scores; schedule panel."
  },
  {
    id: "GS-2041",
    name: "Ari Lennox",
    cohort: "Spring 2026",
    fromStage: "Eligibility",
    toStage: "Review",
    reviewer: "M. Rivera",
    movedAt: "2026-02-06T16:10:00Z",
    daysInStage: 5,
    reason: "Eligibility docs cleared."
  },
  {
    id: "GS-2044",
    name: "Noah Kim",
    cohort: "Spring 2026",
    fromStage: "Interview",
    toStage: "Final",
    reviewer: "A. Chen",
    movedAt: "2026-02-05T18:45:00Z",
    daysInStage: 7,
    reason: "Panel notes complete."
  },
  {
    id: "GS-1968",
    name: "Fatima Noor",
    cohort: "Winter 2025",
    fromStage: "Review",
    toStage: "Interview",
    reviewer: "S. Tran",
    movedAt: "2026-02-03T14:05:00Z",
    daysInStage: 15,
    reason: "Escalated after delay."
  },
  {
    id: "GS-2050",
    name: "Isla Bennett",
    cohort: "Spring 2026",
    fromStage: "Submitted",
    toStage: "Eligibility",
    reviewer: "L. Webb",
    movedAt: "2026-02-02T12:20:00Z",
    daysInStage: 3,
    reason: "Intake verification complete."
  },
  {
    id: "GS-1967",
    name: "Mateo Ruiz",
    cohort: "Winter 2025",
    fromStage: "Final",
    toStage: "Awarded",
    reviewer: "S. Tran",
    movedAt: "2026-02-01T09:30:00Z",
    daysInStage: 8,
    reason: "Award approval issued."
  }
];

const ensureSchema = async (client) => {
  await client.query("CREATE SCHEMA IF NOT EXISTS groupscholar_application_funnel");
  await client.query(`
    CREATE TABLE IF NOT EXISTS groupscholar_application_funnel.stage_movements (
      id SERIAL PRIMARY KEY,
      application_id TEXT NOT NULL,
      name TEXT NOT NULL,
      cohort TEXT NOT NULL,
      from_stage TEXT NOT NULL,
      to_stage TEXT NOT NULL,
      reviewer TEXT NOT NULL,
      moved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      days_in_stage INTEGER NOT NULL,
      reason TEXT
    )
  `);
  await client.query(
    "CREATE INDEX IF NOT EXISTS stage_movements_moved_at_idx ON groupscholar_application_funnel.stage_movements (moved_at DESC);"
  );
};

const seedStageMovementsIfEmpty = async (client) => {
  const countResult = await client.query(
    "SELECT COUNT(*)::int AS count FROM groupscholar_application_funnel.stage_movements;"
  );
  if (countResult.rows[0].count > 0) {
    return false;
  }

  for (const event of sampleEvents) {
    await client.query(
      `
      INSERT INTO groupscholar_application_funnel.stage_movements
        (application_id, name, cohort, from_stage, to_stage, reviewer, moved_at, days_in_stage, reason)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      [
        event.id,
        event.name,
        event.cohort,
        event.fromStage,
        event.toStage,
        event.reviewer,
        event.movedAt,
        event.daysInStage,
        event.reason
      ]
    );
  }

  return true;
};

const mapRow = (row) => ({
  id: row.application_id,
  name: row.name,
  cohort: row.cohort,
  fromStage: row.from_stage,
  toStage: row.to_stage,
  reviewer: row.reviewer,
  movedAt: row.moved_at,
  daysInStage: Number(row.days_in_stage),
  reason: row.reason || ""
});

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.setHeader("Content-Type", "application/json");

  const pool = getPool();
  if (!pool) {
    res.status(200).json({
      source: "sample",
      events: sampleEvents,
      note: "Database credentials not configured."
    });
    return;
  }

  try {
    const client = await pool.connect();
    try {
      await ensureSchema(client);
      await seedStageMovementsIfEmpty(client);

      const result = await client.query(`
        SELECT application_id, name, cohort, from_stage, to_stage, reviewer, moved_at, days_in_stage, reason
        FROM groupscholar_application_funnel.stage_movements
        ORDER BY moved_at DESC
        LIMIT 12
      `);

      res.status(200).json({
        source: "database",
        events: result.rows.map(mapRow),
        note: "Recent stage transitions captured in the pipeline."
      });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(200).json({
      source: "fallback",
      events: sampleEvents,
      note: "Database unavailable. Using fallback stage movement data."
    });
  }
};

const { getPool } = require("./_db");

const sampleRecords = [
  {
    id: "GS-2042",
    name: "Jalen Ortiz",
    cohort: "Spring 2026",
    stage: "Interview",
    reviewer: "L. Webb",
    requestedAt: "2026-02-03T16:00:00Z",
    decisionBy: "2026-02-10T16:00:00Z",
    decidedAt: null,
    status: "pending",
    daysInQueue: 5,
    notes: "Panel notes awaiting sign-off."
  },
  {
    id: "GS-2044",
    name: "Noah Kim",
    cohort: "Spring 2026",
    stage: "Final",
    reviewer: "A. Chen",
    requestedAt: "2026-02-01T18:00:00Z",
    decisionBy: "2026-02-08T18:00:00Z",
    decidedAt: null,
    status: "pending",
    daysInQueue: 7,
    notes: "Budget confirmation required."
  },
  {
    id: "GS-2041",
    name: "Ari Lennox",
    cohort: "Spring 2026",
    stage: "Interview",
    reviewer: "M. Rivera",
    requestedAt: "2026-01-30T14:30:00Z",
    decisionBy: "2026-02-06T14:30:00Z",
    decidedAt: "2026-02-05T13:15:00Z",
    status: "completed",
    daysInQueue: 6,
    notes: "Decision finalized after panel review."
  },
  {
    id: "GS-1968",
    name: "Fatima Noor",
    cohort: "Winter 2025",
    stage: "Final",
    reviewer: "S. Tran",
    requestedAt: "2026-01-24T11:45:00Z",
    decisionBy: "2026-02-01T11:45:00Z",
    decidedAt: null,
    status: "overdue",
    daysInQueue: 12,
    notes: "Needs final award approval."
  },
  {
    id: "GS-2050",
    name: "Isla Bennett",
    cohort: "Spring 2026",
    stage: "Interview",
    reviewer: "L. Webb",
    requestedAt: "2026-02-04T09:00:00Z",
    decisionBy: "2026-02-11T09:00:00Z",
    decidedAt: null,
    status: "pending",
    daysInQueue: 4,
    notes: "Waiting on supplemental reference."
  },
  {
    id: "GS-1967",
    name: "Mateo Ruiz",
    cohort: "Winter 2025",
    stage: "Final",
    reviewer: "S. Tran",
    requestedAt: "2026-01-20T15:00:00Z",
    decisionBy: "2026-01-27T15:00:00Z",
    decidedAt: "2026-01-26T10:20:00Z",
    status: "completed",
    daysInQueue: 6,
    notes: "Award approved and issued."
  }
];

const ensureSchema = async (client) => {
  await client.query("CREATE SCHEMA IF NOT EXISTS groupscholar_application_funnel");
  await client.query(`
    CREATE TABLE IF NOT EXISTS groupscholar_application_funnel.decision_latency (
      id SERIAL PRIMARY KEY,
      application_id TEXT NOT NULL,
      name TEXT NOT NULL,
      cohort TEXT NOT NULL,
      stage TEXT NOT NULL,
      reviewer TEXT NOT NULL,
      requested_at TIMESTAMPTZ NOT NULL,
      decision_by TIMESTAMPTZ NOT NULL,
      decided_at TIMESTAMPTZ,
      status TEXT NOT NULL,
      days_in_queue INTEGER NOT NULL,
      notes TEXT
    )
  `);
  await client.query(
    "CREATE INDEX IF NOT EXISTS decision_latency_due_idx ON groupscholar_application_funnel.decision_latency (decision_by ASC);"
  );
};

const seedDecisionLatencyIfEmpty = async (client) => {
  const countResult = await client.query(
    "SELECT COUNT(*)::int AS count FROM groupscholar_application_funnel.decision_latency;"
  );
  if (countResult.rows[0].count > 0) {
    return false;
  }

  for (const record of sampleRecords) {
    await client.query(
      `
      INSERT INTO groupscholar_application_funnel.decision_latency
        (application_id, name, cohort, stage, reviewer, requested_at, decision_by, decided_at, status, days_in_queue, notes)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `,
      [
        record.id,
        record.name,
        record.cohort,
        record.stage,
        record.reviewer,
        record.requestedAt,
        record.decisionBy,
        record.decidedAt,
        record.status,
        record.daysInQueue,
        record.notes
      ]
    );
  }

  return true;
};

const mapRow = (row) => ({
  id: row.application_id,
  name: row.name,
  cohort: row.cohort,
  stage: row.stage,
  reviewer: row.reviewer,
  requestedAt: row.requested_at,
  decisionBy: row.decision_by,
  decidedAt: row.decided_at,
  status: row.status,
  daysInQueue: Number(row.days_in_queue),
  notes: row.notes || ""
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
      records: sampleRecords,
      note: "Database credentials not configured."
    });
    return;
  }

  try {
    const client = await pool.connect();
    try {
      await ensureSchema(client);
      await seedDecisionLatencyIfEmpty(client);

      const result = await client.query(`
        SELECT application_id, name, cohort, stage, reviewer, requested_at, decision_by, decided_at, status, days_in_queue, notes
        FROM groupscholar_application_funnel.decision_latency
        ORDER BY decision_by ASC
        LIMIT 12
      `);

      res.status(200).json({
        source: "database",
        records: result.rows.map(mapRow),
        note: "Decision queue latency captured from the pipeline."
      });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(200).json({
      source: "fallback",
      records: sampleRecords,
      note: "Database unavailable. Using fallback decision latency data."
    });
  }
};

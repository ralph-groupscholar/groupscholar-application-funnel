const { getPool } = require("./_db");

const sampleRecords = [
  {
    id: "GS-2042",
    name: "Jalen Ortiz",
    cohort: "Spring 2026",
    reviewer: "L. Webb",
    panelLead: "C. Liao",
    scheduledAt: "2026-02-12T16:00:00Z",
    inviteSentAt: "2026-02-08T10:00:00Z",
    status: "scheduled",
    daysWaiting: 4,
    notes: "Panel confirmed, interpreter requested."
  },
  {
    id: "GS-2050",
    name: "Isla Bennett",
    cohort: "Spring 2026",
    reviewer: "L. Webb",
    panelLead: "C. Liao",
    scheduledAt: null,
    inviteSentAt: "2026-02-06T15:30:00Z",
    status: "invited",
    daysWaiting: 5,
    notes: "Waiting on candidate confirmation."
  },
  {
    id: "GS-2041",
    name: "Ari Lennox",
    cohort: "Spring 2026",
    reviewer: "M. Rivera",
    panelLead: "T. Monroe",
    scheduledAt: null,
    inviteSentAt: null,
    status: "hold",
    daysWaiting: 8,
    notes: "Needs availability from panelists."
  },
  {
    id: "GS-1969",
    name: "Chloe Martin",
    cohort: "Winter 2025",
    reviewer: "R. Flores",
    panelLead: "J. Patel",
    scheduledAt: "2026-02-09T18:00:00Z",
    inviteSentAt: "2026-02-04T09:30:00Z",
    status: "scheduled",
    daysWaiting: 2,
    notes: "Send prep packet."
  },
  {
    id: "GS-1968",
    name: "Fatima Noor",
    cohort: "Winter 2025",
    reviewer: "S. Tran",
    panelLead: "J. Patel",
    scheduledAt: null,
    inviteSentAt: "2026-02-02T14:00:00Z",
    status: "invited",
    daysWaiting: 9,
    notes: "Needs time-zone coordination."
  }
];

const ensureSchema = async (client) => {
  await client.query("CREATE SCHEMA IF NOT EXISTS groupscholar_application_funnel");
  await client.query(`
    CREATE TABLE IF NOT EXISTS groupscholar_application_funnel.interview_scheduling (
      id SERIAL PRIMARY KEY,
      application_id TEXT NOT NULL,
      name TEXT NOT NULL,
      cohort TEXT NOT NULL,
      reviewer TEXT NOT NULL,
      panel_lead TEXT,
      scheduled_at TIMESTAMPTZ,
      invite_sent_at TIMESTAMPTZ,
      status TEXT NOT NULL,
      days_waiting INTEGER NOT NULL,
      notes TEXT
    )
  `);
  await client.query(
    "CREATE INDEX IF NOT EXISTS interview_scheduling_status_idx ON groupscholar_application_funnel.interview_scheduling (status);"
  );
  await client.query(
    "CREATE INDEX IF NOT EXISTS interview_scheduling_scheduled_idx ON groupscholar_application_funnel.interview_scheduling (scheduled_at DESC);"
  );
};

const seedInterviewSchedulingIfEmpty = async (client) => {
  const countResult = await client.query(
    "SELECT COUNT(*)::int AS count FROM groupscholar_application_funnel.interview_scheduling;"
  );
  if (countResult.rows[0].count > 0) {
    return false;
  }

  for (const record of sampleRecords) {
    await client.query(
      `
      INSERT INTO groupscholar_application_funnel.interview_scheduling
        (application_id, name, cohort, reviewer, panel_lead, scheduled_at, invite_sent_at, status, days_waiting, notes)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [
        record.id,
        record.name,
        record.cohort,
        record.reviewer,
        record.panelLead,
        record.scheduledAt,
        record.inviteSentAt,
        record.status,
        record.daysWaiting,
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
  reviewer: row.reviewer,
  panelLead: row.panel_lead,
  scheduledAt: row.scheduled_at,
  inviteSentAt: row.invite_sent_at,
  status: row.status,
  daysWaiting: Number(row.days_waiting),
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
      await seedInterviewSchedulingIfEmpty(client);

      const result = await client.query(`
        SELECT application_id, name, cohort, reviewer, panel_lead, scheduled_at, invite_sent_at, status, days_waiting, notes
        FROM groupscholar_application_funnel.interview_scheduling
        ORDER BY scheduled_at DESC NULLS LAST, invite_sent_at DESC NULLS LAST
        LIMIT 12
      `);

      res.status(200).json({
        source: "database",
        records: result.rows.map(mapRow),
        note: "Interview scheduling status from the production pipeline."
      });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(200).json({
      source: "fallback",
      records: sampleRecords,
      note: "Database unavailable. Using fallback interview scheduling data."
    });
  }
};

const { getPool } = require("./_db");

const sampleData = [
  {
    id: "GS-2041",
    name: "Ari Lennox",
    cohort: "Spring 2026",
    stage: "Review",
    reviewer: "M. Rivera",
    status: "active",
    submittedAt: "2026-01-15",
    lastUpdate: "2026-02-02",
    turnaroundDays: 6
  },
  {
    id: "GS-2042",
    name: "Jalen Ortiz",
    cohort: "Spring 2026",
    stage: "Interview",
    reviewer: "L. Webb",
    status: "active",
    submittedAt: "2026-01-14",
    lastUpdate: "2026-02-06",
    turnaroundDays: 8
  },
  {
    id: "GS-2043",
    name: "Riya Patel",
    cohort: "Spring 2026",
    stage: "Eligibility",
    reviewer: "M. Rivera",
    status: "stalled",
    submittedAt: "2026-01-12",
    lastUpdate: "2026-01-20",
    turnaroundDays: 12
  },
  {
    id: "GS-2044",
    name: "Noah Kim",
    cohort: "Spring 2026",
    stage: "Final",
    reviewer: "A. Chen",
    status: "active",
    submittedAt: "2026-01-10",
    lastUpdate: "2026-02-05",
    turnaroundDays: 5
  },
  {
    id: "GS-2045",
    name: "Zara Okafor",
    cohort: "Spring 2026",
    stage: "Awarded",
    reviewer: "A. Chen",
    status: "completed",
    submittedAt: "2026-01-08",
    lastUpdate: "2026-02-01",
    turnaroundDays: 4
  },
  {
    id: "GS-1967",
    name: "Mateo Ruiz",
    cohort: "Winter 2025",
    stage: "Awarded",
    reviewer: "S. Tran",
    status: "completed",
    submittedAt: "2025-11-21",
    lastUpdate: "2025-12-12",
    turnaroundDays: 10
  },
  {
    id: "GS-1968",
    name: "Fatima Noor",
    cohort: "Winter 2025",
    stage: "Final",
    reviewer: "S. Tran",
    status: "stalled",
    submittedAt: "2025-11-18",
    lastUpdate: "2025-12-02",
    turnaroundDays: 14
  },
  {
    id: "GS-1969",
    name: "Chloe Martin",
    cohort: "Winter 2025",
    stage: "Interview",
    reviewer: "R. Flores",
    status: "completed",
    submittedAt: "2025-11-20",
    lastUpdate: "2025-12-08",
    turnaroundDays: 9
  },
  {
    id: "GS-1970",
    name: "Kenji Ito",
    cohort: "Winter 2025",
    stage: "Review",
    reviewer: "R. Flores",
    status: "active",
    submittedAt: "2025-11-25",
    lastUpdate: "2025-12-04",
    turnaroundDays: 11
  },
  {
    id: "GS-2050",
    name: "Isla Bennett",
    cohort: "Spring 2026",
    stage: "Review",
    reviewer: "L. Webb",
    status: "active",
    submittedAt: "2026-01-16",
    lastUpdate: "2026-02-04",
    turnaroundDays: 7
  }
];


const ensureSchema = async (client) => {
  await client.query("CREATE SCHEMA IF NOT EXISTS application_funnel;");
  await client.query(`
    CREATE TABLE IF NOT EXISTS application_funnel.applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cohort TEXT NOT NULL,
      stage TEXT NOT NULL,
      reviewer TEXT NOT NULL,
      status TEXT NOT NULL,
      submitted_at DATE NOT NULL,
      last_update DATE NOT NULL,
      turnaround_days INTEGER NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await client.query(
    "CREATE INDEX IF NOT EXISTS application_funnel_cohort_idx ON application_funnel.applications (cohort);"
  );
  await client.query(
    "CREATE INDEX IF NOT EXISTS application_funnel_stage_idx ON application_funnel.applications (stage);"
  );
  await client.query(
    "CREATE INDEX IF NOT EXISTS application_funnel_last_update_idx ON application_funnel.applications (last_update);"
  );
};

const mapRow = (row) => ({
  id: row.id,
  name: row.name,
  cohort: row.cohort,
  stage: row.stage,
  reviewer: row.reviewer,
  status: row.status,
  submittedAt: row.submitted_at.toISOString().slice(0, 10),
  lastUpdate: row.last_update.toISOString().slice(0, 10),
  turnaroundDays: Number(row.turnaround_days)
});

const buildPayload = ({ source, note, data, meta }) => ({
  source,
  note,
  data,
  meta: {
    refreshedAt: new Date().toISOString(),
    dataRowCount: data.length,
    cohortCount: meta.cohorts.length,
    cohorts: meta.cohorts,
    dbRowCount: meta.dbRowCount,
    lastDataUpdate: meta.lastDataUpdate || null
  }
});

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const poolInstance = getPool();
  if (!poolInstance) {
    const cohorts = Array.from(new Set(sampleData.map((item) => item.cohort))).sort();
    res.status(200).json(
      buildPayload({
        source: "sample",
        note: "Live database not configured. Showing sample data.",
        data: sampleData,
        meta: { cohorts, dbRowCount: 0, lastDataUpdate: null }
      })
    );
    return;
  }

  try {
    const client = await poolInstance.connect();
    try {
      await ensureSchema(client);
      const dataResult = await client.query(
        "SELECT id, name, cohort, stage, reviewer, status, submitted_at, last_update, turnaround_days FROM application_funnel.applications ORDER BY last_update DESC;"
      );
      const metaResult = await client.query(
        "SELECT MAX(updated_at) AS last_update FROM application_funnel.applications;"
      );

      const rows = dataResult.rows || [];
      const mappedRows = rows.map(mapRow);
      const cohorts = Array.from(
        new Set((mappedRows.length ? mappedRows : sampleData).map((item) => item.cohort))
      ).sort();
      const lastDataUpdate = metaResult.rows[0]?.last_update || null;

      if (!mappedRows.length) {
        res.status(200).json(
          buildPayload({
            source: "database-empty",
            note: "Database connected but no rows yet. Showing sample data.",
            data: sampleData,
            meta: { cohorts, dbRowCount: 0, lastDataUpdate }
          })
        );
        return;
      }

      res.status(200).json(
        buildPayload({
          source: "database",
          note: "Live database connected.",
          data: mappedRows,
          meta: { cohorts, dbRowCount: rows.length, lastDataUpdate }
        })
      );
    } finally {
      client.release();
    }
  } catch (error) {
    const cohorts = Array.from(new Set(sampleData.map((item) => item.cohort))).sort();
    res.status(200).json(
      buildPayload({
        source: "fallback",
        note: "Database unavailable. Showing sample data.",
        data: sampleData,
        meta: { cohorts, dbRowCount: 0, lastDataUpdate: null }
      })
    );
  }
};

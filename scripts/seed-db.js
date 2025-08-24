const { Pool } = require("pg");

const connectionString = process.env.GROUPSCHOLAR_DB_URL;
if (!connectionString) {
  console.error("Missing GROUPSCHOLAR_DB_URL env var.");
  process.exit(1);
}

const sslSetting = (process.env.GROUPSCHOLAR_DB_SSL || "").toLowerCase();
const shouldUseSsl = ["true", "1", "require", "required"].includes(sslSetting);
const poolConfig = { connectionString };
if (shouldUseSsl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

const sampleApplications = [
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

const sampleBriefs = [
  {
    cohort: "Spring 2026",
    summary:
      "Review throughput steady but interview stage requires nudges. Prioritize stalled eligibility files and rebalance reviewer load for final decisions.",
    generatedAt: "2026-02-06T15:00:00Z",
    metrics: {
      active: 18,
      stalled: 4,
      inReview: 9,
      inInterview: 5,
      inFinal: 3,
      awarded: 2
    }
  },
  {
    cohort: "Winter 2025",
    summary:
      "Wrap-up cycle nearing completion. Focus on final documentation requests and confirm award notifications to close remaining files.",
    generatedAt: "2025-12-10T15:00:00Z",
    metrics: {
      active: 6,
      stalled: 2,
      inReview: 2,
      inInterview: 1,
      inFinal: 2,
      awarded: 7
    }
  }
];

const sampleSnapshots = [
  {
    capturedAt: "2026-01-29T14:00:00Z",
    totalApplications: 47,
    activeApplications: 18,
    stalledApplications: 5,
    conversionRate: 0.55,
    notes: "Week opening pulse; review load stabilizing."
  },
  {
    capturedAt: "2026-02-01T14:00:00Z",
    totalApplications: 49,
    activeApplications: 19,
    stalledApplications: 5,
    conversionRate: 0.58,
    notes: "Eligibility backlog easing after document follow-ups."
  },
  {
    capturedAt: "2026-02-03T14:00:00Z",
    totalApplications: 50,
    activeApplications: 20,
    stalledApplications: 7,
    conversionRate: 0.598,
    notes: "Midweek pulse; interview throughput improving after reviewer swap."
  },
  {
    capturedAt: "2026-02-06T14:00:00Z",
    totalApplications: 52,
    activeApplications: 21,
    stalledApplications: 6,
    conversionRate: 0.6125,
    notes: "Latest Monday checkpoint; stalled files concentrated in eligibility."
  }
];

const ensureSchemas = async (client) => {
  await client.query("CREATE SCHEMA IF NOT EXISTS application_funnel;");
  await client.query("CREATE SCHEMA IF NOT EXISTS groupscholar_application_funnel;");

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

  await client.query(`
    CREATE TABLE IF NOT EXISTS groupscholar_application_funnel.funnel_snapshots (
      id SERIAL PRIMARY KEY,
      captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      total_applications INTEGER NOT NULL,
      active_applications INTEGER NOT NULL,
      stalled_applications INTEGER NOT NULL,
      conversion_rate NUMERIC(5, 4) NOT NULL,
      notes TEXT
    );
  `);
};

const seedApplications = async (client) => {
  const { rows } = await client.query(
    "SELECT COUNT(*)::int AS count FROM application_funnel.applications;"
  );
  if (rows[0].count > 0) return "applications already seeded";

  for (const app of sampleApplications) {
    await client.query(
      `
      INSERT INTO application_funnel.applications
        (id, name, cohort, stage, reviewer, status, submitted_at, last_update, turnaround_days)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING;
      `,
      [
        app.id,
        app.name,
        app.cohort,
        app.stage,
        app.reviewer,
        app.status,
        app.submittedAt,
        app.lastUpdate,
        app.turnaroundDays
      ]
    );
  }
  return "applications seeded";
};

const seedBriefs = async (client) => {
  const { rows } = await client.query(
    "SELECT COUNT(*)::int AS count FROM application_funnel.briefs;"
  );
  if (rows[0].count > 0) return "briefs already seeded";

  for (const brief of sampleBriefs) {
    await client.query(
      `
      INSERT INTO application_funnel.briefs
        (cohort, summary, generated_at, metrics)
      VALUES
        ($1, $2, $3, $4);
      `,
      [brief.cohort, brief.summary, brief.generatedAt, brief.metrics]
    );
  }
  return "briefs seeded";
};

const seedSnapshots = async (client) => {
  const { rows } = await client.query(
    "SELECT COUNT(*)::int AS count FROM groupscholar_application_funnel.funnel_snapshots;"
  );
  if (rows[0].count > 0) return "snapshots already seeded";

  for (const snapshot of sampleSnapshots) {
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
  return "snapshots seeded";
};

const run = async () => {
  const client = await pool.connect();
  try {
    await ensureSchemas(client);
    const results = [];
    results.push(await seedApplications(client));
    results.push(await seedBriefs(client));
    results.push(await seedSnapshots(client));
    console.log(results.join("\n"));
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});

const stages = [
  "Submitted",
  "Eligibility",
  "Review",
  "Interview",
  "Final",
  "Awarded"
];

const slaTargets = {
  Submitted: 3,
  Eligibility: 5,
  Review: 7,
  Interview: 6,
  Final: 5,
  Awarded: 0
};

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

const sampleSnapshotHistory = [
  {
    capturedAt: "2026-01-29T14:00:00Z",
    totalApplications: 47,
    activeApplications: 18,
    stalledApplications: 5,
    conversionRate: 0.55,
    notes: "Week opening pulse."
  },
  {
    capturedAt: "2026-02-01T14:00:00Z",
    totalApplications: 49,
    activeApplications: 19,
    stalledApplications: 5,
    conversionRate: 0.58,
    notes: "Eligibility backlog easing."
  },
  {
    capturedAt: "2026-02-03T14:00:00Z",
    totalApplications: 50,
    activeApplications: 20,
    stalledApplications: 7,
    conversionRate: 0.598,
    notes: "Interview throughput improving."
  },
  {
    capturedAt: "2026-02-06T14:00:00Z",
    totalApplications: 52,
    activeApplications: 21,
    stalledApplications: 6,
    conversionRate: 0.6125,
    notes: "Latest Monday checkpoint."
  }
];

const sampleBriefArchive = [
  {
    cohort: "Spring 2026",
    summary:
      "Review throughput steady but interview stage requires nudges. Prioritize stalled eligibility files and rebalance reviewer load for final decisions.",
    generated_at: "2026-02-06T15:00:00Z",
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
    generated_at: "2025-12-10T15:00:00Z",
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

let data = [...sampleData];

const cohortSelect = document.getElementById("cohortSelect");
const reviewerFilter = document.getElementById("reviewerFilter");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const exportJson = document.getElementById("exportJson");
const generateBrief = document.getElementById("generateBrief");

const funnelStages = document.getElementById("funnelStages");
const reviewerTable = document.getElementById("reviewerTable");
const alertList = document.getElementById("alertList");
const slaList = document.getElementById("slaList");
const slaMetrics = document.getElementById("slaMetrics");
const cadenceSummary = document.getElementById("cadenceSummary");
const cadenceList = document.getElementById("cadenceList");
const stageMomentum = document.getElementById("stageMomentum");
const stageTargets = document.getElementById("stageTargets");
const decisionQueue = document.getElementById("decisionQueue");
const prioritySummary = document.getElementById("prioritySummary");
const priorityList = document.getElementById("priorityList");
const reviewerRiskMetrics = document.getElementById("reviewerRiskMetrics");
const reviewerRiskList = document.getElementById("reviewerRiskList");
const reviewerPlaybook = document.getElementById("reviewerPlaybook");
const rosterTable = document.getElementById("rosterTable");
const cohortComparison = document.getElementById("cohortComparison");
const cohortComparisonNote = document.getElementById("cohortComparisonNote");
const cohortSnapshot = document.getElementById("cohortSnapshot");
const capacityForecast = document.getElementById("capacityForecast");
const rebalanceList = document.getElementById("rebalanceList");
const liveSnapshot = document.getElementById("liveSnapshot");
const liveSnapshotNotes = document.getElementById("liveSnapshotNotes");
const snapshotTrend = document.getElementById("snapshotTrend");
const snapshotTrendNote = document.getElementById("snapshotTrendNote");
const captureSnapshot = document.getElementById("captureSnapshot");
const briefArchive = document.getElementById("briefArchive");
const briefArchiveNote = document.getElementById("briefArchiveNote");
const refreshBriefArchive = document.getElementById("refreshBriefArchive");
const outreachMetrics = document.getElementById("outreachMetrics");
const outreachList = document.getElementById("outreachList");
const briefPanel = document.getElementById("briefPanel");
const briefOutput = document.getElementById("briefOutput");
const briefStatus = document.getElementById("briefStatus");
const activeCohort = document.getElementById("activeCohort");
const totalApplications = document.getElementById("totalApplications");
const overallConversion = document.getElementById("overallConversion");
const refreshLiveData = document.getElementById("refreshLiveData");

const unique = (items) => Array.from(new Set(items)).sort();
const today = new Date();
const SLA_TARGET_DAYS = 7;
const SLA_WARNING_DAYS = 10;
const SLA_CRITICAL_DAYS = 14;
const stageEffortHours = {
  Submitted: 0.5,
  Eligibility: 1,
  Review: 2,
  Interview: 3,
  Final: 2,
  Awarded: 0.5
};
const briefArchiveMap = new Map();
const reviewerDailyCapacity = 4;
const stagePriorityWeight = {
  Submitted: 0.6,
  Eligibility: 0.9,
  Review: 1.2,
  Interview: 1.6,
  Final: 1.8,
  Awarded: 0.2
};
const stageActionMap = {
  Submitted: "Confirm intake completeness",
  Eligibility: "Complete eligibility check",
  Review: "Assign reviewer or advance",
  Interview: "Schedule interview panel",
  Final: "Confirm award decision",
  Awarded: "Send award packet"
};
const outreachCadenceDays = {
  Submitted: 2,
  Eligibility: 3,
  Review: 4,
  Interview: 3,
  Final: 2,
  Awarded: 0
};
const outreachTouchpointMap = {
  Submitted: "Send intake confirmation",
  Eligibility: "Request missing documents",
  Review: "Share review timeline update",
  Interview: "Confirm interview logistics",
  Final: "Provide decision timeline",
  Awarded: "Share onboarding next steps"
};

const buildSelectOptions = () => {
  const cohorts = unique(data.map((item) => item.cohort));
  const reviewers = unique(data.map((item) => item.reviewer));

  if (!cohorts.length) {
    cohortSelect.innerHTML = '<option value="">No cohorts</option>';
    reviewerFilter.innerHTML = '<option value="all">All</option>';
    return;
  }

  cohortSelect.innerHTML = cohorts
    .map((cohort) => `<option value="${cohort}">${cohort}</option>`)
    .join("");
  reviewerFilter.innerHTML =
    '<option value="all">All</option>' +
    reviewers.map((reviewer) => `<option value="${reviewer}">${reviewer}</option>`).join("");
};

const filterData = () => {
  const cohort = cohortSelect.value;
  const status = statusFilter.value;
  const reviewer = reviewerFilter.value;
  const query = searchInput.value.toLowerCase();

  return data.filter((item) => {
    const matchCohort = item.cohort === cohort;
    const matchStatus = status === "all" || item.status === status;
    const matchReviewer = reviewer === "all" || item.reviewer === reviewer;
    const matchQuery =
      item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);

    return matchCohort && matchStatus && matchReviewer && matchQuery;
  });
};

const renderFunnel = (items) => {
  const counts = stages.map((stage) => items.filter((item) => item.stage === stage).length);
  const submitted = counts[0] || 1;

  funnelStages.innerHTML = stages
    .map((stage, index) => {
      const count = counts[index];
      const conversion = ((count / submitted) * 100).toFixed(0);
      const previous = index === 0 ? count : counts[index - 1] || 1;
      const drop = previous - count;
      const delta = index === 0 ? "" : `${drop} drop-off`;
      return `
        <div class="stage">
          <div>
            <strong>${stage}</strong>
            <span>${conversion}% conversion</span>
          </div>
          <div>
            <strong>${count}</strong>
            <div class="delta">${delta}</div>
          </div>
        </div>
      `;
    })
    .join("");

  totalApplications.textContent = items.length;
  overallConversion.textContent = `${((counts[counts.length - 1] / submitted) * 100).toFixed(1)}%`;
};

const renderReviewers = (items) => {
  const reviewerMap = {};
  items.forEach((item) => {
    if (!reviewerMap[item.reviewer]) {
      reviewerMap[item.reviewer] = { count: 0, totalDays: 0, stages: new Set() };
    }
    reviewerMap[item.reviewer].count += 1;
    reviewerMap[item.reviewer].totalDays += item.turnaroundDays;
    reviewerMap[item.reviewer].stages.add(item.stage);
  });

  const rows = Object.entries(reviewerMap).map(([name, detail]) => {
    const avg = (detail.totalDays / detail.count).toFixed(1);
    return `
      <div class="table-row">
        <div><strong>${name}</strong><span>Reviewer</span></div>
        <div><strong>${detail.count}</strong><span>Assigned</span></div>
        <div><strong>${avg} days</strong><span>Avg turnaround</span></div>
        <div><strong>${detail.stages.size}</strong><span>Stages touched</span></div>
      </div>
    `;
  });

  reviewerTable.innerHTML = rows.join("") || "<p>No reviewer data.</p>";
};

const renderCapacity = (items) => {
  const activeItems = items.filter((item) => item.status !== "completed");
  const reviewers = unique(activeItems.map((item) => item.reviewer));
  const reviewerCount = reviewers.length;
  const totalHours = activeItems.reduce(
    (sum, item) => sum + (stageEffortHours[item.stage] || 1),
    0
  );
  const dailyCapacity = reviewerCount * reviewerDailyCapacity;
  const daysToClear = dailyCapacity ? (totalHours / dailyCapacity).toFixed(1) : "0.0";

  const stageHours = stages.map((stage) => {
    const count = activeItems.filter((item) => item.stage === stage).length;
    return { stage, count, hours: count * (stageEffortHours[stage] || 1) };
  });

  const highestLoad = stageHours.reduce(
    (max, current) => (current.hours > max.hours ? current : max),
    stageHours[0] || { stage: "None", count: 0, hours: 0 }
  );

  capacityForecast.innerHTML = `
    <div class="forecast-card">
      <span>Active workload</span>
      <strong>${totalHours.toFixed(1)} hrs</strong>
      <div>${activeItems.length} active files</div>
    </div>
    <div class="forecast-card">
      <span>Reviewer capacity</span>
      <strong>${dailyCapacity} hrs/day</strong>
      <div>${reviewerCount || 0} reviewers</div>
    </div>
    <div class="forecast-card">
      <span>Clearance estimate</span>
      <strong>${daysToClear} days</strong>
      <div>At current pacing</div>
    </div>
    <div class="forecast-card">
      <span>Heaviest stage</span>
      <strong>${highestLoad.stage}</strong>
      <div>${highestLoad.hours.toFixed(1)} hrs queued</div>
    </div>
  `;

  const reviewerLoad = reviewers.reduce((acc, reviewer) => {
    acc[reviewer] = activeItems.filter((item) => item.reviewer === reviewer).length;
    return acc;
  }, {});
  const avgLoad = reviewerCount
    ? activeItems.length / reviewerCount
    : 0;
  const suggestions = [];

  Object.entries(reviewerLoad).forEach(([reviewer, count]) => {
    if (count > avgLoad + 1) {
      suggestions.push({
        title: "Rebalance reviewer load",
        body: `${reviewer} holds ${count} files. Move ${Math.ceil(count - avgLoad)} to another reviewer.`
      });
    }
  });

  if (highestLoad.stage === "Review" && highestLoad.count >= 2) {
    suggestions.push({
      title: "Reduce review backlog",
      body: `Shift ${highestLoad.count} review files to interview scheduling or add review coverage.`
    });
  }

  if (!suggestions.length) {
    suggestions.push({
      title: "Load looks balanced",
      body: "No immediate reassignments needed. Maintain current reviewer rotation."
    });
  }

  rebalanceList.innerHTML = suggestions
    .map(
      (item) => `
      <div class="rebalance-item">
        <strong>${item.title}</strong>
        <span>${item.body}</span>
      </div>
    `
    )
    .join("");
};

const renderReviewerRisk = (items) => {
  const activeItems = items.filter((item) => item.status !== "completed");
  const reviewers = unique(activeItems.map((item) => item.reviewer));
  const reviewerCount = reviewers.length;
  const avgLoad = reviewerCount ? activeItems.length / reviewerCount : 0;

  const riskRows = reviewers.map((reviewer) => {
    const owned = activeItems.filter((item) => item.reviewer === reviewer);
    const stalled = owned.filter((item) => item.status === "stalled").length;
    const warnings = owned.filter((item) => daysSince(item.lastUpdate) >= SLA_WARNING_DAYS).length;
    const breaches = owned.filter((item) => daysSince(item.lastUpdate) >= SLA_CRITICAL_DAYS).length;
    const avgAge = owned.length
      ? owned.reduce((sum, item) => sum + daysSince(item.lastUpdate), 0) / owned.length
      : 0;
    const riskScore = Math.round((avgAge * 0.6 + warnings * 2 + breaches * 3 + stalled * 1.5) * 10) / 10;
    const severity = breaches || avgAge >= SLA_CRITICAL_DAYS ? "critical" : warnings || avgAge >= SLA_WARNING_DAYS ? "warning" : "";

    return {
      reviewer,
      owned: owned.length,
      stalled,
      warnings,
      breaches,
      avgAge: avgAge.toFixed(1),
      riskScore,
      severity,
      loadDelta: owned.length - avgLoad
    };
  });

  const overCapacity = riskRows.filter((row) => row.owned > avgLoad + 1).length;
  const topRisk = riskRows.sort((a, b) => b.riskScore - a.riskScore)[0];
  const avgIdle = riskRows.length
    ? (
        riskRows.reduce((sum, row) => sum + Number(row.avgAge), 0) / riskRows.length
      ).toFixed(1)
    : "0.0";

  reviewerRiskMetrics.innerHTML = `
    <div class="risk-metric">
      <span>Reviewers online</span>
      <strong>${reviewerCount || 0}</strong>
      <div>${activeItems.length} active files</div>
    </div>
    <div class="risk-metric warning">
      <span>Over-capacity</span>
      <strong>${overCapacity}</strong>
      <div>Above avg load</div>
    </div>
    <div class="risk-metric">
      <span>Avg idle days</span>
      <strong>${avgIdle}</strong>
      <div>Across reviewers</div>
    </div>
    <div class="risk-metric ${topRisk && topRisk.severity ? topRisk.severity : ""}">
      <span>Top risk</span>
      <strong>${topRisk ? topRisk.reviewer : "None"}</strong>
      <div>${topRisk ? `${topRisk.riskScore} risk score` : "No active risk"}</div>
    </div>
  `;

  reviewerRiskList.innerHTML = riskRows.length
    ? riskRows
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 6)
        .map(
          (row) => `
        <div class="risk-card ${row.severity}">
          <div>
            <strong>${row.reviewer}</strong>
            <span>${row.owned} files • ${row.avgAge} days avg idle</span>
          </div>
          <div>
            <strong>${row.riskScore} risk score</strong>
            <span>${row.warnings} warnings • ${row.breaches} breaches</span>
          </div>
          <div class="risk-chip">
            <span>Load delta</span>
            <strong>${row.loadDelta >= 0 ? "+" : ""}${row.loadDelta.toFixed(1)}</strong>
          </div>
        </div>
      `
        )
        .join("")
    : "<p>No active reviewer risk signals.</p>";

  const playbook = [];
  riskRows
    .filter((row) => row.owned > avgLoad + 1)
    .forEach((row) => {
      playbook.push({
        title: "Shift workload",
        body: `${row.reviewer} is carrying ${row.owned} files (${row.loadDelta.toFixed(1)} above average). Reassign ${Math.ceil(row.loadDelta)} file(s).`
      });
    });

  riskRows
    .filter((row) => row.breaches > 0)
    .forEach((row) => {
      playbook.push({
        title: "Escalate SLA breaches",
        body: `${row.reviewer} has ${row.breaches} breached file(s). Prioritize immediate reviews or add backup coverage.`
      });
    });

  if (!playbook.length) {
    playbook.push({
      title: "Coverage steady",
      body: "Reviewer load and SLA risk look stable. Maintain current rotation and keep weekly check-ins."
    });
  }

  reviewerPlaybook.innerHTML = playbook
    .slice(0, 4)
    .map(
      (item) => `
      <div class="playbook-item">
        <strong>${item.title}</strong>
        <span>${item.body}</span>
      </div>
    `
    )
    .join("");
};

const renderAlerts = (items) => {
  const alerts = [];
  const stalled = items.filter((item) => item.status === "stalled");
  if (stalled.length) {
    alerts.push({
      title: "Stalled applications",
      body: `${stalled.length} applications have not moved in 14+ days.`
    });
  }

  const reviewBacklog = items.filter((item) => item.stage === "Review").length;
  if (reviewBacklog >= 3) {
    alerts.push({
      title: "Review backlog",
      body: `Review queue has ${reviewBacklog} active files. Consider rebalancing.`
    });
  }

  const overloaded = Object.values(
    items.reduce((acc, item) => {
      acc[item.reviewer] = (acc[item.reviewer] || 0) + 1;
      return acc;
    }, {})
  ).some((count) => count >= 3);

  if (overloaded) {
    alerts.push({
      title: "Reviewer capacity",
      body: "At least one reviewer holds 3+ files. Shift assignments or add coverage."
    });
  }

  alertList.innerHTML = alerts.length
    ? alerts
        .map(
          (alert) => `
      <div class="alert">
        <strong>${alert.title}</strong>
        <span>${alert.body}</span>
      </div>
    `
        )
        .join("")
    : "<p>No alerts. Funnel looks healthy.</p>";
};

const daysSince = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  const diff = today - date;
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
};

const addDays = (dateString, days) => {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date;
};

const formatDate = (date) => date.toISOString().slice(0, 10);

const renderSlaWatch = (items) => {
  const watchItems = items
    .map((item) => ({
      ...item,
      days: daysSince(item.lastUpdate)
    }))
    .filter((item) => item.days >= SLA_WARNING_DAYS)
    .sort((a, b) => b.days - a.days);

  if (!watchItems.length) {
    slaList.innerHTML = "<p>No SLA risks detected.</p>";
    return;
  }

  slaList.innerHTML = watchItems
    .map((item) => {
      const severity = item.days >= SLA_CRITICAL_DAYS ? "critical" : "warning";
      return `
        <div class="sla-card ${severity}">
          <div>
            <strong>${item.name}</strong>
            <span>${item.id} • ${item.stage}</span>
          </div>
          <div>
            <strong>${item.days} days</strong>
            <span>Owner: ${item.reviewer}</span>
          </div>
        </div>
      `;
    })
    .join("");
};

const renderSlaMetrics = (items) => {
  const activeItems = items.filter((item) => item.status !== "completed");
  const avgAge = activeItems.length
    ? (
        activeItems.reduce((sum, item) => sum + daysSince(item.lastUpdate), 0) / activeItems.length
      ).toFixed(1)
    : "0.0";

  const withinTarget = activeItems.filter((item) => daysSince(item.lastUpdate) < SLA_TARGET_DAYS)
    .length;
  const warnings = activeItems.filter(
    (item) =>
      daysSince(item.lastUpdate) >= SLA_WARNING_DAYS &&
      daysSince(item.lastUpdate) < SLA_CRITICAL_DAYS
  ).length;
  const breaches = activeItems.filter(
    (item) => daysSince(item.lastUpdate) >= SLA_CRITICAL_DAYS
  ).length;

  slaMetrics.innerHTML = `
    <div class="sla-metric">
      <span>Within target</span>
      <strong>${withinTarget}</strong>
      <div>${SLA_TARGET_DAYS}-day SLA</div>
    </div>
    <div class="sla-metric warning">
      <span>Warnings</span>
      <strong>${warnings}</strong>
      <div>${SLA_WARNING_DAYS}+ days</div>
    </div>
    <div class="sla-metric critical">
      <span>Breaches</span>
      <strong>${breaches}</strong>
      <div>${SLA_CRITICAL_DAYS}+ days</div>
    </div>
    <div class="sla-metric">
      <span>Avg age</span>
      <strong>${avgAge}</strong>
      <div>Days since update</div>
    </div>
  `;
};

const renderCadencePlan = (items) => {
  const activeItems = items.filter((item) => item.status !== "completed");
  if (!activeItems.length) {
    cadenceSummary.innerHTML = "<p>No active files to plan.</p>";
    cadenceList.innerHTML = "";
    return;
  }

  const enriched = activeItems.map((item) => {
    const target = slaTargets[item.stage] ?? SLA_TARGET_DAYS;
    const idleDays = daysSince(item.lastUpdate);
    const daysUntilDue = target - idleDays;
    const dueDate = formatDate(addDays(item.lastUpdate, target));
    const severity = daysUntilDue < 0 ? "critical" : daysUntilDue <= 3 ? "warning" : "";
    const status =
      daysUntilDue < 0
        ? `Overdue by ${Math.abs(daysUntilDue)} days`
        : `Due in ${daysUntilDue} days`;

    return { ...item, target, idleDays, daysUntilDue, dueDate, severity, status };
  });

  const overdue = enriched.filter((item) => item.daysUntilDue < 0).length;
  const dueSoon = enriched.filter((item) => item.daysUntilDue >= 0 && item.daysUntilDue <= 3).length;
  const dueThisWeek = enriched.filter((item) => item.daysUntilDue > 3 && item.daysUntilDue <= 7).length;
  const topRiskStage = Object.entries(
    enriched
      .filter((item) => item.daysUntilDue <= 3)
      .reduce((acc, item) => {
        acc[item.stage] = (acc[item.stage] || 0) + 1;
        return acc;
      }, {})
  ).sort((a, b) => b[1] - a[1])[0];

  cadenceSummary.innerHTML = `
    <div class="cadence-metric critical">
      <span>Overdue</span>
      <strong>${overdue}</strong>
      <div>Past SLA target</div>
    </div>
    <div class="cadence-metric warning">
      <span>Due in 72h</span>
      <strong>${dueSoon}</strong>
      <div>Needs attention</div>
    </div>
    <div class="cadence-metric">
      <span>Due this week</span>
      <strong>${dueThisWeek}</strong>
      <div>Within 7 days</div>
    </div>
    <div class="cadence-metric">
      <span>Top risk stage</span>
      <strong>${topRiskStage ? topRiskStage[0] : "None"}</strong>
      <div>${topRiskStage ? `${topRiskStage[1]} files` : "No near-term risk"}</div>
    </div>
  `;

  const ranked = enriched
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
    .slice(0, 6);

  cadenceList.innerHTML = ranked
    .map(
      (item) => `
      <div class="cadence-card ${item.severity}">
        <div>
          <strong>${item.name}</strong>
          <span>${item.id} • ${item.stage}</span>
        </div>
        <div>
          <strong>${item.status}</strong>
          <span>Owner: ${item.reviewer} • Due ${item.dueDate}</span>
        </div>
        <div class="cadence-chip">
          <span>Target</span>
          <strong>${item.target} days</strong>
        </div>
      </div>
    `
    )
    .join("");
};

const renderStageMomentum = (items) => {
  const rows = stages.map((stage) => {
    const stageItems = items.filter((item) => item.stage === stage);
    const avgAge = stageItems.length
      ? (stageItems.reduce((sum, item) => sum + daysSince(item.lastUpdate), 0) / stageItems.length).toFixed(1)
      : "0.0";
    const stalled = stageItems.filter((item) => item.status === "stalled").length;
    const active = stageItems.filter((item) => item.status === "active").length;
    const risk = avgAge >= 14 ? "critical" : avgAge >= 10 ? "warning" : "";

    return `
      <div class="table-row ${risk}">
        <div><strong>${stage}</strong><span>Stage</span></div>
        <div><strong>${stageItems.length}</strong><span>In stage</span></div>
        <div><strong>${avgAge} days</strong><span>Avg age</span></div>
        <div><strong>${stalled}/${active}</strong><span>Stalled/active</span></div>
      </div>
    `;
  });

  stageMomentum.innerHTML = rows.join("");
};

const renderStageTargets = (items) => {
  const rows = stages.map((stage) => {
    const stageItems = items.filter((item) => item.stage === stage);
    const avgAge = stageItems.length
      ? (stageItems.reduce((sum, item) => sum + daysSince(item.lastUpdate), 0) / stageItems.length).toFixed(1)
      : "0.0";
    const target = slaTargets[stage] ?? SLA_TARGET_DAYS;
    const gap = (avgAge - target).toFixed(1);
    const risk = avgAge >= SLA_CRITICAL_DAYS ? "critical" : avgAge >= SLA_WARNING_DAYS ? "warning" : "";

    return `
      <div class="table-row ${risk}">
        <div><strong>${stage}</strong><span>Stage target</span></div>
        <div><strong>${target} days</strong><span>SLA target</span></div>
        <div><strong>${avgAge} days</strong><span>Current avg</span></div>
        <div><strong>${gap} days</strong><span>Above target</span></div>
      </div>
    `;
  });

  stageTargets.innerHTML = rows.join("");
};

const renderDecisionQueue = (items) => {
  const queue = items
    .filter((item) => item.status !== "completed" && ["Interview", "Final"].includes(item.stage))
    .map((item) => ({
      ...item,
      days: daysSince(item.lastUpdate),
      action: item.stage === "Interview" ? "Schedule interview panel" : "Confirm award decision"
    }))
    .sort((a, b) => b.days - a.days)
    .slice(0, 6);

  if (!queue.length) {
    decisionQueue.innerHTML = "<p>No decision items queued.</p>";
    return;
  }

  decisionQueue.innerHTML = queue
    .map((item) => {
      const severity = item.days >= SLA_CRITICAL_DAYS ? "critical" : item.days >= SLA_WARNING_DAYS ? "warning" : "";
      return `
        <div class="decision-card ${severity}">
          <div>
            <strong>${item.name}</strong>
            <span>${item.id} • ${item.stage}</span>
          </div>
          <div>
            <strong>${item.days} days idle</strong>
            <span>${item.action} • ${item.reviewer}</span>
          </div>
        </div>
      `;
    })
    .join("");
};

const renderPriorityQueue = (items) => {
  const activeItems = items.filter((item) => item.status !== "completed");
  if (!activeItems.length) {
    prioritySummary.innerHTML = "<p>No active files in this cohort.</p>";
    priorityList.innerHTML = "";
    return;
  }

  const enriched = activeItems.map((item) => {
    const days = daysSince(item.lastUpdate);
    const stageWeight = stagePriorityWeight[item.stage] || 1;
    const statusWeight = item.status === "stalled" ? 1.4 : 1;
    const score = Math.round(days * stageWeight * statusWeight * 10) / 10;
    const severity = days >= SLA_CRITICAL_DAYS ? "critical" : days >= SLA_WARNING_DAYS ? "warning" : "";
    const action = stageActionMap[item.stage] || "Advance file";

    return { ...item, days, score, severity, action };
  });

  const topStageRisk = enriched
    .filter((item) => item.days >= SLA_WARNING_DAYS)
    .reduce((acc, item) => {
      acc[item.stage] = (acc[item.stage] || 0) + 1;
      return acc;
    }, {});

  const topStage = Object.entries(topStageRisk).sort((a, b) => b[1] - a[1])[0];
  const avgIdle = (
    enriched.reduce((sum, item) => sum + item.days, 0) / enriched.length
  ).toFixed(1);
  const atRisk = enriched.filter((item) => item.days >= SLA_WARNING_DAYS).length;

  prioritySummary.innerHTML = `
    <div class="priority-metric">
      <span>At-risk files</span>
      <strong>${atRisk}</strong>
      <div>${SLA_WARNING_DAYS}+ days idle</div>
    </div>
    <div class="priority-metric">
      <span>Avg idle time</span>
      <strong>${avgIdle} days</strong>
      <div>Across active files</div>
    </div>
    <div class="priority-metric">
      <span>Top risk stage</span>
      <strong>${topStage ? topStage[0] : "None"}</strong>
      <div>${topStage ? `${topStage[1]} files` : "No SLA risk"}</div>
    </div>
  `;

  const ranked = enriched
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  priorityList.innerHTML = ranked
    .map((item) => `
      <div class="priority-card ${item.severity}">
        <div>
          <strong>${item.name}</strong>
          <span>${item.id} • ${item.stage}</span>
        </div>
        <div>
          <strong>${item.days} days idle</strong>
          <span>${item.action} • ${item.reviewer}</span>
        </div>
        <div class="priority-score">
          <span>Priority</span>
          <strong>${item.score}</strong>
        </div>
      </div>
    `)
    .join("");
};

const renderOutreachCadence = (items) => {
  const activeItems = items.filter((item) => item.status !== "completed");
  const cadenceItems = activeItems
    .map((item) => {
      const cadence = outreachCadenceDays[item.stage] ?? 3;
      if (!cadence) return null;
      const dueDate = addDays(item.lastUpdate, cadence);
      const daysToDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      const severity = daysToDue < 0 ? "critical" : daysToDue <= 2 ? "warning" : "";
      const statusLabel =
        daysToDue < 0
          ? `${Math.abs(daysToDue)} days overdue`
          : daysToDue === 0
          ? "Due today"
          : `${daysToDue} days until due`;
      const action = outreachTouchpointMap[item.stage] || "Send update";

      return {
        ...item,
        cadence,
        dueDate,
        daysToDue,
        severity,
        statusLabel,
        action
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysToDue - b.daysToDue);

  const overdue = cadenceItems.filter((item) => item.daysToDue < 0).length;
  const dueSoon = cadenceItems.filter(
    (item) => item.daysToDue >= 0 && item.daysToDue <= 2
  ).length;
  const dueWeek = cadenceItems.filter(
    (item) => item.daysToDue >= 0 && item.daysToDue <= 7
  ).length;

  outreachMetrics.innerHTML = `
    <div class="cadence-metric critical">
      <span>Overdue touchpoints</span>
      <strong>${overdue}</strong>
      <div>Past due cadence</div>
    </div>
    <div class="cadence-metric warning">
      <span>Due soon</span>
      <strong>${dueSoon}</strong>
      <div>Next 48 hours</div>
    </div>
    <div class="cadence-metric">
      <span>Due this week</span>
      <strong>${dueWeek}</strong>
      <div>Next 7 days</div>
    </div>
  `;

  const listItems = cadenceItems
    .filter((item) => item.daysToDue <= 7)
    .slice(0, 6);

  outreachList.innerHTML = listItems.length
    ? listItems
        .map(
          (item) => `
        <div class="cadence-card ${item.severity}">
          <div>
            <strong>${item.name}</strong>
            <span>${item.id} • ${item.stage}</span>
          </div>
          <div>
            <strong>${item.statusLabel}</strong>
            <span>${item.action} • ${formatDate(item.dueDate)}</span>
          </div>
        </div>
      `
        )
        .join("")
    : "<p>No outreach touchpoints due in the next week.</p>";
};

const cohortTermOrder = {
  Winter: 1,
  Spring: 2,
  Summer: 3,
  Fall: 4
};

const parseCohortKey = (label) => {
  if (!label) {
    return { year: 0, term: 0, label: "" };
  }
  const match = label.match(/([A-Za-z]+)\s+(\d{4})/);
  if (!match) {
    return { year: 0, term: 0, label };
  }
  const term = cohortTermOrder[match[1]] || 0;
  const year = Number(match[2]) || 0;
  return { year, term, label };
};

const sortCohorts = (cohorts) =>
  cohorts.slice().sort((a, b) => {
    const aKey = parseCohortKey(a);
    const bKey = parseCohortKey(b);
    if (aKey.year !== bKey.year) {
      return aKey.year - bKey.year;
    }
    if (aKey.term !== bKey.term) {
      return aKey.term - bKey.term;
    }
    return a.localeCompare(b);
  });

const buildCohortMetrics = (items) => {
  const total = items.length;
  const stalled = items.filter((item) => item.status === "stalled").length;
  const awarded = items.filter((item) => item.stage === "Awarded").length;
  const conversion = total ? awarded / total : 0;
  const avgTurnaround = total
    ? items.reduce((sum, item) => sum + item.turnaroundDays, 0) / total
    : 0;
  const slaBreaches = items.filter(
    (item) => item.status !== "completed" && daysSince(item.lastUpdate) >= SLA_CRITICAL_DAYS
  ).length;
  const topStage = stages.reduce(
    (max, stage) => {
      const count = items.filter((item) => item.stage === stage).length;
      return count > max.count ? { stage, count } : max;
    },
    { stage: stages[0], count: 0 }
  );

  return {
    total,
    stalled,
    awarded,
    conversion,
    avgTurnaround,
    slaBreaches,
    topStage
  };
};

const buildDeltaMeta = (current, baseline, higherIsBetter = true) => {
  const delta = current - baseline;
  if (delta === 0) {
    return { label: "No change", className: "comparison-delta" };
  }
  const isPositive = delta > 0;
  const isGood = higherIsBetter ? isPositive : !isPositive;
  return {
    label: `${isPositive ? "+" : ""}${delta}`,
    className: `comparison-delta ${isGood ? "good" : "bad"}`
  };
};

const renderCohortComparison = () => {
  if (!cohortComparison) {
    return;
  }

  const cohorts = sortCohorts(unique(data.map((item) => item.cohort)));
  const currentCohort = cohortSelect.value;
  const currentIndex = cohorts.indexOf(currentCohort);
  const baselineCohort =
    currentIndex > 0
      ? cohorts[currentIndex - 1]
      : cohorts.find((cohort) => cohort !== currentCohort);

  if (!baselineCohort) {
    cohortComparison.innerHTML =
      "<p class=\"comparison-note\">Only one cohort available. Add a second cohort to unlock comparison trends.</p>";
    if (cohortComparisonNote) {
      cohortComparisonNote.textContent = "";
    }
    return;
  }

  const currentItems = data.filter((item) => item.cohort === currentCohort);
  const baselineItems = data.filter((item) => item.cohort === baselineCohort);
  const current = buildCohortMetrics(currentItems);
  const baseline = buildCohortMetrics(baselineItems);

  const cards = [
    {
      label: "Total applications",
      value: current.total,
      delta: buildDeltaMeta(current.total, baseline.total, true)
    },
    {
      label: "Conversion rate",
      value: `${(current.conversion * 100).toFixed(1)}%`,
      delta: buildDeltaMeta(
        Number((current.conversion * 100).toFixed(1)),
        Number((baseline.conversion * 100).toFixed(1)),
        true
      )
    },
    {
      label: "Awarded files",
      value: current.awarded,
      delta: buildDeltaMeta(current.awarded, baseline.awarded, true)
    },
    {
      label: "Avg turnaround",
      value: `${current.avgTurnaround.toFixed(1)} days`,
      delta: buildDeltaMeta(
        Number(current.avgTurnaround.toFixed(1)),
        Number(baseline.avgTurnaround.toFixed(1)),
        false
      )
    },
    {
      label: "Stalled files",
      value: current.stalled,
      delta: buildDeltaMeta(current.stalled, baseline.stalled, false)
    },
    {
      label: "SLA breaches",
      value: current.slaBreaches,
      delta: buildDeltaMeta(current.slaBreaches, baseline.slaBreaches, false)
    }
  ];

  cohortComparison.innerHTML = cards
    .map(
      (card) => `
      <div class="comparison-card">
        <span>${card.label}</span>
        <strong>${card.value}</strong>
        <div class="${card.delta.className}">${card.delta.label}</div>
      </div>
    `
    )
    .join("");

  if (cohortComparisonNote) {
    cohortComparisonNote.textContent = `Baseline: ${baselineCohort} • Top stage now: ${current.topStage.stage} (${current.topStage.count})`;
  }
};

const renderSnapshot = (items) => {
  const stageHighlights = stages.map((stage) => {
    const count = items.filter((item) => item.stage === stage).length;
    return { stage, count };
  });

  const maxStage = stageHighlights.reduce((max, stage) =>
    stage.count > max.count ? stage : max
  );

  const avgTurnaround = items.length
    ? (items.reduce((sum, item) => sum + item.turnaroundDays, 0) / items.length).toFixed(1)
    : "0.0";

  cohortSnapshot.innerHTML = `
    <div class="snapshot-card">
      <span>Highest volume stage</span>
      <strong>${maxStage.stage}</strong>
      <div>${maxStage.count} applications</div>
    </div>
    <div class="snapshot-card">
      <span>Stalled signals</span>
      <strong>${items.filter((item) => item.status === "stalled").length}</strong>
      <div>Requires follow-up</div>
    </div>
    <div class="snapshot-card">
      <span>Avg turnaround</span>
      <strong>${avgTurnaround} days</strong>
      <div>Across active files</div>
    </div>
  `;
};

const renderRoster = (items) => {
  rosterTable.innerHTML = items
    .map(
      (item) => `
      <div class="table-row">
        <div><strong>${item.name}</strong><span>${item.id}</span></div>
        <div><strong>${item.stage}</strong><span>${item.status}</span></div>
        <div><strong>${item.reviewer}</strong><span>Owner</span></div>
        <div><strong>${item.lastUpdate}</strong><span>Last update</span></div>
      </div>
    `
    )
    .join("");
};

const renderBrief = (items) => {
  const total = items.length;
  const awarded = items.filter((item) => item.stage === "Awarded").length;
  const stalled = items.filter((item) => item.status === "stalled").length;
  const backlog = items.filter((item) => item.stage === "Review").length;
  const slaWarnings = items.filter(
    (item) =>
      item.status !== "completed" &&
      daysSince(item.lastUpdate) >= SLA_WARNING_DAYS &&
      daysSince(item.lastUpdate) < SLA_CRITICAL_DAYS
  ).length;
  const slaBreaches = items.filter(
    (item) => item.status !== "completed" && daysSince(item.lastUpdate) >= SLA_CRITICAL_DAYS
  ).length;

  briefOutput.textContent = `WEEKLY APPLICATION FUNNEL BRIEF\n\nCohort: ${cohortSelect.value}\nApplications in funnel: ${total}\nAwarded to date: ${awarded}\nStalled applications: ${stalled}\nReview backlog: ${backlog}\n\nKey moves\n- Shift ${backlog > 0 ? backlog : 1} files out of review if SLA risk continues.\n- Follow up with ${stalled} stalled scholars to unblock documentation.\n- Confirm interview capacity for next 7 days based on current pacing.\n\nReviewer load\n${buildReviewerLines(items)}\n\nSignals\n- Highest volume stage: ${stages.reduce((max, stage) => (items.filter((item) => item.stage === stage).length > max.count ? { stage, count: items.filter((item) => item.stage === stage).length } : max), { stage: stages[0], count: 0 }).stage}\n- Overall conversion: ${overallConversion.textContent}\n`;
  briefOutput.textContent += `- SLA warnings: ${slaWarnings}\n- SLA breaches: ${slaBreaches}\n`;

  briefPanel.hidden = false;
  briefPanel.scrollIntoView({ behavior: "smooth" });

  saveBrief(items, briefOutput.textContent);
};

const buildReviewerLines = (items) => {
  const reviewerMap = {};
  items.forEach((item) => {
    reviewerMap[item.reviewer] = (reviewerMap[item.reviewer] || 0) + 1;
  });

  return Object.entries(reviewerMap)
    .map(([name, count]) => `- ${name}: ${count} active files`)
    .join("\n");
};

const setLiveRefreshState = (isRefreshing) => {
  if (!refreshLiveData) {
    return;
  }
  refreshLiveData.disabled = isRefreshing;
  refreshLiveData.textContent = isRefreshing ? "Refreshing..." : "Refresh snapshot";
};

const formatTimestamp = (value) => {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const setBriefStatus = (message, tone) => {
  if (!briefStatus) {
    return;
  }

  briefStatus.textContent = message;
  briefStatus.dataset.tone = tone;
};

const setBriefArchiveNote = (message) => {
  if (!briefArchiveNote) {
    return;
  }
  briefArchiveNote.textContent = message || "";
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildBriefMetrics = (metrics = {}) => {
  const entries = [
    { label: "Total", value: metrics.total },
    { label: "Active", value: metrics.active },
    { label: "Stalled", value: metrics.stalled },
    { label: "Review backlog", value: metrics.backlog ?? metrics.inReview },
    { label: "Interview", value: metrics.inInterview },
    { label: "Final", value: metrics.inFinal },
    { label: "Awarded", value: metrics.awarded },
    { label: "SLA warnings", value: metrics.slaWarnings },
    { label: "SLA breaches", value: metrics.slaBreaches }
  ];

  return entries.filter((entry) => entry.value !== undefined && entry.value !== null);
};

const renderBriefArchive = (briefs) => {
  if (!briefArchive) {
    return;
  }

  const list = Array.isArray(briefs) ? briefs : [];
  briefArchiveMap.clear();
  setBriefArchiveNote(list.length ? "Showing the latest saved briefs." : "No saved briefs yet.");

  if (list.length === 0) {
    briefArchive.innerHTML =
      "<p class=\"brief-empty\">No brief history yet. Generate a brief to seed the archive.</p>";
    return;
  }

  briefArchive.innerHTML = list
    .map((brief, index) => {
      const id = String(brief.id ?? `brief-${index}`);
      briefArchiveMap.set(id, brief);
      const createdLabel = formatDateTime(brief.created_at || brief.generated_at);
      const metrics = brief.metrics || {};
      const summaryText = brief.summary || "No summary available.";
      const summaryPreview = summaryText.split("\n").slice(0, 3).join(" ");
      const metricEntries = buildBriefMetrics(metrics);
      const metricsMarkup = metricEntries.length
        ? metricEntries
            .map(
              (entry) => `
              <div class="brief-metric">
                <span>${escapeHtml(entry.label)}</span>
                <strong>${escapeHtml(entry.value)}</strong>
              </div>
            `
            )
            .join("")
        : "<div class=\"brief-empty\">No metrics recorded for this brief.</div>";
      return `
        <div class="brief-card">
          <div class="brief-meta">
            <span>${escapeHtml(brief.cohort || "Unknown cohort")}</span>
            <span>${createdLabel}</span>
          </div>
          <strong>Weekly Brief Draft</strong>
          <p>${escapeHtml(summaryPreview)}</p>
          <div class="brief-metrics">${metricsMarkup}</div>
          <button class="brief-action" data-brief-id="${id}">Open brief</button>
          <button class="brief-action" data-brief-copy="${id}">Copy summary</button>
        </div>
      `;
    })
    .join("");
};

const loadBriefArchive = async () => {
  if (!briefArchive) {
    return;
  }

  setBriefArchiveNote("Loading brief history...");
  try {
    const response = await fetch("/api/briefs", { method: "GET" });
    if (!response.ok) {
      throw new Error("Brief archive fetch failed");
    }

    const result = await response.json();
    renderBriefArchive(result?.briefs || []);
  } catch (error) {
    renderBriefArchive(sampleBriefArchive);
    setBriefArchiveNote("Pipeline offline. Showing local brief samples.");
  }
};

const saveBrief = async (items, summary) => {
  setBriefStatus("Saving brief...", "pending");

  const payload = {
    cohort: cohortSelect.value,
    summary,
    generatedAt: new Date().toISOString(),
    metrics: {
      total: items.length,
      awarded: items.filter((item) => item.stage === "Awarded").length,
      stalled: items.filter((item) => item.status === "stalled").length,
      backlog: items.filter((item) => item.stage === "Review").length,
      slaWarnings: items.filter(
        (item) =>
          item.status !== "completed" &&
          daysSince(item.lastUpdate) >= SLA_WARNING_DAYS &&
          daysSince(item.lastUpdate) < SLA_CRITICAL_DAYS
      ).length,
      slaBreaches: items.filter(
        (item) => item.status !== "completed" && daysSince(item.lastUpdate) >= SLA_CRITICAL_DAYS
      ).length
    }
  };

  try {
    const response = await fetch("/api/briefs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Brief save failed");
    }

    const result = await response.json();
    const savedAt = formatTimestamp(result?.brief?.created_at || result?.brief?.generated_at);
    setBriefStatus(savedAt ? `Saved to pipeline on ${savedAt}` : "Saved to pipeline", "success");
    loadBriefArchive();
  } catch (error) {
    setBriefStatus("Brief saved locally only (pipeline unavailable)", "warning");
  }
};

const loadLatestBrief = async () => {
  if (!briefStatus) {
    return;
  }

  try {
    const response = await fetch("/api/briefs", { method: "GET" });
    if (!response.ok) {
      throw new Error("Brief fetch failed");
    }

    const result = await response.json();
    const latest = result?.briefs?.[0];
    if (latest) {
      const savedAt = formatTimestamp(latest.created_at || latest.generated_at);
      setBriefStatus(savedAt ? `Last brief saved on ${savedAt}` : "Last brief saved to pipeline", "info");
      return;
    }

    setBriefStatus("No brief saved yet", "info");
  } catch (error) {
    setBriefStatus("Pipeline offline (local-only mode)", "warning");
  }
};

const formatDateTime = (value) => {
  if (!value) {
    return "Not available";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

const formatDelta = (value, suffix = "") => {
  if (value === 0) {
    return { label: `0${suffix}`, className: "trend-delta flat" };
  }
  if (value > 0) {
    return { label: `+${value}${suffix}`, className: "trend-delta" };
  }
  return { label: `${value}${suffix}`, className: "trend-delta down" };
};

const setCaptureState = (isLoading) => {
  if (!captureSnapshot) {
    return;
  }
  captureSnapshot.disabled = isLoading;
  captureSnapshot.textContent = isLoading ? "Capturing..." : "Capture snapshot";
};

const buildSnapshotPayload = (items) => {
  const total = items.length;
  const active = items.filter((item) => item.status === "active").length;
  const stalled = items.filter((item) => item.status === "stalled").length;
  const completed = items.filter((item) => item.status === "completed").length;
  const conversionRate = total ? Number((completed / total).toFixed(4)) : 0;

  return {
    totalApplications: total,
    activeApplications: active,
    stalledApplications: stalled,
    conversionRate,
    notes: `Captured from ${cohortSelect.value} dashboard.`
  };
};

const renderSnapshotTrend = (payload) => {
  if (!snapshotTrend) {
    return;
  }

  const history = payload?.history ?? [];
  if (snapshotTrendNote) {
    snapshotTrendNote.textContent = payload?.note || "";
  }

  if (!Array.isArray(history) || history.length === 0) {
    snapshotTrend.innerHTML =
      "<p class=\"trend-empty\">No snapshot history yet. Seed the funnel snapshots to activate trends.</p>";
    return;
  }

  snapshotTrend.innerHTML = history
    .map((entry, index) => {
      const prev = index > 0 ? history[index - 1] : null;
      const deltaTotal = prev ? entry.totalApplications - prev.totalApplications : 0;
      const deltaConversion = prev
        ? Number((entry.conversionRate - prev.conversionRate).toFixed(3))
        : 0;
      const totalDelta = formatDelta(deltaTotal);
      const conversionDelta = formatDelta(Number((deltaConversion * 100).toFixed(1)), "%");
      const conversionPercent = Number((entry.conversionRate * 100).toFixed(1));
      const pill = index === history.length - 1 ? "Latest" : `Pulse ${index + 1}`;

      return `
        <div class="trend-card">
          <div class="trend-meta">
            <span class="trend-pill">${pill}</span>
            <strong>${formatDateTime(entry.capturedAt)}</strong>
            <span>${entry.notes || "Snapshot capture"}</span>
          </div>
          <div class="trend-stat">
            <span>Total applications</span>
            <strong>${entry.totalApplications}</strong>
            <span class="${totalDelta.className}">${totalDelta.label}</span>
          </div>
          <div class="trend-stat">
            <span>Active applications</span>
            <strong>${entry.activeApplications}</strong>
            <span>Stalled: ${entry.stalledApplications}</span>
          </div>
          <div class="trend-stat">
            <span>Conversion rate</span>
            <strong>${conversionPercent}%</strong>
            <span class="${conversionDelta.className}">${conversionDelta.label}</span>
          </div>
        </div>
      `;
    })
    .join("");
};

const captureSnapshotToPipeline = async () => {
  if (!captureSnapshot) {
    return;
  }

  setCaptureState(true);
  if (snapshotTrendNote) {
    snapshotTrendNote.textContent = "Capturing snapshot to pipeline...";
  }

  try {
    const payload = buildSnapshotPayload(filterData());
    const response = await fetch("/api/funnel-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Snapshot capture failed");
    }

    await loadSnapshotHistory();
  } catch (error) {
    if (snapshotTrendNote) {
      snapshotTrendNote.textContent =
        "Snapshot capture failed. Keep monitoring locally and retry when the pipeline is online.";
    }
  } finally {
    setCaptureState(false);
  }
};

const loadSnapshotHistory = async () => {
  if (!snapshotTrend) {
    return;
  }

  try {
    const response = await fetch("/api/funnel-history");
    if (!response.ok) {
      throw new Error("History fetch failed");
    }
    const payload = await response.json();
    renderSnapshotTrend(payload);
  } catch (error) {
    renderSnapshotTrend({
      source: "fallback",
      history: sampleSnapshotHistory,
      note: "Using local snapshot history while pipeline is offline."
    });
  }
};

const renderLiveSnapshot = (payload) => {
  if (!liveSnapshot || !payload) {
    return;
  }

  const meta = payload.meta || {};
  const source = payload.source || "sample";
  const sourceLabel =
    source === "database"
      ? "Database"
      : source === "database-empty"
      ? "Database (Empty)"
      : source === "fallback"
      ? "Fallback"
      : "Sample";
  const pillClass = source === "database" ? "sync-pill" : "sync-pill warn";
  const cohorts = meta.cohorts && meta.cohorts.length ? meta.cohorts.join(", ") : "None";

  liveSnapshot.innerHTML = `
    <div class="sync-card">
      <span class="label">Source</span>
      <strong>${sourceLabel}</strong>
      <span class="${pillClass}">${source}</span>
    </div>
    <div class="sync-card">
      <span class="label">Records</span>
      <strong>${meta.dataRowCount ?? 0}</strong>
      <span>${meta.dbRowCount ? `${meta.dbRowCount} in DB` : "No DB rows"}</span>
    </div>
    <div class="sync-card">
      <span class="label">Cohorts</span>
      <strong>${meta.cohortCount ?? 0}</strong>
      <span>${cohorts}</span>
    </div>
    <div class="sync-card">
      <span class="label">Last refresh</span>
      <strong>${formatDateTime(meta.refreshedAt)}</strong>
      <span>Data updated ${formatDateTime(meta.lastDataUpdate)}</span>
    </div>
  `;

  if (liveSnapshotNotes) {
    liveSnapshotNotes.textContent = payload.note || "";
  }
};

const refreshLiveSnapshot = async () => {
  setLiveRefreshState(true);
  try {
    await Promise.all([loadRemoteData(), loadSnapshotHistory()]);
  } finally {
    setLiveRefreshState(false);
  }
};

const exportData = (items) => {
  const payload = {
    generatedAt: new Date().toISOString(),
    cohort: cohortSelect.value,
    applications: items
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `groupscholar-funnel-${cohortSelect.value.replace(/\s+/g, "-").toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const loadRemoteData = async () => {
  try {
    const response = await fetch("/api/applications");
    if (!response.ok) throw new Error("Fetch failed");
    const payload = await response.json();
    if (payload && Array.isArray(payload.data)) {
      data = payload.data;
      const current = cohortSelect.value;
      buildSelectOptions();
      if (current && data.some((item) => item.cohort === current)) {
        cohortSelect.value = current;
      } else if (data.length) {
        cohortSelect.value = data[0].cohort;
      }
      render();
    }
    renderLiveSnapshot(payload);
  } catch (error) {
    renderLiveSnapshot({
      source: "offline",
      note: "Live sync unavailable. Using cached sample data.",
      meta: {
        refreshedAt: new Date().toISOString(),
        dataRowCount: data.length,
        cohortCount: unique(data.map((item) => item.cohort)).length,
        cohorts: unique(data.map((item) => item.cohort)),
        dbRowCount: 0,
        lastDataUpdate: null
      }
    });
  }
};

const render = () => {
  const items = filterData();
  activeCohort.textContent = cohortSelect.value;
  renderFunnel(items);
  renderReviewers(items);
  renderCapacity(items);
  renderAlerts(items);
  renderSlaMetrics(items);
  renderSlaWatch(items);
  renderOutreachCadence(items);
  renderPriorityQueue(items);
  renderStageMomentum(items);
  renderStageTargets(items);
  renderDecisionQueue(items);
  renderReviewerRisk(items);
  renderCohortComparison();
  renderSnapshot(items);
  renderRoster(items);
};

buildSelectOptions();
if (data.some((item) => item.cohort === "Spring 2026")) {
  cohortSelect.value = "Spring 2026";
} else if (data.length) {
  cohortSelect.value = data[0].cohort;
}
render();
loadLatestBrief();
loadBriefArchive();
refreshLiveSnapshot();

[cohortSelect, reviewerFilter, statusFilter, searchInput].forEach((control) => {
  control.addEventListener("input", render);
});

exportJson.addEventListener("click", () => exportData(filterData()));

generateBrief.addEventListener("click", () => renderBrief(filterData()));

if (refreshLiveData) {
  refreshLiveData.addEventListener("click", refreshLiveSnapshot);
}

if (captureSnapshot) {
  captureSnapshot.addEventListener("click", captureSnapshotToPipeline);
}

if (refreshBriefArchive) {
  refreshBriefArchive.addEventListener("click", loadBriefArchive);
}

if (briefArchive) {
  briefArchive.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    const openTarget = event.target.closest("[data-brief-id]");
    const copyTarget = event.target.closest("[data-brief-copy]");

    if (copyTarget) {
      const brief = briefArchiveMap.get(copyTarget.dataset.briefCopy);
      if (!brief || !brief.summary) {
        return;
      }
      navigator.clipboard?.writeText(brief.summary).then(
        () => {
          copyTarget.textContent = "Copied";
          setTimeout(() => {
            copyTarget.textContent = "Copy summary";
          }, 1500);
        },
        () => {
          copyTarget.textContent = "Copy failed";
          setTimeout(() => {
            copyTarget.textContent = "Copy summary";
          }, 1500);
        }
      );
      return;
    }

    if (!openTarget) {
      return;
    }

    const brief = briefArchiveMap.get(openTarget.dataset.briefId);
    if (!brief) {
      return;
    }
    if (brief.cohort && cohortSelect) {
      const hasOption = Array.from(cohortSelect.options).some(
        (option) => option.value === brief.cohort
      );
      if (hasOption) {
        cohortSelect.value = brief.cohort;
        render();
      }
    }
    if (briefOutput) {
      briefOutput.textContent = brief.summary || "No summary available.";
    }
    if (briefPanel) {
      briefPanel.hidden = false;
      briefPanel.scrollIntoView({ behavior: "smooth" });
    }
    const savedAt = formatTimestamp(brief.created_at || brief.generated_at);
    setBriefStatus(
      savedAt ? `Loaded archived brief from ${savedAt}` : "Loaded archived brief",
      "info"
    );
  });
}

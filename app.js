const stages = [
  "Submitted",
  "Eligibility",
  "Review",
  "Interview",
  "Final",
  "Awarded"
];

const data = [
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

const cohortSelect = document.getElementById("cohortSelect");
const reviewerFilter = document.getElementById("reviewerFilter");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const exportJson = document.getElementById("exportJson");
const generateBrief = document.getElementById("generateBrief");

const funnelStages = document.getElementById("funnelStages");
const reviewerTable = document.getElementById("reviewerTable");
const alertList = document.getElementById("alertList");
const rosterTable = document.getElementById("rosterTable");
const cohortSnapshot = document.getElementById("cohortSnapshot");
const briefPanel = document.getElementById("briefPanel");
const briefOutput = document.getElementById("briefOutput");
const activeCohort = document.getElementById("activeCohort");
const totalApplications = document.getElementById("totalApplications");
const overallConversion = document.getElementById("overallConversion");

const unique = (items) => Array.from(new Set(items)).sort();

const buildSelectOptions = () => {
  const cohorts = unique(data.map((item) => item.cohort));
  const reviewers = unique(data.map((item) => item.reviewer));

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

  briefOutput.textContent = `WEEKLY APPLICATION FUNNEL BRIEF\n\nCohort: ${cohortSelect.value}\nApplications in funnel: ${total}\nAwarded to date: ${awarded}\nStalled applications: ${stalled}\nReview backlog: ${backlog}\n\nKey moves\n- Shift ${backlog > 0 ? backlog : 1} files out of review if SLA risk continues.\n- Follow up with ${stalled} stalled scholars to unblock documentation.\n- Confirm interview capacity for next 7 days based on current pacing.\n\nReviewer load\n${buildReviewerLines(items)}\n\nSignals\n- Highest volume stage: ${stages.reduce((max, stage) => (items.filter((item) => item.stage === stage).length > max.count ? { stage, count: items.filter((item) => item.stage === stage).length } : max), { stage: stages[0], count: 0 }).stage}\n- Overall conversion: ${overallConversion.textContent}\n`;

  briefPanel.hidden = false;
  briefPanel.scrollIntoView({ behavior: "smooth" });
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

const render = () => {
  const items = filterData();
  activeCohort.textContent = cohortSelect.value;
  renderFunnel(items);
  renderReviewers(items);
  renderAlerts(items);
  renderSnapshot(items);
  renderRoster(items);
};

buildSelectOptions();
cohortSelect.value = "Spring 2026";
render();

[cohortSelect, reviewerFilter, statusFilter, searchInput].forEach((control) => {
  control.addEventListener("input", render);
});

exportJson.addEventListener("click", () => exportData(filterData()));

generateBrief.addEventListener("click", () => renderBrief(filterData()));

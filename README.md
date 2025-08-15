# Group Scholar Application Funnel

A local-first operational dashboard to track application flow, reviewer capacity, and conversion health across cohorts.

## Features
- Cohort, status, reviewer, and search filters
- Stage-by-stage funnel conversion with drop-off visibility
- Reviewer capacity and turnaround time tracking
- Operational alerting for stalled files and review backlog
- SLA watchlist for overdue application follow-ups
- Live snapshot panel backed by a Postgres data store (with safe fallback data)
- Weekly brief generator that persists drafts to the pipeline plus JSON export

## Tech
- HTML, CSS, vanilla JavaScript, Node serverless endpoints, and Postgres

## Run
- Open `index.html` in a browser for the local-only dashboard.
- Deploy to Vercel to enable the live data and brief pipeline endpoints.

## Data
- Set `GROUPSCHOLAR_DB_URL` in Vercel to enable `/api/applications` and `/api/briefs`.
- The live data panel shows sample data if the database is empty or unavailable.

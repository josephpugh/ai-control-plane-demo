# AI Control Plane

A governance framework UX for managing the full lifecycle of internally-developed generative AI capabilities. This is a demo/prototype application that visualizes how an enterprise AI Control Plane would operate — from initial intake and classification through testing, release gating, runtime monitoring, and value tracking.

Built as a companion to the *Operationalizing the AI Control Plane* design document.

![Dashboard](https://img.shields.io/badge/screens-9-blue) ![React](https://img.shields.io/badge/React-19-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4)

## Screens

### Dashboard
Portfolio overview of all AI initiatives with risk distribution, active signals, gate pass rates, and data source connectivity status (ServiceNow, Dynatrace, Azure AD, Mulesoft, LLM Gateway, CI/CD, Evidence Store, Jira).

### Initiative Builder
Full initiative detail view with lifecycle stepper (Intake through Monitoring), value hypothesis tracking with progress bars, connected MCP servers/models/agent identity, latest release status, and approval pathway. Tabs for Overview, Classification (all 13 IA-IM dimensions), Controls & Gates, and Signal history.

### Testing & TEVV
Test, Evaluate, Verify & Validate hub. Manages golden datasets, test suites (safety, security, quality, regression, bias), evidence pack integrity verification, and classification-derived test requirements. Visual heatmap bars per suite and category-level bar charts.

### Integration Topology
Interactive graph visualization showing how an initiative connects to MCP servers, tools, LLM models, agent identities, and Azure AD security groups. Animated connection edges, color-coded node types, and click-to-inspect detail panels with tool inventories and risk metadata.

### Runtime Observatory
Live monitoring across environments (production/staging/development). Request volume and latency charts with SLA reference lines, 8 runtime evaluation cards with threshold comparisons (groundedness, safety, bias, etc.), and a **declared-vs-observed reconciliation** view that detects undeclared MCP server connections via AD group change signals.

### Release Gates
Gate enforcement status per tagged release. Shows the gate enforcement policy matrix across all four approval pathways (Standard through Exception-Only), expandable releases with per-gate pass/fail results, evidence pack binding with artifact hash verification, and tamper-evident integrity status.

### Impact Analyzer
What-if scenario builder. Select an initiative, choose a change type (add MCP server, change model, expand audience), and run a predictive analysis. Shows classification dimension changes, tier escalation (e.g., Medium to Critical), new controls/gates/evidence obligations, and AI-generated recommendations for bounded alternatives.

### MCP Server & Tool Registry
Authoritative inventory of all registered MCP servers and tools with governed risk metadata. Search and filter by source (Internal, Mulesoft, Azure, 3rd Party). Expandable detail view showing tools with invocation stats, AD group access controls, classification impact, and connected initiatives.

### Value Tracking
Hypothesis-to-reality measurement. Track initial value hypotheses against real-world metrics with progress bars, radar charts, and confidence scores. Portfolio-level achievement view, user adoption trends, and usage snapshots (DAU, session duration, cost per interaction).

### AI Assistant
Contextual chat panel available on every screen. Understands initiative state, classification rules, and can answer questions like "What happens if I add Market-Data-MCP?" with full impact analysis responses.

## Data Sources (Mocked)

The application simulates integration with enterprise data services:

| Source | What It Provides |
|--------|-----------------|
| **ServiceNow** | Capability records, incident tracking |
| **Dynatrace** | Runtime metrics, distributed traces, anomaly detection |
| **Azure AD / Entra** | Group memberships, identity graph, role assignments |
| **Mulesoft Gateway** | MCP server and agent discovery, API gateway telemetry |
| **LLM Gateway** | Model usage, token metrics, routing configuration |
| **CI/CD Pipeline** | Release events, artifact hashes, build status |
| **Evidence Store** | Signed test evidence packs, integrity verification |
| **Jira** | Work tracking, initiative metadata |

## Tech Stack

- **React 19** + **TypeScript 5.8**
- **Vite** for build tooling
- **Tailwind CSS 4** for styling (dark theme with glassmorphism)
- **Recharts** for data visualization (area, bar, line, radar, pie charts)
- **React Router 7** for navigation
- **Lucide React** for icons
- **Radix UI** primitives
- **Framer Motion** for animations

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173` by default.

## Project Structure

```
src/
  components/
    chat/          # AI assistant chat panel
    common/        # Reusable UI components (GlassCard, MetricCard, StatusBadge, ProgressBar)
  data/
    mockData.ts    # All mock data (initiatives, MCP servers, releases, signals, etc.)
  layouts/
    AppLayout.tsx  # Main layout with sidebar navigation and notification panel
  pages/
    Dashboard.tsx       # Portfolio overview
    InitiativeDetail.tsx # Initiative builder with classification
    Testing.tsx         # TEVV and test management
    Topology.tsx        # Integration graph visualization
    Runtime.tsx         # Runtime observatory and eval monitoring
    Gates.tsx           # Release gate enforcement
    Impact.tsx          # What-if impact analyzer
    Registry.tsx        # MCP server and tool registry
    Value.tsx           # Value hypothesis tracking
  types/
    index.ts       # TypeScript type definitions
```

## Key Concepts from the Governance Framework

- **Classification Dimensions (IA-IM):** 13 dimensions that determine an initiative's risk tier and required controls
- **Approval Pathways:** Standard, Proportionate Controls, Enhanced Controls, Exception-Only
- **Capability Record:** Living object per AI capability tracking classification, obligations, evidence, and runtime reality
- **Continuous Evaluation Loop:** Sense, Classify, Derive, Compare, Decide, Enforce & Verify
- **Declared vs. Observed:** Reconciliation between what teams declared at intake and what telemetry actually shows
- **Evidence Packs:** Signed, tamper-evident test evidence bound to specific tagged releases

## License

MIT

import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import {
  Nav,
  Section,
  Container,
  Stack,
  Grid,
  Card,
  DataReadout,
  Table,
  Badge,
  Tag,
  Progress,
  Avatar,
  Divider,
  Alert,
  Tabs,
  Switch,
  Tooltip,
  Button,
} from "@dillingerstaffing/strand-ui";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const agents = [
  {
    id: "AGT-001",
    name: "Archivist",
    type: "Retrieval",
    status: "active",
    tasks: 1284,
    success: 99.2,
    latency: "42ms",
    initials: "AR",
  },
  {
    id: "AGT-002",
    name: "Classifier",
    type: "Analysis",
    status: "active",
    tasks: 876,
    success: 97.8,
    latency: "118ms",
    initials: "CL",
  },
  {
    id: "AGT-003",
    name: "Dispatcher",
    type: "Orchestration",
    status: "active",
    tasks: 2041,
    success: 99.9,
    latency: "8ms",
    initials: "DI",
  },
  {
    id: "AGT-004",
    name: "Sentinel",
    type: "Monitoring",
    status: "idle",
    tasks: 540,
    success: 100,
    latency: "—",
    initials: "SE",
  },
  {
    id: "AGT-005",
    name: "Synthesizer",
    type: "Generation",
    status: "active",
    tasks: 312,
    success: 94.6,
    latency: "890ms",
    initials: "SY",
  },
  {
    id: "AGT-006",
    name: "Validator",
    type: "QA",
    status: "error",
    tasks: 1102,
    success: 88.1,
    latency: "203ms",
    initials: "VA",
  },
];

const activityLog = [
  { time: "14:32:08", agent: "Dispatcher", action: "Routed 12 tasks to Archivist queue", status: "complete" as const },
  { time: "14:31:55", agent: "Classifier", action: "Classified batch #4891 — 34 documents", status: "complete" as const },
  { time: "14:31:42", agent: "Synthesizer", action: "Generated summary for report R-2291", status: "process" as const },
  { time: "14:31:30", agent: "Validator", action: "Validation failure on output V-0884", status: "error" as const },
  { time: "14:31:18", agent: "Sentinel", action: "Health check passed — all endpoints nominal", status: "complete" as const },
  { time: "14:30:59", agent: "Archivist", action: "Indexed 208 records into vector store", status: "complete" as const },
  { time: "14:30:41", agent: "Dispatcher", action: "Rebalanced load across 3 active agents", status: "process" as const },
  { time: "14:30:22", agent: "Classifier", action: "Confidence threshold warning on doc D-7712", status: "warning" as const },
];

const tableColumns = [
  { key: "id", header: "ID", sortable: true },
  { key: "name", header: "Agent", sortable: true },
  { key: "type", header: "Type", sortable: true },
  { key: "status", header: "Status" },
  { key: "tasks", header: "Tasks", sortable: true },
  { key: "success", header: "Success %", sortable: true },
  { key: "latency", header: "Latency", sortable: true },
];

// Gap #5 fix: pass JSX StatusChip nodes into table data for visual status
const tableData = agents.map((a) => ({
  id: a.id,
  name: a.name,
  type: a.type,
  status: <StatusChip status={a.status} />,
  tasks: a.tasks.toLocaleString(),
  success: `${a.success}%`,
  latency: a.latency,
}));

// ---------------------------------------------------------------------------
// Sub-components (no custom CSS, only Strand primitives)
// ---------------------------------------------------------------------------

function StatusChip({ status }: { status: string }) {
  const variant =
    status === "active"
      ? "live"
      : status === "idle"
        ? "neutral"
        : status === "error"
          ? "caution"
          : "neutral";
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span class={`strand-status-chip strand-status-chip--${variant}`}>{label}</span>;
}

function LogEntry({
  time,
  agent,
  action,
  status,
}: {
  time: string;
  agent: string;
  action: string;
  status: "complete" | "process" | "warning" | "error";
}) {
  return (
    <div class="strand-log">
      <span class="strand-log__time">{time}</span>
      <span class={`strand-log__status strand-log__status--${status}`}>
        {status === "complete" ? "OK" : status === "process" ? "RUN" : status === "warning" ? "WARN" : "ERR"}
      </span>
      <span>
        <strong>{agent}</strong> — {action}
      </span>
    </div>
  );
}

function AgentCard({
  name,
  type,
  status,
  tasks,
  success,
  initials,
  featured,
}: {
  name: string;
  type: string;
  status: string;
  tasks: number;
  success: number;
  initials: string;
  featured?: boolean;
}) {
  return (
    <Card
      variant={featured ? "outlined" : "elevated"}
      padding={featured ? "lg" : "md"}
    >
      <Stack direction="vertical" gap={5}>
        <Stack direction="horizontal" gap={4} align="center" justify="between">
          <Stack direction="horizontal" gap={3} align="center">
            <Avatar initials={initials} size={featured ? "lg" : "md"} />
            <Stack direction="vertical" gap={1}>
              <span class="strand-heading--sm">{name}</span>
              <Tag variant="outlined" status="default">{type}</Tag>
            </Stack>
          </Stack>
          <StatusChip status={status} />
        </Stack>
        <Divider />
        <Stack direction="horizontal" gap={6} justify="between">
          <DataReadout label="Tasks" value={tasks.toLocaleString()} size="sm" />
          <DataReadout label="Success" value={`${success}%`} size="sm" />
        </Stack>
        <Progress value={success} size="sm" />
      </Stack>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Bar chart using strand-bar-chart primitives
// Gap #4 fix: use strand-bar-chart--md for dashboard-appropriate height
// ---------------------------------------------------------------------------

function TaskVolumeChart() {
  const data = [
    { label: "Mon", amount: 420 },
    { label: "Tue", amount: 580 },
    { label: "Wed", amount: 510 },
    { label: "Thu", amount: 720 },
    { label: "Fri", amount: 690 },
    { label: "Sat", amount: 340 },
    { label: "Sun", amount: 280 },
  ];
  const max = Math.max(...data.map((d) => d.amount));
  return (
    <div class="strand-bar-chart strand-bar-chart--md">
      {data.map((d) => (
        <div class="strand-bar-chart__col" key={d.label}>
          <span class="strand-bar-chart__amount">{d.amount}</span>
          <div
            class="strand-bar-chart__bar"
            style={{ height: `${(d.amount / max) * 100}%` }}
          />
          <span class="strand-bar-chart__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main App
// ---------------------------------------------------------------------------

export function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const totalTasks = agents.reduce((s, a) => s + a.tasks, 0);
  const activeCount = agents.filter((a) => a.status === "active").length;
  const avgSuccess =
    (agents.reduce((s, a) => s + a.success, 0) / agents.length).toFixed(1);
  const errorCount = agents.filter((a) => a.status === "error").length;

  // Gap #3 fix: separate error agents for focal hierarchy
  const errorAgents = agents.filter((a) => a.status === "error");
  const healthyAgents = agents.filter((a) => a.status !== "error");

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <Stack direction="vertical" gap={8}>
          {/* Gap #3 fix: featured error agent creates focal point */}
          {errorAgents.length > 0 && (
            <div>
              <Stack direction="horizontal" gap={3} align="center" class="strand-mb-4">
                <span class="strand-overline">Attention Required</span>
                <Badge variant="count" status="red" count={errorAgents.length} />
              </Stack>
              <Stack direction="vertical" gap={4}>
                {errorAgents.map((a) => (
                  <AgentCard key={a.id} {...a} featured />
                ))}
              </Stack>
            </div>
          )}

          <div>
            <Stack direction="horizontal" gap={3} align="center" class="strand-mb-6">
              <span class="strand-overline">Agent Roster</span>
              <Badge variant="count" status="blue" count={healthyAgents.length} />
            </Stack>
            <Grid columns={3} gap={6}>
              {healthyAgents.map((a) => (
                <AgentCard key={a.id} {...a} />
              ))}
            </Grid>
          </div>

          <Divider direction="horizontal" />

          {/* Bottom section: Task volume + System KV */}
          <Grid columns={2} gap={6}>
            <Card variant="elevated" padding="md">
              <Stack direction="vertical" gap={4}>
                <span class="strand-overline">Task Volume — 7 Day</span>
                <TaskVolumeChart />
              </Stack>
            </Card>

            <Card variant="elevated" padding="md">
              <Stack direction="vertical" gap={4}>
                <span class="strand-overline">System Diagnostics</span>
                <div class="strand-kv">
                  <span class="strand-kv__label">Uptime</span>
                  <span class="strand-kv__value">14d 7h 32m</span>
                </div>
                <div class="strand-kv">
                  <span class="strand-kv__label">Queue Depth</span>
                  <span class="strand-kv__value">23</span>
                </div>
                <div class="strand-kv">
                  <span class="strand-kv__label">Memory</span>
                  <span class="strand-kv__value">4.2 GB / 16 GB</span>
                </div>
                <div class="strand-kv">
                  <span class="strand-kv__label">CPU Load</span>
                  <span class="strand-kv__value">38%</span>
                </div>
                <div class="strand-kv">
                  <span class="strand-kv__label">Network I/O</span>
                  <span class="strand-kv__value">1.4 Gbps</span>
                </div>
                <div class="strand-kv">
                  <span class="strand-kv__label">Error Rate</span>
                  <span class="strand-kv__value strand-kv__value--status">0.03%</span>
                </div>
              </Stack>
            </Card>
          </Grid>
        </Stack>
      ),
    },
    {
      id: "agents",
      label: "Agents",
      content: (
        <Stack direction="vertical" gap={6}>
          <Stack direction="horizontal" gap={3} align="center" justify="between">
            <span class="strand-overline">All Registered Agents</span>
            {/* Gap #6 fix: secondary variant — table is the primary element */}
            <Tooltip content="Deploy a new autonomous agent to the cluster">
              <Button variant="secondary" size="sm">
                Deploy Agent
              </Button>
            </Tooltip>
          </Stack>
          <Card variant="elevated" padding="none">
            <Table columns={tableColumns} data={tableData} />
          </Card>
        </Stack>
      ),
    },
    {
      id: "activity",
      label: "Activity Log",
      content: (
        <Stack direction="vertical" gap={6}>
          <Stack direction="horizontal" gap={3} align="center" justify="between">
            <span class="strand-overline strand-overline--pulse">Live Feed</span>
            <Switch
              checked={autoRefresh}
              onChange={setAutoRefresh}
              label="Auto-refresh"
            />
          </Stack>
          <Card variant="elevated" padding="md">
            <Stack direction="vertical" gap={2}>
              {activityLog.map((entry, i) => (
                <LogEntry key={i} {...entry} />
              ))}
            </Stack>
          </Card>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Nav
        glass
        logo={<strong>STRAND LAB</strong>}
        items={[
          { label: "Dashboard", href: "#", active: true },
          { label: "Pipelines", href: "#" },
          { label: "Models", href: "#" },
          { label: "Settings", href: "#" },
        ]}
        actions={
          <Stack direction="horizontal" gap={3} align="center">
            <Badge variant="dot" status="teal">
              <Avatar initials="ZD" size="sm" />
            </Badge>
          </Stack>
        }
      />

      {/* Gap #1 fix: compact section for dashboard — data above the fold */}
      <Section variant="compact" background="primary">
        <Container size="full">
          <Stack direction="vertical" gap={6}>
            {/* Gap #2 fix: section-header + text-center for consistent alignment */}
            <div class="strand-section-header strand-text-center">
              <span class="strand-overline strand-overline--accent">Agent Operations</span>
              <h1 class="strand-headline strand-headline--lg strand-mt-3">
                Dashboard
              </h1>
              <p class="strand-lead strand-mt-2">
                Real-time monitoring and orchestration for autonomous agent systems.
              </p>
            </div>

            {errorCount > 0 && (
              <Alert status="warning" dismissible>
                {errorCount} agent{errorCount > 1 ? "s" : ""} reporting errors. Review the agent roster for details.
              </Alert>
            )}

            <Grid columns={4} gap={6}>
              <Card variant="elevated" padding="md">
                <DataReadout label="Active Agents" value={activeCount} size="lg" />
              </Card>
              <Card variant="elevated" padding="md">
                <DataReadout
                  label="Total Tasks"
                  value={totalTasks.toLocaleString()}
                  size="lg"
                />
              </Card>
              <Card variant="elevated" padding="md">
                <DataReadout label="Avg Success" value={`${avgSuccess}%`} size="lg" />
              </Card>
              <Card variant="elevated" padding="md">
                <DataReadout label="Error Agents" value={errorCount} size="lg" />
              </Card>
            </Grid>
          </Stack>
        </Container>
      </Section>

      {/* Main content tabs */}
      <Section variant="standard" background="recessed">
        <Container size="full">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </Container>
      </Section>

      {/* Footer */}
      <footer class="strand-footer">
        <nav class="strand-footer__nav">
          <a class="strand-footer__link" href="#">Documentation</a>
          <a class="strand-footer__link" href="#">API Reference</a>
          <a class="strand-footer__link" href="#">Status</a>
          <a class="strand-footer__link" href="#">Support</a>
        </nav>
        <p class="strand-footer__copy">Strand Agent Dashboard — Built with Strand UI</p>
      </footer>
    </>
  );
}

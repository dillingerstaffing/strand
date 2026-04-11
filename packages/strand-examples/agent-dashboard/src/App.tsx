import { useState } from "preact/hooks";
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
  Divider,
  Alert,
  Tabs,
  Switch,
  Tooltip,
  Button,
  InstrumentViewport,
  Avatar,
} from "@dillingerstaffing/strand-ui";

// ---------------------------------------------------------------------------
// Value stream: five operator decisions
// 1. "Is the fleet healthy?" → KPI readouts
// 2. "What broke and why?" → Error panel with diagnostics
// 3. "Is this worth the money?" → Per-agent cost + burn rate
// 4. "Is quality holding?" → Success rates, health scores, deltas
// 5. "What happened recently?" → Activity log
// ---------------------------------------------------------------------------

interface AgentError {
  message: string;
  timestamp: string;
  context: string;
  failures: number;
  lastSuccess: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "online" | "idle" | "error";
  task: string;
  model: string;
  version: string;
  healthScore: number;
  tasksCompleted: number;
  tasksPerHour: number;
  throughputDelta: number;
  successRate: number;
  p95: string;
  tokens: string;
  tokensIn: string;
  tokensOut: string;
  cost: string;
  costPerHour: string;
  uptime: string;
  error?: AgentError;
}

const agents: Agent[] = [
  {
    id: "AGT-001", name: "Archivist", role: "Document Retrieval & Indexing",
    status: "online", task: "Indexing batch B-4920 (208 records)",
    model: "gpt-4o", version: "v2.4.1", healthScore: 98,
    tasksCompleted: 1284, tasksPerHour: 214, throughputDelta: 12,
    successRate: 99.2, p95: "42ms", tokens: "1.2M", tokensIn: "840K", tokensOut: "360K",
    cost: "$4.80", costPerHour: "$0.32", uptime: "14d 7h",
  },
  {
    id: "AGT-002", name: "Classifier", role: "Intent Classification & Routing",
    status: "online", task: "Processing inference queue (34 pending)",
    model: "gpt-4o-mini", version: "v3.1.0", healthScore: 94,
    tasksCompleted: 876, tasksPerHour: 146, throughputDelta: -3,
    successRate: 97.8, p95: "118ms", tokens: "890K", tokensIn: "710K", tokensOut: "180K",
    cost: "$3.56", costPerHour: "$0.24", uptime: "14d 7h",
  },
  {
    id: "AGT-003", name: "Dispatcher", role: "Task Orchestration & Load Balancing",
    status: "online", task: "Routing 12 tasks to Archivist queue",
    model: "gpt-4o-mini", version: "v2.4.1", healthScore: 99,
    tasksCompleted: 2041, tasksPerHour: 340, throughputDelta: 8,
    successRate: 99.9, p95: "8ms", tokens: "204K", tokensIn: "180K", tokensOut: "24K",
    cost: "$0.82", costPerHour: "$0.05", uptime: "14d 7h",
  },
  {
    id: "AGT-004", name: "Sentinel", role: "System Health Monitoring",
    status: "idle", task: "Next check in 28s",
    model: "gpt-4o-mini", version: "v1.8.0", healthScore: 100,
    tasksCompleted: 540, tasksPerHour: 12, throughputDelta: 0,
    successRate: 100, p95: "3ms", tokens: "18K", tokensIn: "14K", tokensOut: "4K",
    cost: "$0.07", costPerHour: "$0.01", uptime: "14d 7h",
  },
  {
    id: "AGT-005", name: "Synthesizer", role: "Report Generation & Summarization",
    status: "online", task: "Generating quarterly summary R-2291",
    model: "gpt-4o", version: "v2.4.1", healthScore: 82,
    tasksCompleted: 312, tasksPerHour: 8, throughputDelta: -1,
    successRate: 94.6, p95: "890ms", tokens: "4.1M", tokensIn: "3.2M", tokensOut: "900K",
    cost: "$14.15", costPerHour: "$0.94", uptime: "14d 7h",
  },
  {
    id: "AGT-006", name: "Validator", role: "Output Quality Assurance",
    status: "error", task: "Halted — awaiting manual review",
    model: "gpt-4o", version: "v2.4.1", healthScore: 31,
    tasksCompleted: 1102, tasksPerHour: 0, throughputDelta: -100,
    successRate: 88.1, p95: "203ms", tokens: "620K", tokensIn: "480K", tokensOut: "140K",
    cost: "$2.48", costPerHour: "$0.00", uptime: "6d 2h",
    error: {
      message: "Schema validation failed: field 'confidence_score' expected float64, got string in output V-0884",
      timestamp: "2 min ago",
      context: "Validating Synthesizer output for report R-2291",
      failures: 3,
      lastSuccess: "14:29:12",
    },
  },
];

const activityLog = [
  { time: "14:32:08", agent: "AGT-003", action: "Routed 12 tasks to Archivist queue", status: "complete" as const },
  { time: "14:31:55", agent: "AGT-002", action: "Classified batch #4891 — 34 documents", status: "complete" as const },
  { time: "14:31:42", agent: "AGT-005", action: "Generating summary for report R-2291", status: "process" as const },
  { time: "14:31:30", agent: "AGT-006", action: "Schema validation failed on output V-0884", status: "error" as const },
  { time: "14:31:18", agent: "AGT-004", action: "Health check passed — all endpoints nominal", status: "complete" as const },
  { time: "14:30:59", agent: "AGT-001", action: "Indexed 208 records into vector store", status: "complete" as const },
  { time: "14:30:41", agent: "AGT-003", action: "Rebalanced load across 3 active agents", status: "process" as const },
  { time: "14:30:22", agent: "AGT-002", action: "Confidence threshold warning on doc D-7712", status: "warning" as const },
];

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function StatusChip({ status }: { status: string }) {
  const variant = status === "online" ? "live" : status === "idle" ? "neutral" : "caution";
  return <span class={`strand-status-chip strand-status-chip--${variant}`}>{status.toUpperCase()}</span>;
}

function LogEntry({ time, agent, action, status }: {
  time: string; agent: string; action: string;
  status: "complete" | "process" | "warning" | "error";
}) {
  return (
    <div class="strand-log">
      <span class="strand-log__time">{time}</span>
      <span class={`strand-log__status strand-log__status--${status}`}>
        {status === "complete" ? "OK" : status === "process" ? "RUN" : status === "warning" ? "WARN" : "ERR"}
      </span>
      <span class="strand-log__text"><strong>{agent}</strong> — {action}</span>
    </div>
  );
}

function AgentPanel({ agent }: { agent: Agent }) {
  return (
    <div class="strand-card strand-card--elevated strand-card--pad-sm strand-glass-surface">
      <Stack direction="vertical" gap={2}>
        <Stack direction="horizontal" justify="between" align="center">
          <span class="strand-overline">{agent.id}</span>
          <StatusChip status={agent.status} />
        </Stack>
        <div>
          <div class="strand-heading--sm">{agent.name}</div>
          <span class="strand-text-secondary--xs">{agent.role}</span>
        </div>
        <span class="strand-text-secondary--xs">{agent.task}</span>
        <Divider />
        <div class="strand-kv"><span class="strand-kv__label">Throughput</span><span class="strand-kv__value">{agent.tasksPerHour}/hr</span></div>
        <div class="strand-kv"><span class="strand-kv__label">P95 Response</span><span class="strand-kv__value">{agent.p95}</span></div>
        <div class="strand-kv"><span class="strand-kv__label">Success</span><span class="strand-kv__value">{agent.successRate}%</span></div>
        <div class="strand-kv"><span class="strand-kv__label">Cost</span><span class="strand-kv__value">{agent.cost}</span></div>
        <Progress value={agent.successRate} size="sm" />
      </Stack>
    </div>
  );
}

function ErrorPanel({ agent }: { agent: Agent }) {
  const err = agent.error!;
  return (
    <Card variant="outlined" padding="sm">
      <Stack direction="vertical" gap={2}>
        <Stack direction="horizontal" justify="between" align="center" wrap>
          <Stack direction="horizontal" gap={2} align="center">
            <span class="strand-overline">{agent.id}</span>
            <span class="strand-heading--sm">{agent.name}</span>
          </Stack>
          <StatusChip status="error" />
        </Stack>
        <Alert status="error">{err.message}</Alert>
        <div class="strand-kv"><span class="strand-kv__label">Failed</span><span class="strand-kv__value">{err.timestamp}</span></div>
        <div class="strand-kv"><span class="strand-kv__label">Context</span><span class="strand-kv__value">{err.context}</span></div>
        <div class="strand-kv"><span class="strand-kv__label">Consecutive</span><span class="strand-kv__value strand-kv__value--status">{err.failures}</span></div>
        <div class="strand-kv"><span class="strand-kv__label">Last Success</span><span class="strand-kv__value">{err.lastSuccess}</span></div>
        <Stack direction="horizontal" gap={2} wrap>
          <Button variant="secondary" size="sm">View Trace</Button>
          <Button variant="ghost" size="sm">Restart Agent</Button>
        </Stack>
      </Stack>
    </Card>
  );
}

function TaskVolumeChart() {
  const data = [
    { label: "Mon", amount: 420 }, { label: "Tue", amount: 580 },
    { label: "Wed", amount: 510 }, { label: "Thu", amount: 720 },
    { label: "Fri", amount: 690 }, { label: "Sat", amount: 340 },
    { label: "Sun", amount: 280 },
  ];
  const max = Math.max(...data.map((d) => d.amount));
  return (
    <div class="strand-bar-chart">
      {data.map((d) => (
        <div class="strand-bar-chart__col" key={d.label}>
          <span class="strand-bar-chart__amount">{d.amount}</span>
          <div class="strand-bar-chart__bar" style={{ height: `${(d.amount / max) * 100}%` }} />
          <span class="strand-bar-chart__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rich table cells for Agents tab
// ---------------------------------------------------------------------------

function AgentIdentityCell({ agent }: { agent: Agent }) {
  return (
    <Stack direction="horizontal" gap={3} align="center">
      <Stack direction="vertical" gap={1}>
        <Stack direction="horizontal" gap={2} align="center">
          <span class="strand-heading--sm">{agent.name}</span>
          <StatusChip status={agent.status} />
        </Stack>
        <span class="strand-text-secondary--xs">{agent.role}</span>
        <span class="strand-text-secondary--xs" style={{ fontFamily: "var(--strand-font-mono)", letterSpacing: "var(--strand-tracking-wider)" }}>
          {agent.id} · {agent.version} · {agent.model}
        </span>
      </Stack>
    </Stack>
  );
}

function HealthCell({ score }: { score: number }) {
  return (
    <Stack direction="horizontal" gap={2} align="center">
      <Progress variant="ring" size="sm" value={score} />
    </Stack>
  );
}

function ThroughputCell({ value, delta }: { value: number; delta: number }) {
  const color = delta > 2 ? "strand-status-chip strand-status-chip--live"
    : delta < -2 ? "strand-status-chip strand-status-chip--caution"
    : "strand-status-chip strand-status-chip--neutral";
  const arrow = delta > 2 ? "+" : delta < -2 ? "" : "";
  return (
    <Stack direction="vertical" gap={1}>
      <span class="strand-kv__value">{value}/hr</span>
      {delta !== 0 && (
        <span class={color}>{arrow}{delta}%</span>
      )}
    </Stack>
  );
}

function SuccessCell({ rate }: { rate: number }) {
  return (
    <Stack direction="vertical" gap={1}>
      <span class="strand-kv__value">{rate}%</span>
      <Progress value={rate} size="sm" />
    </Stack>
  );
}

function CostCell({ total, hourly }: { total: string; hourly: string }) {
  return (
    <Stack direction="vertical" gap={1}>
      <span class="strand-kv__value">{total}</span>
      <span class="strand-text-secondary--xs">{hourly}/hr</span>
    </Stack>
  );
}

function UptimeCell({ uptime, status }: { uptime: string; status: string }) {
  const badgeStatus = status === "error" ? "red" as const
    : uptime.includes("d") && parseInt(uptime) >= 7 ? "teal" as const
    : uptime.includes("d") ? "blue" as const
    : "amber" as const;
  return (
    <Stack direction="horizontal" gap={2} align="center">
      <span class="strand-kv__value">{uptime}</span>
      <Badge variant="dot" status={badgeStatus}><span /></Badge>
    </Stack>
  );
}

// Table config
const agentTableColumns = [
  { key: "agent", header: "Agent" },
  { key: "health", header: "Health", sortable: true },
  { key: "activity", header: "Activity" },
  { key: "throughput", header: "Throughput", sortable: true },
  { key: "success", header: "Success", sortable: true },
  { key: "latency", header: "P95", sortable: true },
  { key: "cost", header: "Cost", sortable: true },
  { key: "uptime", header: "Uptime", sortable: true },
];

const agentTableData = agents.map((a) => ({
  agent: <AgentIdentityCell agent={a} />,
  health: <HealthCell score={a.healthScore} />,
  activity: <span class="strand-text-secondary--xs">{a.task}</span>,
  throughput: <ThroughputCell value={a.tasksPerHour} delta={a.throughputDelta} />,
  success: <SuccessCell rate={a.successRate} />,
  latency: <span class="strand-kv__value">{a.p95}</span>,
  cost: <CostCell total={a.cost} hourly={a.costPerHour} />,
  uptime: <UptimeCell uptime={a.uptime} status={a.status} />,
}));

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const onlineCount = agents.filter((a) => a.status === "online").length;
  const errorRate = ((agents.filter((a) => a.status === "error").length / agents.length) * 100).toFixed(1);
  const totalThroughput = agents.filter((a) => a.status !== "error").reduce((s, a) => s + a.tasksPerHour, 0);
  const totalCost = agents.reduce((s, a) => s + parseFloat(a.cost.replace("$", "")), 0).toFixed(2);
  const errorAgents = agents.filter((a) => a.status === "error");
  const healthyAgents = agents.filter((a) => a.status !== "error");

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <Stack direction="vertical" gap={6}>
          {errorAgents.map((a) => <ErrorPanel key={a.id} agent={a} />)}
          <div>
            <span class="strand-overline strand-mb-3 strand-block">Fleet — {healthyAgents.length} agents</span>
            <div class="strand-grid strand-grid--auto-md strand-grid--gap-4">
              {healthyAgents.map((a) => <AgentPanel key={a.id} agent={a} />)}
            </div>
          </div>
          <div class="strand-grid strand-grid--auto-md strand-grid--gap-4">
            <div class="strand-card strand-card--elevated strand-card--pad-sm strand-glass-surface">
              <Stack direction="vertical" gap={3}>
                <span class="strand-overline">Task Volume — 7 Day</span>
                <TaskVolumeChart />
              </Stack>
            </div>
            <div class="strand-card strand-card--warm strand-card--pad-sm">
              <Stack direction="vertical" gap={1}>
                <span class="strand-overline strand-mb-2">System</span>
                <div class="strand-kv"><span class="strand-kv__label">Uptime</span><span class="strand-kv__value">14d 7h 32m</span></div>
                <div class="strand-kv"><span class="strand-kv__label">Queue</span><span class="strand-kv__value">23 pending</span></div>
                <div class="strand-kv"><span class="strand-kv__label">Memory</span><span class="strand-kv__value">4.2 / 16 GB</span></div>
                <div class="strand-kv"><span class="strand-kv__label">CPU</span><span class="strand-kv__value">38%</span></div>
                <div class="strand-kv"><span class="strand-kv__label">Network</span><span class="strand-kv__value">1.4 Gbps</span></div>
                <div class="strand-kv"><span class="strand-kv__label">Error Rate</span><span class="strand-kv__value strand-kv__value--status">0.03%</span></div>
              </Stack>
            </div>
          </div>
        </Stack>
      ),
    },
    {
      id: "agents",
      label: "Agents",
      content: (
        <Stack direction="vertical" gap={4}>
          <Stack direction="horizontal" align="center" justify="between" wrap>
            <span class="strand-overline">{agents.length} Registered Agents</span>
            <Tooltip content="Deploy a new autonomous agent to the cluster">
              <Button variant="secondary" size="sm">Deploy Agent</Button>
            </Tooltip>
          </Stack>
          <Card variant="elevated" padding="none">
            <Table columns={agentTableColumns} data={agentTableData} />
          </Card>
        </Stack>
      ),
    },
    {
      id: "activity",
      label: "Activity Log",
      content: (
        <Stack direction="vertical" gap={4}>
          <Stack direction="horizontal" align="center" justify="between" wrap>
            <span class="strand-overline strand-overline--pulse">Live Feed</span>
            <Switch checked={autoRefresh} onChange={setAutoRefresh} label="Auto-refresh" />
          </Stack>
          <InstrumentViewport>
            <div class="strand-scanline strand-scanline--ambient" />
            <Stack direction="vertical" gap={1}>
              {activityLog.map((entry, i) => <LogEntry key={i} {...entry} />)}
            </Stack>
          </InstrumentViewport>
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
          <Badge variant="dot" status="teal">
            <Avatar initials="ZD" size="sm" />
          </Badge>
        }
      />

      <Section variant="compact" background="primary" class="strand-nav-offset">
        <Container size="full">
          <Stack direction="vertical" gap={4}>
            <InstrumentViewport grid>
              <Stack direction="vertical" gap={3}>
                <span class="strand-overline strand-overline--pulse">Agent Operations</span>
                <div class="strand-stack strand-stack--horizontal strand-stack--responsive strand-stack--gap-6 strand-stack--justify-between strand-stack--align-start">
                  <DataReadout label="Fleet Status" value={`${onlineCount} / ${agents.length}`} size="sm" />
                  <DataReadout label="Error Rate" value={`${errorRate}%`} size="sm" />
                  <DataReadout label="Throughput" value={`${totalThroughput}/hr`} size="sm" />
                  <DataReadout label="Cost Today" value={`$${totalCost}`} size="sm" />
                </div>
              </Stack>
            </InstrumentViewport>

            {errorAgents.length > 0 && (
              <Alert status="warning" dismissible>
                {errorAgents.length} agent reporting errors — {errorAgents.map((a) => `${a.id} ${a.name}`).join(", ")}
              </Alert>
            )}

            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </Stack>
        </Container>
      </Section>

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

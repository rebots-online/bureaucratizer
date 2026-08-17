"use client";

import type { CSSProperties } from "react";
import { useCallback, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import {
  Activity,
  Archive,
  ArrowRight,
  BellRing,
  Blocks,
  Bot,
  Braces,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardCheck,
  Clock3,
  Code2,
  Copy,
  Eye,
  FileCheck2,
  FileInput,
  FileSignature,
  GitBranch,
  GraduationCap,
  GripVertical,
  House,
  Info,
  LayoutTemplate,
  Link2,
  Mail,
  MessageSquareText,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stethoscope,
  UploadCloud,
  UserRound,
  UsersRound,
  WandSparkles,
  X,
} from "lucide-react";
import "@xyflow/react/dist/style.css";

type EditionKey = "real-estate-team" | "law-office" | "medical-clinic" | "education" | "consulting";
type StepKind = "collect" | "review" | "decision" | "message" | "sign" | "complete";
type StudioView = "flow" | "compose" | "spec";

type FlowData = {
  eyebrow: string;
  title: string;
  detail: string;
  kind: StepKind;
  owner?: string;
  badge?: string;
};

type WorkflowNode = Node<FlowData, "workflow">;

type Edition = {
  key: EditionKey;
  label: string;
  shortLabel: string;
  accent: string;
  tint: string;
  icon: typeof House;
  workflow: string;
  audience: string;
  nouns: string[];
  steps: FlowData[];
};

const editions: Edition[] = [
  {
    key: "real-estate-team",
    label: "Real Estate Team Edition",
    shortLabel: "Real Estate Team",
    accent: "#335f4b",
    tint: "#e8f1ec",
    icon: House,
    workflow: "Buyer representation · new client",
    audience: "Buyer + agent + transaction coordinator",
    nouns: ["Buyer", "Property", "Offer", "Brokerage"],
    steps: [
      { eyebrow: "INTAKE", title: "Buyer story", detail: "Goals, timing, people & constraints", kind: "collect", owner: "Buyer", badge: "6 fields" },
      { eyebrow: "EVIDENCE", title: "Identity & financing", detail: "ID, pre-approval and consent", kind: "collect", owner: "Buyer", badge: "3 items" },
      { eyebrow: "TEAM REVIEW", title: "Readiness check", detail: "Agent verifies fit and exceptions", kind: "review", owner: "Buyer agent", badge: "SLA 4h" },
      { eyebrow: "DECISION", title: "Representation route", detail: "Ready now, nurture, or refer", kind: "decision", owner: "System", badge: "3 paths" },
      { eyebrow: "AGREEMENT", title: "Representation agreement", detail: "Explain, acknowledge and sign", kind: "sign", owner: "Buyer + agent", badge: "eSign" },
      { eyebrow: "HANDOFF", title: "Activate search", detail: "Create CRM record and next actions", kind: "complete", owner: "Coordinator", badge: "4 actions" },
    ],
  },
  {
    key: "law-office",
    label: "Law Office Edition",
    shortLabel: "Law Office",
    accent: "#5c5139",
    tint: "#f1eee6",
    icon: Building2,
    workflow: "New matter · conflict-safe intake",
    audience: "Prospect + intake clerk + reviewing lawyer",
    nouns: ["Prospect", "Matter", "Party", "Retainer"],
    steps: [
      { eyebrow: "PRE-INTAKE", title: "Matter outline", detail: "Issue, jurisdiction and urgency", kind: "collect", owner: "Prospect", badge: "8 fields" },
      { eyebrow: "CONFLICT DATA", title: "Parties & relationships", detail: "Names, aliases and related entities", kind: "collect", owner: "Prospect", badge: "Repeatable" },
      { eyebrow: "GATE", title: "Conflict review", detail: "Search, record and adjudicate matches", kind: "review", owner: "Intake clerk", badge: "Required" },
      { eyebrow: "DECISION", title: "Triage route", detail: "Consult, decline, refer, or urgent review", kind: "decision", owner: "Lawyer", badge: "4 paths" },
      { eyebrow: "ENGAGEMENT", title: "Retainer & consent", detail: "Scope, fees, disclosures and eSign", kind: "sign", owner: "Client + lawyer", badge: "eSign" },
      { eyebrow: "OPEN MATTER", title: "Evidence ledger", detail: "Open matter and preserve audit trail", kind: "complete", owner: "Clerk", badge: "7y policy" },
    ],
  },
  {
    key: "medical-clinic",
    label: "Medical Clinic Edition",
    shortLabel: "Medical Clinic",
    accent: "#275c66",
    tint: "#e4f0f2",
    icon: Stethoscope,
    workflow: "New patient · referral intake",
    audience: "Patient + referring office + clinic team",
    nouns: ["Patient", "Referral", "Provider", "Encounter"],
    steps: [
      { eyebrow: "PATIENT", title: "Demographics & access", detail: "Identity, contact and accessibility", kind: "collect", owner: "Patient", badge: "10 fields" },
      { eyebrow: "CLINICAL", title: "Referral evidence", detail: "Reason, history, tests and medications", kind: "collect", owner: "Referrer", badge: "5 items" },
      { eyebrow: "NURSE REVIEW", title: "Completeness triage", detail: "Clinical sufficiency and red flags", kind: "review", owner: "Triage nurse", badge: "SLA 1d" },
      { eyebrow: "DECISION", title: "Care route", detail: "Routine, priority, redirect, or emergency", kind: "decision", owner: "Clinician", badge: "4 paths" },
      { eyebrow: "CONSENT", title: "Privacy & care consent", detail: "Explain use, sharing and withdrawal", kind: "sign", owner: "Patient", badge: "Consent" },
      { eyebrow: "SCHEDULE", title: "Ready for booking", detail: "Offer appropriate appointment windows", kind: "complete", owner: "Scheduler", badge: "2 actions" },
    ],
  },
  {
    key: "education",
    label: "Educational Institution Edition",
    shortLabel: "Education",
    accent: "#4d5486",
    tint: "#ececf6",
    icon: GraduationCap,
    workflow: "Student support · accommodation request",
    audience: "Student + instructor + support office",
    nouns: ["Student", "Course", "Request", "Plan"],
    steps: [
      { eyebrow: "REQUEST", title: "Student context", detail: "Barrier, course and requested support", kind: "collect", owner: "Student", badge: "7 fields" },
      { eyebrow: "DOCUMENTS", title: "Supporting evidence", detail: "Upload or request alternate verification", kind: "collect", owner: "Student", badge: "Conditional" },
      { eyebrow: "ASSESSMENT", title: "Eligibility review", detail: "Policy fit, sufficiency and consultation", kind: "review", owner: "Support office", badge: "SLA 3d" },
      { eyebrow: "DECISION", title: "Support pathway", detail: "Approve, revise, discuss, or appeal", kind: "decision", owner: "Advisor", badge: "4 paths" },
      { eyebrow: "PLAN", title: "Shared accommodation plan", detail: "Responsibilities and acknowledgements", kind: "sign", owner: "Student + office", badge: "Acknowledge" },
      { eyebrow: "DELIVERY", title: "Notify & monitor", detail: "Instructor notice and follow-up cadence", kind: "complete", owner: "System", badge: "3 actions" },
    ],
  },
  {
    key: "consulting",
    label: "Business Consultant’s Edition",
    shortLabel: "SMB Consultant",
    accent: "#75513d",
    tint: "#f3ebe6",
    icon: Activity,
    workflow: "Discovery · paid diagnostic",
    audience: "Owner + consultant + specialist",
    nouns: ["Client", "Engagement", "Finding", "Recommendation"],
    steps: [
      { eyebrow: "DISCOVERY", title: "Business snapshot", detail: "Goals, bottlenecks and decision context", kind: "collect", owner: "Owner", badge: "9 fields" },
      { eyebrow: "EVIDENCE", title: "Operating signals", detail: "Financials, process docs and metrics", kind: "collect", owner: "Client team", badge: "6 items" },
      { eyebrow: "ANALYSIS", title: "Diagnostic review", detail: "Evidence quality, gaps and hypotheses", kind: "review", owner: "Consultant", badge: "SLA 2d" },
      { eyebrow: "DECISION", title: "Engagement route", detail: "Workshop, project, referral, or decline", kind: "decision", owner: "Consultant", badge: "4 paths" },
      { eyebrow: "SCOPE", title: "Proposal & authority", detail: "Outcomes, exclusions, fees and approvals", kind: "sign", owner: "Sponsor", badge: "eSign" },
      { eyebrow: "KICKOFF", title: "Launch workbench", detail: "Create plan, evidence room and cadence", kind: "complete", owner: "System", badge: "5 actions" },
    ],
  },
];

const nodeIcons: Record<StepKind, typeof FileInput> = {
  collect: FileInput,
  review: ClipboardCheck,
  decision: GitBranch,
  message: Mail,
  sign: FileSignature,
  complete: FileCheck2,
};

function WorkflowCard({ data, selected }: NodeProps<WorkflowNode>) {
  const Icon = nodeIcons[data.kind];
  return (
    <div className={`flow-node ${selected ? "is-selected" : ""}`}>
      <Handle type="target" position={Position.Left} className="flow-handle" />
      <div className={`node-icon kind-${data.kind}`}><Icon size={17} strokeWidth={1.8} /></div>
      <div className="node-copy">
        <span className="node-eyebrow">{data.eyebrow}</span>
        <strong>{data.title}</strong>
        <small>{data.detail}</small>
        <div className="node-meta">
          <span><UserRound size={11} /> {data.owner}</span>
          <span>{data.badge}</span>
        </div>
      </div>
      <GripVertical className="node-grip" size={16} />
      <Handle type="source" position={Position.Right} className="flow-handle" />
    </div>
  );
}

const nodeTypes = { workflow: WorkflowCard };

function makeNodes(steps: FlowData[]): WorkflowNode[] {
  return steps.map((step, index) => ({
    id: `step-${index + 1}`,
    type: "workflow",
    position: { x: 70 + (index % 3) * 325, y: 70 + Math.floor(index / 3) * 235 },
    data: step,
  }));
}

function makeEdges(): Edge[] {
  return [
    ["step-1", "step-2"], ["step-2", "step-3"], ["step-3", "step-4"],
    ["step-4", "step-5"], ["step-5", "step-6"],
  ].map(([source, target], index) => ({
    id: `edge-${index + 1}`, source, target, type: "smoothstep", animated: index === 2,
    style: { stroke: "var(--accent)", strokeWidth: 1.6 },
  }));
}

const libraryItems = [
  { label: "Ask for information", icon: MessageSquareText },
  { label: "Request evidence", icon: FileInput },
  { label: "Human review", icon: ClipboardCheck },
  { label: "Decision / branch", icon: GitBranch },
  { label: "Send a message", icon: BellRing },
  { label: "Sign / acknowledge", icon: FileSignature },
];

function bureauSpec(edition: Edition, nodes: WorkflowNode[]) {
  const editionId = edition.key.replaceAll("-", ".");
  const workflowId = edition.workflow.toLowerCase().replaceAll(" · ", "-").replaceAll(" ", "-");
  const steps = nodes.map((node, index) => {
    const id = node.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const next = nodes[index + 1]?.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    return `  step ${id} {
    type: ${node.data.kind}
    actor: "${node.data.owner}"
    purpose: "${node.data.detail}"
    complete_when: evidence.accepted
    ${next ? `next: ${next}` : "emit: workflow.completed"}
  }`;
  }).join("\n\n");

  return `edition "${editionId}" extends "core.professional" {
  vocabulary: [${edition.nouns.map((noun) => `"${noun}"`).join(", ")}]
  accent: "${edition.accent}"
}

workflow "${workflowId}" version 4 {
  audience: "${edition.audience}"
  access: magic_link
  autosave: continuous

${steps}
}

experience portal {
  navigation: progressive
  explain_before_ask: true
  resume_across_devices: true
  rejection: item_level
}

evidence policy {
  audit: full
  seal: tamper_evident
  export: [pdf, docx, csv, json]
}`;
}

export default function Home() {
  const [editionKey, setEditionKey] = useState<EditionKey>("real-estate-team");
  const edition = editions.find((item) => item.key === editionKey) ?? editions[0];
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>(makeNodes(edition.steps));
  const [edges, , onEdgesChange] = useEdgesState(makeEdges());
  const [selectedId, setSelectedId] = useState("step-3");
  const [editionOpen, setEditionOpen] = useState(false);
  const [activeView, setActiveView] = useState<StudioView>("flow");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMobile, setPreviewMobile] = useState(false);
  const selectedNode = nodes.find((node) => node.id === selectedId) ?? nodes[0];

  const themeStyle = useMemo(() => ({
    "--accent": edition.accent,
    "--accent-tint": edition.tint,
  } as CSSProperties), [edition]);
  const spec = useMemo(() => bureauSpec(edition, nodes), [edition, nodes]);
  const specFileName = `${edition.workflow.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.bureau`;

  const selectEdition = useCallback((nextEdition: Edition) => {
    setEditionKey(nextEdition.key);
    setNodes(makeNodes(nextEdition.steps));
    setSelectedId("step-3");
    setEditionOpen(false);
  }, [setNodes]);

  const updateSelected = useCallback((field: keyof FlowData, value: string) => {
    setNodes((current) => current.map((node) => node.id === selectedId
      ? { ...node, data: { ...node.data, [field]: value } }
      : node));
  }, [selectedId, setNodes]);

  const addStep = useCallback(() => {
    const next = nodes.length + 1;
    const id = `step-${next}`;
    setNodes((current) => [...current, {
      id,
      type: "workflow",
      position: { x: 395 + ((next - 1) % 3) * 40, y: 530 + Math.floor(next / 3) * 40 },
      data: { eyebrow: "NEW STEP", title: "Untitled action", detail: "Define the outcome and evidence", kind: "collect", owner: "Unassigned", badge: "Draft" },
    }]);
    setSelectedId(id);
  }, [nodes.length, setNodes]);

  return (
    <main className="app-shell" style={themeStyle}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><Braces size={19} strokeWidth={1.7} /></div>
          <div><strong>Auto-Bureaucratizer</strong><span>Workflow Studio</span></div>
        </div>
        <nav className="product-nav" aria-label="Product sections">
          <button className="active"><Blocks size={15} /> Studio</button>
          <button><Play size={15} /> Runs</button>
          <button><UsersRound size={15} /> People</button>
          <button><Archive size={15} /> Evidence</button>
        </nav>
        <div className="top-actions">
          <button className="icon-button" aria-label="Search"><Search size={17} /></button>
          <button className="icon-button" aria-label="More options"><MoreHorizontal size={18} /></button>
          <button className="avatar">RC</button>
        </div>
      </header>

      <section className="contextbar">
        <div className="edition-picker-wrap">
          <button className="edition-picker" onClick={() => setEditionOpen(!editionOpen)} aria-expanded={editionOpen}>
            <edition.icon size={17} />
            <span><small>EDITION</small><strong>{edition.shortLabel}</strong></span>
            <ChevronDown size={15} />
          </button>
          {editionOpen && (
            <div className="edition-menu">
              <span className="menu-kicker">One engine · different operating language</span>
              {editions.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.key} onClick={() => selectEdition(item)}>
                    <Icon size={17} /><span><strong>{item.label}</strong><small>{item.nouns.join(" · ")}</small></span>
                    {item.key === editionKey && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="workflow-title">
          <span className="status-dot" />
          <div><small>WORKFLOW · DRAFT 04</small><strong>{edition.workflow}</strong></div>
        </div>
        <div className="context-actions">
          <div className="presence"><span>JC</span><span>AM</span><span>+2</span></div>
          <button className="secondary-button" onClick={() => setPreviewOpen(true)}><Play size={14} /> Test run</button>
          <button className="primary-button">Publish <ArrowRight size={15} /></button>
        </div>
      </section>

      <section className="viewbar">
        <div className="view-tabs">
          <button className={activeView === "flow" ? "active" : ""} onClick={() => setActiveView("flow")}><GitBranch size={15} /> Flow</button>
          <button className={activeView === "compose" ? "active" : ""} onClick={() => setActiveView("compose")}><LayoutTemplate size={15} /> Compose</button>
          <button className={activeView === "spec" ? "active" : ""} onClick={() => setActiveView("spec")}><Braces size={15} /> Spec</button>
        </div>
        <div className="audience-note"><ShieldCheck size={15} /> {edition.audience}</div>
      </section>

      {activeView === "flow" && <section className="studio-grid">
        <aside className="library-panel">
          <div className="panel-heading">
            <div><small>BUILDING BLOCKS</small><strong>What happens next?</strong></div>
            <button className="icon-button small"><Plus size={16} /></button>
          </div>
          <label className="search-field"><Search size={15} /><input aria-label="Search blocks" placeholder="Search blocks" /></label>
          <div className="library-section">
            <span className="section-label">PEOPLE & EVIDENCE</span>
            {libraryItems.map((item) => {
              const Icon = item.icon;
              return <button className="library-item" key={item.label} onClick={addStep}><Icon size={17} /><span>{item.label}</span><GripVertical size={14} /></button>;
            })}
          </div>
          <div className="assistant-card">
            <div className="assistant-icon"><WandSparkles size={17} /></div>
            <div><strong>Describe the outcome</strong><p>Draft the actors, evidence, exceptions and handoffs—not just a prettier form.</p></div>
            <button><Sparkles size={14} /> Ask studio</button>
          </div>
        </aside>

        <section className="canvas-panel" aria-label="Workflow canvas">
          <div className="canvas-toolbar">
            <div><span className="status-chip"><Check size={12} /> Structure valid</span><span className="quiet-chip">6 steps · 3 actors · 4 automations</span></div>
            <button className="add-step-button" onClick={addStep}><Plus size={14} /> Add step</button>
          </div>
          <div className="flow-wrap">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onNodeClick={(_, node) => setSelectedId(node.id)}
              fitView
              fitViewOptions={{ padding: 0.18 }}
              minZoom={0.45}
              maxZoom={1.45}
              colorMode="light"
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Dots} gap={22} size={1.15} color="#cfd2ca" />
              <Controls position="bottom-left" showInteractive={false} />
              <MiniMap position="bottom-right" pannable zoomable nodeColor={edition.tint} maskColor="rgba(247,247,243,.78)" />
            </ReactFlow>
          </div>
        </section>

        <aside className="inspector-panel">
          <div className="inspector-head">
            <div><small>STEP {selectedId.replace("step-", "").padStart(2, "0")}</small><strong>{selectedNode?.data.title}</strong></div>
            <button className="icon-button small"><MoreHorizontal size={17} /></button>
          </div>
          <div className="inspector-summary">
            <div className={`node-icon kind-${selectedNode?.data.kind}`}>{selectedNode && (() => { const Icon = nodeIcons[selectedNode.data.kind]; return <Icon size={18} />; })()}</div>
            <div><span>Purpose</span><p>{selectedNode?.data.detail}</p></div>
          </div>
          <div className="field-group">
            <label><span>Step name</span><input value={selectedNode?.data.title ?? ""} onChange={(event) => updateSelected("title", event.target.value)} /></label>
            <label><span>Instruction</span><textarea value={selectedNode?.data.detail ?? ""} onChange={(event) => updateSelected("detail", event.target.value)} /></label>
            <label><span>Responsible actor</span><button className="select-control"><span><UserRound size={14} /> {selectedNode?.data.owner}</span><ChevronDown size={14} /></button></label>
            <label><span>Completion rule</span><button className="select-control"><span><ClipboardCheck size={14} /> All required evidence accepted</span><ChevronDown size={14} /></button></label>
          </div>
          <div className="rule-block">
            <div className="rule-title"><GitBranch size={15} /><strong>After this step</strong><button className="icon-button small"><Settings2 size={14} /></button></div>
            <div className="rule-line"><span>IF</span><code>review.status == &quot;ready&quot;</code></div>
            <div className="rule-line"><span>THEN</span><code>go_to(&quot;representation-route&quot;)</code></div>
          </div>
          <div className="inspector-footer">
            <span><Clock3 size={14} /> Autosaved just now</span>
            <button>Open advanced</button>
          </div>
        </aside>
      </section>}

      {activeView === "compose" && <section className="studio-grid compose-grid">
        <aside className="library-panel outline-panel">
          <div className="panel-heading">
            <div><small>CLIENT EXPERIENCE</small><strong>Page outline</strong></div>
            <button className="icon-button small"><Plus size={16} /></button>
          </div>
          <div className="outline-list">
            <span className="section-label">BUYER PORTAL · DEFAULT PATH</span>
            <button className="active"><GripVertical size={13} /><span><small>01</small><strong>Welcome & context</strong></span><Eye size={14} /></button>
            {nodes.slice(0, 5).map((node, index) => (
              <button key={node.id}><GripVertical size={13} /><span><small>{String(index + 2).padStart(2, "0")}</small><strong>{node.data.title}</strong></span><Eye size={14} /></button>
            ))}
            <button><GripVertical size={13} /><span><small>07</small><strong>Confirmation</strong></span><Eye size={14} /></button>
          </div>
          <div className="assistant-card compose-tip">
            <div className="assistant-icon"><Bot size={17} /></div>
            <div><strong>Content follows the graph</strong><p>Move or branch a workflow step and its client-facing page follows. Presentation stays editable here.</p></div>
          </div>
        </aside>

        <section className="compose-panel">
          <div className="canvas-toolbar compose-toolbar">
            <div><span className="status-chip"><Check size={12} /> Content mapped</span><span className="quiet-chip">Desktop · 720px reading width</span></div>
            <div><button className="toolbar-icon active" aria-label="Desktop preview"><LayoutTemplate size={14} /></button><button className="toolbar-icon" aria-label="Mobile preview"><Smartphone size={14} /></button><button className="add-step-button" onClick={() => setPreviewOpen(true)}><Eye size={14} /> Preview as client</button></div>
          </div>
          <div className="compose-stage">
            <article className="portal-document">
              <header className="portal-brandbar">
                <div className="portal-logo"><edition.icon size={18} /><span><strong>North & Field</strong><small>{edition.shortLabel}</small></span></div>
                <div className="secure-note"><ShieldCheck size={14} /> Secure workspace</div>
              </header>
              <div className="portal-progress-copy"><span>YOUR PROGRESS</span><strong>2 of 6 steps ready</strong></div>
              <div className="portal-progress"><span /></div>
              <section className="portal-content">
                <div className="editing-badge"><Sparkles size={12} /> Live WYSIWYG</div>
                <p className="portal-kicker">LET’S GET YOU READY</p>
                <h1 contentEditable suppressContentEditableWarning>Welcome. We’ll take this one useful step at a time.</h1>
                <p contentEditable suppressContentEditableWarning>Tell us only what is needed for the next decision. You can leave and return from any device; every answer saves automatically.</p>
                <div className="portal-callout"><Info size={17} /><div><strong>Why we ask</strong><span>Your answers help the team prepare before requesting documents, so you won’t be asked for evidence that does not apply.</span></div></div>
                <div className="portal-task-card">
                  <div className="task-card-head"><div className="task-number">1</div><div><span>FIRST STEP · ABOUT 4 MINUTES</span><strong>{nodes[0]?.data.title}</strong></div><CheckCircle2 size={19} /></div>
                  <p>{nodes[0]?.data.detail}. You can review every answer before anything is shared with the team.</p>
                  <div className="example-fields"><div><span>What are you hoping to accomplish?</span><strong>A comfortable home within commuting distance…</strong></div><div><span>Ideal timing</span><strong>Within 3–6 months</strong></div></div>
                </div>
                <div className="portal-actions"><button className="portal-secondary">Save & leave</button><button className="portal-primary">Start this step <ArrowRight size={15} /></button></div>
              </section>
            </article>
          </div>
        </section>

        <aside className="inspector-panel compose-inspector">
          <div className="inspector-head"><div><small>CONTENT BLOCK</small><strong>Welcome & context</strong></div><button className="icon-button small"><MoreHorizontal size={17} /></button></div>
          <div className="property-tabs"><button className="active">Content</button><button>Rules</button><button>Style</button></div>
          <div className="field-group">
            <label><span>Purpose</span><button className="select-control"><span><MessageSquareText size={14} /> Explain before asking</span><ChevronDown size={14} /></button></label>
            <label><span>Tone</span><button className="select-control"><span><Sparkles size={14} /> Calm · plain language</span><ChevronDown size={14} /></button></label>
            <label><span>Visible to</span><button className="select-control"><span><UsersRound size={14} /> External actors</span><ChevronDown size={14} /></button></label>
          </div>
          <div className="mapping-card"><Link2 size={15} /><div><strong>Bound to workflow</strong><span>Updates when the edition’s first collect step changes.</span><code>steps[0].experience.intro</code></div></div>
          <div className="inspector-footer"><span><Clock3 size={14} /> Autosaved just now</span><button>Detach block</button></div>
        </aside>
      </section>}

      {activeView === "spec" && <section className="studio-grid spec-grid">
        <aside className="library-panel schema-panel">
          <div className="panel-heading"><div><small>BUREAUSPEC 0.4</small><strong>Schema map</strong></div><button className="icon-button small"><Plus size={16} /></button></div>
          <div className="schema-tree">
            <button className="active"><Braces size={15} /><span>Edition pack</span><Check size={13} /></button>
            <button><UsersRound size={15} /><span>Vocabulary & actors</span><Check size={13} /></button>
            <button><GitBranch size={15} /><span>Workflow graph</span><Check size={13} /></button>
            <button><LayoutTemplate size={15} /><span>Experience</span><Check size={13} /></button>
            <button><ShieldCheck size={15} /><span>Evidence policy</span><Check size={13} /></button>
            <button><BellRing size={15} /><span>Automations</span><Circle size={9} /></button>
          </div>
          <div className="assistant-card spec-tip"><div className="assistant-icon"><Code2 size={17} /></div><div><strong>UI-authored, text-portable</strong><p>The canvas writes this source. Humans and agents can review, diff, generate, inherit, or compile it.</p></div></div>
        </aside>

        <section className="spec-panel">
          <div className="canvas-toolbar spec-toolbar"><div><span className="status-chip"><Check size={12} /> Compiles cleanly</span><span className="quiet-chip">41 declarations · 0 unreachable steps</span></div><div><button className="toolbar-icon"><Copy size={14} /></button><button className="add-step-button"><Play size={14} /> Compile</button></div></div>
          <div className="spec-workspace">
            <div className="code-editor">
              <div className="code-head"><span>{specFileName}</span><span>UTF-8 · BureauSpec 0.4</span></div>
              <pre contentEditable suppressContentEditableWarning><code>{spec}</code></pre>
            </div>
            <aside className="compiled-view">
              <span className="section-label">NORMALIZED OUTPUT</span>
              <div className="compile-score"><strong>100</strong><span>portable<br />schema score</span></div>
              <div className="compiled-metrics"><div><span>Steps</span><strong>{nodes.length}</strong></div><div><span>Actors</span><strong>3</strong></div><div><span>Policies</span><strong>4</strong></div></div>
              <span className="section-label">INHERITANCE</span>
              <div className="inheritance-stack"><span>core.professional</span><ArrowRight size={13} /><span>{edition.key}</span><ArrowRight size={13} /><strong>this workflow</strong></div>
              <span className="section-label">COMPILES TO</span>
              <div className="compile-targets"><span>Web portal</span><span>Task queue</span><span>API schema</span><span>Audit map</span><span>PDF pack</span><span>Analytics</span></div>
            </aside>
          </div>
        </section>

        <aside className="inspector-panel validation-panel">
          <div className="inspector-head"><div><small>COMPILER</small><strong>Validation</strong></div><button className="icon-button small"><MoreHorizontal size={17} /></button></div>
          <div className="validation-summary"><CheckCircle2 size={25} /><div><strong>Ready to publish</strong><span>The client experience, team queues and evidence rules resolve from one graph.</span></div></div>
          <div className="validation-list">
            <div><Check size={14} /><span><strong>Every step has an owner</strong><small>3 human · 3 system-assisted</small></span></div>
            <div><Check size={14} /><span><strong>No dead-end branches</strong><small>All outcomes terminate or hand off</small></span></div>
            <div><Check size={14} /><span><strong>Evidence is attributable</strong><small>Actor, time, policy and revision retained</small></span></div>
            <div><Check size={14} /><span><strong>Edition vocabulary resolved</strong><small>{edition.nouns.join(" · ")}</small></span></div>
          </div>
          <div className="rule-block lineage-card"><div className="rule-title"><ShieldCheck size={15} /><strong>Portability contract</strong></div><p>No presentation-only construct is required to reproduce this workflow in another renderer.</p></div>
        </aside>
      </section>}

      {previewOpen && <div className="preview-overlay" role="dialog" aria-modal="true" aria-label="Client test run">
        <div className="preview-chrome">
          <div><span className="live-dot" /><strong>Test run</strong><small>No records will be created</small></div>
          <div className="preview-device"><button aria-label="Desktop client preview" className={!previewMobile ? "active" : ""} onClick={() => setPreviewMobile(false)}><LayoutTemplate size={15} /></button><button aria-label="Mobile client preview" className={previewMobile ? "active" : ""} onClick={() => setPreviewMobile(true)}><Smartphone size={15} /></button></div>
          <button className="close-preview" onClick={() => setPreviewOpen(false)} aria-label="Close preview"><X size={18} /></button>
        </div>
        <div className={`client-preview-stage ${previewMobile ? "mobile" : ""}`}>
          <article className="client-portal">
            <header><div className="portal-logo"><edition.icon size={18} /><span><strong>North & Field</strong><small>Secure client workspace</small></span></div><button><Link2 size={14} /> Copy private link</button></header>
            <div className="client-progress"><div><span>Welcome back, Alex</span><strong>You’re 33% ready</strong></div><div className="portal-progress"><span /></div><small>No account required · progress saves automatically</small></div>
            <main>
              <section className="client-main">
                <p className="portal-kicker">NEXT BEST ACTION</p>
                <h1>{nodes[1]?.data.title}</h1>
                <p>{nodes[1]?.data.detail}. We’ll check each item individually, so one correction never sends the whole package backwards.</p>
                <div className="why-card"><Info size={17} /><div><strong>Why this is needed</strong><span>The team uses this evidence only to confirm readiness for the next decision.</span></div></div>
                <div className="upload-zone"><UploadCloud size={25} /><strong>Drop files here or choose from your device</strong><span>PDF, JPG, PNG or DOCX · up to 25 MB each</span><button>Choose files</button></div>
                <div className="portal-actions"><button className="portal-secondary">Back</button><button className="portal-primary">Save & continue <ArrowRight size={15} /></button></div>
              </section>
              <aside className="client-checklist"><span className="section-label">YOUR PATH</span>{nodes.slice(0,5).map((node,index) => <div className={index === 1 ? "active" : index === 0 ? "done" : ""} key={node.id}>{index === 0 ? <Check size={13} /> : <span>{index + 1}</span>}<p><strong>{node.data.title}</strong><small>{index === 0 ? "Complete" : index === 1 ? "In progress" : "Not started"}</small></p></div>)}</aside>
            </main>
          </article>
        </div>
      </div>}
    </main>
  );
}

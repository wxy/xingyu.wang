import { PipeSegment, EndCap, StraightCoupling } from "@/components/pipes";

export default function DemoPipesPage() {
  return (
    <div
      style={{
        background: "#0a0a06",
        minHeight: "100vh",
        padding: 40,
        fontFamily: "monospace",
        color: "#33ff33",
      }}
    >
      <h2 style={{ fontSize: 14, marginBottom: 24, color: "#33ff3366" }}>
        ╔══ PIPE SYSTEM DEMO ═══════════════════════════════╗
      </h2>

      <Section title="1. Horizontal — two monitors">
        <div style={{ display: "flex", alignItems: "center" }}>
          <CrtMonitor name="HiTable" icon="📊" mon="01" status="rec" />
          <EndCap direction="horizontal" />
          <PipeSegment direction="horizontal" />
          <StraightCoupling direction="horizontal" />
          <PipeSegment direction="horizontal" />
          <EndCap direction="horizontal" />
          <CrtMonitor name="Navigraph" icon="🧭" mon="02" status="idle" />
        </div>
      </Section>

      <Section title="2. Vertical — two monitors">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CrtMonitor name="HiTable" icon="📊" mon="01" status="rec" />
          <EndCap direction="vertical" />
          <PipeSegment direction="vertical" />
          <StraightCoupling direction="vertical" />
          <PipeSegment direction="vertical" />
          <EndCap direction="vertical" />
          <CrtMonitor name="AI Pulse" icon="🤖" mon="03" status="rec" />
        </div>
      </Section>

      <Section title="3. Four monitors — horizontal + vertical pipes">
        <FourMonitorGrid />
      </Section>

      <div
        style={{
          marginTop: 40,
          padding: 16,
          border: "1px solid #33ff3318",
          background: "rgba(10,16,10,0.5)",
          fontSize: 9,
          color: "#33ff3366",
        }}
      >
        PipeSegment · EndCap · StraightCoupling
      </div>
    </div>
  );
}

/** 2×2 monitors connected by horizontal + vertical pipes.
 *  Same flex approach as demos 1+2 — just stacked rows + columns. */
function FourMonitorGrid() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {/* Row 1: two monitors + horizontal pipe */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <CrtMonitor name="HiTable" icon="📊" mon="01" status="rec" />
        <EndCap direction="horizontal" />
        <PipeSegment direction="horizontal" length={60} />
        <StraightCoupling direction="horizontal" />
        <PipeSegment direction="horizontal" length={60} />
        <EndCap direction="horizontal" />
        <CrtMonitor name="Navigraph" icon="🧭" mon="02" status="idle" />
      </div>

      {/* Vertical pipes between rows — one under each monitor */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* Left vertical */}
        <div style={{ width: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <EndCap direction="vertical" />
          <PipeSegment direction="vertical" length={40} />
          <StraightCoupling direction="vertical" />
          <PipeSegment direction="vertical" length={40} />
          <EndCap direction="vertical" />
        </div>
        {/* Gap between monitors */}
        <div style={{ width: 60 + 24 + 60 + 6 + 6 }} />
        {/* Right vertical */}
        <div style={{ width: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <EndCap direction="vertical" />
          <PipeSegment direction="vertical" length={40} />
          <StraightCoupling direction="vertical" />
          <PipeSegment direction="vertical" length={40} />
          <EndCap direction="vertical" />
        </div>
      </div>

      {/* Row 2: two monitors + horizontal pipe */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <CrtMonitor name="AI Pulse" icon="🤖" mon="03" status="rec" />
        <EndCap direction="horizontal" />
        <PipeSegment direction="horizontal" length={60} />
        <StraightCoupling direction="horizontal" />
        <PipeSegment direction="horizontal" length={60} />
        <EndCap direction="horizontal" />
        <CrtMonitor name="SilentFeed" icon="📡" mon="04" status="standby" />
      </div>
    </div>
  );
}

/* ══════════════════════ helpers ══════════════════════ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 10, color: "#ffaa00", marginBottom: 8, borderBottom: "1px solid #33ff3318", paddingBottom: 4 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function CrtMonitor({ name, icon, mon, status }: { name: string; icon: string; mon: string; status: "rec" | "idle" | "standby" }) {
  const dot = status === "rec" ? { color: "#ffaa00", label: "● REC", bg: "#ffaa00" } : status === "idle" ? { color: "#33ff3366", label: "● IDLE", bg: "#666" } : { color: "#666", label: "● STBY", bg: "#666" };
  return (
    <div style={{ background: "linear-gradient(180deg, #f5f0e8 0%, #e8e0d0 8%, #ddd5c0 20%, #e0d8c5 40%, #d5ccb5 70%, #e5ddd0 90%, #f0ead8 100%)", borderRadius: 14, padding: "10px 10px 14px 10px", boxShadow: "0 6px 24px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.12), 0 0 0 2px #1a1a1a, 0 0 0 4px #2a2a2a", width: 140, zIndex: 1, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 5 }}><div style={{ width: 10, height: 2, background: "#8a8070", borderRadius: 1 }} /><div style={{ width: 10, height: 2, background: "#8a8070", borderRadius: 1 }} /><div style={{ width: 10, height: 2, background: "#8a8070", borderRadius: 1 }} /></div>
      <div style={{ background: "#1a1a1a", borderRadius: 7, padding: 2, boxShadow: "inset 0 2px 6px rgba(0,0,0,0.8)" }}><div style={{ background: "radial-gradient(ellipse at 40% 30%, #0d200d 0%, #050d05 100%)", borderRadius: 5, padding: "8px 10px", border: "1px solid #33ff3310", boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden", aspectRatio: "4/3" }}><div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,20,0,0.04) 2px, rgba(0,20,0,0.04) 4px)", pointerEvents: "none", zIndex: 2 }} /><div style={{ position: "relative", zIndex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 7 }}><span style={{ color: "#33ff3333" }}>MON-{mon}</span><span style={{ color: dot.color, fontSize: 6 }}>{dot.label}</span></div><div style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ fontSize: 14 }}>{icon}</span><div style={{ color: "#33ff33", fontSize: 11, fontWeight: "bold" }}>{name}</div></div></div></div></div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 5 }}><span style={{ width: 3, height: 3, borderRadius: "50%", background: dot.bg, boxShadow: status === "rec" ? "0 0 4px #ffaa00" : undefined, display: "inline-block" }} /></div>
    </div>
  );
}

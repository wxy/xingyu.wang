import { PipeSegment, EndCap, StraightCoupling } from "@/components/pipes";

export default function DemoPipesPage() {
  return (
    <div className="min-h-screen p-10 font-mono text-fg">
      <h2 className="text-sm mb-6 text-[rgba(51,255,51,0.4)]">
        ╔══ PIPE SYSTEM DEMO ═══════════════════════════════╗
      </h2>

      <Section title="1. Horizontal — two monitors">
        <div className="flex items-center">
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
        <div className="flex flex-col items-center">
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

      <div className="mt-10 p-4 border border-[rgba(51,255,51,0.09)] bg-[rgba(10,16,10,0.5)] text-[9px] text-[rgba(51,255,51,0.4)]">
        PipeSegment · EndCap · StraightCoupling
      </div>
    </div>
  );
}

function FourMonitorGrid() {
  return (
    <div className="flex flex-col items-center gap-0">
      {/* Row 1 */}
      <div className="flex items-center">
        <CrtMonitor name="HiTable" icon="📊" mon="01" status="rec" />
        <EndCap direction="horizontal" />
        <PipeSegment direction="horizontal" length={60} />
        <StraightCoupling direction="horizontal" />
        <PipeSegment direction="horizontal" length={60} />
        <EndCap direction="horizontal" />
        <CrtMonitor name="Navigraph" icon="🧭" mon="02" status="idle" />
      </div>

      {/* Vertical pipes */}
      <div className="flex items-start">
        <div className="w-[150px] flex flex-col items-center">
          <EndCap direction="vertical" />
          <PipeSegment direction="vertical" length={40} />
          <StraightCoupling direction="vertical" />
          <PipeSegment direction="vertical" length={40} />
          <EndCap direction="vertical" />
        </div>
        <div className="w-[156px]" />
        <div className="w-[150px] flex flex-col items-center">
          <EndCap direction="vertical" />
          <PipeSegment direction="vertical" length={40} />
          <StraightCoupling direction="vertical" />
          <PipeSegment direction="vertical" length={40} />
          <EndCap direction="vertical" />
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex items-center">
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="text-[10px] text-accent mb-2 border-b border-[rgba(51,255,51,0.09)] pb-1">
        {title}
      </div>
      {children}
    </div>
  );
}

function CrtMonitor({ name, icon, mon, status }: { name: string; icon: string; mon: string; status: "rec" | "idle" | "standby" }) {
  const dot = status === "rec" ? { color: "#ffaa00", label: "● REC", bg: "#ffaa00" } : status === "idle" ? { color: "rgba(51,255,51,0.4)", label: "● IDLE", bg: "#666" } : { color: "#666", label: "● STBY", bg: "#666" };
  return (
    <div className="crt-monitor-shell w-[140px] z-[1] relative rounded-[14px] px-2.5 pt-2.5 pb-3.5">
      {/* Ventilation slots */}
      <div className="flex justify-center gap-1 mb-[5px]">
        <div className="w-2.5 h-0.5 bg-[#8a8070] rounded-sm" />
        <div className="w-2.5 h-0.5 bg-[#8a8070] rounded-sm" />
        <div className="w-2.5 h-0.5 bg-[#8a8070] rounded-sm" />
      </div>
      {/* Screen */}
      <div className="bg-[#1a1a1a] rounded-[7px] p-0.5 [box-shadow:inset_0_2px_6px_rgba(0,0,0,0.8)]">
        <div className="crt-screen-inner px-2.5 py-2 aspect-[4/3]">
          <div className="relative z-[1]">
            <div className="flex justify-between mb-1 text-[7px]">
              <span className="text-[rgba(51,255,51,0.2)]">MON-{mon}</span>
              <span style={{ color: dot.color }} className="text-[6px]">{dot.label}</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="text-sm">{icon}</span>
              <div className="heading-glow text-[11px]">{name}</div>
            </div>
          </div>
        </div>
      </div>
      {/* LED */}
      <div className="flex justify-center mt-[5px]">
        <span
          className="w-[3px] h-[3px] rounded-full inline-block"
          style={{ background: dot.bg, boxShadow: status === "rec" ? "0 0 4px #ffaa00" : undefined }}
        />
      </div>
    </div>
  );
}

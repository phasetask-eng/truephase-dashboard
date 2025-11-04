"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/** ---- Brand palette ---- */
// 🎨 Theme Colors
const BG       = "#0B0B0D";    // page background
const CARD     = "#131316";    // card background
const TEXT     = "#EAEAEA";    // primary text
const MUTED    = "#9CA3AF";    // secondary text
const ACCENT   = "#34D399";    // Truephase green
const ACCENT_2 = "#22C55E";    // darker hover green
const GRID     = "#2A2A2E";    // chart grid lines


/** Simple card for consistent dark styling */
function Card({
  title,
  children,
  right,
}: {
  title?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="tp-card rounded-2xl p-5"
      style={{ background: CARD }}
    >
      {(title || right) && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm md:text-base font-medium" style={{ color: TEXT }}>
            {title}
          </h3>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}


/** Compact KPI pill */
function KPI({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      className="rounded-2xl px-5 py-4"
      style={{ background: CARD, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.04)" }}
    >
      <div className="text-xs uppercase tracking-wide" style={{ color: MUTED }}>
        {label}
      </div>
      <div className="mt-1 text-2xl md:text-3xl font-semibold" style={{ color: TEXT }}>
        {value}
      </div>
      {sub && (
        <div className="mt-1 text-xs" style={{ color: MUTED }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/** ---------- Demo Data (edit to tell your story) ---------- */
const voiceSeries = [
  { day: "Mon", calls: 210, answered: 182, bookings: 42 },
  { day: "Tue", calls: 240, answered: 201, bookings: 55 },
  { day: "Wed", calls: 198, answered: 171, bookings: 39 },
  { day: "Thu", calls: 312, answered: 281, bookings: 68 },
  { day: "Fri", calls: 260, answered: 229, bookings: 57 },
];

const reviewsSeries = [
  { m: "Jan", google: 14, fb: 8, tp: 5, avg: 4.3 },
  { m: "Feb", google: 20, fb: 10, tp: 7, avg: 4.4 },
  { m: "Mar", google: 31, fb: 15, tp: 10, avg: 4.6 },
  { m: "Apr", google: 45, fb: 20, tp: 14, avg: 4.7 },
  { m: "May", google: 70, fb: 33, tp: 21, avg: 4.8 },
];

const automationSeries = [
  { w: "W1", tasks: 120, errorsBefore: 18, errorsAfter: 6 },
  { w: "W2", tasks: 160, errorsBefore: 20, errorsAfter: 7 },
  { w: "W3", tasks: 210, errorsBefore: 22, errorsAfter: 8 },
  { w: "W4", tasks: 250, errorsBefore: 25, errorsAfter: 9 },
];

const aiSeries = [
  { w: "W1", accuracy: 86, confidence: 0.78, errors: 4 },
  { w: "W2", accuracy: 89, confidence: 0.81, errors: 3 },
  { w: "W3", accuracy: 92, confidence: 0.84, errors: 2 },
  { w: "W4", accuracy: 94, confidence: 0.86, errors: 1 },
];

/** Sentiment pie */
const sentiment = [
  { name: "Positive", value: 72, color: ACCENT },
  { name: "Neutral", value: 18, color: "#8B8B94" },
  { name: "Negative", value: 10, color: "#EF4444" },
];

/** ---------- Page Component ---------- */
export default function TruephaseDashboard() {
  const [section, setSection] = useState<"overview" | "voice" | "reviews" | "automation" | "ai">(
    "overview"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /** Sections */
  const Overview = () => (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Calls Answered by AI" value="1,064" sub="+18% vs last week" />
        <KPI label="Hours Saved" value="142 hrs" sub="Admin & scheduling" />
        <KPI label="Avg Rating" value="4.7★" sub="Google/Facebook/Trustpilot" />
        <KPI label="Model Accuracy" value="94%" sub="Past 7 days" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Voice Volume & Bookings">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={voiceSeries}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke={MUTED} />
                <YAxis stroke={MUTED} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Area type="monotone" dataKey="calls" stroke={ACCENT} fill="url(#grad1)" />
                <Line type="monotone" dataKey="bookings" stroke={ACCENT_2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Reviews Collected by Platform">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reviewsSeries}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="m" stroke={MUTED} />
                <YAxis stroke={MUTED} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Line type="monotone" dataKey="google" stroke={ACCENT} strokeWidth={2} />
                <Line type="monotone" dataKey="fb" stroke="#38BDF8" strokeWidth={2} />
                <Line type="monotone" dataKey="tp" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Automation: Tasks & Error Reduction">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={automationSeries}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="w" stroke={MUTED} />
                <YAxis stroke={MUTED} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Bar dataKey="tasks" fill={ACCENT} />
                <Bar dataKey="errorsAfter" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  const Voice = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Response Rate" value="86%" sub="Answered ÷ Total" />
        <KPI label="Avg Response Time" value="8.2s" sub="to pick up" />
        <KPI label="Missed Calls Prevented" value="260" sub="this week" />
        <KPI label="Conversions / Bookings" value="56" sub="from AI-led calls" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Total Calls Handled">
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={voiceSeries}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke={MUTED} />
                <YAxis stroke={MUTED} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Line type="monotone" dataKey="calls" stroke={ACCENT} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Missed Calls Prevented (Before vs After)">
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={voiceSeries}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke={MUTED} />
                <YAxis stroke={MUTED} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Bar dataKey="answered" fill={ACCENT} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Bookings Made">
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={voiceSeries}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke={MUTED} />
                <YAxis stroke={MUTED} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Bar dataKey="bookings" fill={ACCENT_2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  const Reviews = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Response Rate to Reviews" value="86%" sub="AI replies" />
        <KPI label="Reviews this Month" value="124" sub="+41% vs last month" />
        <KPI label="Avg Rating Trend" value="4.8★" sub="up from 4.3★" />
        <KPI label="Top Keyword" value="quick booking" sub="AI NLP extraction" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Reviews Collected by Platform">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reviewsSeries}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="m" stroke={MUTED} />
                <YAxis stroke={MUTED} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Line type="monotone" dataKey="google" stroke={ACCENT} strokeWidth={2} />
                <Line type="monotone" dataKey="fb" stroke="#38BDF8" strokeWidth={2} />
                <Line type="monotone" dataKey="tp" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Average Rating Trend">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reviewsSeries}>
                <defs>
                  <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT_2} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={ACCENT_2} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="m" stroke={MUTED} />
                <YAxis stroke={MUTED} domain={[4, 5]} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a3231ff", color: TEXT }} />
                <Area type="monotone" dataKey="avg" stroke={ACCENT_2} fill="url(#grad2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Sentiment Breakdown">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentiment}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {sentiment.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2f32ff", color: TEXT }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  const Automation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Tasks Automated" value="740" sub="this month" />
        <KPI label="Hours Saved" value="140 hrs" sub="£8.8k cost saved est." />
        <KPI label="Error Reduction" value="−62%" sub="before vs after" />
        <KPI label="Success Rate" value="95%" sub="execution success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Tasks Automated">
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={automationSeries}>
                <defs>
                  <linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="w" stroke={MUTED} />
                <YAxis stroke={MUTED} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Area type="monotone" dataKey="tasks" stroke={ACCENT} fill="url(#grad3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Error Reduction (%) — Before vs After">
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={automationSeries}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="w" stroke={MUTED} />
                <YAxis stroke={MUTED} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Bar dataKey="errorsBefore" fill="#EF4444" />
                <Bar dataKey="errorsAfter" fill={ACCENT} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Automation ROI Calculator (demo)"
          right={<span className="text-xs" style={{ color: MUTED }}>Assumes £25/hr</span>}
        >
          <div className="flex items-center gap-6">
            <div className="text-4xl font-semibold" style={{ color: TEXT }}>
              £833<span className="text-base" style={{ color: MUTED }}>/month</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const AI = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Model Accuracy" value="94%" sub="weekly" />
        <KPI label="Avg Confidence" value="0.86" sub="0–1" />
        <KPI label="Retrains" value="4" sub="past month" />
        <KPI label="Incidents" value="1" sub="downtime/error logs" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Model Accuracy Trend">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aiSeries}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="w" stroke={MUTED} />
                <YAxis stroke={MUTED} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Line type="monotone" dataKey="accuracy" stroke={ACCENT} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Prediction Confidence">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiSeries}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="w" stroke={MUTED} />
                <YAxis stroke={MUTED} domain={[0, 1]} />
                <Tooltip contentStyle={{ background: CARD, border: "1px solid #2a2a32", color: TEXT }} />
                <Area type="monotone" dataKey="confidence" stroke={ACCENT_2} fillOpacity={0.15} fill={ACCENT_2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="AI Downtime / Errors">
          <div className="text-4xl font-semibold" style={{ color: ACCENT }}>
            ↓ 92%
          </div>
          <div className="text-xs mt-2" style={{ color: MUTED }}>
            vs. baseline month
          </div>
        </Card>
      </div>
    </div>
  );

  /** Section renderer */
  const renderSection = () => {
    if (section === "overview") return <Overview />;
    if (section === "voice") return <Voice />;
    if (section === "reviews") return <Reviews />;
    if (section === "automation") return <Automation />;
    return <AI />;
  };

  return (
    <>
      {/* 🔹 Top Navbar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#1e1e24]"
        style={{
          background: BG,
          boxShadow: "0 4px 20px rgba(0,0,0,.5)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            className="md:hidden mr-2 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: TEXT }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"}
              />
            </svg>
          </button>
          {/* Change the src if your file is not this name */}
          <img src="/truephase-logo.jpg" alt="Truephase Logo" className="h-8" />
          <h1 className="text-lg font-semibold hidden sm:block" style={{ color: TEXT }}>
            Truephase Ai Dashboard
          </h1>
        </div>

       <button
         onClick={() => window.open("https://truephase.co.uk/#contact", "_blank")}
         className="tp-cta px-3 sm:px-5 py-2 rounded-lg font-medium text-black text-sm sm:text-base"
         style={{
           background: ACCENT,
           boxShadow: "0 0 16px rgba(34,197,94,.6)",
           textShadow: "0 0 4px rgba(0,0,0,.5)",
         }}
       >
         Book a Demo
       </button>

      </header>

      {/* 🔹 Dashboard Layout */}
      <div className="min-h-screen flex" style={{ background: BG, color: TEXT }}>
        {/* Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed md:relative md:flex w-64 flex-col border-r border-[#1e1e24]
          transition-all duration-300 ease-in-out transform
          ${isMobileMenuOpen ? 'translate-x-0 z-50' : '-translate-x-full md:translate-x-0'}
          top-0 bottom-0 left-0 bg-[#0B0B0D]
        `}>
          <style jsx>{`
  .tp-sideHead {
    background: linear-gradient(
      135deg,
      rgba(34,197,94,.15) 0%,
      rgba(107,47,255,.16) 100%
    );
    border-bottom: 1px solid #1e1e24;
  }
`}</style>

          <div
            className="p-6 rounded-br-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,197,94,.15), rgba(107,47,255,.15))",
              borderBottom: "1px solid #1e1e24",
            }}
          >
            <img src="/truephase-logo.jpg" alt="Truephase Logo" className="h-10 mb-2" />
            <p className="text-xs" style={{ color: MUTED }}>
              AI Automation Suite
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {[
              ["Overview", "overview"],
              ["Voice Agent", "voice"],
              ["Reviews", "reviews"],
              ["Automation", "automation"],
              ["AI Performance", "ai"],
            ].map(([label, key]) => {
              const active = section === (key as any);
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSection(key as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-xl transition"
                  style={{
                    background: active ? ACCENT_2 : "transparent",
                    color: active ? "#fff" : MUTED,
                    border: active ? "none" : "1px solid #1f1f26",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold" style={{ color: TEXT }}>
              {section === "overview"
                ? "Overview"
                : section === "voice"
                ? "Voice Agent Analytics"
                : section === "reviews"
                ? "Review Management"
                : section === "automation"
                ? "Business Automation Workflows"
                : "AI Performance & Continuous Improvement"}
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: MUTED }}>
              Live demo with sample data • Dark UI • Interactive charts
            </p>
          </div>

          <div className="w-full">
            {renderSection()}
          </div>
        </main>
      </div>
    </>
  );
}

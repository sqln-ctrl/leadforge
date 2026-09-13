import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Globe2,
  Mail,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";

import Logomark from "../components/layout/Logomark";

const WORKFLOW = [
  { icon: Search, step: "01", title: "Discover", body: "Search any city and category to find businesses worth a closer look." },
  { icon: Sparkles, step: "02", title: "Qualify", body: "Score opportunities using website, contact, and business signals." },
  { icon: Send, step: "03", title: "Convert", body: "Manage your pipeline and turn the strongest leads into outreach." },
];

const FEATURES = [
  { icon: Globe2, title: "Google-powered discovery", body: "Source local businesses from the places your prospects already show up." },
  { icon: Zap, title: "Opportunity scoring", body: "Move from a long list to a focused shortlist with clear qualification signals." },
  { icon: UsersRound, title: "Built-in CRM", body: "Take leads from new to contacted, qualified, and closed in one view." },
  { icon: BarChart3, title: "Pipeline clarity", body: "See your lead coverage, status mix, and highest-value industries at a glance." },
  { icon: Mail, title: "Outreach-ready context", body: "Keep contact details, websites, notes, and proposals close to every lead." },
  { icon: ShieldCheck, title: "A focused workspace", body: "One calm system for the part of growth that normally lives in spreadsheets." },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f9fb] text-ink-900">
      <Nav />
      <Hero />
      <LogoStrip />
      <Workflow />
      <FeatureGrid />
      <ClosingCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-lg shadow-black/10 backdrop-blur">
            <Logomark className="h-6 w-6" tone="light" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">LeadForge</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="hidden rounded-lg px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white sm:inline-flex">
            Log in
          </Link>
          <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-ink-50">
            Start free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 pb-20 pt-32 sm:pt-36 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(232,81,29,0.34),transparent_30%),radial-gradient(circle_at_88%_22%,rgba(59,130,246,0.19),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

      <div className="relative mx-auto grid max-w-7xl min-w-0 items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="min-w-0 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-forge-500 text-white"><Sparkles className="h-2.5 w-2.5" /></span>
            Sales intelligence for growth agencies
          </div>
          <h1 className="mt-6 break-words font-display text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Find your next best client <span className="text-forge-400">before your competitors do.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-ink-200 sm:text-lg">
            LeadForge turns local business searches into qualified, outreach-ready opportunities. Discover, score, and manage your pipeline in one focused workspace.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-forge-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-forge-900/40 transition hover:-translate-y-0.5 hover:bg-forge-400">
              Build your lead list <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#workflow" className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white">
              See the workflow <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-xs text-ink-300">
            {["No spreadsheets required", "Your leads, your workflow", "Built for focused outreach"].map((item) => (
              <span key={item} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-forge-400" />{item}</span>
            ))}
          </div>
        </div>
        <ProductPreview />
      </div>
    </section>
  );
}

function ProductPreview() {
  const leads = [
    { name: "Moss & Mortar", type: "Home services · Lahore", score: 92, color: "bg-forge-500", status: "High opportunity" },
    { name: "Studio Saffron", type: "Retail · Karachi", score: 78, color: "bg-emerald-500", status: "Contact ready" },
    { name: "Northline Dental", type: "Healthcare · Islamabad", score: 66, color: "bg-blue-500", status: "New signal" },
  ];

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-2xl lg:ml-auto">
      <div className="absolute -inset-8 rounded-[2rem] bg-forge-500/20 blur-3xl" />
      <div className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] p-2 shadow-2xl shadow-black/30 backdrop-blur-md">
        <div className="min-w-0 overflow-hidden rounded-xl bg-[#fbfcfe] p-3 shadow-inner sm:p-5">
          <div className="flex min-w-0 items-center justify-between gap-2 border-b border-ink-100 pb-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900"><Logomark className="h-5 w-5" tone="light" /></span>
              <div className="min-w-0"><p className="truncate text-xs font-semibold text-ink-900">LeadForge workspace</p><p className="truncate text-[10px] text-ink-400">Discovery overview</p></div>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700 sm:px-2.5 sm:text-[10px]">Live pipeline</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {[['New leads', '28', 'text-ink-900'], ['Contactable', '19', 'text-emerald-600'], ['Avg. score', '74', 'text-forge-600']].map(([label, value, color]) => (
              <div key={label} className="min-w-0 rounded-xl border border-ink-100 bg-white p-2.5 sm:p-3">
                <p className="truncate text-[9px] text-ink-400 sm:text-[10px]">{label}</p><p className={`mt-1 font-display text-lg font-semibold sm:text-xl ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 min-w-0 rounded-xl border border-ink-100 bg-white p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-semibold text-ink-900">Priority opportunities</p><p className="mt-0.5 text-[10px] text-ink-400">Scored from your latest search</p></div><BarChart3 className="h-4 w-4 text-forge-500" /></div>
            <div className="space-y-2">
              {leads.map((lead) => (
                <div key={lead.name} className="flex min-w-0 items-center gap-2 rounded-lg bg-ink-50 px-2 py-2.5 sm:gap-2.5 sm:px-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${lead.color}`} />
                  <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-ink-800">{lead.name}</p><p className="truncate text-[10px] text-ink-400">{lead.type}</p></div>
                  <div className="shrink-0 text-right"><p className="text-xs font-semibold text-ink-900">{lead.score}</p><p className="hidden text-[9px] text-forge-600 sm:block">{lead.status}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-xl border border-ink-100 bg-white px-3 py-2.5 shadow-xl shadow-black/10 sm:-left-8">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forge-50 text-forge-600"><Zap className="h-4 w-4" /></span>
        <div><p className="text-[10px] text-ink-400">Opportunity found</p><p className="text-xs font-semibold text-ink-800">No website detected</p></div>
      </div>
    </div>
  );
}

function LogoStrip() {
  return (
    <section className="border-b border-ink-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-8 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
        <p className="max-w-xs text-sm font-medium text-ink-400">A better prospecting system for agencies selling digital services.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-300">
          <span>Web design</span><span>AI automation</span><span>Marketing</span><span>Development</span>
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section id="workflow" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-forge-600">A simpler sales workflow</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-ink-900 sm:text-4xl">From local search to a focused pipeline.</h2>
        <p className="mt-4 text-base leading-7 text-ink-500">LeadForge removes the research-heavy work between finding a business and knowing whether it deserves your time.</p>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {WORKFLOW.map(({ icon: Icon, step, title, body }) => (
          <article key={step} className="group relative rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forge-50 text-forge-600"><Icon className="h-5 w-5" /></span><span className="font-mono text-xs text-ink-300">{step}</span></div>
            <h3 className="mt-7 font-display text-xl font-semibold text-ink-900">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-ink-500">{body}</p>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-forge-600 opacity-0 transition group-hover:opacity-100">Move forward <ArrowRight className="h-3.5 w-3.5" /></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="border-y border-ink-100 bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-xl"><p className="text-sm font-semibold text-forge-600">Everything connected</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-ink-900 sm:text-4xl">Your lead generation stack, distilled.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-ink-500">Bring discovery, qualification, CRM activity, and analytics into one consistently organized process.</p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="bg-white p-6 transition hover:bg-ink-50/60 sm:p-7"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-50 text-forge-600"><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-base font-semibold text-ink-900">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-500">{body}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-ink-900 px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(232,81,29,0.46),transparent_48%)]" />
        <div className="relative"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-forge-400"><CircleDot className="h-5 w-5" /></span><h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Make every prospecting hour count.</h2><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink-300">Build a lead list your team can actually act on, then spend your energy where it changes the outcome.</p><Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-forge-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-forge-400">Create your workspace <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8"><Link to="/" className="flex items-center gap-2"><Logomark className="h-5 w-5" /><span className="font-display text-sm font-semibold text-ink-900">LeadForge</span></Link><p className="flex items-center gap-1.5 text-xs text-ink-400"><Clock3 className="h-3.5 w-3.5" />Built for more focused prospecting.</p><div className="flex gap-4 text-xs text-ink-400"><Link to="/login" className="hover:text-ink-700">Log in</Link><Link to="/register" className="hover:text-ink-700">Sign up</Link></div></div>
    </footer>
  );
}

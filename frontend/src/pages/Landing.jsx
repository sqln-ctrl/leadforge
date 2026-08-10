import { Link } from "react-router-dom";
import { Search, Flame, Send, ArrowRight, Mail, Gauge, ClipboardList, Download } from "lucide-react";
import Logomark from "../components/layout/Logomark";
import ScoreBadge from "../components/leads/ScoreBadge";

const PIPELINE = [
  {
    stage: "Ore",
    icon: Search,
    title: "Find the raw material",
    body: "Search a city and category. LeadForge pulls in every matching business from Google Places and OpenStreetMap.",
  },
  {
    stage: "Forge",
    icon: Flame,
    title: "Refine and score it",
    body: "Each business gets enriched with contact details and audited for site speed, SSL, and mobile-friendliness -- then scored on how much it needs you.",
  },
  {
    stage: "Blade",
    icon: Send,
    title: "Work the ready list",
    body: "Add notes, track status, and export the businesses worth a pitch. No more guessing who to call first.",
  },
];

const FEATURES = [
  { icon: Search, title: "Business discovery", body: "Search by city and category, pull in matches automatically." },
  { icon: Mail, title: "Contact enrichment", body: "Emails, phone numbers, and domains found automatically." },
  { icon: Gauge, title: "Website audits", body: "Speed, SSL, mobile-friendliness, and tech stack, checked for you." },
  { icon: Flame, title: "Lead scoring", body: "Every business ranked by how much it needs your help." },
  { icon: ClipboardList, title: "CRM & notes", body: "Track status and outreach without leaving the list." },
  { icon: Download, title: "Export", body: "Pull your shortlist into CSV or Excel whenever you need it." },
];

export default function Landing() {
  return (
    <div className="bg-white">
      <Nav />
      <Hero />
      <Problem />
      <Pipeline />
      <Features />
      <ClosingCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <Logomark className="h-6 w-6" tone="light" />
          <span className="font-display text-lg font-semibold text-white">LeadForge</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/login" className="rounded-lg  px-5 py-2 bg-black text-sm font-medium text-ink-200 hover:text-white">
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-forge-500 px-4 py-2 text-sm font-medium text-white hover:bg-forge-400"
          >
            Start forging leads
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      {/* Ambient forge glow -- quiet, not a spotlight */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-forge-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-forge-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-40 md:grid-cols-2">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-forge-400">
            For agencies who still prospect by hand
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
            Stop guessing which businesses need you.
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-200">
            LeadForge finds local businesses, audits their web presence, and scores how badly
            each one needs your agency -- so you spend time pitching, not prospecting.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-forge-500 px-5 py-3 text-sm font-medium text-white hover:bg-forge-400"
            >
              Start forging leads <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-ink-200 hover:text-white"
            >
              See how it works
            </a>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

// The signature element: a single business listing visibly "forged" into a
// scored lead on loop -- raw card, spark, then the scored result. This is
// the product's core mechanic (discovery -> audit -> score), shown rather
// than described.
function HeroVisual() {
  return (
    <div className="relative mx-auto flex h-64 w-full max-w-sm items-center justify-center">
      <div className="relative h-40 w-full">
        <div className="forge-cycle-raw absolute inset-0 flex flex-col justify-center rounded-xl border border-ink-700 bg-ink-800 p-5">
          <p className="text-sm font-medium text-ink-100">Cafe Aroma</p>
          <p className="mt-1 text-xs text-ink-400">Restaurant &middot; Lahore</p>
          <p className="mt-4 text-xs text-ink-500">Checking web presence...</p>
        </div>

        <div className="forge-cycle-spark absolute inset-0 flex items-center justify-center">
          <Flame className="h-16 w-16 text-forge-400" strokeWidth={1.5} />
        </div>

        <div className="forge-cycle-scored absolute inset-0 flex flex-col justify-center rounded-xl border border-forge-500/40 bg-ink-800 p-5 shadow-[0_0_40px_-10px_rgba(232,81,29,0.4)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink-100">Cafe Aroma</p>
            <ScoreBadge score={92} />
          </div>
          <p className="mt-1 text-xs text-ink-400">Restaurant &middot; Lahore</p>
          <p className="mt-4 text-xs text-forge-300">No website found -- high opportunity</p>
        </div>
      </div>
    </div>
  );
}

function Problem() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-forge-500">The problem</p>
      <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 md:text-3xl">
        Prospecting still runs on guesswork
      </h2>
      <p className="mt-4 text-base leading-relaxed text-ink-500">
        Scrolling Google Maps and Instagram, guessing which businesses have outdated websites
        or no online presence at all, then chasing down contact info by hand. It works, but it
        doesn't scale -- and the businesses that need you most are easy to miss.
      </p>
    </section>
  );
}

function Pipeline() {
  return (
    <section id="how-it-works" className="bg-ink-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-forge-500">The pipeline</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 md:text-3xl">
            From raw listings to ready leads
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {PIPELINE.map(({ stage, icon: Icon, title, body }, i) => (
            <div key={stage} className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-card">
                  <Icon className="h-5 w-5 text-forge-500" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-ink-300">
                  {stage}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p>
              {i < PIPELINE.length - 1 && (
                <div className="absolute right-[-1rem] top-5 hidden h-px w-8 bg-ink-200 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 max-w-xl">
        <p className="font-mono text-xs uppercase tracking-widest text-forge-500">What's inside</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 md:text-3xl">
          Everything after the search
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-ink-100 p-5">
            <Icon className="h-5 w-5 text-forge-500" />
            <h3 className="mt-3 text-sm font-semibold text-ink-900">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-500">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="bg-ink-900 py-20 text-center">
      <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">
        Ready to stop guessing?
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm text-ink-300">
        Create a free account and run your first search.
      </p>
      <Link
        to="/register"
        className="mt-7 inline-flex items-center gap-2 rounded-lg bg-forge-500 px-5 py-3 text-sm font-medium text-white hover:bg-forge-400"
      >
        Start forging leads <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <Logomark className="h-5 w-5" />
          <span className="font-display text-sm font-semibold text-ink-900">LeadForge</span>
        </div>
        <p className="text-xs text-ink-400">Built for agencies who still prospect by hand.</p>
        <div className="flex gap-4 text-xs text-ink-400">
          <Link to="/login" className="hover:text-ink-700">Log in</Link>
          <Link to="/register" className="hover:text-ink-700">Sign up</Link>
        </div>
      </div>
    </footer>
  );
}

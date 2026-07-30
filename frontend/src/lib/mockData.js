// Placeholder data standing in for the /businesses endpoints (Phase 3).
// Shaped to match the SRS's Business + Lead Score entities so swapping
// this out for real API calls later requires no changes to the UI.

export const STATUSES = ["New", "Contacted", "Qualified", "Closed"];

export const mockLeads = [
  {
    id: "1",
    name: "Cafe Aroma",
    category: "Restaurant",
    city: "Lahore",
    website: null,
    score: 92,
    status: "New",
    reason: "No website found",
    contact: { email: "info@cafearoma.pk", phone: "+92 42 111 2233" },
    notes: [],
  },
  {
    id: "2",
    name: "Bistro 21",
    category: "Restaurant",
    city: "Lahore",
    website: "bistro21.pk",
    score: 78,
    status: "Contacted",
    reason: "Slow site, no SSL",
    contact: { email: "hello@bistro21.pk", phone: "+92 42 111 4455" },
    notes: [{ id: "n1", text: "Left a voicemail, following up Friday.", createdAt: "2026-07-24" }],
  },
  {
    id: "3",
    name: "Spice Route Kitchen",
    category: "Restaurant",
    city: "Lahore",
    website: "spiceroutekitchen.com",
    score: 65,
    status: "Qualified",
    reason: "Outdated design, not mobile-friendly",
    contact: { email: "contact@spiceroutekitchen.com", phone: "+92 42 111 7788" },
    notes: [
      { id: "n2", text: "Owner is interested, wants a proposal by next week.", createdAt: "2026-07-22" },
    ],
  },
  {
    id: "4",
    name: "The Grill House",
    category: "Restaurant",
    city: "Lahore",
    website: "thegrillhouse.pk",
    score: 34,
    status: "Closed",
    reason: "Modern site, active socials",
    contact: { email: "team@thegrillhouse.pk", phone: "+92 42 111 9900" },
    notes: [{ id: "n3", text: "Not a fit -- already redesigned last quarter.", createdAt: "2026-07-18" }],
  },
];

export function scoreTemperature(score) {
  if (score >= 80) return "hot";
  if (score >= 55) return "warm";
  if (score >= 30) return "cool";
  return "cold";
}

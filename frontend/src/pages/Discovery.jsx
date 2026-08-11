
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { discoveryApi } from "../lib/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const CACHE_KEY = "leadforge_discovery_cache";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);

    if (!raw) return null;

    const cached = JSON.parse(raw);

    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return cached;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function saveCache(form, results, skipped) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      form,
      results,
      skipped,
      timestamp: Date.now(),
    })
  );
}

export default function Discovery() {
  const [form, setForm] = useState({
    city: "",
    category: "",
    country: "",
  });

  const [results, setResults] = useState(null);
  const [skipped, setSkipped] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = loadCache();

    if (cached) {
      setForm(cached.form);
      setResults(cached.results);
      setSkipped(cached.skipped);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);
    setResults(null);

    try {
      const { data } = await discoveryApi.search({
        city: form.city,
        category: form.category,
        country: form.country || undefined,
      });

      setResults(data.created);
      setSkipped(data.skipped_existing);

      saveCache(
        form,
        data.created,
        data.skipped_existing
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Search failed -- check the city/category and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Discovery
        </h1>

        <p className="mt-1 text-sm text-ink-400">
          Find new businesses by city, country, and category.
        </p>
      </header>

      <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <form
          className="grid grid-cols-3 gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            label="City"
            name="city"
            placeholder="Lahore"
            required
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
          />

          <Input
            label="Category"
            name="category"
            placeholder="restaurant"
            required
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          />

          <Input
            label="Country"
            name="country"
            placeholder="Pakistan"
            value={form.country}
            onChange={(e) =>
              setForm({
                ...form,
                country: e.target.value,
              })
            }
          />

          <Button
            type="submit"
            className="col-span-3"
            disabled={loading}
          >
            <Search className="h-4 w-4" />

            {loading ? "Searching..." : "Run discovery"}
          </Button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {results !== null && (
          <div className="mt-6">
            <p className="mb-3 text-xs text-ink-400">
              {results.length} new business
              {results.length === 1 ? "" : "es"} saved

              {skipped > 0 &&
                ` -- ${skipped} already in your list, skipped`}
            </p>

            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink-200 py-12 text-center">
                <p className="text-sm font-medium text-ink-600">
                  No new businesses found
                </p>

                <p className="mt-1 max-w-sm text-xs text-ink-400">
                  Try a broader category, or a bigger/better-mapped
                  city -- OpenStreetMap coverage varies by region.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-ink-50 rounded-lg border border-ink-100">
                {results.map((lead) => (
                  <li key={lead.id}>
                    <Link
                      to={`/app/leads/${lead.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-ink-50/60"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink-800">
                          {lead.name}
                        </p>

                        <p className="text-xs text-ink-400">
                          {lead.location || "No location on file"}
                        </p>
                      </div>

                      <ArrowRight className="h-4 w-4 text-ink-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

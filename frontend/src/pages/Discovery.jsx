
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

function saveCache(form, results, skipped, providerResults, providerLimit) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      form,
      results,
      skipped,
      providerResults,
      providerLimit,
      timestamp: Date.now(),
    })
  );
}

export default function Discovery() {
  const [form, setForm] = useState({
    city: "",
    category: "",
    country: "",
    limit: 20,
  });

  const [results, setResults] = useState(null);
  const [skipped, setSkipped] = useState(0);
  const [providerResults, setProviderResults] = useState(0);
  const [providerLimit, setProviderLimit] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cached = loadCache();

    if (cached) {
      setForm((current) => ({ ...current, ...cached.form }));
      setResults(cached.results);
      setSkipped(cached.skipped);
      setProviderResults(cached.providerResults || 0);
      setProviderLimit(cached.providerLimit || 60);
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
        limit: Number(form.limit),
      });

      setResults(data.created);
      setSkipped(data.skipped_existing);
      setProviderResults(data.provider_results);
      setProviderLimit(data.provider_limit);

      saveCache(
        form,
        data.created,
        data.skipped_existing,
        data.provider_results,
        data.provider_limit
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
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
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

          <Input
            label="Lead limit"
            name="limit"
            type="number"
            min="1"
            max="100"
            required
            value={form.limit}
            onChange={(e) =>
              setForm({
                ...form,
                limit: e.target.value,
              })
            }
          />

          <Button
            type="submit"
            className="md:col-span-2 xl:col-span-4"
            disabled={loading}
          >
            <Search className="h-4 w-4" />

            {loading ? "Searching..." : "Run discovery"}
          </Button>
        </form>

        <p className="mt-3 text-xs text-ink-400">
          Request up to 100 leads per run. Google Places Text Search returns a
          maximum of 60 results per search.
        </p>

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

              {providerResults >= providerLimit &&
                ` -- Google returned its ${providerLimit}-lead maximum`}
            </p>

            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink-200 py-12 text-center">
                <p className="text-sm font-medium text-ink-600">
                  No new businesses found
                </p>

                <p className="mt-1 max-w-sm text-xs text-ink-400">
                  Try a broader category or a larger city. Google may not have
                  matching businesses for every query.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-ink-50 rounded-lg border border-ink-100">
                {results.map((lead) => (
                  <li key={lead.id}>
                    <Link
                      to="/app/crm"
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

                      <span className="flex items-center gap-1 text-xs font-medium text-forge-600">
                        Open CRM <ArrowRight className="h-4 w-4" />
                      </span>
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

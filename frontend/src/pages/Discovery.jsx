
import { useState } from "react";
import { Search } from "lucide-react";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { discoveryApi } from "../lib/api";

export default function Discovery() {
  const [form, setForm] = useState({
    city: "",
    category: "",
    country: "",
  });

  const [businesses, setBusinesses] = useState([]);
  const [skippedExisting, setSkippedExisting] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setBusinesses([]);
    setSkippedExisting(0);

    if (!form.city.trim() || !form.category.trim()) {
      setError("Please enter a city and category.");
      return;
    }

    try {
      setLoading(true);

      const response = await discoveryApi.search({
        city: form.city.trim(),
        category: form.category.trim(),
        country: form.country.trim() || null,
        limit: 10,
      });

      setBusinesses(response.data.created || []);
      setSkippedExisting(response.data.skipped_existing || 0);
    } catch (err) {
      console.error("Discovery error:", err);

      const message =
        err.response?.data?.detail ||
        "Something went wrong while searching for businesses.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">
          Discovery
        </h1>

        <p className="mt-1 text-sm text-ink-500">
          Find new businesses by city, country, and category.
        </p>
      </div>

      {/* Search Form */}
      <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <form
          className="grid grid-cols-3 gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            label="City"
            name="city"
            placeholder="Lahore"
            value={form.city}
            onChange={handleChange}
          />

          <Input
            label="Category"
            name="category"
            placeholder="Restaurants"
            value={form.category}
            onChange={handleChange}
          />

          <Input
            label="Country"
            name="country"
            placeholder="Pakistan"
            value={form.country}
            onChange={handleChange}
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

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {businesses.length > 0 && (
        <div className="rounded-xl border border-ink-100 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-ink-100 p-6">
            <div>
              <h2 className="text-lg font-semibold text-ink-900">
                Discovered Businesses
              </h2>

              <p className="mt-1 text-sm text-ink-500">
                {businesses.length} new businesses found
              </p>
            </div>

            {skippedExisting > 0 && (
              <span className="text-sm text-ink-500">
                {skippedExisting} already existed
              </span>
            )}
          </div>

          <div className="divide-y divide-ink-100">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="p-6 transition hover:bg-ink-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-ink-900">
                      {business.name}
                    </h3>

                    {business.industry && (
                      <p className="mt-1 text-sm text-ink-500">
                        {business.industry}
                      </p>
                    )}

                    {business.location && (
                      <p className="mt-1 text-sm text-ink-500">
                        📍 {business.location}
                      </p>
                    )}

                    {business.phone && (
                      <p className="mt-1 text-sm text-ink-500">
                        📞 {business.phone}
                      </p>
                    )}
                  </div>

                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading &&
        !error &&
        businesses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 py-12 text-center">
            <Search className="h-8 w-8 text-ink-300" />

            <p className="mt-3 text-sm font-medium text-ink-600">
              No businesses found yet
            </p>

            <p className="mt-1 max-w-sm text-xs text-ink-400">
              Enter a city and category above to discover new
              businesses.
            </p>
          </div>
        )}
    </div>
  );
}


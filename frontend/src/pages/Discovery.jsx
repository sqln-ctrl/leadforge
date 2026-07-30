import { Search } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Discovery() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Discovery</h1>
        <p className="mt-1 text-sm text-ink-400">Find new businesses by city, country, and category.</p>
      </header>

      <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <form
          className="grid grid-cols-3 gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input label="City" name="city" placeholder="Lahore" />
          <Input label="Category" name="category" placeholder="Restaurants" />
          <Input label="Country" name="country" placeholder="Pakistan" />
          <Button type="submit" className="col-span-3" disabled>
            <Search className="h-4 w-4" /> Run discovery
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-ink-200 py-12 text-center">
          <p className="text-sm font-medium text-ink-600">Discovery isn't wired up yet</p>
          <p className="mt-1 max-w-sm text-xs text-ink-400">
            This screen is ready for Phase 4 (Google Places + OpenStreetMap integration). Once those
            backend endpoints exist, this form will trigger a search and stream results here.
          </p>
        </div>
      </div>
    </div>
  );
}

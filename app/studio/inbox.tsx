"use client";
import { useEffect, useState } from "react";
import { packages, projects, addons, money, statuses } from "../portfolio-data";
type Inquiry = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  packageId: string;
  addons: string;
  estimate: number | null;
  projectId: string;
  dateMode: string;
  date: string;
  location: string;
  budget: string;
  message: string;
  status: string;
  createdAt: string;
};
export default function Inbox() {
  const [items, setItems] = useState<Inquiry[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [filter, setFilter] = useState("All");
  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/bookings");
      const d = (await r.json()) as { error?: string; inquiries: Inquiry[] };
      if (!r.ok) throw new Error(d.error || "Unable to load briefs.");
      setItems(d.inquiries);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  async function update(id: string, status: string) {
    setError("");
    try {
      const r = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!r.ok)
        throw new Error(
          "Unable to update the brief. Please refresh and try again.",
        );
      setItems((s) => s.map((i) => (i.id === id ? { ...i, status } : i)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update.");
    }
  }
  function exportData() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(items, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "common-light-booking-inquiries.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="inbox-page">
      <a className="wordmark" href="/">
        COMMON
        <br />
        LIGHT / INBOX
      </a>
      <div className="inbox-heading">
        <div>
          <p className="eyebrow">THE NEXT STORY STARTS HERE.</p>
          <h1>
            THE BRIEF <em>BOARD.</em>
          </h1>
        </div>
        <div>
          <button
            className="button outline"
            disabled={loading}
            onClick={refresh}
          >
            {loading ? "LOADING…" : "REFRESH"}
          </button>
          <button
            className="button"
            onClick={exportData}
            disabled={!items.length}
          >
            EXPORT JSON
          </button>
        </div>
      </div>
      <p>
        Private studio workspace. Dates and estimates are inquiry preferences,
        not confirmed bookings or final quotes. Email notifications are not
        configured.
      </p>
      <div className="inbox-tabs">
        {["All", ...statuses].map((s) => (
          <button
            key={s}
            className={filter === s ? "active" : ""}
            onClick={() => setFilter(s)}
          >
            {s.toUpperCase()} (
            {items.filter((i) => s === "All" || i.status === s).length})
          </button>
        ))}
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!loading &&
        !items.filter((i) => filter === "All" || i.status === filter)
          .length && <p className="empty">No briefs in this view yet.</p>}
      <div className="inbox-list">
        {items
          .filter((i) => filter === "All" || i.status === filter)
          .map((i) => (
            <article key={i.id}>
              <div className="inbox-top">
                <span>
                  {i.reference} · RECEIVED{" "}
                  {new Date(i.createdAt).toLocaleDateString("en-PH", {
                    timeZone: "Asia/Manila",
                  })}
                </span>
                <select
                  aria-label={`Status for ${i.reference}`}
                  value={i.status}
                  onChange={(e) => update(i.id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <h2>
                {packages.find((p) => p.id === i.packageId)?.name ||
                  "A CUSTOM BRIEF"}
              </h2>
              <div className="inbox-columns">
                <div>
                  <h3>{i.name}</h3>
                  <p>
                    <a href={`mailto:${i.email}`}>{i.email}</a>
                    <br />
                    {i.phone || "No phone provided"}
                    <br />
                    {i.company || "Independent project"}
                  </p>
                </div>
                <div>
                  <p>
                    Timing: {i.dateMode === "Flexible" ? "Flexible" : i.date}
                    <br />
                    Location: {i.location}
                    <br />
                    Budget: {i.budget}
                  </p>
                </div>
                <div>
                  <p>
                    Sample estimate:{" "}
                    {i.estimate === null ? "Custom quote" : money(i.estimate)}
                    <br />
                    {(JSON.parse(i.addons) as string[])
                      .map((id) => addons.find((a) => a.id === id)?.name)
                      .join(" · ") || "No add-ons"}
                    <br />
                    Inspiration:{" "}
                    {projects.find((p) => p.id === i.projectId)?.title ||
                      "Not specified"}
                  </p>
                </div>
              </div>
              <p className="inbox-note">{i.message}</p>
            </article>
          ))}
      </div>
      <a className="text-link" href="/">
        ← BACK TO THE PORTFOLIO
      </a>
    </main>
  );
}

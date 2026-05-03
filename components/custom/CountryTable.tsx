"use client";

import Image from "next/image";
import Link from "next/link";
import { SortKey } from "@/types/Countries";
import EditCountryModal from "./EditCountryModal";
import { useCountryTable } from "@/application/hooks/useCountryTable";

function formatNumber(n?: number) {
  if (n == null) return "—";
  return new Intl.NumberFormat().format(n);
}

function formatArea(n?: number) {
  if (n == null) return "—";
  return `${new Intl.NumberFormat().format(n)} km²`;
}

function SortIcon({ col, sortKey, sortAsc }: { col: SortKey; sortKey: SortKey; sortAsc: boolean }) {
  if (sortKey !== col) return <span className="opacity-30"> ↕</span>;
  return <span className="text-primary">{sortAsc ? " ↑" : " ↓"}</span>;
}

export default function CountryTable() {
  const {
    paginated, regions, sorted,
    loading, error, searchInput, editingCountry, setEditingCountry,
    currentPage, totalPages, PAGE_SIZE,
    regionFilter, sortKey, sortAsc,
    handleSort, handleSearch, handleRegionChange, handlePageChange,
  } = useCountryTable();

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <header className="mb-5 flex flex-col items-center text-center">
        <div className="space-y-2 mb-3">
          <h1 className="text-xl font-extrabold text-foreground tracking-tight sm:text-2xl">
            Global Countries
          </h1>
        </div>
      
        <div className="w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-card border border-border rounded-2xl shadow-border/50">
            <div className="relative flex-1 w-full group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search by name, capital, or code..."
                value={searchInput}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>

            <div className="hidden sm:block w-px h-8 bg-border" />

            <div className="relative w-full sm:w-48">
              <select
                value={regionFilter}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 bg-transparent border-none focus:ring-0 text-sm font-medium text-foreground cursor-pointer outline-none"
              >
                {regions.map((r) => (
                  <option key={r} value={r} className="bg-popover text-popover-foreground">
                    {r === "All" ? "All Regions" : r}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Loading countries…
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && sorted.length === 0 && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No countries match your search.
        </div>
      )}

      {/* Table */}
      {!loading && !error && sorted.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="w-10 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Flag</th>
                  <th className="cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground" onClick={() => handleSort("name")}>
                    Country <SortIcon col="name" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Code</th>
                  <th className="cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground" onClick={() => handleSort("capital")}>
                    Capital <SortIcon col="capital" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                  <th className="cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground" onClick={() => handleSort("region")}>
                    Region <SortIcon col="region" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                  <th className="cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground" onClick={() => handleSort("subregion")}>
                    Subregion <SortIcon col="subregion" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                  <th className="cursor-pointer select-none px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground" onClick={() => handleSort("population")}>
                    Population <SortIcon col="population" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                  <th className="cursor-pointer select-none px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground" onClick={() => handleSort("area")}>
                    Area <SortIcon col="area" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Currency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Languages</th>
                  <th className="pl-4 pr-6 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border bg-card text-card-foreground">
                {paginated.map((country, idx) => (
                  <tr key={country.alpha3Code} className="hover:bg-muted/60 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                      {(currentPage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative h-5 w-8">
                        <Image
                          src={country.flags?.png ?? country.flag}
                          alt={`${country.name} flag`}
                          fill
                          className="object-cover rounded-sm shadow-sm"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-card-foreground">{country.name}</div>
                      {country.nativeName && country.nativeName !== country.name && (
                        <div className="text-xs text-muted-foreground">{country.nativeName}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex flex-col gap-0.5">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">{country.alpha2Code}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{country.alpha3Code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{country.capital || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{country.region || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{country.subregion || "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{formatNumber(country.population)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground whitespace-nowrap">{formatArea(country.area)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {country.currencies?.length
                        ? country.currencies.map((c, index) => (
                            <span key={`${c.code}-${index}`} title={c.name} className="mr-1 whitespace-nowrap">
                              {c.symbol} {c.code}
                            </span>
                          ))
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {country.languages?.slice(0, 3).map((l) => (
                          <span key={l.iso639_1 || l.iso639_2} title={l.nativeName} className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                            {l.name}
                          </span>
                        ))}
                        {(country.languages?.length ?? 0) > 3 && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            +{country.languages.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="pl-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/countries/${encodeURIComponent(country.name)}`}
                          aria-label={`View ${country.name}`}
                          className="rounded-md border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          aria-label={`Edit ${country.name}`}
                          className="rounded-md border border-primary/30 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                          onClick={() => setEditingCountry(country)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <EditCountryModal
            isOpen={!!editingCountry}
            country={editingCountry}
            onClose={() => setEditingCountry(null)}
            onSave={(updated) => console.log("Saved:", updated)}
          />

          {/* Pagination */}
          <div className="flex items-center justify-center gap-10 text-sm text-muted-foreground">
            <span>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, sorted.length)} of {sorted.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="rounded px-2 py-1 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">«</button>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="rounded px-2 py-1 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">‹</button>
              <span className="rounded bg-primary px-3 py-1 font-medium text-primary-foreground">{currentPage}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="rounded px-2 py-1 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">›</button>
              <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="rounded px-2 py-1 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">»</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

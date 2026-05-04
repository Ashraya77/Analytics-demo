"use client";

import Image from "next/image";
import Link from "next/link";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { SortKey } from "@/types/Countries";
import EditCountryModal from "./EditCountryModal";
import { useCountryTable } from "@/application/hooks/useCountryTable";
import { updateCountry } from "@/application/services/countryService";

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

const skeletonRows = Array.from({ length: 10 });

function CountryTableSkeleton() {
  return (
    <SkeletonTheme baseColor="var(--muted)" highlightColor="var(--secondary)" borderRadius={6}>
      <div className="overflow-x-auto rounded-xl border border-border" aria-label="Loading countries">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="w-10 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Flag</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Country</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Capital</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Subregion</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Population</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Area</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Currency</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Languages</th>
              <th className="pl-4 pr-6 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-card text-card-foreground">
            {skeletonRows.map((_, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3">
                  <Skeleton width={18} />
                </td>
                <td className="px-4 py-3">
                  <Skeleton width={32} height={20} />
                </td>
                <td className="px-4 py-3">
                  <Skeleton width={130} />
                  <Skeleton width={84} height={12} className="mt-1" />
                </td>
                <td className="px-4 py-3">
                  <div className="inline-flex flex-col gap-1">
                    <Skeleton width={34} height={18} />
                    <Skeleton width={40} height={18} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Skeleton width={86} />
                </td>
                <td className="px-4 py-3">
                  <Skeleton width={72} />
                </td>
                <td className="px-4 py-3">
                  <Skeleton width={98} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Skeleton width={84} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Skeleton width={76} />
                </td>
                <td className="px-4 py-3">
                  <Skeleton width={78} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Skeleton width={58} height={20} />
                    <Skeleton width={46} height={20} />
                  </div>
                </td>
                <td className="pl-4 pr-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton width={44} height={26} />
                    <Skeleton width={40} height={26} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-10 text-sm">
        <Skeleton width={120} />
        <div className="flex items-center gap-1">
          <Skeleton width={28} height={28} />
          <Skeleton width={28} height={28} />
          <Skeleton width={34} height={28} />
          <Skeleton width={28} height={28} />
          <Skeleton width={28} height={28} />
        </div>
      </div>
    </SkeletonTheme>
  );
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
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Global Countries
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Explore and manage demographic data across the globe.
          </p>
        </div>
      </div>
      
      <div className="w-full">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-card border border-border/50 rounded-2xl shadow-sm">
          <div className="relative flex-1 w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search countries, capitals, or codes..."
              value={searchInput}
              onChange={handleSearch}
              className="w-full pl-11 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
            />
          </div>

          <div className="hidden sm:block w-px h-6 bg-border/60" />

          <div className="relative w-full sm:w-48">
            <select
              value={regionFilter}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 bg-transparent border-none focus:ring-0 text-sm font-semibold text-foreground/80 cursor-pointer outline-none"
            >
              {regions.map((r) => (
                <option key={r} value={r} className="bg-popover text-popover-foreground">
                  {r === "All" ? "All Regions" : r}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div aria-busy="true">
          <CountryTableSkeleton />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && sorted.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm font-medium text-muted-foreground">No countries match your search parameters.</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && sorted.length > 0 && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card shadow-sm">
            <table className="min-w-full divide-y divide-border/50 text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="w-10 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">#</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Flag</th>
                  <th className="cursor-pointer select-none px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 hover:text-foreground transition-colors" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-2">
                      Country <SortIcon col="name" sortKey={sortKey} sortAsc={sortAsc} />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Code</th>
                  <th className="cursor-pointer select-none px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 hover:text-foreground transition-colors" onClick={() => handleSort("capital")}>
                    <div className="flex items-center gap-2">
                      Capital <SortIcon col="capital" sortKey={sortKey} sortAsc={sortAsc} />
                    </div>
                  </th>
                  <th className="cursor-pointer select-none px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 hover:text-foreground transition-colors" onClick={() => handleSort("region")}>
                    <div className="flex items-center gap-2">
                      Region <SortIcon col="region" sortKey={sortKey} sortAsc={sortAsc} />
                    </div>
                  </th>
                  <th className="cursor-pointer select-none px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 hover:text-foreground transition-colors" onClick={() => handleSort("population")}>
                    <div className="flex items-center gap-2 justify-end">
                      Population <SortIcon col="population" sortKey={sortKey} sortAsc={sortAsc} />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/40 bg-card">
                {paginated.map((country, idx) => (
                  <tr key={country.alpha3Code} className="group hover:bg-muted/40 transition-all duration-200">
                    <td className="px-6 py-4 text-muted-foreground/60 tabular-nums font-medium text-xs">
                      {(currentPage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative h-6 w-9 overflow-hidden rounded-sm shadow-sm border border-border/40">
                        <Image
                          src={country.flags?.png ?? country.flag}
                          alt={`${country.name} flag`}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground tracking-tight">{country.name}</div>
                      {country.nativeName && country.nativeName !== country.name && (
                        <div className="text-[10px] font-medium text-muted-foreground/60">{country.nativeName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground border border-border/40">
                        {country.alpha3Code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground/80">{country.capital || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-bold text-primary ring-1 ring-inset ring-primary/20">
                        {country.region || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums font-semibold text-foreground/80">{formatNumber(country.population)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/countries/${encodeURIComponent(country.name)}`}
                          className="rounded-lg border border-border bg-background px-3 py-1 text-[11px] font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          className="rounded-lg bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
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
            onSave={async (updated) => {
              await updateCountry(updated);
            }}
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
        </div>
      )}
    </div>
  );
}

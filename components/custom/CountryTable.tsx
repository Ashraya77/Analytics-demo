"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCountries } from "@/application/services/countryService";
import Image from "next/image";
import { Country, SortKey, SORT_KEYS } from "@/types/Countries";
import EditCountryModal from "./EditCountryModal";


// Helpers
function formatNumber(n?: number) {
  if (n == null) return "—";
  return new Intl.NumberFormat().format(n);
}

function formatArea(n?: number) {
  if (n == null) return "—";
  return `${new Intl.NumberFormat().format(n)} km²`;
}

function SortIcon({
  col,
  sortKey,
  sortAsc,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortAsc: boolean;
}) {
  if (sortKey !== col) return <span className="opacity-30"> ↕</span>;
  return <span className="text-primary">{sortAsc ? " ↑" : " ↓"}</span>;
}

function isSortKey(value: string | null): value is SortKey {
  return value !== null && SORT_KEYS.includes(value as SortKey);
}

function getPositivePage(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default function CountryTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const regionFilter = searchParams.get("region") ?? "All";
  const sort = searchParams.get("sort");

  const sortKey = isSortKey(sort) ? sort : "name";
  const sortAsc = searchParams.get("order") !== "desc";
  const page = getPositivePage(searchParams.get("page"));

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  const lastAppliedSearchRef = useRef(search);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCountries();
        const data: Country[] = Array.isArray(response)
          ? response
          : (response.data ?? []);
        setCountries(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load countries.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (lastAppliedSearchRef.current === search) return;

    lastAppliedSearchRef.current = search;
    const syncId = window.setTimeout(() => {
      setSearchInput(search);
    }, 0);

    return () => window.clearTimeout(syncId);
  }, [search]);

  const replaceQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });

      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (searchInput === search) return;

    const timeoutId = window.setTimeout(() => {
      lastAppliedSearchRef.current = searchInput;
      replaceQueryParams({
        search: searchInput || null,
        page: null,
      });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [replaceQueryParams, search, searchInput]);

  const regions = [
    "All",
    ...Array.from(
      new Set(countries.map((c) => c.region).filter(Boolean)),
    ).sort(),
  ];

  const filtered = countries.filter((c) => {
    const matchesSearch = [
      c.name,
      c.alpha2Code,
      c.alpha3Code,
      c.capital,
      c.subregion,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRegion = regionFilter === "All" || c.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    const cmp =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
    return sortAsc ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (page === currentPage) return;

    const syncPageId = window.setTimeout(() => {
      replaceQueryParams({
        page: currentPage > 1 ? String(currentPage) : null,
      });
    }, 0);

    return () => window.clearTimeout(syncPageId);
  }, [currentPage, page, replaceQueryParams]);

  const handleSort = (key: SortKey) => {
    const nextSortKey = key;
    const nextSortAsc = sortKey === key ? !sortAsc : true;

    replaceQueryParams({
      sort: nextSortKey === "name" ? null : nextSortKey,
      order: nextSortAsc ? null : "desc",
      page: null,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Section - Center Oriented */}
      <header className="mb-5 flex flex-col items-center text-center">

        {/* 1. Title & Meta Section */}
        <div className="space-y-2 mb-3">

          <h1 className="text-xl font-extrabold text-foreground tracking-tight sm:text-2xl">
            Global Countries
          </h1>

        </div>

        {/* 2. Unified Search & Filter Bar - Width Constrained */}
        <div className="w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-card border border-border rounded-2xl shadow-xl shadow-border/50">

            {/* Search Input Container */}
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

            {/* Vertical Divider (Hidden on mobile) */}
            <div className="hidden sm:block w-px h-8 bg-border" />

            {/* Region Dropdown */}
            <div className="relative w-full sm:w-48">
              <select
                value={regionFilter}
                onChange={(e) => {
                  replaceQueryParams({
                    region: e.target.value === "All" ? null : e.target.value,
                    page: null,
                  });
                }}
                className="w-full appearance-none pl-4 pr-10 py-3 bg-transparent border-none focus:ring-0 text-sm font-medium text-foreground cursor-pointer outline-none"
              >
                {regions.map((r) => (
                  <option key={r} value={r} className="bg-popover text-popover-foreground">{r === "All" ? "All Regions" : r}</option>
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
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
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
      {!loading && !error && filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No countries match your search.
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="w-10 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Flag
                  </th>
                  <th
                    className="cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("name")}
                  >
                    Country{" "}
                    <SortIcon col="name" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Code
                  </th>
                  <th
                    className="cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("capital")}
                  >
                    Capital
                    <SortIcon
                      col="capital"
                      sortKey={sortKey}
                      sortAsc={sortAsc}
                    />
                  </th>
                  <th
                    className="cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("region")}
                  >
                    Region{" "}
                    <SortIcon
                      col="region"
                      sortKey={sortKey}
                      sortAsc={sortAsc}
                    />
                  </th>
                  <th
                    className="cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("subregion")}
                  >
                    Subregion{" "}
                    <SortIcon
                      col="subregion"
                      sortKey={sortKey}
                      sortAsc={sortAsc}
                    />
                  </th>
                  <th
                    className="cursor-pointer select-none px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("population")}
                  >
                    Population{" "}
                    <SortIcon
                      col="population"
                      sortKey={sortKey}
                      sortAsc={sortAsc}
                    />
                  </th>
                  <th
                    className="cursor-pointer select-none px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("area")}
                  >
                    Area{" "}
                    <SortIcon col="area" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Currency
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Languages
                  </th>
                  <th className="pl-4 pr-12 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border bg-card text-card-foreground">
                {paginated.map((country, idx) => (
                  <tr
                    key={country.alpha3Code}
                    className="hover:bg-muted/60 transition-colors"
                  >
                    {/* # */}
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>

                    {/* Flag */}
                    {/* Flag */}
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

                    {/* Name + native name */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-card-foreground">
                        {country.name}
                      </div>
                      {country.nativeName &&
                        country.nativeName !== country.name && (
                          <div className="text-xs text-muted-foreground">
                            {country.nativeName}
                          </div>
                        )}
                    </td>

                    {/* Alpha codes */}
                    <td className="px-4 py-3">
                      <div className="inline-flex flex-col gap-0.5">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                          {country.alpha2Code}
                        </span>
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                          {country.alpha3Code}
                        </span>
                      </div>
                    </td>

                    {/* Capital */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {country.capital || "—"}
                    </td>

                    {/* Region */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {country.region || "—"}
                    </td>

                    {/* Subregion */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {country.subregion || "—"}
                    </td>

                    {/* Population */}
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {formatNumber(country.population)}
                    </td>

                    {/* Area */}
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground whitespace-nowrap">
                      {formatArea(country.area)}
                    </td>

                    {/* Currencies */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {country.currencies?.length
                        ? country.currencies.map((c, index) => (
                          <span
                            key={`${c.code}-${index}`}
                            title={c.name}
                            className="mr-1 whitespace-nowrap"
                          >
                            {c.symbol} {c.code}
                          </span>
                        ))
                        : "—"}
                    </td>

                    {/* Languages */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {country.languages?.slice(0, 3).map((l) => (
                          <span
                            key={l.iso639_1 || l.iso639_2}
                            title={l.nativeName}
                            className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground"
                          >
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

                    {/* Action */}
                    <td className="pl-4 pr-12 text-right">
                      <button
                        type="button"
                        aria-label={`Edit ${country.name}`}
                        className="rounded-md border border-primary/30 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                        onClick={() => setEditingCountry(country)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <EditCountryModal
              isOpen={!!editingCountry}
              country={editingCountry}
              onClose={() => setEditingCountry(null)}
              onSave={(updated) => {
                // update your local state or refetch
                console.log("Saved:", updated);
              }}
            />
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-center gap-10 text-sm text-muted-foreground">
            <span>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, sorted.length)} of{" "}
              {sorted.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => replaceQueryParams({ page: null })}
                disabled={currentPage === 1}
                className="rounded px-2 py-1 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                «
              </button>
              <button
                onClick={() =>
                  replaceQueryParams({
                    page: currentPage - 1 > 1 ? String(currentPage - 1) : null,
                  })
                }
                disabled={currentPage === 1}
                className="rounded px-2 py-1 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              <span className="rounded bg-primary px-3 py-1 font-medium text-primary-foreground">
                {currentPage}
              </span>
              <button
                onClick={() =>
                  replaceQueryParams({
                    page:
                      currentPage + 1 > 1 ? String(currentPage + 1) : null,
                  })
                }
                disabled={currentPage === totalPages}
                className="rounded px-2 py-1 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
              <button
                onClick={() =>
                  replaceQueryParams({
                    page: totalPages > 1 ? String(totalPages) : null,
                  })
                }
                disabled={currentPage === totalPages}
                className="rounded px-2 py-1 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                »
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

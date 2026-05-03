import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCountries } from "@/application/services/countryService";
import { Country, SortKey, SORT_KEYS } from "@/types/Countries";

function isSortKey(value: string | null): value is SortKey {
  return value !== null && SORT_KEYS.includes(value as SortKey);
}

function getPositivePage(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

const PAGE_SIZE = 10;

export function useCountryTable() {
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

  // Fetch countries on mount
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
        setError(err instanceof Error ? err.message : "Failed to load countries.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync searchInput when URL search param changes externally
  useEffect(() => {
    if (lastAppliedSearchRef.current === search) return;
    lastAppliedSearchRef.current = search;
    const id = window.setTimeout(() => setSearchInput(search), 0);
    return () => window.clearTimeout(id);
  }, [search]);

  const replaceQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      const nextQuery = params.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Debounced search → URL update
  useEffect(() => {
    if (searchInput === search) return;
    const id = window.setTimeout(() => {
      lastAppliedSearchRef.current = searchInput;
      replaceQueryParams({ search: searchInput || null, page: null });
    }, 300);
    return () => window.clearTimeout(id);
  }, [replaceQueryParams, search, searchInput]);

  // Derived data
  const regions = [
    "All",
    ...Array.from(new Set(countries.map((c) => c.region).filter(Boolean))).sort(),
  ];

  const filtered = countries.filter((c) => {
    const matchesSearch = [c.name, c.alpha2Code, c.alpha3Code, c.capital, c.subregion]
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
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Clamp page in URL if out of range
  useEffect(() => {
    if (page === currentPage) return;
    const id = window.setTimeout(() => {
      replaceQueryParams({ page: currentPage > 1 ? String(currentPage) : null });
    }, 0);
    return () => window.clearTimeout(id);
  }, [currentPage, page, replaceQueryParams]);

  const handleSort = (key: SortKey) => {
    replaceQueryParams({
      sort: key === "name" ? null : key,
      order: sortKey === key && sortAsc ? "desc" : null,
      page: null,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleRegionChange = (value: string) => {
    replaceQueryParams({ region: value === "All" ? null : value, page: null });
  };

  const handlePageChange = (newPage: number) => {
    replaceQueryParams({ page: newPage > 1 ? String(newPage) : null });
  };

  return {
    // Data
    countries,
    paginated,
    regions,
    sorted,

    // State
    loading, 
    error,
    searchInput,
    editingCountry,
    setEditingCountry,

    // Pagination
    currentPage,
    totalPages,
    PAGE_SIZE,

    // Params
    search,
    regionFilter,
    sortKey,
    sortAsc,

    // Handlers
    handleSort,
    handleSearch,
    handleRegionChange,
    handlePageChange,
  };
}
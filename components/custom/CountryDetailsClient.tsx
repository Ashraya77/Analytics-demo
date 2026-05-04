"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { getCountryByName } from "@/application/services/countryService";
import { Country } from "@/types/Countries";

function formatNumber(value?: number) {
  if (value == null) return "N/A";
  return new Intl.NumberFormat().format(value);
}

function firstCountry(data: unknown): Country | null {
  if (Array.isArray(data)) return (data[0] as Country | undefined) ?? null;
  if (data && typeof data === "object") return data as Country;
  return null;
}

function CountryDetailsSkeleton() {
  return (
    <SkeletonTheme baseColor="var(--muted)" highlightColor="var(--secondary)" borderRadius={6}>
      <div className="space-y-6" aria-busy="true" aria-label="Loading country details">
        <div className="inline-flex items-center gap-2">
          <Skeleton circle width={16} height={16} />
          <Skeleton width={72} />
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Skeleton width={176} height={112} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <Skeleton width={190} height={30} />
                <Skeleton width={120} className="mt-2" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Skeleton width={34} height={24} />
                  <Skeleton width={44} height={24} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-border bg-background px-4 py-3">
                  <Skeleton width={72} height={12} />
                  <Skeleton width={104} className="mt-2" />
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5 rounded-xl border border-border bg-card p-6 text-card-foreground">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>
                <Skeleton width={88} height={12} />
                <div className="mt-2 flex flex-wrap gap-2">
                  <Skeleton width={70} height={24} />
                  <Skeleton width={54} height={24} />
                  {index < 2 && <Skeleton width={64} height={24} />}
                </div>
              </div>
            ))}
          </aside>
        </section>
      </div>
    </SkeletonTheme>
  );
}

export default function CountryDetailsClient({ countryName }: { countryName: string }) {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCountry() {
      try {
        setLoading(true);
        setError(null);
        const response = await getCountryByName(countryName);
        const selectedCountry = firstCountry(response.data);

        if (!cancelled) {
          if (selectedCountry) setCountry(selectedCountry);
          else setError("Country not found.");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load country.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCountry();

    return () => {
      cancelled = true;
    };
  }, [countryName]);

  if (loading) {
    return <CountryDetailsSkeleton />;
  }

  if (error || !country) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/countries"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Countries
        </Link>
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error ?? "Country not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/countries"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Countries
      </Link>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={country.flags?.png ?? country.flag}
                alt={`${country.name} flag`}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {country.name}
              </h1>
              {country.nativeName && country.nativeName !== country.name && (
                <p className="mt-1 text-sm text-muted-foreground">{country.nativeName}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-muted px-2 py-1 font-mono font-semibold text-foreground">
                  {country.alpha2Code}
                </span>
                <span className="rounded bg-muted px-2 py-1 font-mono text-muted-foreground">
                  {country.alpha3Code}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Capital" value={country.capital || "N/A"} />
            <Detail label="Region" value={country.region || "N/A"} />
            <Detail label="Subregion" value={country.subregion || "N/A"} />
            <Detail label="Population" value={formatNumber(country.population)} />
            <Detail label="Area" value={`${formatNumber(country.area)} km2`} />
            <Detail label="Demonym" value={country.demonym || "N/A"} />
          </div>
        </div>

        <aside className="space-y-4 rounded-xl border border-border bg-card p-6 text-card-foreground">
          <InfoGroup
            label="Currencies"
            values={country.currencies?.map((currency) =>
              [currency.symbol, currency.code, currency.name].filter(Boolean).join(" ")
            )}
          />
          <InfoGroup
            label="Languages"
            values={country.languages?.map((language) => language.name)}
          />
          <InfoGroup label="Timezones" values={country.timezones} />
          <InfoGroup label="Calling Codes" values={country.callingCodes?.map((code) => `+${code}`)} />
          <InfoGroup label="Borders" values={country.borders} />
        </aside>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function InfoGroup({ label, values }: { label: string; values?: string[] }) {
  const visibleValues = values?.filter(Boolean) ?? [];

  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {visibleValues.length > 0 ? (
          visibleValues.map((value, index) => (
            <span key={`${value}-${index}`} className="rounded-full bg-accent px-2 py-1 text-xs text-accent-foreground">
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">N/A</span>
        )}
      </div>
    </div>
  );
}

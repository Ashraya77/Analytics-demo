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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/countries"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground/80 hover:text-primary transition-all group"
        >
          <div className="p-2 rounded-lg bg-background border border-border/50 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Countries
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Main Info Card */}
          <div className="rounded-3xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
                <div className="relative h-40 w-64 shrink-0 overflow-hidden rounded-2xl border border-border/40 shadow-md">
                  <Image
                    src={country.flags?.png ?? country.flag}
                    alt={`${country.name} flag`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-4">
                  <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                      {country.name}
                    </h1>
                    {country.nativeName && country.nativeName !== country.name && (
                      <p className="mt-1 text-lg font-medium text-muted-foreground/60">{country.nativeName}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20">
                      {country.region}
                    </span>
                    <span className="rounded-xl bg-muted/60 px-3 py-1 text-xs font-mono font-bold text-muted-foreground border border-border/40">
                      {country.alpha3Code}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Detail label="Capital" value={country.capital || "N/A"} icon="🏛️" />
                <Detail label="Subregion" value={country.subregion || "N/A"} icon="📍" />
                <Detail label="Population" value={formatNumber(country.population)} icon="👥" />
                <Detail label="Area" value={`${formatNumber(country.area)} km²`} icon="🌍" />
                <Detail label="Demonym" value={country.demonym || "N/A"} icon="🏷️" />
                <Detail label="Timezone" value={country.timezones?.[0] || "N/A"} icon="🕒" />
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-sm space-y-8">
            <InfoGroup
              label="Currencies"
              values={country.currencies?.map((currency) =>
                [currency.symbol, currency.code].filter(Boolean).join(" ")
              )}
            />
            <div className="h-px bg-border/40" />
            <InfoGroup
              label="Languages"
              values={country.languages?.map((language) => language.name)}
            />
            <div className="h-px bg-border/40" />
            <InfoGroup label="Calling Codes" values={country.callingCodes?.map((code) => `+${code}`)} />
            <div className="h-px bg-border/40" />
            <InfoGroup label="Neighboring Borders" values={country.borders} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-muted/30 p-5 space-y-2 group hover:bg-muted/50 transition-all">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
      </div>
      <p className="text-lg font-bold text-foreground tracking-tight">{value}</p>
    </div>
  );
}

function InfoGroup({ label, values }: { label: string; values?: string[] }) {
  const visibleValues = values?.filter(Boolean) ?? [];

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
      <div className="flex flex-wrap gap-2">
        {visibleValues.length > 0 ? (
          visibleValues.map((value, index) => (
            <span key={`${value}-${index}`} className="rounded-xl bg-background border border-border/50 px-3 py-1.5 text-xs font-bold text-foreground/80 shadow-sm">
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm font-medium text-muted-foreground/40 italic">Not Available</span>
        )}
      </div>
    </div>
  );
}

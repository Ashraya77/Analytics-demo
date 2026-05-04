"use client";

import { useEffect, useState } from "react";
import { Country } from "@/types/Countries";

interface EditCountryModalProps {
    country: Country | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updated: Country) => void | Promise<void>;
}
const REGIONS = [
    "Africa",
    "Americas",
    "Asia",
    "Europe",
    "Oceania",
    "Polar",
    "Antarctic",
];
export default function EditCountryModal({
    country,
    isOpen,
    onClose,
    onSave,
}: EditCountryModalProps) {
    const [form, setForm] = useState<Country | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        if (country) {
            setForm({ ...country });
            setSaveError(null);
        }
    }, [country]);

    if (!isOpen || !form) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => prev && { ...prev, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (form && !isSaving) {
            setIsSaving(true);
            setSaveError(null);
            try {
                await onSave(form);
                onClose();
            } catch (error) {
                setSaveError(error instanceof Error ? error.message : "Failed to save country.");
            } finally {
                setIsSaving(false);
            }
        }
    };

    // Derive display strings from nested objects
    const currencyDisplay = form.currencies?.length
        ? form.currencies.map((c) => `${c.symbol} ${c.code}`).join(", ")
        : "—";

    const languageDisplay = form.languages?.length
        ? form.languages.map((l) => l.name).join(", ")
        : "—";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 w-full max-w-lg shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            Edit country
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            Update country details below
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Country name" name="name" value={form.name ?? ""} onChange={handleChange} />
                        <Field label="Capital" name="capital" value={form.capital ?? ""} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="ISO code (alpha-2)" name="alpha2Code" value={form.alpha2Code ?? ""} onChange={handleChange} />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-neutral-500">Region</label>
                            <select
                                name="region"
                                value={form.region ?? ""}
                                onChange={(e) => setForm((prev) => prev && { ...prev, region: e.target.value })}
                                className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 text-neutral-900 dark:text-white"
                            >
                                {REGIONS.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>          </div>

                    {/* Read-only derived fields */}
                    <ReadOnlyField label="Currency" value={currencyDisplay} />
                    <ReadOnlyField label="Languages" value={languageDisplay} />
                    {saveError && (
                        <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
                    <button
                        onClick={onClose}
                        className="text-sm px-4 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-sm px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    name,
    value,
    onChange,
}: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-500">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
            />
        </div>
    );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-500">{label}</label>
            <div className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                {value}
            </div>
        </div>
    );
}

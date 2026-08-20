"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import { useCreateManada, useManadas } from "../hooks/use-manadas";
import { formatPackPlace } from "../lib/locations";
import { getApiErrorMessage } from "../services/get-api-error-message";
import type { ManadaView } from "../types/manada.types";
import { LocationFields, type LocationValue } from "./location-fields";

export function ManadaPicker({
  id,
  value,
  location,
  onChange,
  error,
}: {
  id: string;
  value: ManadaView | null;
  location: LocationValue;
  onChange: (next: ManadaView | null) => void;
  error?: string;
}) {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [draftLocation, setDraftLocation] = useState<LocationValue>(location);
  const rootRef = useRef<HTMLDivElement>(null);
  const manadas = useManadas({
    country: location.country,
    state: location.state,
    city: location.city,
  });
  const create = useCreateManada();

  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, []);

  useEffect(() => {
    if (!creating) {
      setDraftLocation(location);
    }
  }, [creating, location]);

  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const automatic = useMemo(
    () =>
      (manadas.data?.automatic ?? []).filter((item) =>
        matchesQuery(item, normalizedQuery),
      ),
    [manadas.data?.automatic, normalizedQuery],
  );
  const others = useMemo(
    () =>
      (manadas.data?.others ?? []).filter((item) =>
        matchesQuery(item, normalizedQuery),
      ),
    [manadas.data?.others, normalizedQuery],
  );

  const exactMatch = [...automatic, ...others].some(
    (item) => item.name.toLocaleLowerCase("pt-BR") === normalizedQuery,
  );
  const canCreate = query.trim().length >= 2 && !exactMatch;
  const hasLocation = Boolean(location.country && location.state && location.city);

  function selectPack(pack: ManadaView) {
    onChange(pack);
    setQuery("");
    setOpen(false);
    setCreating(false);
  }

  function handleCreate() {
    if (!canCreate) {
      return;
    }
    setDraftLocation({
      country: location.country || "BR",
      state: location.state,
      city: location.city,
    });
    setCreating(true);
  }

  function submitCreate() {
    create.mutate(
      {
        name: query.trim(),
        country: draftLocation.country,
        state: draftLocation.state,
        city: draftLocation.city,
      },
      {
        onSuccess: (pack) => {
          selectPack(pack);
        },
      },
    );
  }

  return (
    <div ref={rootRef} className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-paper">
        {t("register.pack")}
      </label>

      {value && !open && !creating ? (
        <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-background px-3 py-2">
          <div>
            <p className="text-sm font-medium text-paper">{value.name}</p>
            <p className="text-xs text-mist">{formatPackPlace(value)}</p>
          </div>
          <button
            type="button"
            className="text-sm text-flare-ink underline"
            onClick={() => {
              setOpen(true);
              setQuery("");
            }}
          >
            {t("register.packChange")}
          </button>
        </div>
      ) : (
        <Input
          id={id}
          role="combobox"
          aria-expanded={open}
          autoComplete="off"
          placeholder={t("register.packSearch")}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setCreating(false);
            if (value) {
              onChange(null);
            }
          }}
        />
      )}

      {open && !creating ? (
        <div className="overflow-hidden rounded-ctl border border-line bg-panel shadow-e2">
          {!hasLocation ? (
            <p className="px-3 py-2 text-sm text-mist">{t("register.packNeedLocation")}</p>
          ) : null}
          {manadas.isLoading ? (
            <p className="px-3 py-2 text-sm text-mist">{t("common.loading")}</p>
          ) : null}
          {manadas.isError ? (
            <p className="px-3 py-2 text-sm text-hard">{t("register.packLoadError")}</p>
          ) : null}

          <PackGroup title={t("register.packAutomatic")} items={automatic} onSelect={selectPack} />
          <PackGroup title={t("register.packOthers")} items={others} onSelect={selectPack} />

          {!manadas.isLoading && automatic.length === 0 && others.length === 0 && !canCreate ? (
            <p className="px-3 py-2 text-sm text-mist">{t("register.packEmpty")}</p>
          ) : null}

          {canCreate ? (
            <button
              type="button"
              className="block w-full border-t border-line px-3 py-2 text-left text-sm text-flare-ink hover:bg-background"
              onClick={handleCreate}
            >
              {t("register.packCreate", { name: query.trim() })}
            </button>
          ) : null}
        </div>
      ) : null}

      {creating ? (
        <div className="space-y-3 rounded-md border border-line bg-background p-3">
          <p className="text-sm font-medium text-paper">
            {t("register.packCreateTitle", { name: query.trim() })}
          </p>
          <LocationFields
            idPrefix={`${id}-create`}
            value={draftLocation}
            onChange={setDraftLocation}
          />
          {create.isError ? (
            <p className="text-sm text-hard">
              {locale === "pt-BR"
                ? getApiErrorMessage(create.error, t("register.packCreateError"))
                : t("register.packCreateError")}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button
              type="button"
              className="bg-panel text-paper hover:bg-panel/80"
              onClick={() => setCreating(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              disabled={
                create.isPending ||
                draftLocation.country.length < 2 ||
                draftLocation.state.trim().length < 2 ||
                draftLocation.city.trim().length < 2
              }
              onClick={submitCreate}
            >
              {create.isPending ? t("register.packCreating") : t("common.create")}
            </Button>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-hard">{error}</p> : null}
    </div>
  );
}

function PackGroup({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: ManadaView[];
  onSelect: (item: ManadaView) => void;
}) {
  if (items.length === 0) {
    return null;
  }
  return (
    <div>
      <p className="bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-mist">
        {title}
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={cn(
                "flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left hover:bg-background",
              )}
              onClick={() => onSelect(item)}
            >
              <span className="text-sm text-paper">{item.name}</span>
              <span className="text-xs text-mist">{formatPackPlace(item)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function matchesQuery(item: ManadaView, query: string): boolean {
  if (!query) {
    return true;
  }
  return `${item.name} ${item.city} ${item.state}`
    .toLocaleLowerCase("pt-BR")
    .includes(query);
}

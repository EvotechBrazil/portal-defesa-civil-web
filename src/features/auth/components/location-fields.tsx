"use client";

import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n-provider";
import { useBrazilCities, useBrazilStates } from "../hooks/use-location-options";
import { COUNTRY_OPTIONS } from "../lib/locations";

const selectClassName =
  "min-h-11 w-full rounded-ctl border border-line bg-background px-3 text-sm text-foreground outline-none";

export interface LocationValue {
  country: string;
  state: string;
  city: string;
}

export function LocationFields({
  idPrefix,
  value,
  onChange,
  errors,
}: {
  idPrefix: string;
  value: LocationValue;
  onChange: (next: LocationValue) => void;
  errors?: Partial<Record<"country" | "state" | "city", string>>;
}) {
  const { t } = useI18n();
  const isBrazil = value.country === "BR";
  const states = useBrazilStates(isBrazil);
  const cities = useBrazilCities(isBrazil && value.state ? value.state : undefined);
  const cityListId = `${idPrefix}-cities`;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field
        id={`${idPrefix}-country`}
        label={t("register.country")}
        error={errors?.country}
      >
        <select
          id={`${idPrefix}-country`}
          className={selectClassName}
          value={value.country}
          onChange={(event) =>
            onChange({ country: event.target.value, state: "", city: "" })
          }
        >
          {COUNTRY_OPTIONS.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={`${idPrefix}-state`}
        label={t("register.state")}
        error={errors?.state}
      >
        {isBrazil && (states.data?.length ?? 0) > 0 ? (
          <select
            id={`${idPrefix}-state`}
            className={selectClassName}
            value={value.state}
            onChange={(event) =>
              onChange({ ...value, state: event.target.value, city: "" })
            }
          >
            <option value="">{t("register.statePlaceholder")}</option>
            {states.data?.map((state) => (
              <option key={state.sigla} value={state.sigla}>
                {state.nome}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id={`${idPrefix}-state`}
            autoComplete="address-level1"
            placeholder={t("register.statePlaceholder")}
            value={value.state}
            onChange={(event) =>
              onChange({ ...value, state: event.target.value, city: "" })
            }
          />
        )}
      </Field>

      <Field
        id={`${idPrefix}-city`}
        label={t("register.city")}
        error={errors?.city}
      >
        {isBrazil && (cities.data?.length ?? 0) > 0 ? (
          <>
            <Input
              id={`${idPrefix}-city`}
              list={cityListId}
              autoComplete="address-level2"
              placeholder={t("register.cityPlaceholder")}
              value={value.city}
              onChange={(event) => onChange({ ...value, city: event.target.value })}
            />
            <datalist id={cityListId}>
              {(cities.data ?? []).map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </>
        ) : (
          <Input
            id={`${idPrefix}-city`}
            autoComplete="address-level2"
            placeholder={t("register.cityPlaceholder")}
            value={value.city}
            onChange={(event) => onChange({ ...value, city: event.target.value })}
          />
        )}
      </Field>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-paper">
        {label}
      </label>
      {children}
      {error ? <p className="text-sm text-hard">{error}</p> : null}
    </div>
  );
}

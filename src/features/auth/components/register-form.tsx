"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/i18n-provider";
import { useCheckWhatsapp } from "../hooks/use-check-whatsapp";
import { useRegister } from "../hooks/use-register";
import { useRequestAccess } from "../hooks/use-request-access";
import { fileToDataUrl, formatWhatsapp } from "../lib/whatsapp";
import {
  checkWhatsappSchema,
  registerSchema,
  requestAccessSchema,
  type CheckWhatsappFormValues,
  type RegisterFormValues,
  type RequestAccessFormValues,
} from "../schemas/register.schema";
import { getApiErrorMessage } from "../services/get-api-error-message";
import type { WhatsappCheckStatus } from "../types/auth.types";
import type { ManadaView } from "../types/manada.types";
import { LocationFields } from "./location-fields";
import { ManadaPicker } from "./manada-picker";

type Step = "gate" | "register" | "request" | "status";

const PHOTO_MAX_BYTES = 2 * 1024 * 1024;

export function RegisterForm() {
  const { locale, t } = useI18n();
  const [step, setStep] = useState<Step>("gate");
  const [status, setStatus] = useState<WhatsappCheckStatus | "REQUEST_SENT" | null>(
    null,
  );
  const [whatsapp, setWhatsapp] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [registerPack, setRegisterPack] = useState<ManadaView | null>(null);
  const [requestPack, setRequestPack] = useState<ManadaView | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const check = useCheckWhatsapp();
  const registerAccount = useRegister();
  const request = useRequestAccess();

  const gateForm = useForm<CheckWhatsappFormValues>({
    resolver: zodResolver(checkWhatsappSchema),
    defaultValues: { whatsapp: "" },
  });
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      lgndNumber: "",
      country: "BR",
      state: "",
      city: "",
      manadaId: "",
      squad: "",
      eventoFire: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    },
  });
  const requestForm = useForm<RequestAccessFormValues>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      name: "",
      lgndNumber: "",
      country: "BR",
      state: "",
      city: "",
      manadaId: "",
      email: "",
      confirmEmail: "",
      justification: "",
    },
  });

  function resetToGate() {
    setStep("gate");
    setStatus(null);
    setWhatsapp("");
    setPhotoFile(null);
    setPhotoError(null);
    setRegisterPack(null);
    setRequestPack(null);
    setShowPassword(false);
    gateForm.reset();
    registerForm.reset();
    requestForm.reset();
  }

  function handleCheck(values: CheckWhatsappFormValues) {
    check.mutate(values.whatsapp, {
      onSuccess: (result) => {
        setWhatsapp(result.whatsapp);
        setStatus(result.status);
        if (result.status === "ALLOWED") {
          setStep("register");
          return;
        }
        if (result.status === "NOT_ALLOWED" || result.status === "REJECTED") {
          setStep("gate");
          return;
        }
        setStep("status");
      },
    });
  }

  async function handleRegister(values: RegisterFormValues) {
    setPhotoError(null);
    if (!photoFile) {
      setPhotoError(t("register.photoRequired"));
      return;
    }
    if (photoFile.size > PHOTO_MAX_BYTES) {
      setPhotoError(t("register.photoMax"));
      return;
    }
    if (!/^image\/(jpeg|png|webp)$/.test(photoFile.type)) {
      setPhotoError(t("register.photoType"));
      return;
    }
    const photoBase64 = await fileToDataUrl(photoFile);
    registerAccount.mutate({
      whatsapp,
      name: values.name,
      lgndNumber: values.lgndNumber,
      manadaId: values.manadaId,
      country: values.country,
      state: values.state,
      city: values.city,
      squad: values.squad,
      eventoFire: values.eventoFire,
      email: values.email,
      password: values.password,
      photoBase64,
    });
  }

  function handleRequest(values: RequestAccessFormValues) {
    request.mutate(
      {
        whatsapp,
        name: values.name,
        lgndNumber: values.lgndNumber,
        manadaId: values.manadaId,
        country: values.country,
        state: values.state,
        city: values.city,
        email: values.email,
        justification: values.justification,
      },
      {
        onSuccess: () => {
          setStatus("REQUEST_SENT");
          setStep("status");
        },
      },
    );
  }

  const formatted = whatsapp ? formatWhatsapp(whatsapp) : "";
  const registerLocation = {
    country: registerForm.watch("country"),
    state: registerForm.watch("state"),
    city: registerForm.watch("city"),
  };
  const requestLocation = {
    country: requestForm.watch("country"),
    state: requestForm.watch("state"),
    city: requestForm.watch("city"),
  };

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-paper">{t("register.title")}</h1>
      <p className="mt-1 text-sm text-mist">{t("register.description")}</p>

      {step !== "gate" && formatted ? (
        <div className="mt-4 flex items-center justify-between rounded-md border border-line bg-background px-3 py-2 text-sm">
          <p>
            {t("register.whatsapp")}: <span className="font-medium text-paper">{formatted}</span>
          </p>
          <button
            type="button"
            className="text-flare underline"
            onClick={resetToGate}
          >
            {t("register.change")}
          </button>
        </div>
      ) : null}

      {step === "gate" ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={gateForm.handleSubmit(handleCheck)}
          noValidate
        >
          <div className="space-y-1">
            <label htmlFor="whatsapp" className="text-sm font-medium text-paper">
              {t("register.whatsapp")}
            </label>
            <Input
              id="whatsapp"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+55 43 99999-9999"
              {...gateForm.register("whatsapp")}
            />
            {gateForm.formState.errors.whatsapp ? (
              <p className="text-sm text-red-600">
                {t(gateForm.formState.errors.whatsapp.message ?? "")}
              </p>
            ) : null}
          </div>

          {check.isError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {locale === "pt-BR"
                ? getApiErrorMessage(check.error, t("register.checkError"))
                : t("register.checkError")}
            </p>
          ) : null}

          {status === "NOT_ALLOWED" ? (
            <div className="space-y-3 rounded-md border border-line bg-background px-3 py-3">
              <p className="text-sm text-mist">
                {t("register.notAllowed")}
              </p>
              <Button type="button" className="w-full" onClick={() => setStep("request")}>
                {t("register.requestAccess")}
              </Button>
            </div>
          ) : null}

          {status === "REJECTED" ? (
            <div className="space-y-3 rounded-md border border-line bg-background px-3 py-3">
              <p className="text-sm text-mist">
                {t("register.rejected")}
              </p>
              <Button type="button" className="w-full" onClick={() => setStep("request")}>
                {t("register.requestAgain")}
              </Button>
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={check.isPending}>
              {check.isPending ? t("register.checking") : t("register.continue")}
          </Button>
        </form>
      ) : null}

      {step === "register" ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={registerForm.handleSubmit((values) => {
            void handleRegister(values);
          })}
          noValidate
        >
          <Field
            id="name"
            label={t("auth.name")}
            error={registerForm.formState.errors.name?.message ? t(registerForm.formState.errors.name.message) : undefined}
          >
            <Input id="name" autoComplete="name" {...registerForm.register("name")} />
          </Field>
          <Field
            id="lgndNumber"
            label={t("register.lgndNumber")}
            error={registerForm.formState.errors.lgndNumber?.message ? t(registerForm.formState.errors.lgndNumber.message) : undefined}
          >
            <Input id="lgndNumber" {...registerForm.register("lgndNumber")} />
          </Field>
          <LocationFields
            idPrefix="register"
            value={registerLocation}
            onChange={(next) => {
              registerForm.setValue("country", next.country, { shouldValidate: true });
              registerForm.setValue("state", next.state, { shouldValidate: true });
              registerForm.setValue("city", next.city, { shouldValidate: true });
            }}
            errors={{
              country: registerForm.formState.errors.country?.message
                ? t(registerForm.formState.errors.country.message)
                : undefined,
              state: registerForm.formState.errors.state?.message
                ? t(registerForm.formState.errors.state.message)
                : undefined,
              city: registerForm.formState.errors.city?.message
                ? t(registerForm.formState.errors.city.message)
                : undefined,
            }}
          />
          <ManadaPicker
            id="manada"
            value={registerPack}
            location={registerLocation}
            onChange={(pack) => {
              setRegisterPack(pack);
              registerForm.setValue("manadaId", pack?.id ?? "", { shouldValidate: true });
            }}
            error={
              registerForm.formState.errors.manadaId?.message
                ? t(registerForm.formState.errors.manadaId.message)
                : undefined
            }
          />
          <Field
            id="squad"
            label={t("register.squad")}
            error={registerForm.formState.errors.squad?.message ? t(registerForm.formState.errors.squad.message) : undefined}
          >
            <Input id="squad" {...registerForm.register("squad")} />
          </Field>
          <Field
            id="eventoFire"
            label={t("register.fireEvent")}
            error={registerForm.formState.errors.eventoFire?.message ? t(registerForm.formState.errors.eventoFire.message) : undefined}
          >
            <Input
              id="eventoFire"
              placeholder={t("register.firePlaceholder")}
              {...registerForm.register("eventoFire")}
            />
          </Field>
          <div className="space-y-1">
            <label htmlFor="photo" className="text-sm font-medium text-paper">
              {t("register.photo")}
            </label>
            <Input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                setPhotoError(null);
                setPhotoFile(event.target.files?.[0] ?? null);
              }}
            />
            {photoError ? <p className="text-sm text-red-600">{photoError}</p> : null}
          </div>
          <Field
            id="email"
            label={t("auth.email")}
            error={registerForm.formState.errors.email?.message ? t(registerForm.formState.errors.email.message) : undefined}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              {...registerForm.register("email")}
            />
          </Field>
          <Field
            id="confirmEmail"
            label={t("auth.confirmEmail")}
            error={
              registerForm.formState.errors.confirmEmail?.message
                ? t(registerForm.formState.errors.confirmEmail.message)
                : undefined
            }
          >
            <Input
              id="confirmEmail"
              type="email"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              {...registerForm.register("confirmEmail")}
            />
          </Field>
          <Field
            id="password"
            label={t("auth.password")}
            error={registerForm.formState.errors.password?.message ? t(registerForm.formState.errors.password.message) : undefined}
          >
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...registerForm.register("password")}
            />
            <button
              type="button"
              className="text-sm font-medium text-flare underline"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
            </button>
          </Field>
          <Field
            id="confirmPassword"
            label={t("auth.confirmPassword")}
            error={
              registerForm.formState.errors.confirmPassword?.message
                ? t(registerForm.formState.errors.confirmPassword.message)
                : undefined
            }
          >
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...registerForm.register("confirmPassword")}
            />
          </Field>

          {registerAccount.isError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {locale === "pt-BR"
                ? getApiErrorMessage(registerAccount.error, t("auth.register.error"))
                : t("auth.register.error")}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={registerAccount.isPending}>
            {registerAccount.isPending ? t("auth.register.pending") : t("auth.createAccount")}
          </Button>
        </form>
      ) : null}

      {step === "request" ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={requestForm.handleSubmit(handleRequest)}
          noValidate
        >
          <Field
            id="request-name"
            label={t("auth.name")}
            error={requestForm.formState.errors.name?.message ? t(requestForm.formState.errors.name.message) : undefined}
          >
            <Input id="request-name" autoComplete="name" {...requestForm.register("name")} />
          </Field>
          <Field
            id="request-lgnd"
            label={t("register.requestLgnd")}
            error={requestForm.formState.errors.lgndNumber?.message ? t(requestForm.formState.errors.lgndNumber.message) : undefined}
          >
            <Input id="request-lgnd" {...requestForm.register("lgndNumber")} />
          </Field>
          <LocationFields
            idPrefix="request"
            value={requestLocation}
            onChange={(next) => {
              requestForm.setValue("country", next.country, { shouldValidate: true });
              requestForm.setValue("state", next.state, { shouldValidate: true });
              requestForm.setValue("city", next.city, { shouldValidate: true });
            }}
            errors={{
              country: requestForm.formState.errors.country?.message
                ? t(requestForm.formState.errors.country.message)
                : undefined,
              state: requestForm.formState.errors.state?.message
                ? t(requestForm.formState.errors.state.message)
                : undefined,
              city: requestForm.formState.errors.city?.message
                ? t(requestForm.formState.errors.city.message)
                : undefined,
            }}
          />
          <ManadaPicker
            id="request-manada"
            value={requestPack}
            location={requestLocation}
            onChange={(pack) => {
              setRequestPack(pack);
              requestForm.setValue("manadaId", pack?.id ?? "", { shouldValidate: true });
            }}
            error={
              requestForm.formState.errors.manadaId?.message
                ? t(requestForm.formState.errors.manadaId.message)
                : undefined
            }
          />
          <Field
            id="request-email"
            label={t("auth.email")}
            error={requestForm.formState.errors.email?.message ? t(requestForm.formState.errors.email.message) : undefined}
          >
            <Input
              id="request-email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              {...requestForm.register("email")}
            />
          </Field>
          <Field
            id="request-confirm-email"
            label={t("auth.confirmEmail")}
            error={
              requestForm.formState.errors.confirmEmail?.message
                ? t(requestForm.formState.errors.confirmEmail.message)
                : undefined
            }
          >
            <Input
              id="request-confirm-email"
              type="email"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              {...requestForm.register("confirmEmail")}
            />
          </Field>
          <div className="space-y-1">
            <label htmlFor="justification" className="text-sm font-medium text-paper">
              {t("register.justification")}
            </label>
            <Textarea
              id="justification"
              {...requestForm.register("justification")}
            />
            {requestForm.formState.errors.justification ? (
              <p className="text-sm text-red-600">
                {t(requestForm.formState.errors.justification.message ?? "")}
              </p>
            ) : null}
          </div>

          {request.isError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {locale === "pt-BR"
                ? getApiErrorMessage(request.error, t("register.requestError"))
                : t("register.requestError")}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={request.isPending}>
            {request.isPending ? t("register.sending") : t("register.sendRequest")}
          </Button>
        </form>
      ) : null}

      {step === "status" ? (
        <div className="mt-6 space-y-4">
          {status === "PENDING" ? (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {t("register.pending")}
            </p>
          ) : null}
          {status === "REGISTERED" ? (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {t("register.registered")}
            </p>
          ) : null}
          {status === "REQUEST_SENT" ? (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {t("register.requestSent")}
            </p>
          ) : null}
          {status === "REGISTERED" ? (
            <Link
              href="/login"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-md bg-flare px-4 py-2 text-sm font-medium text-white"
            >
              {t("auth.verify.goLogin")}
            </Link>
          ) : (
            <Button type="button" className="w-full" onClick={resetToGate}>
              {t("common.back")}
            </Button>
          )}
        </div>
      ) : null}

      <p className="mt-4 text-center text-sm text-mist">
        {t("auth.hasAccount")}{" "}
        <Link href="/login" className="font-medium text-flare underline">
          {t("auth.signIn.title")}
        </Link>
      </p>
    </Card>
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
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

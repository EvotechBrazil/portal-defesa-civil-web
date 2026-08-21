"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import { useCheckWhatsapp } from "../hooks/use-check-whatsapp";
import { useRegister } from "../hooks/use-register";
import { useRequestAccess } from "../hooks/use-request-access";
import { markOnboardingPending } from "../lib/onboarding";
import { digitsOf, fileToDataUrl, formatWhatsapp } from "../lib/whatsapp";
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
import { Field } from "./field";
import { LocationFields } from "./location-fields";
import { ManadaPicker } from "./manada-picker";
import { StepHeader } from "./step-header";

type Flow = "gate" | "result" | "register" | "request" | "sent";
type RegisterBlock = 1 | 2 | 3;

const PHOTO_MAX_BYTES = 2 * 1024 * 1024;

function passwordTone(password: string): "weak" | "ok" | "good" {
  if (password.length < 8) {
    return "weak";
  }
  if (password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password)) {
    return "good";
  }
  return "ok";
}

export function RegisterForm() {
  const { locale, t } = useI18n();
  const [flow, setFlow] = useState<Flow>("gate");
  const [registerBlock, setRegisterBlock] = useState<RegisterBlock>(1);
  const [status, setStatus] = useState<WhatsappCheckStatus | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoWarning, setPhotoWarning] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [registerPack, setRegisterPack] = useState<ManadaView | null>(null);
  const [requestPack, setRequestPack] = useState<ManadaView | null>(null);

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

  const password = registerForm.watch("password");
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

  function resetToGate() {
    setFlow("gate");
    setRegisterBlock(1);
    setStatus(null);
    setWhatsapp("");
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
    setPhotoWarning(false);
    setRegisterPack(null);
    setRequestPack(null);
    gateForm.reset();
    registerForm.reset();
    requestForm.reset();
  }

  function handleCheck(values: CheckWhatsappFormValues) {
    check.mutate(values.whatsapp, {
      onSuccess: (result) => {
        setWhatsapp(result.whatsapp);
        setStatus(result.status);
        setFlow(result.status === "ALLOWED" ? "result" : "result");
        if (result.status === "ALLOWED") {
          setRegisterBlock(1);
        }
      },
    });
  }

  async function goRegisterBlock(next: RegisterBlock) {
    if (registerBlock === 1) {
      const ok = await registerForm.trigger(["name", "country", "state", "city"]);
      if (!ok) {
        return;
      }
    }
    if (registerBlock === 2 && next === 3) {
      const ok = await registerForm.trigger(["lgndNumber", "manadaId", "squad", "eventoFire"]);
      if (!ok) {
        return;
      }
    }
    setRegisterBlock(next);
  }

  async function handleRegister(values: RegisterFormValues) {
    setPhotoError(null);
    if (photoFile) {
      if (photoFile.size > PHOTO_MAX_BYTES) {
        setPhotoError(t("register.photoMax"));
        return;
      }
      if (!/^image\/(jpeg|png|webp)$/.test(photoFile.type)) {
        setPhotoError(t("register.photoType"));
        return;
      }
    } else {
      setPhotoWarning(true);
    }
    const photoBase64 = photoFile ? await fileToDataUrl(photoFile) : undefined;
    registerAccount.mutate(
      {
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
      },
      { onSuccess: () => markOnboardingPending() },
    );
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
      { onSuccess: () => setFlow("sent") },
    );
  }

  function onPhotoChange(file: File | null) {
    setPhotoError(null);
    setPhotoWarning(false);
    setPhotoFile(file);
    if (!file) {
      setPhotoPreview(null);
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      setPhotoError(t("register.photoMax"));
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setPhotoError(t("register.photoType"));
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    void fileToDataUrl(file).then(setPhotoPreview);
  }

  const formatted = whatsapp ? formatWhatsapp(whatsapp) : "";
  const name = registerForm.watch("name");

  return (
    <Card>
      {flow === "gate" ? (
        <>
          <StepHeader current={1} total={3} eyebrow={t("signup.progress")} title={t("gate.title")} backLabel={t("common.back")} />
          <p className="mt-2 text-sm leading-relaxed text-mist">{t("gate.why")}</p>
          <form className="mt-6 space-y-4" onSubmit={gateForm.handleSubmit(handleCheck)} noValidate>
            <Field
              id="whatsapp"
              label={t("gate.field")}
              hint={t("gate.hint")}
              error={gateForm.formState.errors.whatsapp?.message ? t(gateForm.formState.errors.whatsapp.message) : undefined}
            >
              <Input
                id="whatsapp"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="5543999999999"
                value={gateForm.watch("whatsapp")}
                onChange={(event) => {
                  gateForm.setValue("whatsapp", digitsOf(event.target.value), {
                    shouldValidate: true,
                  });
                }}
              />
            </Field>
            {check.isError ? (
              <p className="rounded-ctl bg-hard-surf px-3 py-2 text-sm text-hard">
                {locale === "pt-BR"
                  ? getApiErrorMessage(check.error, t("register.checkError"))
                  : t("register.checkError")}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={check.isPending}>
              {check.isPending ? t("register.checking") : t("gate.submit")}
            </Button>
          </form>
          <p className="mt-4 text-sm text-mist">{t("gate.notOnList")}</p>
        </>
      ) : null}

      {flow === "result" && status ? (
        <GateResult
          status={status}
          formatted={formatted}
          onContinue={() => {
            if (status === "ALLOWED") {
              setFlow("register");
              return;
            }
            if (status === "NOT_ALLOWED" || status === "REJECTED") {
              setFlow("request");
              return;
            }
            resetToGate();
          }}
          onOtherNumber={resetToGate}
        />
      ) : null}

      {flow === "register" ? (
        <form
          className="space-y-4"
          onSubmit={registerForm.handleSubmit((values) => void handleRegister(values))}
          noValidate
        >
          <StepHeader
            current={registerBlock}
            total={3}
            eyebrow={t(`signup.block${registerBlock}`)}
            title={t(`signup.block${registerBlock}.title`)}
            onBack={() => {
              if (registerBlock === 1) {
                setFlow("result");
                return;
              }
              setRegisterBlock((current) => (current === 3 ? 2 : 1));
            }}
            backLabel={t("common.back")}
          />

          {registerBlock === 1 ? (
            <>
              <Field id="name" label={t("auth.name")} error={err(registerForm, "name", t)}>
                <Input id="name" autoComplete="name" {...registerForm.register("name")} />
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
                  country: err(registerForm, "country", t),
                  state: err(registerForm, "state", t),
                  city: err(registerForm, "city", t),
                }}
              />
              <p className="text-xs text-mist">{t("signup.remaining")}</p>
              <Button type="button" className="w-full" onClick={() => void goRegisterBlock(2)}>
                {t("register.continue")}
              </Button>
            </>
          ) : null}

          {registerBlock === 2 ? (
            <>
              <ManadaPicker
                id="manada"
                value={registerPack}
                location={registerLocation}
                onChange={(pack) => {
                  setRegisterPack(pack);
                  registerForm.setValue("manadaId", pack?.id ?? "", { shouldValidate: true });
                }}
                error={err(registerForm, "manadaId", t)}
              />
              <Field id="lgndNumber" label={t("register.lgndNumber")} hint={t("signup.lgndHint")} error={err(registerForm, "lgndNumber", t)}>
                <Input id="lgndNumber" {...registerForm.register("lgndNumber")} />
              </Field>
              <Field id="squad" label={t("register.squad")} error={err(registerForm, "squad", t)}>
                <Input id="squad" {...registerForm.register("squad")} />
              </Field>
              <Field id="eventoFire" label={t("register.fireEvent")} hint={t("signup.fireHint")} error={err(registerForm, "eventoFire", t)}>
                <Input id="eventoFire" placeholder={t("register.firePlaceholder")} {...registerForm.register("eventoFire")} />
              </Field>
              <Button type="button" className="w-full" onClick={() => void goRegisterBlock(3)}>
                {t("register.continue")}
              </Button>
            </>
          ) : null}

          {registerBlock === 3 ? (
            <>
              <Field id="email" label={t("auth.email")} hint={t("signup.emailHint")} error={err(registerForm, "email", t)}>
                <Input id="email" type="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" {...registerForm.register("email")} />
              </Field>
              <Field id="confirmEmail" label={t("auth.confirmEmail")} error={err(registerForm, "confirmEmail", t)}>
                <Input id="confirmEmail" type="email" autoComplete="off" autoCapitalize="none" autoCorrect="off" {...registerForm.register("confirmEmail")} />
              </Field>
              <Field id="password" label={t("auth.password")} error={err(registerForm, "password", t)}>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  showLabel={t("auth.showPassword")}
                  hideLabel={t("auth.hidePassword")}
                  {...registerForm.register("password")}
                />
              </Field>
              <Field id="confirmPassword" label={t("auth.confirmPassword")} error={err(registerForm, "confirmPassword", t)}>
                <PasswordInput
                  id="confirmPassword"
                  autoComplete="new-password"
                  showLabel={t("auth.showPassword")}
                  hideLabel={t("auth.hidePassword")}
                  {...registerForm.register("confirmPassword")}
                />
              </Field>
              {password ? (
                <PasswordMeter tone={passwordTone(password)} label={t(`signup.password.${passwordTone(password)}`)} />
              ) : null}
              <div className="space-y-2 rounded-ctl border border-line bg-inset/40 p-3">
                <p className="text-sm font-medium text-paper">{t("register.photo")}</p>
                <p className="text-xs text-mist">{t("signup.photo.optional")}</p>
                <div className="flex items-center gap-3">
                  <Avatar name={name || "MC"} src={photoPreview} size={44} />
                  <label className="inline-flex min-h-11 cursor-pointer items-center rounded-ctl border border-line bg-panel px-3 text-sm text-paper">
                    {t("signup.photo.choose")}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(event) => onPhotoChange(event.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
                {photoError ? <p className="text-sm text-hard">{photoError}</p> : null}
                {photoWarning ? <p className="text-sm text-learn">{t("signup.photo.none")}</p> : null}
              </div>
              <p className="text-xs text-mist">{t("signup.terms")}</p>
              {registerAccount.isError ? (
                <p className="rounded-ctl bg-hard-surf px-3 py-2 text-sm text-hard">
                  {locale === "pt-BR"
                    ? getApiErrorMessage(registerAccount.error, t("auth.register.error"))
                    : t("auth.register.error")}
                </p>
              ) : null}
              <Button type="submit" className="w-full" disabled={registerAccount.isPending}>
                {registerAccount.isPending ? t("auth.register.pending") : t("auth.createAccount")}
              </Button>
            </>
          ) : null}
        </form>
      ) : null}

      {flow === "request" ? (
        <form className="space-y-4" onSubmit={requestForm.handleSubmit(handleRequest)} noValidate>
          <StepHeader
            current={2}
            total={3}
            eyebrow={t("request.form")}
            title={t("register.requestAccess")}
            onBack={resetToGate}
            backLabel={t("common.back")}
          />
          <p className="text-sm text-mist">{t("request.intro")}</p>
          <Field id="request-name" label={t("auth.name")} error={err(requestForm, "name", t)}>
            <Input id="request-name" autoComplete="name" {...requestForm.register("name")} />
          </Field>
          <Field id="request-lgnd" label={t("register.requestLgnd")} error={err(requestForm, "lgndNumber", t)}>
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
              country: err(requestForm, "country", t),
              state: err(requestForm, "state", t),
              city: err(requestForm, "city", t),
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
            error={err(requestForm, "manadaId", t)}
          />
          <Field id="request-email" label={t("auth.email")} error={err(requestForm, "email", t)}>
            <Input id="request-email" type="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" {...requestForm.register("email")} />
          </Field>
          <Field id="request-confirm-email" label={t("auth.confirmEmail")} error={err(requestForm, "confirmEmail", t)}>
            <Input id="request-confirm-email" type="email" autoComplete="off" autoCapitalize="none" autoCorrect="off" {...requestForm.register("confirmEmail")} />
          </Field>
          <Field id="justification" label={t("register.justification")} error={err(requestForm, "justification", t)}>
            <Textarea id="justification" {...requestForm.register("justification")} />
          </Field>
          {request.isError ? (
            <p className="rounded-ctl bg-hard-surf px-3 py-2 text-sm text-hard">
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

      {flow === "sent" ? (
        <EmptyState
          title={t("request.sentTitle")}
          actions={
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center rounded-ctl bg-primary px-4 text-sm font-medium text-primary-ink"
            >
              {t("auth.signIn.title")}
            </Link>
          }
        >
          {t("request.sentBody")}
        </EmptyState>
      ) : null}

      <p className="mt-4 text-center text-sm text-mist">
        {t("auth.hasAccount")}{" "}
        <Link href="/login" className="font-medium text-flare-ink underline">
          {t("auth.signIn.title")}
        </Link>
      </p>
    </Card>
  );
}

function err(
  form: { formState: { errors: Record<string, { message?: string } | undefined> } },
  key: string,
  t: (key: string) => string,
): string | undefined {
  const message = form.formState.errors[key]?.message;
  return message ? t(message) : undefined;
}

function GateResult({
  status,
  formatted,
  onContinue,
  onOtherNumber,
}: {
  status: WhatsappCheckStatus;
  formatted: string;
  onContinue: () => void;
  onOtherNumber: () => void;
}) {
  const { t } = useI18n();
  if (status === "ALLOWED") {
    return (
      <EmptyState
        title={t("gate.result.allowed.title")}
        actions={
          <Button type="button" className="w-full" onClick={onContinue}>
            {t("gate.result.allowed.cta")}
          </Button>
        }
      >
        {t("gate.result.allowed.body")}
        {formatted ? <p className="mt-2 font-medium text-paper">{formatted}</p> : null}
      </EmptyState>
    );
  }
  if (status === "NOT_ALLOWED") {
    return (
      <EmptyState
        tone="learn"
        title={t("gate.result.notAllowed.title")}
        actions={
          <>
            <Button type="button" onClick={onContinue}>
              {t("register.requestAccess")}
            </Button>
            <Button type="button" className="bg-inset text-paper hover:bg-inset" onClick={onOtherNumber}>
              {t("gate.tryOther")}
            </Button>
          </>
        }
      >
        {t("gate.result.notAllowed.body")}
      </EmptyState>
    );
  }
  if (status === "PENDING") {
    return (
      <EmptyState tone="learn" title={t("gate.result.pending.title")} actions={<Button type="button" onClick={onOtherNumber}>{t("common.back")}</Button>}>
        {t("gate.result.pending.body")}
      </EmptyState>
    );
  }
  if (status === "REJECTED") {
    return (
      <EmptyState
        tone="hard"
        title={t("gate.result.rejected.title")}
        actions={
          <>
            <Button type="button" onClick={onContinue}>
              {t("register.requestAgain")}
            </Button>
            <Button type="button" className="bg-inset text-paper hover:bg-inset" onClick={onOtherNumber}>
              {t("gate.tryOther")}
            </Button>
          </>
        }
      >
        {t("gate.result.rejected.body")}
      </EmptyState>
    );
  }
  return (
    <EmptyState
      title={t("gate.result.registered.title")}
      actions={
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-ctl bg-primary px-4 text-sm font-medium text-primary-ink"
        >
          {t("auth.verify.goLogin")}
        </Link>
      }
    >
      {t("gate.result.registered.body")}
    </EmptyState>
  );
}

function PasswordMeter({ tone, label }: { tone: "weak" | "ok" | "good"; label: string }) {
  const width = tone === "weak" ? "33%" : tone === "ok" ? "66%" : "100%";
  const color = tone === "weak" ? "bg-hard" : tone === "ok" ? "bg-learn" : "bg-ok";
  return (
    <div>
      <div className="h-1 overflow-hidden rounded-full bg-inset" aria-hidden>
        <div className={cn("h-full", color)} style={{ width }} />
      </div>
      <p className="mt-1 text-xs text-mist">{label}</p>
    </div>
  );
}

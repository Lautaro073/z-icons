"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginForm } from "@/features/auth";
import { useFormDraft } from "@/hooks/useFormDraft";
import { Link, useRouter } from "@/i18n/navigation";

const initialLoginFormData = {
  email: "",
  password: "",
  twoFactorCode: "",
  requires2FA: false,
};

export default function LoginPage() {
  const auth = useTranslations("auth");
  const common = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData, clearLoginDraft] = useFormDraft("auth:login:draft", initialLoginFormData);
  const handledSessionFeedback = useRef(false);

  const loginForm = useLoginForm({
    formData,
    setFormData,
    clearLoginDraft,
    login,
    onSuccess: (role) => {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/icons");
      }
    },
  });

  useEffect(() => {
    if (handledSessionFeedback.current) {
      return;
    }

    const session = searchParams.get("session");

    if (session === "expired") {
      handledSessionFeedback.current = true;
      toast.info(auth("errors.sessionExpired"));
      router.replace("/auth/login");
    }
  }, [auth, router, searchParams]);

  return (
    <form onSubmit={loginForm.handleSubmit} className="flex flex-col gap-8">
      <div className="space-y-3">
        <h1 className="ui-display-title text-4xl leading-none sm:text-5xl">
          {auth("screens.signIn.title")}
        </h1>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">{common("fields.email")}</span>
          <Input
            type="email"
            placeholder={common("fields.email")}
            value={loginForm.formData.email}
            required
            disabled={loginForm.isLoading}
            autoComplete="email"
            aria-invalid={Boolean(loginForm.formError)}
            className={loginForm.formError ? "border-destructive/70 focus-visible:border-destructive" : undefined}
            onChange={(e) => {
              loginForm.setFormData((current) => ({
                ...current,
                email: e.target.value,
                requires2FA: false,
                twoFactorCode: "",
              }));
              if (loginForm.formError) {
                loginForm.clearFormError();
              }
            }}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">{common("fields.password")}</span>
          <Input
            type="password"
            placeholder={common("fields.password")}
            value={loginForm.formData.password}
            required
            disabled={loginForm.isLoading}
            autoComplete="current-password"
            aria-invalid={Boolean(loginForm.formError)}
            className={loginForm.formError ? "border-destructive/70 focus-visible:border-destructive" : undefined}
            onChange={(e) => {
              loginForm.setFormData((current) => ({
                ...current,
                password: e.target.value,
                requires2FA: false,
                twoFactorCode: "",
              }));
              if (loginForm.formError) {
                loginForm.clearFormError();
              }
            }}
          />
        </label>

        {loginForm.formError && (
          <p
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {loginForm.formError}
          </p>
        )}

        {loginForm.requires2FA && (
          <div className="rounded-[1.4rem] border border-primary/18 bg-primary/8 p-4">
            <p className="ui-section-header tracking-[0.22em]!">{auth("actions.enter2FA")}</p>
            <label className="mt-3 grid gap-2">
              <span className="text-sm font-medium text-foreground">{auth("twoFactor.code")}</span>
              <Input
                type="text"
                inputMode="numeric"
                placeholder={auth("twoFactor.placeholder")}
                value={loginForm.formData.twoFactorCode}
                onChange={(e) => loginForm.setFormData((current) => ({ ...current, twoFactorCode: e.target.value }))}
                maxLength={6}
                disabled={loginForm.isLoading}
              />
            </label>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Button type="submit" className="w-full rounded-full" size="lg" disabled={loginForm.isLoading}>
          {loginForm.isLoading ? auth("actions.signingIn") : auth("actions.signIn")}
        </Button>

        <p className="text-center text-sm leading-6 text-muted-foreground">
          <Link href="/auth/forgot-password" className="font-medium text-foreground hover:underline">
            {auth("actions.forgotPassword")}
          </Link>
        </p>

        <p className="text-center text-sm leading-6 text-muted-foreground">
          {auth("screens.signIn.noAccount")}{" "}
          <Link href="/auth/signup" className="font-medium text-foreground hover:underline">
            {auth("actions.signUp")}
          </Link>
        </p>
      </div>
    </form>
  );
}

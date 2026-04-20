"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  initialForgotPasswordDraft,
  type ForgotPasswordDraft,
  useForgotPasswordForm,
} from "@/features/auth/index";
import { useFormDraft } from "@/hooks/useFormDraft";
import { useLocale } from "@/hooks/useLocale";
import { Link, useRouter } from "@/i18n/navigation";
import {
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  verifyPasswordResetOtp,
} from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const auth = useTranslations("auth");
  const common = useTranslations("common");
  const router = useRouter();
  const { currentLocale } = useLocale();

  const [draft, setDraft, clearDraft] = useFormDraft<ForgotPasswordDraft>(
    "auth:forgot-password:draft",
    initialForgotPasswordDraft
  );

  const forgotPasswordForm = useForgotPasswordForm({
    draft,
    setDraft,
    clearDraft,
    currentLocale,
    requestPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPasswordWithOtp,
    onSuccess: () => router.push("/auth/login"),
  });

  return (
    <form
      onSubmit={
        forgotPasswordForm.draft.step === "request"
          ? forgotPasswordForm.onRequestOtp
          : forgotPasswordForm.draft.step === "verify"
            ? forgotPasswordForm.onVerifyOtp
            : forgotPasswordForm.onResetPassword
      }
      className="flex flex-col gap-8"
    >
      <div className="space-y-3">
        <h1 className="ui-display-title text-4xl leading-none sm:text-5xl">
          {auth("forgotPassword.title")}
        </h1>
        <p className="ui-copy max-w-xl">{auth("forgotPassword.subtitle")}</p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">{common("fields.email")}</span>
          <Input
            type="email"
            placeholder={common("fields.email")}
            value={forgotPasswordForm.draft.email}
            onChange={(e) =>
              forgotPasswordForm.setDraft((current) => ({
                ...current,
                email: e.target.value,
                step: current.step === "request" ? current.step : "request",
                otp: "",
                newPassword: "",
                confirmPassword: "",
              }))
            }
            required
            disabled={forgotPasswordForm.isLoading}
            autoComplete="email"
          />
        </label>

        {forgotPasswordForm.draft.step !== "request" && (
          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">{auth("forgotPassword.otpLabel")}</span>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder={auth("forgotPassword.otpPlaceholder")}
              value={forgotPasswordForm.draft.otp}
              onChange={(e) => forgotPasswordForm.setDraft((current) => ({ ...current, otp: e.target.value }))}
              required
              disabled={forgotPasswordForm.isLoading || forgotPasswordForm.draft.step === "reset"}
            />
          </label>
        )}

        {forgotPasswordForm.draft.step === "reset" && (
          <>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-foreground">{auth("forgotPassword.newPasswordLabel")}</span>
              <Input
                type="password"
                placeholder={auth("forgotPassword.newPasswordLabel")}
                value={forgotPasswordForm.draft.newPassword}
                onChange={(e) => {
                  forgotPasswordForm.setDraft((current) => ({ ...current, newPassword: e.target.value }));
                }}
                required
                minLength={6}
                disabled={forgotPasswordForm.isLoading}
                autoComplete="new-password"
                aria-invalid={Boolean(forgotPasswordForm.resetError)}
                className={forgotPasswordForm.resetError ? "border-destructive/70 focus-visible:border-destructive" : undefined}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-foreground">{auth("forgotPassword.confirmNewPasswordLabel")}</span>
              <Input
                type="password"
                placeholder={auth("forgotPassword.confirmNewPasswordLabel")}
                value={forgotPasswordForm.draft.confirmPassword}
                onChange={(e) => {
                  forgotPasswordForm.setDraft((current) => ({ ...current, confirmPassword: e.target.value }));
                }}
                required
                minLength={6}
                disabled={forgotPasswordForm.isLoading}
                autoComplete="new-password"
                aria-invalid={Boolean(forgotPasswordForm.resetError)}
                className={forgotPasswordForm.resetError ? "border-destructive/70 focus-visible:border-destructive" : undefined}
              />
            </label>

            {forgotPasswordForm.resetError && (
              <p
                role="alert"
                className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {forgotPasswordForm.resetError}
              </p>
            )}
          </>
        )}
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full rounded-full"
          size="lg"
          disabled={forgotPasswordForm.isLoading || (forgotPasswordForm.draft.step === "verify" && !forgotPasswordForm.canVerifyOtp)}
        >
          {forgotPasswordForm.isLoading
            ? forgotPasswordForm.draft.step === "request"
              ? auth("actions.sendingOtp")
              : forgotPasswordForm.draft.step === "verify"
                ? auth("actions.verifyingOtp")
                : auth("actions.resettingPassword")
            : forgotPasswordForm.draft.step === "request"
              ? auth("actions.sendOtp")
              : forgotPasswordForm.draft.step === "verify"
                ? auth("actions.verifyOtp")
                : auth("actions.resetPassword")}
        </Button>


        <p className="text-center text-sm leading-6 text-muted-foreground">
          <Link href="/auth/login" className="font-medium text-foreground hover:underline">
            {auth("actions.backToLogin")}
          </Link>
        </p>
      </div>
    </form>
  );
}

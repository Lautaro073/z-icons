"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import type { Locale } from "@/i18n/routing";
import type {
  ForgotPasswordDraft,
  ForgotPasswordDraftSetter,
  RequestPasswordResetOtpAction,
  VerifyPasswordResetOtpAction,
  ResetPasswordWithOtpAction,
  ForgotPasswordSuccessHandler,
} from "@/types/auth";

export const initialForgotPasswordDraft: ForgotPasswordDraft = {
  step: "request",
  email: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
};

export function useForgotPasswordForm({
  draft,
  setDraft,
  clearDraft,
  currentLocale,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPasswordWithOtp,
  onSuccess,
}: {
  draft: ForgotPasswordDraft;
  setDraft: ForgotPasswordDraftSetter;
  clearDraft: () => void;
  currentLocale: Locale;
  requestPasswordResetOtp: RequestPasswordResetOtpAction;
  verifyPasswordResetOtp: VerifyPasswordResetOtpAction;
  resetPasswordWithOtp: ResetPasswordWithOtpAction;
  onSuccess: ForgotPasswordSuccessHandler;
}) {
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const canVerifyOtp = draft.otp.trim().length === 6;

  const normalizeOtpError = (message: string) => {
    if (message === "Invalid or expired OTP") {
      return t("errors.invalidOrExpiredOtp");
    }

    return message || t("errors.otpVerifyFailed");
  };

  const onRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setResetError(null);
    setIsLoading(true);

    try {
      await requestPasswordResetOtp(draft.email.trim(), currentLocale);
      toast.success(t("success.otpSent"));
      setDraft((current) => ({ ...current, step: "verify" }));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || t("errors.passwordResetRequestFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setResetError(null);

    if (!draft.otp.trim()) {
      toast.error(t("errors.otpRequired"));
      return;
    }

    if (draft.otp.trim().length !== 6) {
      toast.error(t("errors.otpLength"));
      return;
    }

    setIsLoading(true);

    try {
      await verifyPasswordResetOtp(draft.email.trim(), draft.otp.trim(), currentLocale);
      toast.success(t("success.otpVerified"));
      setDraft((current) => ({ ...current, step: "reset" }));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(normalizeOtpError(error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setResetError(null);

    if (draft.newPassword.length < 6) {
      const message = t("errors.passwordTooShort");
      setResetError(message);
      toast.error(message);
      return;
    }

    if (draft.newPassword !== draft.confirmPassword) {
      const message = t("errors.passwordMismatch");
      setResetError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordWithOtp(
        draft.email.trim(),
        draft.otp.trim(),
        draft.newPassword,
        draft.confirmPassword,
        currentLocale
      );
      clearDraft();
      toast.success(t("success.passwordResetSuccess"));
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || t("errors.passwordResetFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    draft,
    setDraft,
    clearDraft,
    isLoading,
    resetError,
    canVerifyOtp,
    onRequestOtp,
    onVerifyOtp,
    onResetPassword,
  };
}

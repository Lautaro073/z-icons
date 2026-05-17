"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import type {
  LoginFormData,
  LoginFormSetter,
  LoginAction,
  AuthLoginSuccessHandler,
} from "@/types/auth";

export function useLoginForm({
  formData,
  setFormData,
  clearLoginDraft,
  login,
  onSuccess,
}: {
  formData: LoginFormData;
  setFormData: LoginFormSetter;
  clearLoginDraft: () => void;
  login: LoginAction;
  onSuccess: AuthLoginSuccessHandler;
}) {
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com)$/i;
    if (!emailRegex.test(formData.email)) {
      const message = t("errors.invalidEmailProvider");
      setFormError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);

    try {
      const loggedUser = await login(
        formData.email,
        formData.password,
        formData.twoFactorCode || undefined
      );

      clearLoginDraft();
      toast.success(t("success.loginSuccess"));
      onSuccess(loggedUser.role_name);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "2FA_REQUIRED") {
          setFormData((current) => ({ ...current, requires2FA: true }));
          setFormError(null);
          toast.info(t("actions.enter2FA"));
        } else {
          const normalizedMessage =
            error.message === "Invalid credentials"
              ? t("errors.invalidCredentials")
              : error.message || t("errors.loginFailed");

          setFormError(normalizedMessage);
          toast.error(normalizedMessage);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearFormError = () => setFormError(null);

  return {
    formData,
    setFormData,
    clearLoginDraft,
    isLoading,
    formError,
    clearFormError,
    requires2FA: formData.requires2FA,
    handleSubmit,
  };
}

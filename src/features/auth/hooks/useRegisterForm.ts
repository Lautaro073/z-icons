"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import type {
  RegisterFormData,
  RegisterFieldError,
  RegisterFormSetter,
  RegisterAction,
  RegisterSuccessHandler,
} from "@/types/auth";

export function useRegisterForm({
  formData,
  setFormData,
  clearRegisterDraft,
  register,
  onSuccess,
}: {
  formData: RegisterFormData;
  setFormData: RegisterFormSetter;
  clearRegisterDraft: () => void;
  register: RegisterAction;
  onSuccess: RegisterSuccessHandler;
}) {
  const t = useTranslations("auth");
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldError>({});
  const [isLoading, setIsLoading] = useState(false);

  const mapRegisterError = (message: string): RegisterFieldError => {
    const normalized = message.toLowerCase();

    if (
      normalized.includes("username") &&
      (normalized.includes("exist") || normalized.includes("used") || normalized.includes("taken") || normalized.includes("duplicate"))
    ) {
      return { username: t("errors.usernameTaken"), form: t("errors.usernameTaken") };
    }

    if (
      normalized.includes("email") &&
      (normalized.includes("exist") || normalized.includes("used") || normalized.includes("taken") || normalized.includes("registered") || normalized.includes("duplicate"))
    ) {
      return { email: t("errors.emailTaken"), form: t("errors.emailTaken") };
    }

    return { form: message || t("errors.registerFailed") };
  };

  const clearFieldError = (field: keyof Omit<RegisterFieldError, "form">) => {
    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      const message = t("errors.passwordMismatch");
      setFieldErrors({ password: message, confirmPassword: message, form: message });
      toast.error(message);
      return;
    }

    if (formData.password.length < 6) {
      const message = t("errors.passwordTooShort");
      setFieldErrors({ password: message, form: message });
      toast.error(message);
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.username, formData.email, formData.password, formData.confirmPassword);
      clearRegisterDraft();
      toast.success(t("success.registerSuccess"));
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        const nextErrors = mapRegisterError(error.message || t("errors.registerFailed"));
        setFieldErrors(nextErrors);
        toast.error(nextErrors.form || t("errors.registerFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    clearRegisterDraft,
    fieldErrors,
    isLoading,
    handleSubmit,
    clearFieldError,
  };
}

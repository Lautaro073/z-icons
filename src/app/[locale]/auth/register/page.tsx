"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRegisterForm, useRegisterForm, type RegisterFormData } from "@/features/auth";
import { useFormDraft } from "@/hooks/useFormDraft";
import { useRouter } from "@/i18n/navigation";

const initialRegisterFormData: RegisterFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData, clearRegisterDraft] = useFormDraft("auth:register:draft", initialRegisterFormData);

  const registerForm = useRegisterForm({
    formData,
    setFormData,
    clearRegisterDraft,
    register,
    onSuccess: () => router.push("/icons"),
  });

  return (
    <AuthRegisterForm
      headerText={t("actions.signUp")}
      title={t("register.title")}
      subtitle={t("register.subtitle")}
      hasAccountText={t("register.haveAccount")}
      loginHref="/auth/login"
      loginText={t("actions.signIn")}
      registerForm={registerForm}
    />
  );
}

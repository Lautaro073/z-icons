"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRegisterForm, useRegisterForm, type RegisterFormData } from "@/features/auth";
import { useFormDraft } from "@/hooks/useFormDraft";
import { useRouter } from "@/i18n/navigation";

const initialSignupFormData: RegisterFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData, clearSignupDraft] = useFormDraft("auth:signup:draft", initialSignupFormData);

  const registerForm = useRegisterForm({
    formData,
    setFormData,
    clearRegisterDraft: clearSignupDraft,
    register,
    onSuccess: () => router.push("/icons"),
  });

  return (
    <AuthRegisterForm
      title={t("screens.signUp.title")}
      subtitle={t("screens.signUp.subtitle")}
      hasAccountText={t("screens.signUp.hasAccount")}
      loginHref="/auth/login"
      loginText={t("actions.signIn")}
      registerForm={registerForm}
    />
  );
}

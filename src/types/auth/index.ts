export interface LoginFormData {
  email: string;
  password: string;
  twoFactorCode: string;
  requires2FA: boolean;
}

export type LoginFormSetter = React.Dispatch<React.SetStateAction<LoginFormData>>;
export type LoginAction = (
  email: string,
  password: string,
  twoFactorCode?: string
) => Promise<{ role_name: "admin" | "user" | "pro" }>;
export type AuthLoginSuccessHandler = (role: "admin" | "user" | "pro") => void;

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type RegisterFieldError = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

export type RegisterFormSetter = React.Dispatch<React.SetStateAction<RegisterFormData>>;
export type RegisterAction = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) => Promise<void>;
export type RegisterSuccessHandler = () => void;

export type ForgotPasswordStep = "request" | "verify" | "reset";

export interface ForgotPasswordDraft {
  step: ForgotPasswordStep;
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

import type { Locale } from "@/i18n/routing";
import type { PasswordResetOtpVerifyResponse } from "@/lib/api/backend";

export type ForgotPasswordDraftSetter = React.Dispatch<React.SetStateAction<ForgotPasswordDraft>>;
export type RequestPasswordResetOtpAction = (email: string, locale: Locale) => Promise<void>;
export type VerifyPasswordResetOtpAction = (email: string, otp: string, locale: Locale) => Promise<PasswordResetOtpVerifyResponse>;
export type ResetPasswordWithOtpAction = (
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string,
  locale: Locale
) => Promise<void>;
export type ForgotPasswordSuccessHandler = () => void;

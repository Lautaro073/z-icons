"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RegisterFormData, RegisterFieldError } from "@/types/auth";

interface AuthRegisterFormProps {
    headerText?: string;
    title: string;
    subtitle: string;
    hasAccountText: string;
    loginHref: string;
    loginText: string;
    registerForm: {
        formData: RegisterFormData;
        fieldErrors: RegisterFieldError;
        isLoading: boolean;
        handleSubmit: (event: React.FormEvent) => void;
        setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
        clearFieldError: (field: keyof Omit<RegisterFieldError, "form">) => void;
    };
}

export function AuthRegisterForm({
    headerText,
    title,
    subtitle,
    hasAccountText,
    loginHref,
    loginText,
    registerForm,
}: AuthRegisterFormProps) {
    const common = useTranslations("common");
    const t = useTranslations("auth");

    return (
        <form onSubmit={registerForm.handleSubmit} className="flex flex-col gap-8">
            <div className="space-y-3">
                {headerText ? <p className="ui-section-header">{headerText}</p> : null}
                <h1 className="ui-display-title text-4xl leading-none sm:text-5xl">{title}</h1>
                <p className="ui-copy max-w-xl">{subtitle}</p>
            </div>

            <div className="grid gap-4">
                <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">{common("fields.username")}</span>
                    <Input
                        type="text"
                        placeholder={common("fields.username")}
                        value={registerForm.formData.username}
                        onChange={(e) => {
                            registerForm.setFormData({ ...registerForm.formData, username: e.target.value });
                            registerForm.clearFieldError("username");
                        }}
                        required
                        disabled={registerForm.isLoading}
                        aria-invalid={Boolean(registerForm.fieldErrors.username)}
                        className={registerForm.fieldErrors.username ? "border-destructive/70 focus-visible:border-destructive" : undefined}
                    />
                    {registerForm.fieldErrors.username && <p className="text-sm text-destructive">{registerForm.fieldErrors.username}</p>}
                </label>

                <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">{common("fields.email")}</span>
                    <Input
                        type="email"
                        placeholder={common("fields.email")}
                        value={registerForm.formData.email}
                        onChange={(e) => {
                            registerForm.setFormData({ ...registerForm.formData, email: e.target.value });
                            registerForm.clearFieldError("email");
                        }}
                        required
                        disabled={registerForm.isLoading}
                        aria-invalid={Boolean(registerForm.fieldErrors.email)}
                        className={registerForm.fieldErrors.email ? "border-destructive/70 focus-visible:border-destructive" : undefined}
                    />
                    {registerForm.fieldErrors.email && <p className="text-sm text-destructive">{registerForm.fieldErrors.email}</p>}
                </label>

                <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">{common("fields.password")}</span>
                    <Input
                        type="password"
                        placeholder={common("fields.password")}
                        value={registerForm.formData.password}
                        onChange={(e) => {
                            registerForm.setFormData({ ...registerForm.formData, password: e.target.value });
                            registerForm.clearFieldError("password");
                        }}
                        required
                        minLength={6}
                        disabled={registerForm.isLoading}
                        aria-invalid={Boolean(registerForm.fieldErrors.password)}
                        className={registerForm.fieldErrors.password ? "border-destructive/70 focus-visible:border-destructive" : undefined}
                    />
                    {registerForm.fieldErrors.password && <p className="text-sm text-destructive">{registerForm.fieldErrors.password}</p>}
                </label>

                <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">{common("fields.confirmPassword")}</span>
                    <Input
                        type="password"
                        placeholder={common("fields.confirmPassword")}
                        value={registerForm.formData.confirmPassword}
                        onChange={(e) => {
                            registerForm.setFormData({ ...registerForm.formData, confirmPassword: e.target.value });
                            registerForm.clearFieldError("confirmPassword");
                        }}
                        required
                        minLength={6}
                        disabled={registerForm.isLoading}
                        aria-invalid={Boolean(registerForm.fieldErrors.confirmPassword)}
                        className={registerForm.fieldErrors.confirmPassword ? "border-destructive/70 focus-visible:border-destructive" : undefined}
                    />
                    {registerForm.fieldErrors.confirmPassword && <p className="text-sm text-destructive">{registerForm.fieldErrors.confirmPassword}</p>}
                </label>
            </div>

            <div className="space-y-4">
                <Button type="submit" className="w-full rounded-full" size="lg" disabled={registerForm.isLoading}>
                    {registerForm.isLoading ? t("actions.signingUp") : t("actions.signUp")}
                </Button>

                <p className="text-center text-sm leading-6 text-muted-foreground">
                    {hasAccountText}{" "}
                    <a href={loginHref} className="font-medium text-foreground hover:underline">
                        {loginText}
                    </a>
                </p>
            </div>
        </form>
    );
}

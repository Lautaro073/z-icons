"use client";

import { ZIcon } from "@zcorvus/z-icons/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PlanType = "pro" | "enterprise";

export type PremiumPlan = {
    id: PlanType;
    price: string;
    badge: string;
    summary: string;
    features: string[];
    featured: boolean;
};

interface PremiumPlanCardProps {
    plan: PremiumPlan;
    isLoading: boolean;
    onCheckout: (planType: PlanType) => void;
    t: ReturnType<typeof useTranslations>;
}

export const PremiumPlanCard = ({ plan, isLoading, onCheckout, t }: PremiumPlanCardProps) => {
    const planIsLoading = isLoading && plan.featured;

    return (
        <article
            className={cn(
                "ui-surface-panel relative flex h-full flex-col rounded-4xl p-6 sm:p-8",
                plan.featured
                    ? "border-primary/30 bg-[color-mix(in_oklab,var(--primary)_12%,var(--card))]"
                    : "bg-card/90"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                    <span className="inline-flex rounded-full bg-background/82 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                        {t(plan.badge)}
                    </span>
                    <div>
                        <h2 className="text-3xl tracking-tight text-foreground sm:text-4xl">
                            {t(`plans.${plan.id}.name`)}
                        </h2>
                        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                            {plan.summary}
                        </p>
                    </div>
                </div>
                <span
                    className={cn(
                        "inline-flex size-11 items-center justify-center rounded-full",
                        plan.featured
                            ? "bg-primary/12 text-primary"
                            : "bg-amber-500/12 text-amber-600 dark:text-amber-300"
                    )}
                >
                    <ZIcon type="mina" name="star" className="size-5" />
                </span>
            </div>

            <div className="mt-8 flex items-end gap-3 border-b border-border/60 pb-6">
                <span className="font-display text-5xl leading-none tracking-tight sm:text-6xl">{plan.price}</span>
                <span className="pb-1 text-sm uppercase tracking-[0.28em] text-muted-foreground">
                    {t("plans.billing")}
                </span>
            </div>

            <ul className="mt-6 flex flex-1 flex-col gap-3" role="list">
                {plan.features.map((feature) => (
                    <li key={feature} className="rounded-[1.35rem] border border-border/60 bg-background/58 p-4">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-300">
                                <ZIcon type="mina" name="check" className="size-4" />
                            </span>
                            <span className="text-sm leading-6 text-foreground/88">{t(feature)}</span>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-8 space-y-3">
                <Button
                    onClick={() => onCheckout(plan.id)}
                    disabled={isLoading}
                    className="w-full rounded-full"
                    size="lg"
                    variant={plan.featured ? "default" : "secondary"}
                >
                    {planIsLoading ? t("processing") : t(`plans.${plan.id}.cta`)}
                </Button>
                <p className="text-center text-xs leading-5 text-muted-foreground">
                    {t("guarantee")}
                </p>
            </div>
        </article>
    );
};

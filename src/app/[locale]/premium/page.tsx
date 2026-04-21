"use client";

import { ZIcon } from "@zcorvus/z-icons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "@/i18n/navigation";
import { createCheckoutSession } from "@/lib/api/backend";
import { PremiumPlanCard } from "./PremiumPlanCard";
import { plans } from "./premiumPlans";

type PlanType = "pro" | "enterprise";

export default function PremiumPage() {
  const t = useTranslations("premium");
  const router = useRouter();
  const { currentLocale } = useLocale();
  const { isAuthenticated } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);

  const handleCheckout = async (planType: PlanType) => {
    setLoadingPlan(planType);

    try {
      if (!isAuthenticated) {
        toast.error(t("errors.notAuthenticated"));
        router.push("/auth/login");
        return;
      }

      const data = await createCheckoutSession(planType, currentLocale);

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("errors.checkoutFailed")
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="ui-page-shell py-2">
      <section className="ui-surface-panel-muted rounded-4xl p-6 sm:p-8 lg:p-10">
        <div className="mt-2 max-w-4xl space-y-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/icons")}
            className="group h-auto justify-start rounded-none px-0 py-0 text-left transition-opacity duration-200 hover:bg-transparent hover:opacity-100"
            aria-label={t("backToIcons")}
          >
            <div className="flex items-start gap-4 sm:gap-5">
              <ZIcon
                type="mina"
                name="arrow-left"
                className="mt-3 size-5 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-x-0.5 group-hover:text-foreground"
              />
              <div className="space-y-4">
                <h1 className="ui-display-title text-foreground/92 transition-colors duration-200 group-hover:text-foreground text-4xl leading-[0.94] sm:text-5xl lg:text-6xl">
                  {t("title")}
                </h1>
                <p className="ui-section-header transition-colors duration-200 group-hover:text-foreground/82">
                  {t("backToIcons")}
                </p>
              </div>
            </div>
          </Button>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {plans.map((plan) => {
          const isLoading = loadingPlan === plan.id;

          return (
            <PremiumPlanCard
              key={plan.id}
              plan={plan}
              isLoading={isLoading}
              onCheckout={handleCheckout}
              t={t}
            />
          );
        })}
      </section>
    </div>
  );
}

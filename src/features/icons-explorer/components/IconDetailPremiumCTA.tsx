"use client";

import { Crown, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function IconDetailPremiumCTA() {
  const t = useTranslations("common.icons.premiumLocked");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent p-5 sm:p-6 backdrop-blur-sm flex flex-col items-center text-center gap-4 shadow-lg shadow-amber-500/5">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      
      <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-background shadow-lg shadow-amber-500/20 relative">
        <Crown className="size-6 fill-current" />
        <div className="absolute -bottom-1 -right-1 size-5 bg-background rounded-full border border-amber-500/30 flex items-center justify-center shadow-sm">
          <Lock className="size-2.5 text-amber-500 fill-current" />
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold tracking-tight bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent">
          {t("title")}
        </h3>
        <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
          {t("description")}
        </p>
      </div>

      <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium shadow-md transition-all hover:scale-[1.02] hover:shadow-amber-500/20 active:scale-[0.98] h-10 rounded-xl border-none">
        <Link href="/premium" className="flex items-center gap-2">
          <Crown className="size-4" />
          <span>{t("cta")}</span>
        </Link>
      </Button>
    </div>
  );
}

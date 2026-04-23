"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useRouter, usePathname } from "@/i18n/navigation";

interface PremiumGuardProps {
  children: React.ReactNode;
  requiredForTypes?: string[];
}

export function PremiumGuard({
  children,
  requiredForTypes = ["premium", "fa-solid", "fa-regular"],
}: PremiumGuardProps) {
  const { hasAccess, isLoading } = usePremiumAccess();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPremiumRoute = requiredForTypes.some((type) => pathname.includes(`/icons/${type}`));

    if (!isPremiumRoute || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (!hasAccess) {
      router.replace("/premium");
    }
  }, [hasAccess, isAuthenticated, isLoading, pathname, requiredForTypes, router]);

  if (isLoading) {
    return (
      <div className="grid gap-5">
        <section className="ui-surface-panel-muted rounded-4xl px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3 max-w-full">
              <Skeleton className="h-11 w-28 rounded-[1.25rem]" />
              <Skeleton className="h-14 w-72 rounded-2xl" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
            <div className="w-full max-w-[720px] space-y-3">
              <Skeleton className="h-12 w-full rounded-full" />
              <div className="flex justify-end">
                <Skeleton className="h-11 w-36 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="ui-surface-panel min-h-144 rounded-4xl p-3 sm:p-4">
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))" }}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}

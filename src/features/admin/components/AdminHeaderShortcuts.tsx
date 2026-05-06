"use client";

import { ZIcon } from "@zcorvus/z-icons/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@/i18n/navigation";

export function AdminHeaderShortcuts() {
  const { user, isLoading } = useAuth();
  const admin = useTranslations("admin");

  if (isLoading || !user || user.role_name !== "admin") {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 mr-1">
      <Button asChild variant="outline" size="sm" className="hidden sm:flex rounded-full gap-2 px-4 border-border/40 bg-card/40 backdrop-blur-md hover:bg-card/80">
        <Link href="/admin?tab=users">
          <ZIcon type="mina" name="users" className="size-3.5" />
          <span className="text-[11px] font-medium tracking-wide uppercase">{admin("tabs.users")}</span>
        </Link>
      </Button>
      <Button asChild variant="outline" size="sm" className="hidden sm:flex rounded-full gap-2 px-4 border-border/40 bg-card/40 backdrop-blur-md hover:bg-card/80">
        <Link href="/admin?tab=stats">
          <ZIcon type="mina" name="activity" className="size-3.5" />
          <span className="text-[11px] font-medium tracking-wide uppercase">{admin("tabs.stats")}</span>
        </Link>
      </Button>

      {/* Mobile versions with just icons */}
      <Button asChild variant="outline" size="icon-sm" className="flex sm:hidden rounded-full border-border/40 bg-card/40 backdrop-blur-md">
        <Link href="/admin?tab=users" aria-label={admin("tabs.users")}>
          <ZIcon type="mina" name="users" className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="icon-sm" className="flex sm:hidden rounded-full border-border/40 bg-card/40 backdrop-blur-md">
        <Link href="/admin?tab=stats" aria-label={admin("tabs.stats")}>
          <ZIcon type="mina" name="activity" className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

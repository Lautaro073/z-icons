import { ZIcon } from "@zcorvus/z-icons/react";
import { Link } from "@/i18n/navigation";
import { AdminAppearanceControls } from "./AdminAppearanceControls";

interface DashboardHeroProps {
    admin: (key: string) => string;
    common: (key: string) => string;
    activeTab: "users" | "stats" | "icons";
}

export function AdminDashboardHero({ admin, common, activeTab }: DashboardHeroProps) {
    return (
        <section className="ui-surface-panel-muted rounded-4xl p-5 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-160 ease-out hover:text-foreground"
                    >
                        <ZIcon
                            type="mina"
                            name="arrow-left"
                            className="size-3.5 -translate-y-px text-muted-foreground transition-transform duration-160 ease-out group-hover:-translate-x-0.5 group-hover:text-foreground"
                        />
                        <span>{common("actions.goHome")}</span>
                    </Link>

                    <h1 className="mt-2 text-[clamp(2.3rem,4.8vw,3.6rem)] leading-[0.95] tracking-tight text-foreground">
                        {admin(activeTab === "icons" ? "iconsTitle" : activeTab === "stats" ? "statsTitle" : "title")}
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                        {admin(activeTab === "icons" ? "iconsDescription" : activeTab === "stats" ? "statsDescription" : "description")}
                    </p>
                </div>

                <AdminAppearanceControls />
            </div>
        </section>
    );
}

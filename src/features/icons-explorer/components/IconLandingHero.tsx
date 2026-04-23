import { ZIcon } from "@zcorvus/z-icons/react";
import { Link } from "@/i18n/navigation";

interface IconLandingHeroProps {
  home: (key: string) => string;
  common: (key: string) => string;
}

export const IconLandingHero = ({ home, common }: IconLandingHeroProps) => (
  <section className="ui-surface-panel-muted rounded-4xl p-5 sm:p-6 lg:p-8">
    <Link
      href="/"
      className="inline-flex items-start gap-4 rounded-[1.4rem] p-2 transition-transform duration-180 ease-out hover:bg-background/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ viewTransitionName: "title" }}
    >
      <span className="grid size-12 place-items-center">
        <ZIcon
          type="mina"
          name="arrow-left"
          className="size-5 text-muted-foreground"
        />
      </span>
      <div className="space-y-3">
        <div>
          <h1 className="ui-display-title text-[clamp(2.1rem,4.8vw,4rem)] leading-[0.94]">
            {home("tagline.line1")}
          </h1>
          <p className="text-[clamp(1.7rem,4vw,3.4rem)] leading-[0.96] tracking-tight text-foreground/82">
            {home("tagline.line2")}
          </p>
        </div>
        <p className="ui-section-header">{common("icons.library")}</p>
      </div>
    </Link>
  </section>
);

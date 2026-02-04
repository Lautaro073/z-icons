"use server";
import { IconCategories, IconCategoriesInfo } from "@/features/icons-explorer";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function IconsLocalePage() {
  const locale = await getLocale();
  const home = await getTranslations('home');

  return (
    <div className="flex flex-col gap-12 px-6 py-6 my-10">
      <Link href={`/${locale}`} className="absolute top-0 left-0 bg-background pr-4 pb-10" style={{ viewTransitionName: "title" }}>
        <h1 className="leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>{home("tagline.line1")}</h1>
        <p className="leading-2" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>{home("tagline.line2")}</p>
      </Link>
      <section className="flex flex-col gap-4">
        <Link href={`/${locale}/icons/local/all`} style={{ viewTransitionName: "title-type" }} className="text-muted-foreground hover:text-foreground transition-colors duration-300">LOCAL / ALL</Link>
        <ul className="flex flex-wrap gap-4">
          {IconCategories.local.map((set) => {
            const { label, subLabel } = IconCategoriesInfo[set];

            return (
              <li key={set} className="bg-secondary rounded-lg px-6 py-6 w-full max-w-[450px]">
                <Link href={`/${locale}/icons/local/${set}`} className="flex gap-1">
                  <span className="text-4xl capitalize text-secondary-foreground">{label}</span>
                  <span className="text-4xl capitalize text-muted-foreground">{subLabel}</span>
                </Link>
                <p className="text-muted-foreground">Classic icons specialized for organizations</p>
              </li>
            )
          })}
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <Link href={`/${locale}/icons/external/all`} className="text-muted-foreground hover:text-foreground transition-colors duration-300">EXTERNAL / ALL</Link>

        <ul className="flex flex-wrap gap-4">
          {IconCategories.external.map((set) => {
            const { label, subLabel } = IconCategoriesInfo[set];

            return (
              <li key={set} className="bg-secondary rounded-lg px-6 py-6 w-full max-w-[450px]">
                <Link href={`/${locale}/icons/external/${set}`} className="flex gap-1">
                  <span className="text-4xl capitalize text-secondary-foreground">{label}</span>
                  <span className="text-4xl capitalize text-muted-foreground">{subLabel}</span>
                </Link>
                <p className="text-muted-foreground">Praveen Juge Icons License MIT</p>
              </li>
            )
          })}
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <Link href={`/${locale}/icons/premium/all`} className="text-muted-foreground hover:text-foreground transition-colors duration-300">PREMIUM / ALL</Link>

        <ul className="flex flex-wrap gap-4">
          {IconCategories.premium.map((set) => {
            const { label, subLabel } = IconCategoriesInfo[set];

            return (
              <li key={set} className="bg-secondary rounded-lg px-6 py-6 w-full max-w-[450px]">
                <Link href={`/${locale}/icons/premium/${set}`} className="flex gap-1">
                  <span className="text-4xl capitalize text-secondary-foreground">{label}</span>
                  <span className="text-4xl capitalize text-muted-foreground">{subLabel}</span>
                </Link>
                <p className="text-muted-foreground">Font Awesome Premium Icons</p>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  );
}
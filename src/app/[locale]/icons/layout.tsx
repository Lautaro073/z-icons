import { IconsLayoutDecoration } from "@/features/icons-explorer";
import { AppearanceSwitcher } from "@/components/controllers/AppearanceSwitcher";

interface IconsLayoutProps {
  children: React.ReactNode;
}

export default function IconsLayout({ children }: IconsLayoutProps) {
  return (
    <div className="relative h-full px-1 sm:px-2 md:px-4">
      <div className="relative h-full overflow-auto rounded-4xl">
        <IconsLayoutDecoration />
        <div className="mx-auto flex h-full w-full max-w-[1540px] flex-col px-3 py-4 sm:px-5 sm:py-6 md:px-8 md:py-8">
          {children}
        </div>
        <AppearanceSwitcher />
      </div>
    </div>
  );
}

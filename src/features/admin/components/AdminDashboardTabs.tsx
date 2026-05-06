"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

type AdminTab = "users" | "stats";

interface AdminDashboardTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  labels: { users: string; stats: string };
  usersContent: React.ReactNode;
  statsContent: React.ReactNode;
}

export function AdminDashboardTabs({
  activeTab,
  onTabChange,
  labels,
  usersContent,
  statsContent,
}: AdminDashboardTabsProps) {
  return (
    <TabsPrimitive.Root
      value={activeTab}
      onValueChange={(value) => onTabChange(value as AdminTab)}
    >
      <TabsPrimitive.List
        className="ui-surface-panel flex w-full items-center gap-1 rounded-2xl p-1"
        aria-label="Admin dashboard sections"
      >
        <TabsPrimitive.Trigger
          value="users"
          className="relative flex-1 cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-160 ease-out hover:text-foreground data-[state=active]:bg-background/80 data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          {labels.users}
        </TabsPrimitive.Trigger>

        <TabsPrimitive.Trigger
          value="stats"
          className="relative flex-1 cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-160 ease-out hover:text-foreground data-[state=active]:bg-background/80 data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          {labels.stats}
        </TabsPrimitive.Trigger>
      </TabsPrimitive.List>

      <TabsPrimitive.Content
        value="users"
        className="mt-6 flex flex-col gap-6 outline-none data-[state=inactive]:hidden"
      >
        {usersContent}
      </TabsPrimitive.Content>

      <TabsPrimitive.Content
        value="stats"
        className="mt-6 outline-none data-[state=inactive]:hidden"
      >
        {statsContent}
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
  );
}

export type { AdminTab };

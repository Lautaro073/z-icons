type AdminTablesPlaceholderProps = {
  type: "loading" | "error" | "empty";
  isPlanFilterEnabled: boolean;
  admin: (key: string) => string;
};

export function AdminTablesPlaceholder({
  type,
  isPlanFilterEnabled,
  admin,
}: AdminTablesPlaceholderProps) {
  if (type === "loading") {
    return (
      <div className="overflow-x-auto overscroll-x-contain">
        <div className="min-w-4xl space-y-2 md:min-w-208">
          {Array.from({ length: 6 }).map((_, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-9 gap-2 animate-pulse">
              {Array.from({ length: 9 }).map((__, colIdx) => (
                <div key={`${rowIdx}-${colIdx}`} className="h-10 rounded-2xl bg-muted/75" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="rounded-[1.25rem] border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm text-destructive">
          {isPlanFilterEnabled ? admin("errors.loadSubscriptions") : admin("errors.loadUsers")}
        </p>
      </div>
    );
  }

  if (type === "empty") {
    return (
      <div className="rounded-[1.25rem] border border-border/60 bg-muted/20 p-4">
        <p className="text-sm text-muted-foreground">{admin("states.emptyUsers")}</p>
      </div>
    );
  }

  return null;
}

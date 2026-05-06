"use client";

import { ZIcon } from "@zcorvus/z-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface InstallCommandBlockProps {
  variant?: "terminal" | "badge" | "banner" | "dock";
}

export function InstallCommandBlock({ variant = "terminal" }: InstallCommandBlockProps) {
  const [copied, setCopied] = useState(false);
  const common = useTranslations("common");
  const command = "npm i @zcorvus/z-icons";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    toast.success(common("toasts.commandCopied"));
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "badge") {
    return (
      <button
        onClick={handleCopy}
        className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-border/40 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all hover:bg-muted/20 hover:text-foreground cursor-pointer"
      >
        <span className="font-mono">{command}</span>
        <ZIcon type="mina" name={copied ? "check" : "copy"} className="size-3.5 transition-transform group-hover:scale-110" />
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/60 px-4 py-3 backdrop-blur-sm">
        <span className="font-mono text-sm font-medium tracking-tight text-foreground">{command}</span>
        <button
          onClick={handleCopy}
          className="flex h-8 items-center justify-center rounded-xl bg-foreground px-3 text-xs font-semibold text-background transition-transform hover:scale-105 active:scale-95"
        >
          {copied ? "Copiado" : "Copiar comando"}
        </button>
      </div>
    );
  }

  if (variant === "dock") {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-[1.25rem] border border-border/50 bg-background/80 p-2 pl-4 shadow-xl shadow-black/20 backdrop-blur-xl">
        <span className="font-mono text-sm tracking-tight text-muted-foreground">
          <span className="text-foreground/40">$</span> {command}
        </span>
        <button
          onClick={handleCopy}
          className="flex size-8 items-center justify-center rounded-lg bg-muted/40 text-foreground transition-colors hover:bg-muted/80"
        >
          <ZIcon type="mina" name={copied ? "check" : "copy"} className="size-4" />
        </button>
      </div>
    );
  }

  // terminal (default)
  return (
    <div className="relative flex w-full max-w-sm items-center justify-between gap-4 rounded-xl border border-border/30 bg-[#0a0a0a]/60 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <ZIcon type="mina" name="code" className="size-4 text-muted-foreground/60" />
        <code className="font-mono text-[13px] tracking-wide text-foreground/90">
          <span className="text-muted-foreground/50 mr-2">$</span>
          {command}
        </code>
      </div>
      <button
        onClick={handleCopy}
        className="flex size-7 items-center justify-center rounded-md bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
      >
        <ZIcon type="mina" name={copied ? "check" : "copy"} className="size-3.5" />
      </button>
    </div>
  );
}

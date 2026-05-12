import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ActionIconButton({
    label,
    onClick,
    disabled,
    destructive = false,
    children,
}: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    destructive?: boolean;
    children: ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className={
                            destructive
                                ? "rounded-full border-destructive/25 text-destructive hover:bg-destructive/10"
                                : "rounded-full"
                        }
                        aria-label={label}
                        onClick={onClick}
                        disabled={disabled}
                    >
                        {children}
                    </Button>
                </span>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

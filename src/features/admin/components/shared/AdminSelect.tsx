import { X } from "lucide-react";
import { adminSelectClassName } from "./adminSelectClassName";

interface SelectOption {
    value: string;
    label: string;
}

interface AdminSelectProps {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    ariaLabel: string;
    className?: string;
    disabled?: boolean;
}

export function AdminSelect({
    value,
    options,
    onChange,
    ariaLabel,
    className,
    disabled = false,
}: AdminSelectProps) {
    const hasValue = value !== "";

    return (
        <div className="relative w-full">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-label={ariaLabel}
                disabled={disabled}
                className={`${adminSelectClassName} w-full pr-10 appearance-none ${className ? ` ${className}` : ""}`}
                style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em" }}
            >
                {options.map((option) => (
                    <option 
                        key={option.value} 
                        value={option.value}
                        disabled={option.value === ""}
                        hidden={option.value === ""}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {hasValue && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute right-7 top-1/2 -translate-y-1/2 text-ui-text-muted hover:text-ui-text p-1 rounded-full bg-ui-surface-panel/50 backdrop-blur-sm transition-colors"
                    aria-label={`Limpiar ${ariaLabel}`}
                >
                    <X size={14} strokeWidth={2.5} />
                </button>
            )}
        </div>
    );
}

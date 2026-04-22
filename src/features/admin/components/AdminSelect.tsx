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
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label={ariaLabel}
            disabled={disabled}
            className={`${adminSelectClassName}${className ? ` ${className}` : ""}`}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

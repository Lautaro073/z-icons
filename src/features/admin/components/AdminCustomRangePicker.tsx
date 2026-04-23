import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toInputDateValue } from "@/features/admin/index";

interface AdminCustomRangePickerProps {
    admin: (key: string) => string;
    common: (key: string) => string;
    buttonLabel: string;
    isOpen: boolean;
    selectedRange?: DateRange;
    maxSelectableDate: Date;
    maxSelectableDateInput: string;
    onOpenChange: (open: boolean) => void;
    onInputChange: (field: "from" | "to", rawValue: string) => void;
    onRangeChange: (range: DateRange | undefined) => void;
    onCancel: () => void;
    onApply: () => void;
}

export function AdminCustomRangePicker({
    admin,
    common,
    buttonLabel,
    isOpen,
    selectedRange,
    maxSelectableDate,
    maxSelectableDateInput,
    onOpenChange,
    onInputChange,
    onRangeChange,
    onCancel,
    onApply,
}: AdminCustomRangePickerProps) {
    return (
        <Popover open={isOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="h-11 justify-start rounded-[1.15rem] text-left font-normal"
                    aria-label={`${admin("filters.from")} - ${admin("filters.to")}`}
                >
                    {buttonLabel}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0" align="start">
                <div className="grid gap-2 border-b border-border/40 p-3">
                    <Input
                        type="date"
                        aria-label={admin("filters.from")}
                        value={toInputDateValue(selectedRange?.from)}
                        onChange={(event) => onInputChange("from", event.currentTarget.value)}
                        max={maxSelectableDateInput}
                        className="h-10 text-sm"
                    />
                    <Input
                        type="date"
                        aria-label={admin("filters.to")}
                        value={toInputDateValue(selectedRange?.to)}
                        onChange={(event) => onInputChange("to", event.currentTarget.value)}
                        max={maxSelectableDateInput}
                        className="h-10 text-sm"
                    />
                </div>

                <div className="flex justify-center p-2">
                    <Calendar
                        mode="range"
                        selected={selectedRange}
                        onSelect={onRangeChange}
                        numberOfMonths={1}
                        disabled={{ after: maxSelectableDate }}
                    />
                </div>

                <div className="flex justify-end gap-2 border-t border-border/40 p-3">
                    <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="rounded-full">
                        {common("actions.cancel")}
                    </Button>
                    <Button type="button" size="sm" className="rounded-full" onClick={onApply}>
                        {common("actions.apply")}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2, Eye, EyeOff } from "lucide-react";
import type { CustomIconPayload, CustomIcon } from "@/features/admin/hooks/useCustomIcons";

const baseSchema = z.object({
  name: z.string(),
  category: z.string(),
  svg_content: z.string(),
  status: z.enum(["active", "disabled"]),
});

type IconFormValues = z.infer<typeof baseSchema>;

interface IconSheetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CustomIconPayload) => Promise<void>;
  defaultValues?: CustomIcon | null;
  isSubmitting?: boolean;
}

export function IconSheetForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isSubmitting,
}: IconSheetFormProps) {
  const admin = useTranslations("admin.customIcons");
  const [showCode, setShowCode] = useState(false);
  const [pasteManually, setPasteManually] = useState(false);

  const iconSchema = z.object({
    name: z.string().min(2, admin("form.validation.nameMinLength")),
    category: z.string().min(2, admin("form.validation.categoryRequired")),
    svg_content: z.string()
      .transform((val) => {
        let cleaned = val.trim();
        // Strip XML declaration: <?xml ... ?>
        cleaned = cleaned.replace(/^<\?xml[^?>]*\?>\s*/i, "");
        // Strip DOCTYPE: <!DOCTYPE ... >
        cleaned = cleaned.replace(/^<!DOCTYPE[^>]*>\s*/i, "");
        // Strip leading XML comments
        cleaned = cleaned.replace(/^(<!--[\s\S]*?-->\s*)+/i, "");
        return cleaned.trim();
      })
      .refine(
        (val) => {
          const normalized = val.toLowerCase();
          return normalized.includes("<svg") && normalized.includes("</svg>");
        },
        { message: admin("form.validation.svgInvalid") }
      ),
    status: z.enum(["active", "disabled"]),
  });

  const form = useForm<IconFormValues>({
    resolver: zodResolver(iconSchema),
    defaultValues: {
      name: "",
      category: "",
      svg_content: "",
      status: "active",
    },
  });

  const svgContent = form.watch("svg_content");

  useEffect(() => {
    if (open) {
      setShowCode(false);
      setPasteManually(false);
    }
    if (open && defaultValues) {
      form.reset({
        name: defaultValues.name,
        category: defaultValues.category,
        svg_content: defaultValues.svg_content || "",
        status: (defaultValues.status as "active" | "disabled") || "active",
      });
    } else if (open && !defaultValues) {
      form.reset({
        name: "",
        category: "",
        svg_content: "",
        status: "active",
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = async (values: IconFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col p-0 sm:max-w-md w-full h-full max-h-screen overflow-hidden border-l border-border/40 bg-background/95 backdrop-blur-md">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="text-xl font-semibold text-foreground">
            {defaultValues ? admin("editIcon") : admin("addIcon")}
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 overflow-hidden">
            {/* Scrollable Form Fields with perfect padding */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">{admin("form.nameLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder={admin("form.namePlaceholder")} {...field} className="bg-background/50 border-border/60 hover:border-border/80 focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">{admin("form.categoryLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder={admin("form.categoryPlaceholder")} {...field} className="bg-background/50 border-border/60 hover:border-border/80 focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="svg_content"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-sm font-medium text-foreground">{admin("form.svgContentLabel")}</FormLabel>
                    
                    {svgContent ? (
                      <div className="flex flex-col gap-3">
                        {/* SVG Loaded Preview Card */}
                        <div className="flex items-center justify-between rounded-xl border border-border/40 p-4 bg-card/30 backdrop-blur-sm shadow-inner">
                          <div className="flex items-center gap-3">
                            <div 
                              className="flex size-11 items-center justify-center rounded-lg border border-border/50 bg-background shadow-sm text-foreground" 
                              dangerouslySetInnerHTML={{ __html: svgContent }} 
                            />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-semibold text-foreground">{admin("form.svgLoaded")}</span>
                              <button
                                type="button"
                                onClick={() => setShowCode(!showCode)}
                                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors font-medium"
                              >
                                {showCode ? (
                                  <>
                                    <EyeOff className="size-3" />
                                    {admin("form.hideCode")}
                                  </>
                                ) : (
                                  <>
                                    <Eye className="size-3" />
                                    {admin("form.showCode")}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              form.setValue("svg_content", "");
                              setShowCode(false);
                            }}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>

                        {showCode && (
                          <FormControl>
                            <Textarea 
                              placeholder={admin("form.svgContentPlaceholder")} 
                              className="h-28 font-mono text-xs bg-background/50 border-border/60 focus:border-primary"
                              {...field} 
                            />
                          </FormControl>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {/* Upload / Drag zone */}
                        {!pasteManually ? (
                          <div className="flex flex-col gap-2">
                            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-muted/30 transition-all rounded-xl p-8 text-center cursor-pointer group">
                              <input 
                                type="file" 
                                accept=".svg" 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const text = event.target?.result as string;
                                    if (text) {
                                      form.setValue("svg_content", text, { shouldValidate: true });
                                      if (!form.getValues("name")) {
                                        const nameWithoutExt = file.name.replace(/\.svg$/i, "");
                                        form.setValue("name", nameWithoutExt, { shouldValidate: true });
                                      }
                                    }
                                  };
                                  reader.readAsText(file);
                                }}
                              />
                              <Upload className="size-7 text-muted-foreground group-hover:text-primary transition-colors mb-2.5" />
                              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{admin("form.uploadLabel")}</span>
                            </div>
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              onClick={() => setPasteManually(true)}
                              className="text-xs text-muted-foreground hover:text-foreground self-center h-auto py-0"
                            >
                              {admin("form.pasteManual")}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <FormControl>
                              <Textarea 
                                placeholder={admin("form.svgContentPlaceholder")} 
                                className="h-28 font-mono text-xs bg-background/50 border-border/60 focus:border-primary"
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              onClick={() => setPasteManually(false)}
                              className="text-xs text-muted-foreground hover:text-foreground self-center h-auto py-0"
                            >
                              {admin("form.backToUpload")}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fixed Sticky Footer with border-t and blurring */}
            <div className="border-t border-border/40 p-6 flex items-center justify-end gap-3 bg-background/90 backdrop-blur-sm sticky bottom-0 z-20">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {admin("form.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? admin("form.submitting") : admin("form.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

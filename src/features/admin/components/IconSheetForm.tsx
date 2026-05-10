"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Crown, Eye, EyeOff, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";
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
import { cn } from "@/lib/utils";
import type { CustomIconPayload, CustomIcon } from "@/features/admin/hooks/useCustomIcons";

interface IconFormValues {
  name: string;
  category: string;
  svg_content: string;
  is_premium: boolean;
  status: "active" | "disabled";
}

interface IconSheetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CustomIconPayload | CustomIconPayload[]) => Promise<void>;
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
  const [batchFiles, setBatchFiles] = useState<{ name: string; content: string }[]>([]);

  const validationSchema = useMemo(() => z.object({
    name: z.string().min(2, admin("form.validation.nameMinLength")),
    category: z.string().min(2, admin("form.validation.categoryRequired")),
    svg_content: z.string()
      .transform((val) => {
        let cleaned = val.trim();
        cleaned = cleaned.replace(/^<\?xml[^?>]*\?>\s*/i, "");
        cleaned = cleaned.replace(/^<!DOCTYPE[^>]*>\s*/i, "");
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
    is_premium: z.boolean(),
    status: z.enum(["active", "disabled"]),
  }), [admin]);

  const form = useForm<IconFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      category: "",
      svg_content: "",
      is_premium: false,
      status: "active",
    },
  });

  const svgContent = form.watch("svg_content");

  useEffect(() => {
    if (open) {
      setShowCode(false);
      setPasteManually(false);
      setBatchFiles([]);
    }
    if (open && defaultValues) {
      form.reset({
        name: defaultValues.name,
        category: defaultValues.category,
        svg_content: defaultValues.svg_content || "",
        is_premium: Boolean(defaultValues.is_premium === true || defaultValues.is_premium === 1 || String(defaultValues.is_premium) === "true"),
        status: (defaultValues.status as "active" | "disabled") || "active",
      });
    } else if (open && !defaultValues) {
      form.reset({
        name: "",
        category: "",
        svg_content: "",
        is_premium: false,
        status: "active",
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = async (values: IconFormValues) => {
    if (batchFiles.length > 1) {
      const payloadArray: CustomIconPayload[] = batchFiles.map((file) => ({
        ...values,
        name: file.name,
        svg_content: file.content,
      }));
      await onSubmit(payloadArray);
    } else {
      await onSubmit(values);
    }
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
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {batchFiles.length <= 1 && (
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
              )}

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
                name="is_premium"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-sm font-medium text-foreground">{admin("form.tierLabel")}</FormLabel>
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-1 border border-border/40 backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={() => field.onChange(false)}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-200 border border-transparent",
                          !field.value 
                            ? "bg-background text-foreground shadow-sm border-border/20" 
                            : "text-muted-foreground hover:text-foreground hover:bg-background/30"
                        )}
                      >
                        {admin("form.tierFree")}
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange(true)}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-200 border border-transparent",
                          field.value 
                            ? "bg-linear-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 shadow-sm border-amber-500/30" 
                            : "text-muted-foreground hover:text-foreground hover:bg-background/30"
                        )}
                      >
                        <Crown className={cn("size-3.5", field.value ? "fill-amber-500/20" : "")} />
                        {admin("form.tierPremium")}
                      </button>
                    </div>
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
                        <div className="flex items-center justify-between rounded-xl border border-border/40 p-4 bg-card/30 backdrop-blur-sm shadow-inner">
                          <div className="flex items-center gap-3">
                            <div 
                              className="flex size-11 items-center justify-center rounded-lg border border-border/50 bg-background shadow-sm text-foreground shrink-0" 
                              dangerouslySetInnerHTML={{ __html: svgContent }} 
                            />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-semibold text-foreground">
                                {batchFiles.length > 1 
                                  ? admin("form.batchReady", { count: batchFiles.length }) 
                                  : admin("form.svgLoaded")
                                }
                              </span>
                              {batchFiles.length <= 1 && (
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
                              )}
                              {batchFiles.length > 1 && (
                                <span className="text-[10px] text-muted-foreground italic">
                                  {batchFiles.map(f => f.name).slice(0, 3).join(", ")}{batchFiles.length > 3 ? "..." : ""}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              form.setValue("svg_content", "");
                              setShowCode(false);
                              setBatchFiles([]);
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
                        {!pasteManually ? (
                          <div className="flex flex-col gap-2">
                            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-muted/30 transition-all rounded-xl p-8 text-center cursor-pointer group">
                              <input 
                                type="file" 
                                accept=".svg" 
                                multiple={!defaultValues}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length === 0) return;
                                  
                                  if (files.length === 1) {
                                    const file = files[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const text = event.target?.result as string;
                                      if (text) {
                                        setBatchFiles([]);
                                        form.setValue("svg_content", text, { shouldValidate: true });
                                        const currentName = form.getValues("name");
                                        if (!currentName || currentName === "Batch Selection") {
                                          const nameWithoutExt = file.name.replace(/\.svg$/i, "");
                                          form.setValue("name", nameWithoutExt, { shouldValidate: true });
                                        }
                                      }
                                    };
                                    reader.readAsText(file);
                                  } else {
                                    const loadPromises = files.map(f => {
                                      return new Promise<{name: string, content: string}>((resolve) => {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                          resolve({
                                            name: f.name.replace(/\.svg$/i, ""),
                                            content: ev.target?.result as string || ""
                                          });
                                        };
                                        reader.readAsText(f);
                                      });
                                    });
                                    
                                    const results = await Promise.all(loadPromises);
                                    const validResults = results.filter(r => r.content && r.content.toLowerCase().includes("<svg"));
                                    
                                    if (validResults.length > 0 && validResults[0]) {
                                      setBatchFiles(validResults);
                                      form.setValue("svg_content", validResults[0].content, { shouldValidate: true });
                                      form.setValue("name", "Batch Selection", { shouldValidate: true });
                                    }
                                  }
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

"use client";

import { createContext, useContext, useMemo, useState } from "react";

type DraftStore = Record<string, unknown>;

interface FormDraftContextValue {
    drafts: DraftStore;
    setDraft: <T>(key: string, draft: T) => void;
    clearDraft: (key: string) => void;
}

const FormDraftContext = createContext<FormDraftContextValue | null>(null);

export function FormDraftProvider({ children }: { children: React.ReactNode }) {
    const [drafts, setDrafts] = useState<DraftStore>({});

    const value = useMemo(
        () => ({
            drafts,
            setDraft: <T,>(key: string, draft: T) => {
                setDrafts((current) => ({ ...current, [key]: draft }));
            },
            clearDraft: (key: string) => {
                setDrafts((current) => {
                    const next = { ...current };
                    delete next[key];
                    return next;
                });
            },
        }),
        [drafts]
    );

    return <FormDraftContext.Provider value={value}>{children}</FormDraftContext.Provider>;
}

export function useFormDraftContext() {
    const context = useContext(FormDraftContext);

    if (!context) {
        throw new Error("useFormDraftContext must be used within a FormDraftProvider");
    }

    return context;
}

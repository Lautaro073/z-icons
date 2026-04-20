"use client";

import { Dispatch, SetStateAction, useCallback } from "react";
import { useFormDraftContext } from "./FormDraftContext";

export function useFormDraft<T>(
  key: string,
  initialState: T
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const { drafts, setDraft, clearDraft } = useFormDraftContext();
  const state = (drafts[key] as T | undefined) ?? initialState;

  const setState = useCallback(
    (nextState: SetStateAction<T>) => {
      const setter = nextState as (prevState: T) => T;
      const value = typeof nextState === "function" ? setter(state as T) : nextState;
      setDraft(key, value);
    },
    [key, setDraft, state]
  );

  const clearDraftState = useCallback(() => {
    clearDraft(key);
  }, [clearDraft, key]);

  return [state, setState, clearDraftState];
}

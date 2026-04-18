export { uiStore } from "./ui.store";

export type {
  InitialUIState,
  UIState,
  UIActions,
  UISlice,
  UISliceStore,
} from "@/types/ui";

export { useUIStoreApi, useUIStore } from "./ui.provider";
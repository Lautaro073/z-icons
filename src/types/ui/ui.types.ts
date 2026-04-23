import { IconSet, Layer, Theme } from "@/types";
import { Store } from "@/types/store";

export interface InitialUIState {
  iconSet: IconSet;
  layer: Layer;
  theme: Theme;
}

export interface UIState extends InitialUIState {
  hasHydrated: boolean;
}

export interface UIActions {
  setIconSet: (p: { iconSet: IconSet }) => void;
  setIconSetDynamic: () => void;
  setLayerDynamic: () => void;
  setTheme: () => void;
  hydrate: (p: Partial<UIState>) => void;
}

export type UISlice = UIState & UIActions;
export type UISliceStore = Store<UISlice>;

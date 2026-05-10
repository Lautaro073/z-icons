import { minaIconNames, neoIconNames, coreIconNames, AllIconNames } from '@zcorvus/z-icons/icons';
import { minaIcons, coreIcons, neoIcons } from '@zcorvus/z-icons/icons';
import { IconCategory, IconContent, IconSet, IconView, Layer } from '@/types';
import { getCustomIcons } from '@/lib/api/backend';

export let customIconsCache: Record<string, string> = {};

export const IconSets: IconSet[] = ["neo", "core", "custom", "mina", "custom-premium","fa-solid", "fa-regular"];

export const IconCategories: Record<IconCategory, IconSet[]> = {
  local: ["core", "neo", "custom"],
  external: ["mina"],
  premium: ["fa-solid", "fa-regular", "custom-premium"],
} as const;

export const IconCategoriesInfo: Record<IconSet, IconView> = {
  core: {
    label: "Core",
    subLabel: "Solid",
    type: ["light"],
  },
  neo: {
    label: "Neo",
    subLabel: "Light",
    type: ["light"],
  },
  custom: {
    label: "zIcons",
    subLabel: "Internos",
    type: ["light"],
  },
  mina: {
    label: "Mina",
    subLabel: "UI",
    type: ["light", "solid"],
  },
  "fa-solid": {
    label: "Font Awesome",
    subLabel: "Solid",
    type: ["solid"],
  },
  "fa-regular": {
    label: "Font Awesome",
    subLabel: "Regular",
    type: ["regular"],
  },
  "custom-premium": {
    label: "zIcons +",
    subLabel: "Premium",
    type: ["light"],
    customBadge: "zCorvus-Premium",
    customDescription: "Iconos Premium de zCorvus",
  },
};

export const getIconSetInfo = (icon: IconSet) => IconCategoriesInfo[icon]
export const getIconSetsByCategory = (category: IconCategory) => IconCategories[category]

export const LayerModes: Record<Uppercase<Layer>, Layer> = {
  COMPACT: "compact",
  EXPANDED: "expanded",
};

/**
 * Número de iconos que se muestran por página en el grid (modo expandido).
 * Cambiá este valor para ajustar la cantidad de iconos por página.
 */
export const ICONS_PER_PAGE = 40;

/**
 * Número de iconos que se muestran por página en el grid (modo compacto).
 * Cambiá este valor para ajustar la cantidad de iconos por página en modo compacto.
 */
export const ICONS_PER_PAGE_COMPACT = 152;



export const getIconContentData = async (): Promise<IconContent> => {
  // Las colecciones grandes se importan dinamicamente para no bloquear el bundle inicial
  const [{ faSolidIconNames, faRegularIconNames }] = await Promise.all([
    import('@/lib/fontawesome')
  ]);

  let customIconNames: string[] = [];
  let customPremiumIconNames: string[] = [];
  try {
    const customIcons = await getCustomIcons();
    if (Array.isArray(customIcons)) {
      const activeIcons = customIcons.filter(icon => icon.status !== "disabled");
      
      const freeIcons = activeIcons.filter(icon => !icon.is_premium || icon.is_premium === "false" || icon.is_premium === 0);
      const premiumIcons = activeIcons.filter(icon => icon.is_premium === true || icon.is_premium === 1 || icon.is_premium === "true");

      customIconNames = freeIcons.map(icon => icon.name);
      customPremiumIconNames = premiumIcons.map(icon => icon.name);

      customIconsCache = activeIcons.reduce((acc, icon) => {
        acc[icon.name] = icon.svg_content || "";
        return acc;
      }, {} as Record<string, string>);
    }
  } catch (err) {
    console.error("Failed to fetch custom icons in explorer:", err);
  }

  return {
    local: {
      core: coreIconNames as Partial<AllIconNames>[],
      neo: neoIconNames as Partial<AllIconNames>[],
      custom: customIconNames as unknown as Partial<AllIconNames>[],
    },
    external: {
      mina: minaIconNames as Partial<AllIconNames>[],
    },
    premium: {
      "fa-solid": faSolidIconNames as unknown as Partial<AllIconNames>[],
      "fa-regular": faRegularIconNames as unknown as Partial<AllIconNames>[],
      "custom-premium": customPremiumIconNames as unknown as Partial<AllIconNames>[],
    },
  };
};

let cachedIconContentPromise: Promise<IconContent> | null = null;

export const getIconContentPromise = (): Promise<IconContent> => {
  if (!cachedIconContentPromise) {
    cachedIconContentPromise = getIconContentData();
  }
  return cachedIconContentPromise;
};

export const clearIconContentCache = () => {
  cachedIconContentPromise = null;
};

// Objeto asíncrono para obtener SVGs y evitar bundles masivos
export const getIconsSVG = async (type: IconSet) => {
  if (type === 'fa-solid') {
    const { faSolidIcons } = await import('@/lib/fontawesome/solid');
    return faSolidIcons;
  }
  if (type === 'fa-regular') {
    const { faRegularIcons } = await import('@/lib/fontawesome/regular');
    return faRegularIcons;
  }
  if (type === 'core') return coreIcons;
  if (type === 'neo') return neoIcons;
  if (type === 'mina') return minaIcons;
  if (type === 'custom' || type === 'custom-premium') {
    return {
      "light": customIconsCache,
      "": customIconsCache
    };
  }
  return null;
};



"use client";
import { ZIcon } from '@zcorvus/z-icons/react';
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils";
import { IconTypeInfo } from '@/types';
import { customIconsCache } from '@/features/icons-explorer/constants/icon.constants';

const FASolidRenderer = dynamic(() => import('./FASolidRenderer'), { ssr: false });
const FARegularRenderer = dynamic(() => import('./FARegularRenderer'), { ssr: false });

interface UnifiedIconProps extends Omit<IconTypeInfo, 'variant'> {
  variant?: string;
  className?: string;
  size?: number;
}

export const UnifiedIcon = ({ type, name, variant, className, size }: UnifiedIconProps) => {
  if (type === 'custom') {
    const svgContent = customIconsCache[name as string] || "";
    return (
      <div
        className={cn(className, "[&>svg]:w-full [&>svg]:h-full [&>svg]:text-current")}
        style={{ width: size || 24, height: size || 24 }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

  // Font Awesome icons lazily loaded
  if (type === 'fa-solid') {
    return <FASolidRenderer name={name as string} className={className} size={size} />;
  }

  if (type === 'fa-regular') {
    return <FARegularRenderer name={name as string} className={className} size={size} />;
  }

  // ZCorvus icons (core, neo, mina)
  return (
    <ZIcon
      type={type as 'core' | 'neo' | 'mina'}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name={name as any}
      variant={variant}
      className={className}
      size={size}
    />
  );
};

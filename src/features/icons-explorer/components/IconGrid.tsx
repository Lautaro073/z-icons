"use client";

import { IconGroup, useActiveIcon } from "@/features/icons-explorer";
import { IconGridLayout } from "./IconGridLayout";

interface IconGridProps {
  data: IconGroup[];
}

const IconGrid = ({ data }: IconGridProps) => {
  const { activeIcon, showDetail, handleShowDetail, handleCloseDetail, activeIconId } = useActiveIcon();

  return (
    <IconGridLayout
      data={data}
      activeIcon={activeIcon}
      activeIconId={activeIconId}
      showDetail={showDetail}
      onShowDetail={handleShowDetail}
      onClose={handleCloseDetail}
    />
  );
};

export { IconGrid };

"use client"
import { MinaIconName } from '@zcorvus/z-icons/icons';
import { ZIcon } from "@zcorvus/z-icons/react";
import { motion } from "framer-motion";

interface IconMarqueeColumnProps {
  icons: MinaIconName[];
  direction: "up" | "down";
  duration: number;
}

const AnimatedIcon = ({
  icons,
  direction,
  duration,
}: IconMarqueeColumnProps) => {
  return (
    <div className="h-[850px] overflow-hidden py-8">
      <motion.div
        className="flex flex-col gap-4"
        animate={{
          y: direction === "up"
            ? ["0%", "-50%"]
            : ["-50%", "0%"],
        }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...icons, ...icons].map((icon, index) => (
          <div
            key={`${icon}-${index}`}
            className="w-8 h-8 grid place-content-center text-muted-foreground/90 opacity-50"
          >
            <ZIcon
              type="mina"
              name={icon}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export { AnimatedIcon }
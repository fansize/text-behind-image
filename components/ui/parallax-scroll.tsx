"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/utils/utils";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[] | StaticImageData[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({

  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div
      className={cn("h-full items-start overflow-y-auto w-full", className)}
      ref={gridRef}
    >
      <h2 className="sr-only">Text Behind Image Use Cases and Examples - See How Others Create Amazing Text Overlay Effects</h2>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl items-start justify-start mx-auto gap-10 pt-10 px-10 md:pt-14"
        ref={gridRef}
      >
        <div className="grid gap-10">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }} // Apply the translateY motion value here
              key={"grid-1" + idx}
            >
              <Image
                src={el}
                className="w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                width={400}
                height={400}
                alt="User created text overlay example"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <motion.div style={{ y: translateSecond }} key={"grid-2" + idx}>
              <Image
                src={el}
                className="w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                width={400}
                height={400}
                alt="User created text overlay example"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <motion.div style={{ y: translateThird }} key={"grid-3" + idx}>
              <Image
                src={el}
                className="w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                width={400}
                height={400}
                alt="User created text overlay example"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

const slideUpVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const bounceInVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      type: "spring" as const,
      bounce: 0.4,
    },
  },
};

export default function Hero() {
  return (
    <motion.div
      className="flex flex-col items-start justify-center h-screen px-8 md:px-16 lg:px-32 relative overflow-hidden bg-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bkg.jpg"
          alt="Club Bayard background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Background overlay for better text readability */}
      <motion.div
        className="absolute inset-0 bg-black/30 z-10"
        variants={fadeInVariants}
      />

      <motion.p
        className="text-xl md:text-2xl lg:text-3xl text-white relative z-20"
        variants={slideUpVariants}
      >
        Centre équestre
      </motion.p>

      <motion.h1
        className="text-4xl md:text-6xl lg:text-8xl font-bold text-white relative z-20"
        variants={slideUpVariants}
      >
        Club Bayard
      </motion.h1>

      <motion.div className="relative z-20 mt-8" variants={bounceInVariants}>
        <Image src="/arrow.svg" alt="arrow" width={32} height={50} />
      </motion.div>
    </motion.div>
  );
}

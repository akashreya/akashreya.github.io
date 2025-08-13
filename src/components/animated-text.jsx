import { motion } from "framer-motion";

export const AnimatedText = ({ text }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.03 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 120,
        duration: 0.6,
      },
    },
    hidden: {
      opacity: 0,
      x: 0, // Reduced from -80 to prevent layout shift
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 120,
      },
    },
  };

  return (
    <motion.div
      className="inline-flex"
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ minWidth: "fit-content" }} // Reserve space to prevent layout shift
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child} className="inline-block">
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

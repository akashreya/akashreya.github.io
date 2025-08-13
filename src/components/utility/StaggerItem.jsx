import { motion } from "motion/react";

/**
 * StaggerItem component for use within AnimatedSection with stagger=true
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} [props.className] - Additional CSS classes
 */
const StaggerItem = ({ children, className = "" }) => {
  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};

export default StaggerItem;
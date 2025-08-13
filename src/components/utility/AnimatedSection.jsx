import { motion, useInView } from "motion/react";
import { useRef } from "react";

/**
 * AnimatedSection component for scroll-triggered entrance animations
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.variant] - Animation variant: 'fadeUp', 'fadeIn', 'slideLeft', 'slideRight'
 * @param {number} [props.delay] - Animation delay in seconds
 * @param {number} [props.duration] - Animation duration in seconds
 * @param {boolean} [props.stagger] - Whether to stagger child animations
 */
const AnimatedSection = ({ 
  children, 
  className = "", 
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  stagger = false
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px -100px 0px" 
  });

  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration,
          delay,
          ease: [0.25, 0.25, 0.25, 0.75]
        }
      }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration,
          delay,
          ease: "easeOut"
        }
      }
    },
    slideLeft: {
      hidden: { opacity: 0, x: -60 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration,
          delay,
          ease: [0.25, 0.25, 0.25, 0.75]
        }
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: 60 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration,
          delay,
          ease: [0.25, 0.25, 0.25, 0.75]
        }
      }
    },
    staggerContainer: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay
        }
      }
    },
    staggerItem: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          ease: [0.25, 0.25, 0.25, 0.75]
        }
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger ? variants.staggerContainer : variants[variant]}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
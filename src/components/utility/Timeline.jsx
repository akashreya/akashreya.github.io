import React from "react";

/**
 * Timeline container component
 * @param {Object} props
 * @param {React.ReactNode[]} props.children - Timeline items (should be TimelineItem components)
 * @param {'2-columns'|'1-column-left'|'1-column-right'} [props.layout] - Layout type
 */
export const Timeline = ({ children, layout = "2-columns" }) => (
  <div className="relative py-8">
    {/* Vertical line */}
    <div className="absolute hidden lg:block left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-emerald-600  z-0" />
    <ul className="space-y-12">
      {React.Children.map(children, (child, idx) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { idx, layout })
          : child
      )}
    </ul>
  </div>
);

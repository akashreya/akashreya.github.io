import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * TimelineItem component
 * @param {Object} props
 * @param {string|React.ReactNode} props.firm - Name of the company/organization (can include icon)
 * @param {string} props.position - Position held
 * @param {string} props.location - Location (city, state, etc.)
 * @param {string} props.description - Description/content
 * @param {string} props.date - Date or range
 * @param {string} [props.color] - Tailwind color class
 * @param {React.ReactNode} [props.icon] - Optional icon for the dot
 * @param {number} [props.idx]
 * @param {'2-columns'|'1-column-left'|'1-column-right'} [props.layout]
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className] - Additional className for the content card
 */
export const TimelineItem = ({
  firm,
  position,
  location,
  description,
  date,
  color = "bg-blue-500",
  icon,
  idx = 0,
  layout = "2-columns",
  children,
  className = "",
}) => {
  const getSide = (idx) => {
    if (layout === "2-columns") return idx % 2 === 0 ? "left" : "right";
    if (layout === "1-column-left") return "left";
    return "right";
  };
  const side = getSide(idx);
  // Layout logic for root <li>
  const liOrder =
    layout === "2-columns"
      ? side === "left"
        ? "md:flex-row"
        : "md:flex-row-reverse"
      : layout === "1-column-left"
      ? "md:flex-row"
      : "md:flex-row-reverse";
  const align =
    layout === "2-columns"
      ? side === "left"
        ? "md:items-end md:text-right"
        : "md:items-start md:text-left"
      : layout === "1-column-left"
      ? "md:items-start md:text-left"
      : "md:items-end md:text-right";

  return (
    <li
      className={`relative flex flex-col ${liOrder} md:justify-between items-center group`}
    >
      <div className="w-full md:w-1/2">
        <div className={`p-6 ${className}`}>
          <div className="inline-flex items-center ml-2 text-sm md:text-xl mb-1">
            <FontAwesomeIcon
              icon="fa-solid fa-calendar"
              className="ml-2 mr-4 text-rose-500"
            />
            {date}
          </div>
          <div className="font-bold text-lg md:text-2xl mb-1 ml-2">
            {position}
          </div>
          <div className="text-sm md:text-xl mb-3 ml-2">
            <span className="font-semibold">{firm}</span>
          </div>
          <div className="inline-flex items-center text-sm md:text-xl mb-2 ml-2">
            <FontAwesomeIcon icon="map-marker" className="mr-2 text-rose-500" />
            {location}
          </div>
          <div className="text-sm">{description}</div>
          {children}
        </div>
      </div>
      <div className="absolute hidden lg:block left-1/2 top-1 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10  flex-col items-center">
        <span
          className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 shadow ${color}`}
        >
          {icon || null}
        </span>
      </div>
    </li>
  );
};

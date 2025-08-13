import React from 'react';

const SectionDivider = ({ className = '' }) => {
  return (
    <div className={`section-divider ${className}`}>
      <div className="divider-line"></div>
      <div className="divider-ornament">
        <div className="ornament-diamond"></div>
        <div className="ornament-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="divider-line"></div>
    </div>
  );
};

export default SectionDivider;
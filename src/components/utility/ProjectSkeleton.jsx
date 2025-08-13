import React from 'react';

/**
 * Skeleton loading component for project cards
 */
const ProjectSkeleton = () => {
  return (
    <div className="project-box animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 md:h-12 bg-white/20 dark:bg-white/10 rounded-lg mb-4 md:mb-6 w-3/4"></div>
      
      {/* Project type skeleton */}
      <div className="h-4 md:h-6 bg-white/15 dark:bg-white/8 rounded-md mb-2 w-1/2"></div>
      
      {/* Description skeleton */}
      <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
        <div className="h-4 md:h-5 bg-white/15 dark:bg-white/8 rounded-md w-full"></div>
        <div className="h-4 md:h-5 bg-white/15 dark:bg-white/8 rounded-md w-5/6"></div>
        <div className="h-4 md:h-5 bg-white/15 dark:bg-white/8 rounded-md w-4/5"></div>
      </div>
      
      {/* Project info section */}
      <div className="project-info">
        {/* Image skeleton */}
        <div className="portfolio-img relative">
          <div className="w-18 md:w-24 lg:w-30 xl:w-50 h-12 md:h-16 lg:h-20 xl:h-30 
                        bg-white/15 dark:bg-white/8 rounded-3xl"></div>
        </div>
        
        {/* Details skeleton */}
        <div className="project-detail flex-1">
          {/* Tech stack skeleton */}
          <div className="h-4 md:h-5 bg-white/15 dark:bg-white/8 rounded-md mb-3 w-full"></div>
          
          {/* Buttons skeleton */}
          <div className="flex items-left lg:items-center flex-col lg:flex-row gap-4 w-fit">
            <div className="h-8 md:h-10 w-16 md:w-20 bg-white/15 dark:bg-white/8 rounded-lg"></div>
            <div className="h-8 md:h-10 w-12 md:w-16 bg-white/15 dark:bg-white/8 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Container for multiple skeleton loaders
 */
export const ProjectSkeletonGrid = ({ count = 4 }) => {
  return (
    <div className="projects-list-inner">
      {Array.from({ length: count }, (_, index) => (
        <ProjectSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
};

export default ProjectSkeleton;
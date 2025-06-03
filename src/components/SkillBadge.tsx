
import React from 'react';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  name: string;
  level?: 'basic' | 'intermediate' | 'proficient' | 'exposure';
  type?: 'language' | 'framework' | 'concept' | 'human';
  className?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  level = 'intermediate',
  type = 'language',
  className
}) => {
  const levelColors = {
    basic: 'bg-muted/30 hover:bg-muted/50',
    intermediate: 'bg-accent/20 hover:bg-accent/30',
    proficient: 'bg-accent/40 hover:bg-accent/50',
    exposure: 'bg-secondary/30 hover:bg-secondary/40'
  };
  
  const typeIcons = {
    language: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 8-8 8"></path>
        <path d="M4 21a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-2"></path>
      </svg>
    ),
    framework: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H2v7"></path>
        <path d="M2 12a9 9 0 0 0 9 9"></path>
        <path d="M15 5h7v7"></path>
        <path d="M22 12a9 9 0 0 1-9 9"></path>
        <circle cx="12" cy="12" r="4"></circle>
      </svg>
    ),
    concept: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    ),
    human: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path>
        <path d="m14 7 3 3"></path>
        <path d="M5 6v4"></path>
        <path d="M19 14v4"></path>
        <path d="M10 2v2"></path>
        <path d="M7 8H3"></path>
        <path d="M21 16h-4"></path>
        <path d="M14 22v-2"></path>
      </svg>
    )
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center px-3 py-1.5 rounded-md text-sm transition-colors',
        levelColors[level],
        className
      )}
    >
      {typeIcons[type]}
      <span>{name}</span>
      {level !== 'intermediate' && (
        <span className="ml-1.5 text-xs opacity-70">({level})</span>
      )}
    </div>
  );
};

export default SkillBadge;

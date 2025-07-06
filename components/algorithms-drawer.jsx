"use client";

import { useState, useEffect } from 'react';
import { AlgorithmsPanel } from './algorithms-panel';

export function AlgorithmsDrawer({ cubeType }) {
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer when pressing escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Drawer toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-r-md transition-transform z-30 ${
          isOpen ? 'translate-x-[280px]' : 'translate-x-0'
        }`}
        aria-label={isOpen ? 'Close algorithms drawer' : 'Open algorithms drawer'}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
      
      {/* Backdrop - only visible when drawer is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Drawer panel */}
      <div 
        className={`fixed left-0 top-0 bottom-0 w-[280px] bg-gray-900 shadow-lg transition-transform z-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full">
          <AlgorithmsPanel cubeType={cubeType} />
        </div>
      </div>
    </>
  );
}

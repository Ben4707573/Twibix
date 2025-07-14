"use client";

import React, { useState, useEffect } from 'react';
import { ScrambleVisualizer as OriginalVisualizer } from './scramble-visualizer';
import { ScrambleVisualizer as BackupVisualizer } from './scramble-visualizer-backup';

/**
 * A switcher component that allows toggling between the original and new scramble visualizers
 * This is useful for testing and comparing the two implementations
 */
export function ScrambleVisualizerSwitcher({ scramble, cubeType }) {
  const [useNew, setUseNew] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Only show visualizer for 2x2-7x7 cubes and Pyraminx
  const supportedCubeTypes = ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7', 'pyraminx'];
  const isSupported = supportedCubeTypes.includes(cubeType);
  
  // Error boundary effect
  useEffect(() => {
    setHasError(false); // Reset error state when cube type changes
  }, [cubeType]);
  
  if (hasError) {
    return (
      <div className="w-full text-center p-4">
        <p className="text-red-500">Error displaying scramble visualization.</p>
      </div>
    );
  }
  
  if (!isSupported) {
    return (
      <div className="w-full text-center p-4">
        <p className="text-gray-500">Scramble visualization is not available for {cubeType}.</p>
      </div>
    );
  }
  
  // Calculate container width based on cube type
  const getContainerClass = () => {
    if (cubeType === '6x6' || cubeType === '7x7') {
      return "w-full max-w-3xl mx-auto"; // Wider for larger cubes
    } else if (cubeType === '4x4' || cubeType === '5x5') {
      return "w-full max-w-2xl mx-auto"; // Medium width for medium cubes
    }
    return "w-full max-w-xl mx-auto"; // Default width
  };
  
  return (
    <div className={getContainerClass()}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium dark:text-gray-300 text-gray-700">
          Scramble Visualizer
        </h3>
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 text-xs">Original</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={useNew} 
                onChange={() => setUseNew(!useNew)}
              />
              <div className={`block w-10 h-6 rounded-full ${useNew ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${useNew ? 'translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-2 text-xs">Backup</span>
          </label>
        </div>
      </div>
      
      {useNew ? (
        <ErrorBoundaryWrapper onError={() => setHasError(true)}>
          <BackupVisualizer scramble={scramble} cubeType={cubeType} />
        </ErrorBoundaryWrapper>
      ) : (
        <ErrorBoundaryWrapper onError={() => setHasError(true)}>
          <OriginalVisualizer scramble={scramble} cubeType={cubeType} />
        </ErrorBoundaryWrapper>
      )}
    </div>
  );
}

// Simple error boundary wrapper using error handling in hooks
function ErrorBoundaryWrapper({ children, onError }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const errorHandler = (error) => {
      console.error("Caught error in scramble visualizer:", error);
      setHasError(true);
      if (onError) onError(error);
      return true; // Prevent default error handling
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, [onError]);
  
  if (hasError) {
    return (
      <div className="w-full text-center p-4">
        <p className="text-red-500">Error displaying scramble visualization.</p>
      </div>
    );
  }
  
  return children;
}

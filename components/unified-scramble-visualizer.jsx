"use client";

import React from 'react';
import { CubeScrambleVisualizer } from './scramblers/cube-scrambler';
import { PyraminxVisualizer } from './scramblers/pyraminx-scrambler';
import { CSTimerCubeVisualizer } from './scramblers/cstimer/cube-visualizer';
import { CSTimerPyraminxVisualizer } from './scramblers/cstimer/pyraminx-visualizer';

/**
 * A unified scramble visualizer that selects the appropriate visualizer based on cube type
 */
export function UnifiedScrambleVisualizer({ scramble, cubeType }) {

  // Define which cube types are supported by visualization
  const cubeSupportedTypes = ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7'];
  const otherSupportedTypes = ['pyraminx'];
  const allSupportedTypes = [...cubeSupportedTypes, ...otherSupportedTypes];
  
  // Check if the current cube type is supported
  const isSupported = allSupportedTypes.includes(cubeType);
  
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
    } else if (cubeType === 'pyraminx') {
      return "w-full max-w-xl mx-auto"; // Custom width for pyraminx
    }
    return "w-full max-w-xl mx-auto"; // Default width
  };

  // Use CSTimer visualizers for the supported cube types
  const showCSTimerVisualizer = cubeSupportedTypes.includes(cubeType) || cubeType === 'pyraminx';
  
  return (
    <div className={`${getContainerClass()} p-2 relative`}>
      {/* Show error boundary message if something goes wrong */}
      <div className="scramble-visualizer-container">
        {showCSTimerVisualizer ? (
          cubeType === 'pyraminx' ? (
            <CSTimerPyraminxVisualizer scramble={scramble} />
          ) : (
            <CSTimerCubeVisualizer scramble={scramble} cubeType={cubeType} />
          )
        ) : (
          // Fallback to original visualizers if needed
          cubeType === 'pyraminx' ? (
            <PyraminxVisualizer scramble={scramble} />
          ) : (
            <CubeScrambleVisualizer scramble={scramble} cubeType={cubeType} />
          )
        )}
      </div>
    </div>
  );
}

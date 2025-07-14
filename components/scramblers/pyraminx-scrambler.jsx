"use client";

import React, { useEffect, useState } from 'react';

// Pyraminx Visualizer component
export function PyraminxVisualizer({ scramble }) {
  // Colors for the pyraminx faces
  const colors = {
    'U': '#00AF00', // Green
    'L': '#FF0000', // Red
    'R': '#0000FF', // Blue
    'B': '#FFFF00'  // Yellow
  };

  const [pyraminxState, setPyraminxState] = useState(null);

  useEffect(() => {
    const initPyraminx = () => {
      try {
        // Initial solved state of pyraminx
        // Each face has 9 stickers in a triangular arrangement
        const getSolvedPyraminx = () => ({
          U: Array(9).fill('U'), // Top face (green)
          L: Array(9).fill('L'), // Left face (red)
          R: Array(9).fill('R'), // Right face (blue)
          B: Array(9).fill('B')  // Back face (yellow)
        });

        // Function to apply a single move to the pyraminx
        const applyMove = (pyraminx, move) => {
          // Create a copy of the current state
          const newPyraminx = {
            U: [...pyraminx.U],
            L: [...pyraminx.L],
            R: [...pyraminx.R],
            B: [...pyraminx.B]
          };

          // Extract face and modifier (if any)
          const face = move[0].toUpperCase();
          const isPrime = move.includes("'");
          const isTip = move.toLowerCase() === move; // lowercase = tip rotation
          
          // Mapping of which stickers need to be rotated for each move
          // Including edge and corner pieces
          // For each face, we define the affected stickers on each face
          // and how they should be swapped during rotation
          const moves = {
            'U': {
              // Normal U move (affects multiple faces)
              edges: [
                // Each entry is [face, [indices to rotate]]
                [newPyraminx.U, [3, 6, 7, 8]], // Center and three corners of U face
                [newPyraminx.L, [0, 1, 4]],    // Top edge of L face
                [newPyraminx.R, [0, 2, 4]],    // Top edge of R face
                [newPyraminx.B, [0, 1, 2]]     // Top edge of B face
              ]
            },
            'L': {
              // Normal L move
              edges: [
                [newPyraminx.L, [3, 6, 7, 8]], // Center and three corners of L face
                [newPyraminx.U, [0, 3, 6]],    // Left edge of U face
                [newPyraminx.R, [6, 7, 8]],    // Bottom edge of R face
                [newPyraminx.B, [0, 3, 6]]     // Right edge of B face
              ]
            },
            'R': {
              // Normal R move
              edges: [
                [newPyraminx.R, [3, 6, 7, 8]], // Center and three corners of R face
                [newPyraminx.U, [2, 5, 8]],    // Right edge of U face
                [newPyraminx.L, [6, 7, 8]],    // Bottom edge of L face
                [newPyraminx.B, [2, 5, 8]]     // Left edge of B face
              ]
            },
            'B': {
              // Normal B move
              edges: [
                [newPyraminx.B, [3, 6, 7, 8]], // Center and three corners of B face
                [newPyraminx.U, [0, 1, 2]],    // Top edge of U face
                [newPyraminx.L, [2, 5, 8]],    // Right edge of L face
                [newPyraminx.R, [0, 3, 6]]     // Left edge of R face
              ]
            },
            'u': {
              // u tip (small u) only affects the U face tip
              edges: [
                [newPyraminx.U, [0, 1, 2]]
              ]
            },
            'l': {
              // l tip only affects the L face tip
              edges: [
                [newPyraminx.L, [0, 1, 2]]
              ]
            },
            'r': {
              // r tip only affects the R face tip
              edges: [
                [newPyraminx.R, [0, 1, 2]]
              ]
            },
            'b': {
              // b tip only affects the B face tip
              edges: [
                [newPyraminx.B, [0, 1, 2]]
              ]
            }
          };

          // Get the appropriate move data
          const moveData = moves[face];
          if (!moveData) return newPyraminx; // Skip invalid moves

          // For tips (lowercase), apply a simple rotation to just the tip
          if (isTip) {
            const tipEdges = moveData.edges[0];
            const [tipFace, tipIndices] = tipEdges;
            
            // Store original values
            const origValues = tipIndices.map(idx => tipFace[idx]);
            
            if (isPrime) {
              // Counterclockwise rotation
              tipFace[tipIndices[0]] = origValues[2];
              tipFace[tipIndices[1]] = origValues[0];
              tipFace[tipIndices[2]] = origValues[1];
            } else {
              // Clockwise rotation
              tipFace[tipIndices[0]] = origValues[1];
              tipFace[tipIndices[1]] = origValues[2];
              tipFace[tipIndices[2]] = origValues[0];
            }
            
            return newPyraminx;
          }

          // For regular moves, rotate all affected edges
          const { edges } = moveData;
          
          // Store original values of all affected stickers
          const origValues = edges.map(([face, indices]) => 
            indices.map(idx => face[idx])
          );
          
          if (isPrime) {
            // Counterclockwise rotation
            // Apply rotation to center face
            const [centerFace, centerIndices] = edges[0];
            centerFace[centerIndices[0]] = origValues[0][3];
            centerFace[centerIndices[1]] = origValues[0][0];
            centerFace[centerIndices[2]] = origValues[0][1];
            centerFace[centerIndices[3]] = origValues[0][2];
            
            // Rotate the adjacent edges counterclockwise
            for (let i = 1; i <= 3; i++) {
              const [face, indices] = edges[i];
              const prevEdge = i === 1 ? 3 : i - 1;
              const prevIndices = edges[prevEdge][1];
              
              for (let j = 0; j < indices.length; j++) {
                face[indices[j]] = origValues[prevEdge][j];
              }
            }
          } else {
            // Clockwise rotation
            // Apply rotation to center face
            const [centerFace, centerIndices] = edges[0];
            centerFace[centerIndices[0]] = origValues[0][1];
            centerFace[centerIndices[1]] = origValues[0][2];
            centerFace[centerIndices[2]] = origValues[0][3];
            centerFace[centerIndices[3]] = origValues[0][0];
            
            // Rotate the adjacent edges clockwise
            for (let i = 1; i <= 3; i++) {
              const [face, indices] = edges[i];
              const nextEdge = i === 3 ? 1 : i + 1;
              const nextIndices = edges[nextEdge][1];
              
              for (let j = 0; j < indices.length; j++) {
                face[indices[j]] = origValues[nextEdge][j];
              }
            }
          }
          
          return newPyraminx;
        };

        // Apply the scramble to a solved pyraminx
        const applyScramble = (moves) => {
          let pyraminx = getSolvedPyraminx();
          
          moves.forEach(move => {
            try {
              pyraminx = applyMove(pyraminx, move);
            } catch (error) {
              console.error(`Failed to apply move ${move} on pyraminx:`, error);
            }
          });
          
          return pyraminx;
        };

        // Process the scramble
        let newPyraminx;
        if (scramble && scramble !== 'Loading...') {
          const moves = scramble.trim().split(/\s+/).filter(move => move && move.length > 0);
          newPyraminx = applyScramble(moves);
        } else {
          newPyraminx = getSolvedPyraminx();
        }
        
        setPyraminxState(newPyraminx);
      } catch (error) {
        console.error("Error initializing pyraminx:", error);
        // Set to solved state as fallback
        setPyraminxState({
          U: Array(9).fill('U'),
          L: Array(9).fill('L'),
          R: Array(9).fill('R'),
          B: Array(9).fill('B')
        });
      }
    };
    
    initPyraminx();
  }, [scramble]);

  // Render a single face of the pyraminx (triangular arrangement)
  const PyraminxFace = ({ face, faceState }) => {
    if (!faceState) return null;
    
    // Size of each sticker
    const stickerSize = 25;
    
    // Layout for a triangular grid (pyraminx face)
    // We'll use absolute positioning to create a triangle shape
    const positions = [
      // Top row (1 sticker)
      { top: 0, left: stickerSize }, // 0
      
      // Second row (2 stickers)
      { top: stickerSize * 0.866, left: stickerSize / 2 }, // 1
      { top: stickerSize * 0.866, left: stickerSize * 1.5 }, // 2
      
      // Third row (center + 2 outer)
      { top: stickerSize * 1.732, left: 0 }, // 3
      { top: stickerSize * 1.732, left: stickerSize }, // 4 (center)
      { top: stickerSize * 1.732, left: stickerSize * 2 }, // 5
      
      // Bottom row (3 stickers)
      { top: stickerSize * 2.598, left: stickerSize * 0.5 }, // 6
      { top: stickerSize * 2.598, left: stickerSize * 1.5 }, // 7
      { top: stickerSize * 2.598, left: stickerSize * 2.5 }, // 8
    ];
    
    return (
      <div 
        className="relative" 
        style={{ 
          width: stickerSize * 3, 
          height: stickerSize * 3,
          marginBottom: stickerSize * 0.3
        }}
      >
        {faceState.map((sticker, i) => (
          <div
            key={i}
            className="absolute w-5 h-5 border border-black rounded-sm transform rotate-45"
            style={{
              top: positions[i].top,
              left: positions[i].left,
              backgroundColor: colors[sticker],
              boxShadow: 'inset 0 0 3px rgba(0,0,0,0.3)'
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-bold text-black text-opacity-80 text-xs bg-white bg-opacity-50 px-1 rounded z-10">
            {face}
          </span>
        </div>
      </div>
    );
  };

  // If pyraminx state isn't ready yet, show loading
  if (!pyraminxState) {
    return <div>Initializing pyraminx...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 w-full max-w-lg mx-auto">
        <div className="flex flex-col items-center">
          {/* Pyraminx net layout */}
          <div className="grid grid-cols-1 mb-2">
            <div className="flex justify-center">
              <PyraminxFace face="U" faceState={pyraminxState.U} />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <PyraminxFace face="L" faceState={pyraminxState.L} />
            <PyraminxFace face="R" faceState={pyraminxState.R} />
            <PyraminxFace face="B" faceState={pyraminxState.B} />
          </div>
          
          {/* Scramble text */}
          {scramble && scramble !== 'Loading...' && (
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-300 max-w-full text-center">
              <div className="mb-1 font-medium">
                Pyraminx Scramble ({scramble.trim().split(/\s+/).length} moves)
              </div>
              <div className="flex flex-wrap justify-center gap-1 p-2 max-h-48 overflow-y-auto bg-white dark:bg-gray-700 rounded-lg shadow-inner">
                {scramble.trim().split(/\s+/).map((move, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-base font-mono"
                  >
                    {move}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

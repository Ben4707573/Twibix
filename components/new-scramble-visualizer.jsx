"use client";

import React, { useEffect, useState } from 'react';

/**
 * ScrambleVisualizer - A React component to visualize scrambles for various cube puzzles
 * @param {Object} props - Component props
 * @param {string} props.scramble - The scramble string to visualize
 * @param {string} props.cubeType - The type of cube ('2x2', '3x3', '4x4', '5x5', '6x6', '7x7', 'pyraminx', 'skewb', 'sq1')
 */
export function ScrambleVisualizer({ scramble, cubeType = '3x3' }) {
  // Define standard colors for cube faces
  const colors = {
    'U': '#FFFFFF', // White (Up)
    'R': '#FF0000', // Red (Right)
    'F': '#00AF00', // Green (Front)
    'D': '#FFFF00', // Yellow (Down)
    'L': '#FF8000', // Orange (Left)
    'B': '#0000FF', // Blue (Back)
    // Colors for other puzzles
    'BL': '#800080', // Purple (Bottom Left - Pyraminx)
    'BR': '#00FFFF', // Cyan (Bottom Right - Pyraminx)
    'BU': '#808080', // Gray (Bottom - Skewb)
  };

  // Size of each cube type
  const sizeMap = {
    '2x2': 2,
    '3x3': 3,
    '4x4': 4,
    '5x5': 5,
    '6x6': 6,
    '7x7': 7,
    'pyraminx': 3, // Sides of triangular faces
    'skewb': 3,    // Approximation for visualization
    'sq1': 2,      // Layers in Square-1
  };

  const size = sizeMap[cubeType] || 3;
  const cellSize = 24; // Size of each cell in pixels
  const spacing = 2;   // Spacing between cells

  // State to hold the current cube state
  const [cubeState, setCubeState] = useState(null);

  // Initialize and update the cube state when scramble or cubeType changes
  useEffect(() => {
    // Solve the cube each time there's a new scramble or cube type
    const initCube = () => {
      // Create a solved cube state
      const getSolvedCube = () => {
        // For standard NxN cubes
        if (['2x2', '3x3', '4x4', '5x5', '6x6', '7x7'].includes(cubeType)) {
          return {
            U: Array(size * size).fill('U'),
            R: Array(size * size).fill('R'),
            F: Array(size * size).fill('F'),
            D: Array(size * size).fill('D'),
            L: Array(size * size).fill('L'),
            B: Array(size * size).fill('B')
          };
        }
        // For Pyraminx
        else if (cubeType === 'pyraminx') {
          return {
            U: Array(9).fill('U'),   // Top face (triangle)
            R: Array(9).fill('R'),   // Right face (triangle) 
            L: Array(9).fill('L'),   // Left face (triangle)
            BL: Array(9).fill('BL'), // Bottom-left face (triangle)
          };
        }
        // For Skewb
        else if (cubeType === 'skewb') {
          return {
            U: Array(9).fill('U'),
            R: Array(9).fill('R'),
            F: Array(9).fill('F'),
            L: Array(9).fill('L'),
            BU: Array(9).fill('BU'), // Bottom face
            B: Array(9).fill('B'),   // Back face
          };
        }
        // For Square-1
        else if (cubeType === 'sq1') {
          return {
            U: Array(8).fill('U'),   // Top layer (8 pieces)
            D: Array(8).fill('D'),   // Bottom layer (8 pieces)
            E: Array(12).fill('E'),  // Equator pieces
          };
        }
        
        // Default to 3x3 if type is not recognized
        return {
          U: Array(9).fill('U'),
          R: Array(9).fill('R'),
          F: Array(9).fill('F'),
          D: Array(9).fill('D'),
          L: Array(9).fill('L'),
          B: Array(9).fill('B')
        };
      };

      // Function to rotate a standard cube face clockwise
      const rotateFaceClockwise = (face, n = size) => {
        const newFace = [...face];
        
        if (n === 2) {
          // 2x2 cube
          // 0 1    ->    2 0
          // 2 3          3 1
          newFace[0] = face[2];
          newFace[1] = face[0];
          newFace[2] = face[3];
          newFace[3] = face[1];
        } 
        else if (n === 3) {
          // 3x3 cube
          // 0 1 2    ->    6 3 0
          // 3 4 5          7 4 1
          // 6 7 8          8 5 2
          newFace[0] = face[6];
          newFace[1] = face[3];
          newFace[2] = face[0];
          newFace[3] = face[7];
          newFace[4] = face[4]; // center stays the same
          newFace[5] = face[1];
          newFace[6] = face[8];
          newFace[7] = face[5];
          newFace[8] = face[2];
        }
        else {
          // General algorithm for NxN cubes (4x4, 5x5, etc.)
          // We need to handle the rotation layer by layer
          
          // Copy the face first
          const tempFace = [...face];
          
          // Rotate the outer layer
          for (let i = 0; i < n; i++) {
            // Top row -> Right column
            newFace[i * n + (n - 1)] = tempFace[i];
            
            // Right column -> Bottom row (reversed)
            newFace[(n - 1) * n + (n - 1 - i)] = tempFace[i * n + (n - 1)];
            
            // Bottom row -> Left column (reversed)
            newFace[(n - 1 - i) * n] = tempFace[(n - 1) * n + i];
            
            // Left column -> Top row
            newFace[i] = tempFace[(n - 1 - i) * n];
          }
          
          // For cubes 4x4 and larger, we need to rotate inner layers too
          if (n >= 4) {
            // This is a simplified approach - for a complete solution,
            // we would need to rotate each layer recursively
            rotateFaceClockwise(
              face.filter((_, i) => 
                i % n !== 0 && i % n !== n - 1 && 
                Math.floor(i / n) !== 0 && Math.floor(i / n) !== n - 1
              ), 
              n - 2
            );
          }
        }
        
        return newFace;
      };

      // Function to rotate a face counterclockwise
      const rotateFaceCounterClockwise = (face) => {
        // Apply clockwise rotation three times to get counterclockwise
        let result = [...face];
        for (let i = 0; i < 3; i++) {
          result = rotateFaceClockwise(result);
        }
        return result;
      };

      // Function to apply a move to the cube
      const applyMove = (cube, move) => {
        // Create a new cube to avoid mutating the original
        const newCube = {};
        for (const face in cube) {
          newCube[face] = [...cube[face]];
        }
        
        // NxN cube moves
        if (['2x2', '3x3', '4x4', '5x5', '6x6', '7x7'].includes(cubeType)) {
          // Parse the move
          const face = move[0].toUpperCase(); // Face to rotate (U, R, F, D, L, B)
          const modifier = move.slice(1);
          const isWide = modifier.includes('w') || modifier.includes('W');
          const isPrime = modifier.includes("'");
          const isDouble = modifier.includes('2');
          
          // Apply the face rotation
          if (isDouble) {
            newCube[face] = rotateFaceClockwise(rotateFaceClockwise(newCube[face]));
          } else if (isPrime) {
            newCube[face] = rotateFaceCounterClockwise(newCube[face]);
          } else {
            newCube[face] = rotateFaceClockwise(newCube[face]);
          }
          
          // Apply adjacent sticker rotations based on the move
          applyAdjacentRotations(newCube, face, isPrime, isDouble, isWide);
        }
        // Handle Pyraminx, Skewb, Sq-1 moves here
        // (implementations omitted for brevity)
        
        return newCube;
      };
      
      // Function to handle adjacent face rotations for NxN cubes
      const applyAdjacentRotations = (newCube, face, isPrime, isDouble, isWide) => {
        // Define adjacent sticker movements for each face
        const getAdjacentStickers = (face) => {
          // For each cube size, we map out which stickers are affected when a face is rotated
          
          if (size === 2) {
            // For 2x2, the relationship between faces and indices:
            // 0 1
            // 2 3
            const adjacencyMap = {
              'U': {
                pieces: [
                  [newCube.B, [0, 1]], // B top row
                  [newCube.R, [0, 1]], // R top row
                  [newCube.F, [0, 1]], // F top row
                  [newCube.L, [0, 1]]  // L top row
                ]
              },
              'R': {
                pieces: [
                  [newCube.U, [1, 3]], // U right column
                  [newCube.F, [1, 3]], // F right column
                  [newCube.D, [1, 3]], // D right column
                  [newCube.B, [0, 2]]  // B left column (reversed)
                ]
              },
              'F': {
                pieces: [
                  [newCube.U, [2, 3]], // U bottom row
                  [newCube.R, [0, 2]], // R left column
                  [newCube.D, [1, 0]], // D top row (reversed)
                  [newCube.L, [1, 3]]  // L right column (correction: was [3, 1])
                ]
              },
              'D': {
                pieces: [
                  [newCube.F, [2, 3]], // F bottom row
                  [newCube.R, [2, 3]], // R bottom row
                  [newCube.B, [2, 3]], // B bottom row
                  [newCube.L, [2, 3]]  // L bottom row
                ]
              },
              'L': {
                pieces: [
                  [newCube.U, [0, 2]], // U left column
                  [newCube.B, [1, 3]], // B right column (reversed)
                  [newCube.D, [0, 2]], // D left column
                  [newCube.F, [0, 2]]  // F left column
                ]
              },
              'B': {
                pieces: [
                  [newCube.U, [0, 1]], // U top row
                  [newCube.L, [0, 2]], // L left column
                  [newCube.D, [3, 2]], // D bottom row (reversed)
                  [newCube.R, [1, 3]]  // R right column (correction: was [3, 1])
                ]
              }
            };
            
            return adjacencyMap[face] || { pieces: [] };
          }
          else if (size === 3) {
            // For 3x3, the relationship between faces and indices:
            // 0 1 2
            // 3 4 5
            // 6 7 8
            const adjacencyMap = {
              'U': {
                pieces: [
                  [newCube.B, [0, 1, 2]], // B top row
                  [newCube.R, [0, 1, 2]], // R top row
                  [newCube.F, [0, 1, 2]], // F top row
                  [newCube.L, [0, 1, 2]]  // L top row
                ]
              },
              'R': {
                pieces: [
                  [newCube.U, [2, 5, 8]], // U right column
                  [newCube.F, [2, 5, 8]], // F right column
                  [newCube.D, [2, 5, 8]], // D right column
                  [newCube.B, [6, 3, 0]]  // B left column (reversed)
                ]
              },
              'F': {
                pieces: [
                  [newCube.U, [6, 7, 8]], // U bottom row
                  [newCube.R, [0, 3, 6]], // R left column
                  [newCube.D, [2, 1, 0]], // D top row (reversed)
                  [newCube.L, [8, 5, 2]]  // L right column (reversed)
                ]
              },
              'D': {
                pieces: [
                  [newCube.F, [6, 7, 8]], // F bottom row
                  [newCube.R, [6, 7, 8]], // R bottom row
                  [newCube.B, [6, 7, 8]], // B bottom row
                  [newCube.L, [6, 7, 8]]  // L bottom row
                ]
              },
              'L': {
                pieces: [
                  [newCube.U, [0, 3, 6]], // U left column
                  [newCube.F, [0, 3, 6]], // F left column
                  [newCube.D, [0, 3, 6]], // D left column
                  [newCube.B, [8, 5, 2]]  // B right column (reversed)
                ]
              },
              'B': {
                pieces: [
                  [newCube.U, [2, 1, 0]], // U top row (reversed)
                  [newCube.L, [0, 3, 6]], // L left column
                  [newCube.D, [6, 7, 8]], // D bottom row
                  [newCube.R, [8, 5, 2]]  // R right column (reversed)
                ]
              }
            };
            
            return adjacencyMap[face] || { pieces: [] };
          }
          // For 4x4 and larger, we'd need more detailed mappings
          // This is omitted for brevity but would follow similar patterns
          
          return { pieces: [] };
        };
        
        // Get the adjacent stickers affected by this move
        const adjacentStickers = getAdjacentStickers(face);
        
        // Apply the rotation to the adjacent stickers
        if (adjacentStickers.pieces.length > 0) {
          // Save the original values before modifying
          const savedValues = adjacentStickers.pieces.map(piece => 
            piece[1].map(idx => piece[0][idx])
          );
          
          if (isDouble) {
            // For 180° moves, swap pieces 0↔2 and 1↔3
            adjacentStickers.pieces[0][1].forEach((idx, i) => {
              adjacentStickers.pieces[0][0][idx] = savedValues[2][i];
            });
            adjacentStickers.pieces[1][1].forEach((idx, i) => {
              adjacentStickers.pieces[1][0][idx] = savedValues[3][i];
            });
            adjacentStickers.pieces[2][1].forEach((idx, i) => {
              adjacentStickers.pieces[2][0][idx] = savedValues[0][i];
            });
            adjacentStickers.pieces[3][1].forEach((idx, i) => {
              adjacentStickers.pieces[3][0][idx] = savedValues[1][i];
            });
          } else if (isPrime) {
            // For counterclockwise moves, rotate adjacent stickers accordingly
            // 0←3←2←1←0
            adjacentStickers.pieces[0][1].forEach((idx, i) => {
              adjacentStickers.pieces[0][0][idx] = savedValues[3][i];
            });
            adjacentStickers.pieces[3][1].forEach((idx, i) => {
              adjacentStickers.pieces[3][0][idx] = savedValues[2][i];
            });
            adjacentStickers.pieces[2][1].forEach((idx, i) => {
              adjacentStickers.pieces[2][0][idx] = savedValues[1][i];
            });
            adjacentStickers.pieces[1][1].forEach((idx, i) => {
              adjacentStickers.pieces[1][0][idx] = savedValues[0][i];
            });
          } else {
            // For clockwise moves, rotate adjacent stickers accordingly
            // 0→1→2→3→0
            adjacentStickers.pieces[1][1].forEach((idx, i) => {
              adjacentStickers.pieces[1][0][idx] = savedValues[0][i];
            });
            adjacentStickers.pieces[2][1].forEach((idx, i) => {
              adjacentStickers.pieces[2][0][idx] = savedValues[1][i];
            });
            adjacentStickers.pieces[3][1].forEach((idx, i) => {
              adjacentStickers.pieces[3][0][idx] = savedValues[2][i];
            });
            adjacentStickers.pieces[0][1].forEach((idx, i) => {
              adjacentStickers.pieces[0][0][idx] = savedValues[3][i];
            });
          }
        }
      };
      
      // Function to apply a scramble sequence
      const applyScramble = (scrambleString) => {
        // Start with a solved cube
        let cube = getSolvedCube();
        
        // Parse the scramble string into individual moves
        const moves = scrambleString.trim().split(/\s+/).filter(move => move.length > 0);
        
        // Apply each move in sequence
        moves.forEach(move => {
          try {
            cube = applyMove(cube, move);
          } catch (error) {
            console.error(`Failed to apply move ${move} on ${cubeType}:`, error);
          }
        });
        
        return cube;
      };
      
      // Initialize the cube state
      let initialCubeState;
      if (scramble && scramble !== 'Loading...') {
        // Apply the scramble to a solved cube
        initialCubeState = applyScramble(scramble);
      } else {
        // Start with a solved cube
        initialCubeState = getSolvedCube();
      }
      
      // Update the state
      setCubeState(initialCubeState);
    };
    
    // Call the initialization
    initCube();
  }, [scramble, cubeType, size]);
  
  // Function to render a single face of the cube
  const CubeFace = ({ face, size, faceState }) => {
    if (!faceState) return null;
    
    return (
      <div 
        className="relative border-2 border-gray-800 shadow-md"
        style={{ 
          width: size * cellSize + (size-1) * spacing, 
          height: size * cellSize + (size-1) * spacing 
        }}
      >
        <div 
          className="absolute inset-0 grid" 
          style={{ 
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
            gap: `${spacing}px`
          }}
        >
          {faceState.map((sticker, i) => (
            <div 
              key={i} 
              className="border border-black" 
              style={{ 
                backgroundColor: colors[sticker], 
                boxShadow: 'inset 0 0 3px rgba(0,0,0,0.3)' 
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-bold text-black text-opacity-80 text-xs bg-white bg-opacity-50 px-1 rounded">
            {face}
          </span>
        </div>
      </div>
    );
  };
  
  // Show loading state if cube state isn't ready
  if (!cubeState) {
    return <div>Initializing puzzle...</div>;
  }
  
  // Render the cube visualization
  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 w-full max-w-md mx-auto">
        <div className="flex flex-col items-center">
          {/* Cube net layout - standard 6-faced cube */}
          {['2x2', '3x3', '4x4', '5x5', '6x6', '7x7'].includes(cubeType) && (
            <>
              <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2px', marginBottom: '2px' }}>
                <div className="flex justify-center">
                  <CubeFace face="U" size={size} faceState={cubeState.U} />
                </div>
              </div>
              
              <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '2px' }}>
                <CubeFace face="L" size={size} faceState={cubeState.L} />
                <CubeFace face="F" size={size} faceState={cubeState.F} />
                <CubeFace face="R" size={size} faceState={cubeState.R} />
                <CubeFace face="B" size={size} faceState={cubeState.B} />
              </div>
              
              <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2px' }}>
                <div className="flex justify-center">
                  <CubeFace face="D" size={size} faceState={cubeState.D} />
                </div>
              </div>
            </>
          )}
          
          {/* Pyraminx layout */}
          {cubeType === 'pyraminx' && (
            <div>Pyraminx visualization (to be implemented)</div>
          )}
          
          {/* Skewb layout */}
          {cubeType === 'skewb' && (
            <div>Skewb visualization (to be implemented)</div>
          )}
          
          {/* Square-1 layout */}
          {cubeType === 'sq1' && (
            <div>Square-1 visualization (to be implemented)</div>
          )}
          
          {/* Scramble text display */}
          {scramble && scramble !== 'Loading...' && (
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-300 max-w-full text-center">
              <div className="mb-1 font-medium">
                {cubeType} Scramble ({scramble.trim().split(/\s+/).length} moves)
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {scramble.trim().split(/\s+/).map((move, index) => (
                  <span key={index} className="inline-block bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">
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

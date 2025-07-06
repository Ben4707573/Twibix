"use client";

import React, { useEffect, useState } from 'react';

export function ScrambleVisualizer({ scramble, cubeType }) {
  const colors = {
    'U': '#FFFFFF', // White
    'R': '#FF0000', // Red
    'F': '#00AF00', // Green
    'D': '#FFFF00', // Yellow
    'L': '#FF8000', // Orange
    'B': '#0000FF'  // Blue
  };

  // Set dimensions based on cube type
  let size;
  if (cubeType === '2x2') {
    size = 2;
  } else if (cubeType === '3x3') {
    size = 3;
  } else if (cubeType === '4x4') {
    size = 4;
  } else if (cubeType === '5x5') {
    size = 5;
  } else if (cubeType === '6x6') {
    size = 6;
  } else if (cubeType === '7x7') {
    size = 7;
  } else if (cubeType === 'pyraminx') {
    size = 3; // Treat pyraminx as 3x3 for display purposes
  } else {
    size = 3; // Default fallback
  }
  
  // Adjust cell size based on cube type for better visibility
  const cellSize = size <= 3 ? 24 : size <= 5 ? 20 : 16; // Adjust size based on cube dimensions
  const spacing = 2;

  // State to hold the cube representation
  const [cubeState, setCubeState] = useState(null);

  // Initialize the cube with its solved state
  useEffect(() => {
    const initCube = () => {
      // Create a solved cube state
      const getSolvedCube = () => ({
        U: Array(size * size).fill('U'),
        R: Array(size * size).fill('R'),
        F: Array(size * size).fill('F'),
        D: Array(size * size).fill('D'),
        L: Array(size * size).fill('L'),
        B: Array(size * size).fill('B')
      });

      // Function to rotate a face 90 degrees clockwise
      const rotateFaceClockwise = (face) => {
        const newFace = [...face];
        if (size === 2) {
          // 2x2: 0 1    ->    2 0
          //      2 3          3 1
          [newFace[0], newFace[1], newFace[2], newFace[3]] = [face[2], face[0], face[3], face[1]];
        } else if (size === 3) {
          // 3x3: 0 1 2    ->    6 3 0
          //      3 4 5          7 4 1
          //      6 7 8          8 5 2
          [newFace[0], newFace[1], newFace[2], newFace[3], newFace[5], newFace[6], newFace[7], newFace[8]] = 
          [face[6], face[3], face[0], face[7], face[1], face[8], face[5], face[2]];
          // Center stays in place
          newFace[4] = face[4];
        } else if (size === 4) {
          // 4x4 outer ring
          [newFace[0], newFace[1], newFace[2], newFace[3], newFace[7], newFace[11], newFace[15], newFace[14], newFace[13], newFace[12], newFace[8], newFace[4]] = 
          [face[12], face[8], face[4], face[0], face[1], face[2], face[3], face[7], face[11], face[15], face[14], face[13]];
          // 4x4 inner ring
          [newFace[5], newFace[6], newFace[10], newFace[9]] = [face[9], face[5], face[6], face[10]];
        }
        return newFace;
      };

      // Function to rotate a face 90 degrees counterclockwise
      const rotateFaceCounterClockwise = (face) => {
        // Rotate clockwise 3 times = counterclockwise once
        let result = [...face];
        for (let i = 0; i < 3; i++) {
          result = rotateFaceClockwise(result);
        }
        return result;
      };

      // Function to apply a single move to the cube
      const applyMove = (cube, move) => {
        const newCube = {
          U: [...cube.U],
          R: [...cube.R],
          F: [...cube.F],
          D: [...cube.D],
          L: [...cube.L],
          B: [...cube.B]
        };

        const face = move[0];
        const modifier = move.slice(1);
        const isWide = modifier.includes('w');
        const isPrime = modifier.includes("'");
        const isDouble = modifier.includes('2');

        // Helper function to get adjacent pieces for each face  
        // Based on standard WCA notation and cube orientation
        const getAdjacentPieces = (face, layer = 'outer') => {
          if (size === 2) {
            switch (face) {
              case 'R':
                // R face clockwise: U-right → F-right → D-right → B-left (reversed)
                return {
                  pieces: [
                    [newCube.U, [1, 3]], 
                    [newCube.F, [1, 3]], 
                    [newCube.D, [1, 3]], 
                    [newCube.B, [2, 0]]
                  ]
                };
              case 'L':
                // L face clockwise: U-left → F-left → D-left → B-right (reversed)
                return {
                  pieces: [
                    [newCube.U, [0, 2]], 
                    [newCube.F, [0, 2]], 
                    [newCube.D, [0, 2]], 
                    [newCube.B, [3, 1]]
                  ]
                };
              case 'U':
                // U face clockwise: B-top → R-top → F-top → L-top
                return {
                  pieces: [
                    [newCube.B, [0, 1]], 
                    [newCube.R, [0, 1]], 
                    [newCube.F, [0, 1]], 
                    [newCube.L, [0, 1]]
                  ]
                };
              case 'D':
                // D face clockwise: F-bottom → R-bottom → B-bottom → L-bottom
                return {
                  pieces: [
                    [newCube.F, [2, 3]], 
                    [newCube.R, [2, 3]], 
                    [newCube.B, [2, 3]], 
                    [newCube.L, [2, 3]]
                  ]
                };
              case 'F':
                // F face clockwise: U-bottom → R-left → D-top (reversed) → L-right (reversed)
                return {
                  pieces: [
                    [newCube.U, [2, 3]], 
                    [newCube.R, [0, 2]], 
                    [newCube.D, [1, 0]], 
                    [newCube.L, [3, 1]]
                  ]
                };
              case 'B':
                // B face clockwise: U-top (reversed) → L-left → D-bottom → R-right (reversed)
                return {
                  pieces: [
                    [newCube.U, [1, 0]], 
                    [newCube.L, [0, 2]], 
                    [newCube.D, [2, 3]], 
                    [newCube.R, [3, 1]]
                  ]
                };
            }
          } else if (size === 3) {
            switch (face) {
              case 'R':
                // R face: U right column -> F right column -> D right column -> B left column (reversed)
                return {
                  pieces: [
                    [newCube.U, [2, 5, 8]], 
                    [newCube.F, [2, 5, 8]], 
                    [newCube.D, [2, 5, 8]], 
                    [newCube.B, [6, 3, 0]]  // B left column reversed
                  ]
                };
              case 'L':
                // L face clockwise: U-left → F-left → D-left → B-right → U-left
                // B-right is reversed because it's viewed from the opposite side
                return {
                  pieces: [
                    [newCube.U, [0, 3, 6]], 
                    [newCube.F, [0, 3, 6]], 
                    [newCube.D, [0, 3, 6]], 
                    [newCube.B, [8, 5, 2]] // B right column reversed
                  ]
                };
              case 'U':
                // U face: B top row -> R top row -> F top row -> L top row
                return {
                  pieces: [
                    [newCube.B, [0, 1, 2]], 
                    [newCube.R, [0, 1, 2]], 
                    [newCube.F, [0, 1, 2]], 
                    [newCube.L, [0, 1, 2]]
                  ]
                };
              case 'D':
                // D face: F bottom row -> R bottom row -> B bottom row -> L bottom row
                return {
                  pieces: [
                    [newCube.F, [6, 7, 8]], 
                    [newCube.R, [6, 7, 8]], 
                    [newCube.B, [6, 7, 8]], 
                    [newCube.L, [6, 7, 8]]
                  ]
                };
              case 'F':
                // F face: U bottom row -> R left column -> D top row (reversed) -> L right column (reversed)
                return {
                  pieces: [
                    [newCube.U, [6, 7, 8]], 
                    [newCube.R, [0, 3, 6]], 
                    [newCube.D, [2, 1, 0]], // D top row reversed
                    [newCube.L, [8, 5, 2]]  // L right column reversed
                  ]
                };
              case 'B':
                // B face clockwise: According to standard notation  
                // U-top → R-right → D-bottom → L-left → U-top
                // But B face is viewed from behind, so some mappings are reversed
                return {
                  pieces: [
                    [newCube.U, [2, 1, 0]], // U top row (right to left when viewed from back)
                    [newCube.L, [0, 3, 6]], // L left column (top to bottom)
                    [newCube.D, [6, 7, 8]], // D bottom row (left to right when viewed from back)
                    [newCube.R, [8, 5, 2]]  // R right column (bottom to top when viewed from back)
                  ]
                };
            }
          } else if (size === 4) {
            // 4x4 moves - support both outer and inner layers
            if (layer === 'outer') {
              // Outer layer moves
              switch (face) {
                case 'R':
                  return {
                    pieces: [
                      [newCube.U, [3, 7, 11, 15]], 
                      [newCube.F, [3, 7, 11, 15]], 
                      [newCube.D, [3, 7, 11, 15]], 
                      [newCube.B, [12, 8, 4, 0]]
                    ]
                  };
                case 'L':
                  return {
                    pieces: [
                      [newCube.U, [0, 4, 8, 12]], 
                      [newCube.B, [15, 11, 7, 3]], 
                      [newCube.D, [0, 4, 8, 12]], 
                      [newCube.F, [0, 4, 8, 12]]
                    ]
                  };
                case 'U':
                  return {
                    pieces: [
                      [newCube.B, [0, 1, 2, 3]], 
                      [newCube.R, [0, 1, 2, 3]], 
                      [newCube.F, [0, 1, 2, 3]], 
                      [newCube.L, [0, 1, 2, 3]]
                    ]
                  };
                case 'D':
                  return {
                    pieces: [
                      [newCube.F, [12, 13, 14, 15]], 
                      [newCube.R, [12, 13, 14, 15]], 
                      [newCube.B, [12, 13, 14, 15]], 
                      [newCube.L, [12, 13, 14, 15]]
                    ]
                  };
                case 'F':
                  return {
                    pieces: [
                      [newCube.U, [12, 13, 14, 15]], 
                      [newCube.R, [0, 4, 8, 12]], 
                      [newCube.D, [3, 2, 1, 0]], 
                      [newCube.L, [15, 11, 7, 3]]
                    ]
                  };
                case 'B':
                  return {
                    pieces: [
                      [newCube.U, [3, 2, 1, 0]], 
                      [newCube.L, [0, 4, 8, 12]], 
                      [newCube.D, [12, 13, 14, 15]], 
                      [newCube.R, [15, 11, 7, 3]]
                    ]
                  };
              }
            } else if (layer === 'inner') {
              // Inner layer moves (for wide moves)
              switch (face) {
                case 'R':
                  return {
                    pieces: [
                      [newCube.U, [2, 6, 10, 14]], 
                      [newCube.F, [2, 6, 10, 14]], 
                      [newCube.D, [2, 6, 10, 14]], 
                      [newCube.B, [13, 9, 5, 1]]
                    ]
                  };
                case 'L':
                  return {
                    pieces: [
                      [newCube.U, [1, 5, 9, 13]], 
                      [newCube.B, [14, 10, 6, 2]], 
                      [newCube.D, [1, 5, 9, 13]], 
                      [newCube.F, [1, 5, 9, 13]]
                    ]
                  };
                case 'U':
                  return {
                    pieces: [
                      [newCube.B, [4, 5, 6, 7]], 
                      [newCube.R, [4, 5, 6, 7]], 
                      [newCube.F, [4, 5, 6, 7]], 
                      [newCube.L, [4, 5, 6, 7]]
                    ]
                  };
                case 'D':
                  return {
                    pieces: [
                      [newCube.F, [8, 9, 10, 11]], 
                      [newCube.R, [8, 9, 10, 11]], 
                      [newCube.B, [8, 9, 10, 11]], 
                      [newCube.L, [8, 9, 10, 11]]
                    ]
                  };
                case 'F':
                  return {
                    pieces: [
                      [newCube.U, [8, 9, 10, 11]], 
                      [newCube.R, [1, 5, 9, 13]], 
                      [newCube.D, [6, 5, 4, 7]], 
                      [newCube.L, [14, 10, 6, 2]]
                    ]
                  };
                case 'B':
                  return {
                    pieces: [
                      [newCube.U, [7, 6, 5, 4]], 
                      [newCube.L, [1, 5, 9, 13]], 
                      [newCube.D, [8, 9, 10, 11]], 
                      [newCube.R, [14, 10, 6, 2]]
                    ]
                  };
              }
            }
          }
          return { pieces: [] };
        };

        // Rotate the face itself
        if (isDouble) {
          newCube[face] = rotateFaceClockwise(rotateFaceClockwise(newCube[face]));
        } else if (isPrime) {
          newCube[face] = rotateFaceCounterClockwise(newCube[face]);
        } else {
          newCube[face] = rotateFaceClockwise(newCube[face]);
        }

        // Helper function to apply piece rotation for a given layer
        const applyPieceRotation = (pieces, isDouble, isPrime) => {
          if (pieces.length === 0) return;
          
          // Store current values of all pieces before modifying
          const savedValues = pieces.map(piece => 
            piece[1].map(idx => piece[0][idx])
          );
          
          if (isDouble) {
            // For 180° moves, swap pieces 0↔2 and 1↔3
            pieces[0][1].forEach((idx, i) => {
              pieces[0][0][idx] = savedValues[2][i];
            });
            pieces[1][1].forEach((idx, i) => {
              pieces[1][0][idx] = savedValues[3][i];
            });
            pieces[2][1].forEach((idx, i) => {
              pieces[2][0][idx] = savedValues[0][i];
            });
            pieces[3][1].forEach((idx, i) => {
              pieces[3][0][idx] = savedValues[1][i];
            });
          } else if (isPrime) {
            // For counterclockwise moves: 0←3←2←1←0
            pieces[0][1].forEach((idx, i) => {
              pieces[0][0][idx] = savedValues[3][i];
            });
            pieces[3][1].forEach((idx, i) => {
              pieces[3][0][idx] = savedValues[2][i];
            });
            pieces[2][1].forEach((idx, i) => {
              pieces[2][0][idx] = savedValues[1][i];
            });
            pieces[1][1].forEach((idx, i) => {
              pieces[1][0][idx] = savedValues[0][i];
            });
          } else {
            // For clockwise moves: 0→1→2→3→0
            pieces[1][1].forEach((idx, i) => {
              pieces[1][0][idx] = savedValues[0][i];
            });
            pieces[2][1].forEach((idx, i) => {
              pieces[2][0][idx] = savedValues[1][i];
            });
            pieces[3][1].forEach((idx, i) => {
              pieces[3][0][idx] = savedValues[2][i];
            });
            pieces[0][1].forEach((idx, i) => {
              pieces[0][0][idx] = savedValues[3][i];
            });
          }
        };

        // Apply move to outer layer
        const outerPieces = getAdjacentPieces(face, 'outer');
        if (outerPieces.pieces.length > 0) {
          applyPieceRotation(outerPieces.pieces, isDouble, isPrime);
        }

        // For wide moves on 4x4, also apply to inner layer
        if (isWide && size === 4) {
          const innerPieces = getAdjacentPieces(face, 'inner');
          if (innerPieces.pieces.length > 0) {
            applyPieceRotation(innerPieces.pieces, isDouble, isPrime);
          }
        }

        return newCube;
      };

      // Apply the scramble to get the final cube state
      const applyScramble = (moves) => {
        let cube = getSolvedCube();
        
        // Filter valid moves and ensure they're uppercase
        const validMoves = moves.filter(move => move && /^[URFDLB]w?['2]?$/.test(move.toUpperCase()));
        
        validMoves.forEach(move => {
          try {
            cube = applyMove(cube, move.toUpperCase());
          } catch (error) {
            console.warn(`Failed to apply move ${move}:`, error);
          }
        });
        
        return cube;
      };

      let newCube;
      try {
        if (scramble && scramble !== 'Loading...') {
          // Parse the scramble and apply moves
          const moves = scramble.trim().split(/\s+/).filter(move => move && move.length > 0);
          
          // const testMoves = ['R']; // Simple test
          // newCube = applyScramble(testMoves);
          
          newCube = applyScramble(moves);
        } else {
          // For a solved cube
          newCube = getSolvedCube();
        }
        
        setCubeState(newCube);
      } catch (error) {
        console.error(`Error initializing ${cubeType} cube:`, error);
        // Set to solved state as fallback
        setCubeState(getSolvedCube());
      }
    };
    
    initCube();
  }, [scramble, cubeType, size]);

  // Helper function to get adjacent faces
  const getAdjacentFaces = (face) => {
    switch(face) {
      case 'U': return ['F', 'R', 'B', 'L'];
      case 'D': return ['F', 'R', 'B', 'L'];
      case 'F': return ['U', 'R', 'D', 'L'];
      case 'B': return ['U', 'R', 'D', 'L'];
      case 'R': return ['U', 'F', 'D', 'B'];
      case 'L': return ['U', 'F', 'D', 'B'];
      default: return [];
    }
  };

  // Create a cube face component that takes a face and its current state
  const CubeFace = ({ face, size, faceState }) => {
    if (!faceState) return null;
    
    // Adjust scaling for larger cubes
    const scale = size > 5 ? 0.8 : size > 3 ? 0.9 : 1;
    const adjustedCellSize = cellSize * scale;
    
    return (
      <div 
        className="relative border-2 border-gray-800 shadow-md"
        style={{ 
          width: size * adjustedCellSize + (size-1) * spacing, 
          height: size * adjustedCellSize + (size-1) * spacing 
        }}
      >
        <div className="absolute inset-0 grid" style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          gap: `${spacing}px`
        }}>
          {faceState.map((sticker, i) => (
            <div 
              key={i} 
              className="border border-black" 
              style={{ backgroundColor: colors[sticker], boxShadow: 'inset 0 0 3px rgba(0,0,0,0.3)' }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-bold text-black text-opacity-70 text-xs">{face}</span>
        </div>
      </div>
    );
  };

  // If cube state isn't ready yet, show loading
  if (!cubeState) {
    return <div>Initializing cube...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className={`bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 w-full mx-auto ${
        size > 5 ? 'max-w-2xl' : size > 3 ? 'max-w-xl' : 'max-w-lg'
      }`}>
        <div className="flex flex-col items-center">
          {/* Cube net layout */}
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
          
          {/* Scramble text */}
          {scramble && scramble !== 'Loading...' && (
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-300 max-w-full text-center">
              <div className="mb-1 font-medium">
                {cubeType} Scramble ({scramble.trim().split(/\s+/).filter(move => move).length} moves)
              </div>
              <div className={`flex flex-wrap justify-center gap-1 p-2 ${size > 5 ? 'max-h-60' : 'max-h-48'} overflow-y-auto bg-white dark:bg-gray-700 rounded-lg shadow-inner`}>
                {scramble.trim().split(/\s+/).map((move, index) => (
                  <span 
                    key={index} 
                    className={`inline-block ${
                      size > 5 ? 'bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded text-sm' : 
                      'bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-base'
                    } font-mono`}
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

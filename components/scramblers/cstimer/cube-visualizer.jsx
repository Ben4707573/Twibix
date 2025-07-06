"use client";

import React, { useEffect, useState, useRef } from 'react';
import { SVG, drawNNNCube } from './draw-utils';

/**
 * CSTimer-style cube scramble visualizer
 * Based on the visualization code from CSTimer: https://github.com/cs0x7f/cstimer/
 * 
 * This component renders a cube state visualization using SVG
 * similar to the original CSTimer implementation
 */
export function CSTimerCubeVisualizer({ scramble, cubeType }) {
  const [svgString, setSvgString] = useState(null);
  const containerRef = useRef(null);
  
  // Colors based on CSTimer's default color scheme
  const colors = {
    'U': '#FFFFFF', // White
    'R': '#FF0000', // Red
    'F': '#00AF00', // Green
    'D': '#FFFF00', // Yellow
    'L': '#FF8000', // Orange
    'B': '#0000FF'  // Blue
  };

  // Parse cube type to get size
  let size = 3; // Default to 3x3
  if (cubeType.includes('x')) {
    const match = cubeType.match(/(\d+)x\d+/);
    if (match) {
      size = parseInt(match[1], 10);
    }
  }

  useEffect(() => {
    if (!scramble || scramble === 'Loading...') {
      // Create a solved cube visualization as placeholder
      renderSolvedCube();
      return;
    }

    // Parse the scramble and visualize
    try {
      visualizeScramble(scramble);
    } catch (error) {
      console.error('Error visualizing scramble:', error);
      renderSolvedCube();
    }
  }, [scramble, cubeType, size]);

  // Function to render a solved cube
  const renderSolvedCube = () => {
    const faceColors = {
      'U': Array(size * size).fill(colors.U),
      'R': Array(size * size).fill(colors.R),
      'F': Array(size * size).fill(colors.F),
      'D': Array(size * size).fill(colors.D),
      'L': Array(size * size).fill(colors.L),
      'B': Array(size * size).fill(colors.B)
    };

    const svg = drawNNNCube(size, faceColors);
    setSvgString(svg.render());
  };

  // Function to visualize a scramble
  const visualizeScramble = (scrambleStr) => {
    // Start with solved cube state
    const state = getInitialCubeState();
    
    // Check if scramble string is valid
    if (!scrambleStr || scrambleStr === 'Loading...') {
      console.warn('Invalid scramble string:', scrambleStr);
      renderSolvedCube();
      return;
    }
    
    // Parse and apply the scramble moves
    const moves = scrambleStr.trim().split(/\s+/);
    
    applyMoves(state, moves);
    
    // Generate the face colors for visualization
    const faceColors = generateFaceColors(state);
    
    // Draw the cube
    const svg = drawNNNCube(size, faceColors);
    setSvgString(svg.render());
  };

  // Initialize cube state in a solved position
  const getInitialCubeState = () => {
    // Create a structured representation of the cube
    // Each face is represented as a 2D array of stickers
    const state = {};
    
    for (const face of 'URFDLB') {
      // Initialize each face with its own color
      state[face] = Array(size * size).fill(face);
    }
    
    return state;
  };

  // Apply a sequence of moves to the cube state
  const applyMoves = (state, moves) => {
    // Process each move in the sequence
    for (let move of moves) {
      // Skip empty, null, or undefined moves
      if (!move) continue;
      
      // Parse the move notation
      const { face, depth, amount } = parseMove(move);
      if (!face) continue; // Skip invalid moves
      
      // Apply the move to the cube state
      applySingleMove(state, face, depth, amount);
    }
    
    return state;
  };
  
  // Parse a move string into face, depth, and amount components
  const parseMove = (moveStr) => {
    
    // Skip empty moves
    if (!moveStr || moveStr.trim() === '') {
      return { face: null, depth: 0, amount: 0 };
    }
    
    // Handle slice moves like M, E, S
    if (['M', 'E', 'S'].includes(moveStr[0])) {
      // Map slice moves to equivalent face moves
      const sliceMap = {
        'M': { face: 'L', depth: Math.floor(size / 2) + (size % 2), reverse: true },
        'E': { face: 'D', depth: Math.floor(size / 2) + (size % 2), reverse: false },
        'S': { face: 'F', depth: Math.floor(size / 2) + (size % 2), reverse: false }
      };
      const sliceInfo = sliceMap[moveStr[0]];
      let amount = 1;
      
      if (moveStr.length > 1) {
        if (moveStr[1] === '2') amount = 2;
        else if (moveStr[1] === "'") amount = 3; // Counter-clockwise = 3 clockwise
      }
      
      if (sliceInfo.reverse) amount = (4 - amount) % 4;
      return { face: sliceInfo.face, depth: sliceInfo.depth, amount };
    }
    
    // Regular face moves (URFDLB)
    let face = moveStr[0];
    let depth = 1; // Default to outer layer
    let amount = 1; // Default to 90 degrees clockwise
    
    // Check for wide moves like Rw, 3Rw
    let i = 1;
    let depthStr = '';
    while (i < moveStr.length && !isNaN(parseInt(moveStr[i]))) {
      depthStr += moveStr[i];
      i++;
    }
    
    if (depthStr) {
      depth = parseInt(depthStr);
    } else if (i < moveStr.length && moveStr[i] === 'w') {
      depth = 2; // Default wide move is 2 layers
      i++;
    }
    
    // Check for move amount (2, ', etc.)
    if (i < moveStr.length) {
      if (moveStr[i] === '2') amount = 2;
      else if (moveStr[i] === "'") amount = 3; // Counter-clockwise = 3 clockwise
    }
    
    return { face, depth, amount };
  };
  
  // Apply a single move to the cube state
  const applySingleMove = (state, face, depth = 1, amount = 1) => {
    // For each iteration of the amount (1, 2, or 3 times)
    for (let iter = 0; iter < amount; iter++) {
      // Rotate the face itself if it's an outer layer move
      if (depth >= 1) {
        rotateFace(state, face);
      }
      
      // Rotate the edge stickers affected by this face turn
      rotateEdges(state, face, depth);
    }
  };
  
  // Rotate a single face 90 degrees clockwise
  const rotateFace = (state, face) => {
    const faceStickers = [...state[face]];
    const newFaceStickers = Array(size * size).fill(null);
    
    // Rotate the face 90 degrees clockwise
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Calculate the new position after rotation
        const newI = j;
        const newJ = size - 1 - i;
        
        // Convert 2D coordinates to 1D index
        const oldIndex = i * size + j;
        const newIndex = newI * size + newJ;
        
        newFaceStickers[newIndex] = faceStickers[oldIndex];
      }
    }
    
    state[face] = newFaceStickers;
  };
  
  // Rotate the edges affected by a face turn
  const rotateEdges = (state, face, depth) => {
    // Adjacent faces for each face
    const adjacentFaces = {
      'U': ['B', 'R', 'F', 'L'], // In clockwise order from the back
      'D': ['F', 'R', 'B', 'L'], // In clockwise order from the front
      'F': ['U', 'R', 'D', 'L'], // In clockwise order from the top
      'B': ['U', 'L', 'D', 'R'], // In clockwise order from the top
      'R': ['U', 'B', 'D', 'F'], // In clockwise order from the top
      'L': ['U', 'F', 'D', 'B']  // In clockwise order from the top
    };
    
    // Edge sticker arrays (will hold the stickers we need to rotate)
    const edges = [[], [], [], []];
    
    // Edge sticker positions for each adjacent face
    let positions;
    
    // Get the sticker positions based on the face being rotated
    if (face === 'U') {
      // Top rows of B, R, F, L
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          edges[0].push(state['B'][(d) * size + i]);
          edges[1].push(state['R'][(d) * size + i]);
          edges[2].push(state['F'][(d) * size + i]);
          edges[3].push(state['L'][(d) * size + i]);
        }
      }
      
      // Rotate the edges
      rotateEdgeArray(edges);
      
      // Put stickers back
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          state['B'][(d) * size + i] = edges[0][d * size + i];
          state['R'][(d) * size + i] = edges[1][d * size + i];
          state['F'][(d) * size + i] = edges[2][d * size + i];
          state['L'][(d) * size + i] = edges[3][d * size + i];
        }
      }
    } else if (face === 'D') {
      // Bottom rows of F, R, B, L
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          edges[0].push(state['F'][(size - 1 - d) * size + i]);
          edges[1].push(state['R'][(size - 1 - d) * size + i]);
          edges[2].push(state['B'][(size - 1 - d) * size + i]);
          edges[3].push(state['L'][(size - 1 - d) * size + i]);
        }
      }
      
      // Rotate the edges
      rotateEdgeArray(edges);
      
      // Put stickers back
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          state['F'][(size - 1 - d) * size + i] = edges[0][d * size + i];
          state['R'][(size - 1 - d) * size + i] = edges[1][d * size + i];
          state['B'][(size - 1 - d) * size + i] = edges[2][d * size + i];
          state['L'][(size - 1 - d) * size + i] = edges[3][d * size + i];
        }
      }
    } else if (face === 'F') {
      // Bottom row of U, right col of L, top row of D, left col of R
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          edges[0].push(state['U'][(size - 1 - d) * size + i]);
          edges[1].push(state['R'][i * size + d]);
          edges[2].push(state['D'][d * size + (size - 1 - i)]);
          edges[3].push(state['L'][(size - 1 - i) * size + (size - 1 - d)]);
        }
      }
      
      // Rotate the edges
      rotateEdgeArray(edges);
      
      // Put stickers back (with proper orientation)
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          state['U'][(size - 1 - d) * size + i] = edges[0][d * size + i];
          state['R'][i * size + d] = edges[1][d * size + i];
          state['D'][d * size + (size - 1 - i)] = edges[2][d * size + i];
          state['L'][(size - 1 - i) * size + (size - 1 - d)] = edges[3][d * size + i];
        }
      }
    } else if (face === 'B') {
      // Top row of U, left col of R, bottom row of D, right col of L
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          edges[0].push(state['U'][d * size + (size - 1 - i)]);
          edges[1].push(state['L'][i * size + d]);
          edges[2].push(state['D'][(size - 1 - d) * size + i]);
          edges[3].push(state['R'][(size - 1 - i) * size + (size - 1 - d)]);
        }
      }
      
      // Rotate the edges
      rotateEdgeArray(edges);
      
      // Put stickers back (with proper orientation)
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          state['U'][d * size + (size - 1 - i)] = edges[0][d * size + i];
          state['L'][i * size + d] = edges[1][d * size + i];
          state['D'][(size - 1 - d) * size + i] = edges[2][d * size + i];
          state['R'][(size - 1 - i) * size + (size - 1 - d)] = edges[3][d * size + i];
        }
      }
    } else if (face === 'R') {
      // Right col of U, right col of B, right col of D, right col of F
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          edges[0].push(state['U'][i * size + (size - 1 - d)]);
          edges[1].push(state['B'][(size - 1 - i) * size + d]);
          edges[2].push(state['D'][i * size + (size - 1 - d)]);
          edges[3].push(state['F'][i * size + (size - 1 - d)]);
        }
      }
      
      // Rotate the edges
      rotateEdgeArray(edges);
      
      // Put stickers back
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          state['U'][i * size + (size - 1 - d)] = edges[0][d * size + i];
          state['B'][(size - 1 - i) * size + d] = edges[1][d * size + i];
          state['D'][i * size + (size - 1 - d)] = edges[2][d * size + i];
          state['F'][i * size + (size - 1 - d)] = edges[3][d * size + i];
        }
      }
    } else if (face === 'L') {
      // Left col of U, left col of F, left col of D, left col of B
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          edges[0].push(state['U'][i * size + d]);
          edges[1].push(state['F'][i * size + d]);
          edges[2].push(state['D'][i * size + d]);
          edges[3].push(state['B'][(size - 1 - i) * size + (size - 1 - d)]);
        }
      }
      
      // Rotate the edges
      rotateEdgeArray(edges);
      
      // Put stickers back
      for (let d = 0; d < depth; d++) {
        for (let i = 0; i < size; i++) {
          state['U'][i * size + d] = edges[0][d * size + i];
          state['F'][i * size + d] = edges[1][d * size + i];
          state['D'][i * size + d] = edges[2][d * size + i];
          state['B'][(size - 1 - i) * size + (size - 1 - d)] = edges[3][d * size + i];
        }
      }
    }
  };
  
  // Helper function to rotate edge stickers in a clockwise manner
  const rotateEdgeArray = (edges) => {
    // Store the last edge
    const temp = [...edges[3]];
    
    // Shift edges
    edges[3] = [...edges[2]];
    edges[2] = [...edges[1]];
    edges[1] = [...edges[0]];
    edges[0] = [...temp];
  };
  
  // Generate face colors for visualization based on cube state
  const generateFaceColors = (state) => {
    // Convert internal state to face colors for drawing
    const faceColors = {};
    
    for (const face of 'URFDLB') {
      faceColors[face] = state[face].map(f => colors[f]);
    }
    
    return faceColors;
  };

  return (
    <div ref={containerRef} className="cstimer-visualizer relative w-full">
      {svgString ? (
        <>
          <div
            className="mx-auto"
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            <span title="Visualization based on CSTimer">
              <a 
                href="https://github.com/cs0x7f/cstimer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span className="ml-1">CSTimer</span>
              </a>
            </span>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-40">
          <span>Loading visualization...</span>
        </div>
      )}
    </div>
  );
}

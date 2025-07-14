"use client";

import React, { useEffect, useState, useRef } from 'react';
import { SVG, drawPyraminx } from './draw-utils';

/**
 * CSTimer-style pyraminx scramble visualizer
 * Based on the visualization code from CSTimer: https://github.com/cs0x7f/cstimer/
 * 
 * This component renders a pyraminx state visualization using SVG
 * similar to the original CSTimer implementation
 */
export function CSTimerPyraminxVisualizer({ scramble }) {
  const [svgString, setSvgString] = useState(null);
  const containerRef = useRef(null);
  
  // Face labels in CSTimer notation
  const FACES = ['F', 'R', 'L', 'D'];
  
  useEffect(() => {
    if (!scramble || scramble === 'Loading...') {
      // Create a solved pyraminx visualization as placeholder
      renderSolvedPyraminx();
      return;
    }

    // Parse the scramble and visualize
    try {
      visualizeScramble(scramble);
    } catch (error) {
      console.error('Error visualizing pyraminx scramble:', error);
      renderSolvedPyraminx();
    }
  }, [scramble]);

  // Function to render a solved pyraminx
  const renderSolvedPyraminx = () => {
    // For a solved pyraminx, each face has its own color
    // F=Green, R=Red, L=Yellow, D=Blue in CSTimer's notation
    // We need to create a string with 20 characters (9 pieces per face + tip)
    const solvedState = 'FFFFFRRRRRLLLLLDDDDD';
    const svg = drawPyraminx(solvedState);
    setSvgString(svg.render());
  };

  // Function to visualize a scramble
  const visualizeScramble = (scrambleStr) => {
    // Check if scramble string is valid
    if (!scrambleStr || scrambleStr === 'Loading...') {
      console.warn('Invalid pyraminx scramble string:', scrambleStr);
      renderSolvedPyraminx();
      return;
    }
    
    // Initialize with a solved pyraminx state
    const state = getSolvedPyraminxState();
    
    try {
      // Parse and apply the scramble
      const moves = parseScramble(scrambleStr);
      
      applyPyraminxMoves(state, moves);
      
      // Generate the visualization
      const stateString = convertStateToString(state);
      const svg = drawPyraminx(stateString);
      setSvgString(svg.render());
    } catch (error) {
      console.error('Error visualizing pyraminx scramble:', error);
      renderSolvedPyraminx();
    }
  };
  
  // Parse a pyraminx scramble string into moves
  const parseScramble = (scrambleStr) => {
    // Split the scramble string into individual moves
    return scrambleStr.trim().split(/\s+/);
  };
  
  // Get a solved pyraminx state
  const getSolvedPyraminxState = () => {
    // In a pyraminx, each face has a unique color
    // We'll represent the pyraminx state as a 3D array
    // - First dimension: faces (FRLDU)
    // - Second dimension: rows (0, 1, 2)
    // - Third dimension: stickers in each row
    
    const state = {
      'F': [['F'], ['F', 'F'], ['F', 'F', 'F']], // Front face (Green)
      'R': [['R'], ['R', 'R'], ['R', 'R', 'R']], // Right face (Red)
      'L': [['L'], ['L', 'L'], ['L', 'L', 'L']], // Left face (Yellow)
      'D': [['D'], ['D', 'D'], ['D', 'D', 'D']]  // Bottom face (Blue)
    };
    
    return state;
  };
  
  // Apply a sequence of moves to the pyraminx state
  const applyPyraminxMoves = (state, moves) => {
    for (const moveStr of moves) {
      // Skip empty moves
      if (!moveStr) continue;
      
      // Parse the move notation
      const { face, tips, direction } = parsePyraminxMove(moveStr);
      
      // Apply the face turn if it's not just a tip move
      if (face) {
        // Apply the main face turn
        rotatePyraminxFace(state, face, direction);
      }
      
      // Apply tip moves if present
      if (tips) {
        rotatePyraminxTip(state, tips, direction);
      }
    }
  };
  
  // Parse a pyraminx move string into face, tips, and direction
  const parsePyraminxMove = (moveStr) => {
    // Default values
    let face = null;
    let tips = null;
    let direction = 1; // 1 for clockwise, -1 for counterclockwise
    
    // Check if it's a tip move (lowercase)
    if (moveStr[0] === moveStr[0].toLowerCase() && 'rlu'.includes(moveStr[0])) {
      tips = moveStr[0].toUpperCase();
      
      // Check for direction
      if (moveStr.includes("'")) {
        direction = -1;
      }
      
      return { face, tips, direction };
    }
    
    // Regular face move
    if ('RLUB'.includes(moveStr[0])) {
      face = moveStr[0];
      
      // Check for direction
      if (moveStr.includes("'")) {
        direction = -1;
      }
      
      return { face, tips, direction };
    }
    
    return { face, tips, direction };
  };
  
  // Rotate a pyraminx face
  const rotatePyraminxFace = (state, face, direction) => {
    // In a pyraminx, when a face is turned, it affects parts of three other faces
    // For this simplified implementation, we'll just handle the main face turns
    
    // Map each face to the adjacent faces that are affected by its rotation
    const adjacentFaces = {
      'R': ['F', 'L', 'D'],
      'L': ['F', 'R', 'D'],
      'U': ['F', 'R', 'L'], // U is actually the B face in the model
      'B': ['F', 'R', 'L'], // Alias for U
      'F': ['R', 'L', 'D']
    };
    
    // Get the faces affected by this move
    const affected = adjacentFaces[face] || [];
    
    // Temporary copy of affected pieces
    const temp = {};
    for (const f of affected) {
      temp[f] = JSON.parse(JSON.stringify(state[f]));
    }
    
    // Apply the rotation
    if (face === 'R') {
      // Rotate clockwise: F -> L -> D -> F
      if (direction === 1) {
        // Top corner
        state['F'][0][0] = temp['D'][0][0];
        state['L'][0][0] = temp['F'][0][0];
        state['D'][0][0] = temp['L'][0][0];
        
        // Middle layer
        state['F'][1][1] = temp['D'][1][1];
        state['L'][1][1] = temp['F'][1][1];
        state['D'][1][1] = temp['L'][1][1];
        
        // Edge pieces
        state['F'][1][0] = temp['D'][1][0];
        state['L'][1][0] = temp['F'][1][0];
        state['D'][1][0] = temp['L'][1][0];
      } else {
        // Rotate counter-clockwise: F -> D -> L -> F
        state['F'][0][0] = temp['L'][0][0];
        state['D'][0][0] = temp['F'][0][0];
        state['L'][0][0] = temp['D'][0][0];
        
        state['F'][1][1] = temp['L'][1][1];
        state['D'][1][1] = temp['F'][1][1];
        state['L'][1][1] = temp['D'][1][1];
        
        state['F'][1][0] = temp['L'][1][0];
        state['D'][1][0] = temp['F'][1][0];
        state['L'][1][0] = temp['D'][1][0];
      }
    } else if (face === 'L') {
      // Rotate clockwise: F -> D -> R -> F
      if (direction === 1) {
        // Top corner
        state['F'][0][0] = temp['R'][0][0];
        state['D'][0][0] = temp['F'][0][0];
        state['R'][0][0] = temp['D'][0][0];
        
        // Middle layer
        state['F'][1][0] = temp['R'][1][0];
        state['D'][1][1] = temp['F'][1][0];
        state['R'][1][0] = temp['D'][1][1];
        
        // Edge pieces
        state['F'][1][1] = temp['R'][1][1];
        state['D'][1][0] = temp['F'][1][1];
        state['R'][1][1] = temp['D'][1][0];
      } else {
        // Rotate counter-clockwise: F -> R -> D -> F
        state['F'][0][0] = temp['D'][0][0];
        state['R'][0][0] = temp['F'][0][0];
        state['D'][0][0] = temp['R'][0][0];
        
        state['F'][1][0] = temp['D'][1][1];
        state['R'][1][0] = temp['F'][1][0];
        state['D'][1][1] = temp['R'][1][0];
        
        state['F'][1][1] = temp['D'][1][0];
        state['R'][1][1] = temp['F'][1][1];
        state['D'][1][0] = temp['R'][1][1];
      }
    } else if (face === 'U' || face === 'B') {
      // Rotate clockwise: F -> R -> L -> F
      if (direction === 1) {
        // Top corner
        state['F'][0][0] = temp['L'][0][0];
        state['R'][0][0] = temp['F'][0][0];
        state['L'][0][0] = temp['R'][0][0];
        
        // Middle layer
        state['F'][1][0] = temp['L'][1][0];
        state['R'][1][0] = temp['F'][1][0];
        state['L'][1][0] = temp['R'][1][0];
        
        // Edge pieces
        state['F'][1][1] = temp['L'][1][1];
        state['R'][1][1] = temp['F'][1][1];
        state['L'][1][1] = temp['R'][1][1];
      } else {
        // Rotate counter-clockwise: F -> L -> R -> F
        state['F'][0][0] = temp['R'][0][0];
        state['L'][0][0] = temp['F'][0][0];
        state['R'][0][0] = temp['L'][0][0];
        
        state['F'][1][0] = temp['R'][1][0];
        state['L'][1][0] = temp['F'][1][0];
        state['R'][1][0] = temp['L'][1][0];
        
        state['F'][1][1] = temp['R'][1][1];
        state['L'][1][1] = temp['F'][1][1];
        state['R'][1][1] = temp['L'][1][1];
      }
    } else if (face === 'F') {
      // Rotate clockwise: R -> D -> L -> R
      if (direction === 1) {
        // Top corner
        state['R'][0][0] = temp['L'][0][0];
        state['D'][0][0] = temp['R'][0][0];
        state['L'][0][0] = temp['D'][0][0];
        
        // Middle layer
        state['R'][1][1] = temp['L'][1][1];
        state['D'][1][0] = temp['R'][1][1];
        state['L'][1][1] = temp['D'][1][0];
        
        // Edge pieces
        state['R'][1][0] = temp['L'][1][0];
        state['D'][1][1] = temp['R'][1][0];
        state['L'][1][0] = temp['D'][1][1];
      } else {
        // Rotate counter-clockwise: R -> L -> D -> R
        state['R'][0][0] = temp['D'][0][0];
        state['L'][0][0] = temp['R'][0][0];
        state['D'][0][0] = temp['L'][0][0];
        
        state['R'][1][1] = temp['D'][1][0];
        state['L'][1][1] = temp['R'][1][1];
        state['D'][1][0] = temp['L'][1][1];
        
        state['R'][1][0] = temp['D'][1][1];
        state['L'][1][0] = temp['R'][1][0];
        state['D'][1][1] = temp['L'][1][0];
      }
    }
  };
  
  // Rotate a pyraminx tip
  const rotatePyraminxTip = (state, tip, direction) => {
    // Tip moves only affect the single sticker at the corner
    
    if (tip === 'R') {
      // Rotate the R tip
      const temp = state['R'][0][0];
      if (direction === 1) {
        state['R'][0][0] = state['F'][0][0];
        state['F'][0][0] = state['D'][0][0];
        state['D'][0][0] = temp;
      } else {
        state['R'][0][0] = state['D'][0][0];
        state['D'][0][0] = state['F'][0][0];
        state['F'][0][0] = temp;
      }
    } else if (tip === 'L') {
      // Rotate the L tip
      const temp = state['L'][0][0];
      if (direction === 1) {
        state['L'][0][0] = state['D'][0][0];
        state['D'][0][0] = state['F'][0][0];
        state['F'][0][0] = temp;
      } else {
        state['L'][0][0] = state['F'][0][0];
        state['F'][0][0] = state['D'][0][0];
        state['D'][0][0] = temp;
      }
    } else if (tip === 'U') {
      // Rotate the U tip (back corner)
      const temp = state['F'][0][0];
      if (direction === 1) {
        state['F'][0][0] = state['R'][0][0];
        state['R'][0][0] = state['L'][0][0];
        state['L'][0][0] = temp;
      } else {
        state['F'][0][0] = state['L'][0][0];
        state['L'][0][0] = state['R'][0][0];
        state['R'][0][0] = temp;
      }
    }
  };
  
  // Convert the internal state to a string representation for visualization
  const convertStateToString = (state) => {
    let result = '';
    
    // Each face in the order they appear in the visualization: F, R, L, D
    for (const face of ['F', 'R', 'L', 'D']) {
      // For each row
      for (let i = 0; i < state[face].length; i++) {
        // For each sticker in the row
        for (let j = 0; j < state[face][i].length; j++) {
          result += state[face][i][j];
        }
      }
    }
    
    // Ensure we have the right number of pieces (20 for the visualization)
    while (result.length < 20) {
      result += 'F'; // Pad with front face color if needed
    }
    
    return result;
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

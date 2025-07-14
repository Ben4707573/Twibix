"use client";

/**
 * Adapted from CSTimer's drawing utilities
 * Original source: https://github.com/cs0x7f/cstimer/blob/main/src/js/tools/image.js
 * 
 * This file contains SVG drawing utilities for rendering cube state visualizations
 */

// Math constants
const hsq3 = Math.sqrt(3) / 2;
const PI = Math.PI;

// SVG utility class
class SVG {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.elements = [];
  }

  addElem(elem) {
    this.elements.push(elem);
  }

  addText(text, position, style = {}, scale = 1) {
    const [x, y] = position;
    const fontStyle = style.font || '16px Arial';
    const fill = style.fill || 'black';
    const stroke = style['stroke'] || 'none';
    const strokeWidth = style['stroke-width'] || '0';
    
    this.addElem(`<text x="${x}" y="${y}" 
      font-family="${fontStyle.split(' ').slice(1).join(' ')}" chrome
      font-size="${parseInt(fontStyle) * scale}px" 
      fill="${fill}" 
      stroke="${stroke}" 
      stroke-width="${strokeWidth}"
      text-anchor="middle" 
      dominant-baseline="middle">${text}</text>`);
  }

  renderGroup(x, y, width, height) {
    return `<g transform="translate(${x},${y}) scale(${width/this.width},${height/this.height})">${this.elements.join('')}</g>`;
  }

  render() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">${this.elements.join('')}</svg>`;
  }
}

// Utility functions
function ctxRotate(pts, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const result = [[], []];
  
  for (let i = 0; i < pts[0].length; i++) {
    result[0][i] = pts[0][i] * cos - pts[1][i] * sin;
    result[1][i] = pts[0][i] * sin + pts[1][i] * cos;
  }
  
  return result;
}

function ctxTransform(pts, matrix) {
  const [a, b, c, d, e, f] = matrix;
  const result = [[], []];
  
  for (let i = 0; i < pts[0].length; i++) {
    result[0][i] = pts[0][i] * a + pts[1][i] * c + e;
    result[1][i] = pts[0][i] * b + pts[1][i] * d + f;
  }
  
  return result;
}

function ctxDrawPolygon(svg, color, points, transform) {
  let transformedPoints;
  
  if (transform) {
    transformedPoints = ctxTransform(points, transform);
  } else {
    transformedPoints = points;
  }
  
  const pathPoints = [];
  for (let i = 0; i < transformedPoints[0].length; i++) {
    pathPoints.push(`${transformedPoints[0][i]},${transformedPoints[1][i]}`);
  }
  
  svg.addElem(`<polygon points="${pathPoints.join(' ')}" fill="${color}" stroke="black" stroke-width="1" />`);
}

// Cube-specific drawing functions (NxN)
function drawNNNCube(size, faceColors, width = 30) {
  const svg = new SVG();
  svg.width = (size * 4 + 1) * width;
  svg.height = (size * 3 + 1) * width;
  
  // Draw each face
  drawFace(svg, 'U', 0, size, faceColors.U, width);
  drawFace(svg, 'R', 1, size, faceColors.R, width);
  drawFace(svg, 'F', 2, size, faceColors.F, width);
  drawFace(svg, 'D', 3, size, faceColors.D, width);
  drawFace(svg, 'L', 4, size, faceColors.L, width);
  drawFace(svg, 'B', 5, size, faceColors.B, width);
  
  return svg;
}

// Helper function to draw a single face
function drawFace(svg, faceLabel, faceIndex, size, colors, width) {
  // Position mapping for each face in the net layout
  const positions = {
    'U': { x: size, y: 0 },
    'R': { x: 2 * size, y: size },
    'F': { x: size, y: size },
    'D': { x: size, y: 2 * size },
    'L': { x: 0, y: size },
    'B': { x: 3 * size, y: size },
  };
  
  const { x, y } = positions[faceLabel];
  
  // Draw stickers
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const colorIndex = i * size + j;
      ctxDrawPolygon(
        svg, 
        colors[colorIndex], 
        [
          [j, j + 1, j + 1, j],
          [i, i, i + 1, i + 1]
        ], 
        [width, x * width, y * width]
      );
    }
  }
  
  // Add face label
  svg.addText(
    faceLabel, 
    [(x + size/2) * width, (y + size/2) * width], 
    { font: `${Math.max(14, width/2)}px Arial`, fill: 'rgba(0,0,0,0.3)' }
  );
}

// Pyraminx-specific drawing functions
function drawPyraminx(pieces, width = 20) {
  const svg = new SVG();
  svg.width = 6 * hsq3 * width;
  svg.height = 6 * hsq3 * width;
  
  // Parse the pieces string if it's not already an array
  let coloredPieces = pieces;
  if (typeof pieces === 'string') {
    coloredPieces = pieces.split('');
  }
  
  // Ensure we have enough pieces (default to F=green for missing pieces)
  while (coloredPieces.length < 20) {
    coloredPieces.push('F');
  }
  
  // Draw the pyraminx pieces
  let idx = 0;
  
  // For each level of the pyramid
  for (let i = 0; i < 3; i++) {
    // For each face (F, R, L, D in CSTimer notation)
    for (let f = 0; f < 3; f++) {
      // For each piece in this row of this face
      for (let j = 0; j < (i * 2 + 1); j++) {
        const x = -hsq3 * i + hsq3 * j;
        const y = i / 2;
        let piece;
        
        // Alternate between triangles pointing up and down
        if (j % 2 === 0) {
          piece = [[x, x - hsq3, x + hsq3], [y, y + 0.5, y + 0.5]];
        } else {
          piece = [[x - hsq3, x, x + hsq3], [y, y + 0.5, y]];
        }
        
        // Get color for this piece
        const color = coloredPieces[idx] || 'F'; // Default to F (green) if missing
        const colorCode = getPyraminxColor(color);
        
        // Draw the piece with rotation for the current face
        ctxDrawPolygon(
          svg, 
          colorCode, 
          ctxRotate(piece, PI / 3 * 4 * f), 
          [width, 3 * hsq3, 3 + (6 * hsq3 - 4.5) / 2]
        );
        
        idx++;
      }
    }
  }
  
  // Add CSTimer attribution
  svg.addText(
    "CSTimer", 
    [svg.width - 30, svg.height - 10], 
    { font: '10px Arial', fill: 'rgba(0,0,0,0.3)' }
  );
  
  return svg;
}

// Helper to get color code for pyraminx face
function getPyraminxColor(faceLabel) {
  const colorMap = {
    'F': '#00AF00', // Green
    'R': '#FF0000', // Red 
    'D': '#0000FF', // Blue
    'L': '#FFFF00', // Yellow
    // Aliases
    'U': '#00AF00', // Green (same as F)
    'B': '#FFFF00', // Yellow (same as L)
  };
  
  return colorMap[faceLabel] || '#888888';
}

export {
  SVG,
  drawNNNCube,
  drawPyraminx,
  ctxRotate,
  ctxTransform,
  ctxDrawPolygon,
  hsq3,
  PI
};
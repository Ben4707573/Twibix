"use client";

import React from 'react';

const ALGORITHMS = {
  '2x2': {
    'PBL (Permutation of Both Layers)': [
      { name: 'Adjacent Swap', algorithm: "R2 F2 R2" },
      { name: 'Diagonal Swap', algorithm: "R U' R F2 R' U R'" },
      { name: 'Y-Perm', algorithm: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
      { name: 'T-Perm', algorithm: "R U R' U' R' F R2 U' R' U' R U R' F'" },
      { name: 'V-Perm', algorithm: "R' U R' U' y R' F' R2 U' R' U R' F R F" },
      { name: 'N-Perm', algorithm: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'" }
    ],
    'OLL (Orientation of Last Layer)': [
      { name: 'Sune', algorithm: "R U R' U R U2 R'" },
      { name: 'Anti-Sune', algorithm: "R U2 R' U' R U' R'" },
      { name: 'Pi', algorithm: "R U2 R2 U' R2 U' R2 U2 R" },
      { name: 'H', algorithm: "R U R' U R U' R' U R U2 R'" },
      { name: 'T', algorithm: "r U R' U' r' F R F'" },
      { name: 'L', algorithm: "F R U' R' U' R U R' F'" }
    ],
    'CLL (Corner Last Layer)': [
      { name: 'AS1', algorithm: "R U2 R' U' R U' R'" },
      { name: 'AS2', algorithm: "R U R' U R U2 R'" },
      { name: 'AS3', algorithm: "F R U' R' F'" },
      { name: 'AS4', algorithm: "F R' F' R U R U' R'" }
    ]
  },
  '3x3': {
    'Cross': [
      { name: 'White Cross Tips', algorithm: "Hold white center on top. Use F D R F' D' to move edge pieces." },
      { name: 'Plus Pattern', algorithm: "F R U R' U' F' - creates cross on top" }
    ],
    'F2L (First Two Layers)': [
      { name: 'Basic Case 1', algorithm: "R U R' U' y L' U L" },
      { name: 'Basic Case 2', algorithm: "F' U F U y' R U' R'" },
      { name: 'Corner in Place, Edge Flipped', algorithm: "R U' R' U d R' U R" },
      { name: 'Edge in Place, Corner Flipped', algorithm: "R U R' U2 R U' R' U R U' R'" },
      { name: 'Both Pieces in Slot', algorithm: "R U' R' d R' U R" },
      { name: 'Pair Made, Wrong Slot', algorithm: "R U R' U' R U R' U' R U R'" },
      { name: 'White Sticker on Right', algorithm: "R U' R' U R U R'" },
      { name: 'White Sticker on Front', algorithm: "F' U F U' F' U F" }
    ],
    'OLL (Orientation of Last Layer)': [
      { name: 'Cross', algorithm: "F R U R' U' F'" },
      { name: 'Dot', algorithm: "F R U R' U' F' f R U R' U' f'" },
      { name: 'L-Shape', algorithm: "f R U R' U' f'" },
      { name: 'Line', algorithm: "F R U R' U' F'" },
      { name: 'Sune', algorithm: "R U R' U R U2 R'" },
      { name: 'Anti-Sune', algorithm: "R U2 R' U' R U' R'" },
      { name: 'T-Shape', algorithm: "r U R' U' r' F R F'" },
      { name: 'Square', algorithm: "r U2 R' U' R U' r'" },
      { name: 'Small L', algorithm: "f R U R' U' f'" },
      { name: 'Fish', algorithm: "R U R' U R U' R' U R U2 R'" },
      { name: 'Kite', algorithm: "r U R' U' M U R U' R'" },
      { name: 'Chameleon', algorithm: "r U R' U' r' R U R U' R'" },
      { name: 'Bowtie', algorithm: "f' L' U' L U f" },
      { name: 'Awkward', algorithm: "r' R2 U R' U r U2 r' U M'" },
      { name: 'Crown', algorithm: "r U' r2 U r2 U r2 U' r" }
    ],
    'PLL (Permutation of Last Layer)': [
      { name: 'T Perm', algorithm: "R U R' U' R' F R2 U' R' U' R U R' F'" },
      { name: 'Y Perm', algorithm: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
      { name: 'Aa Perm', algorithm: "x R' U R' D2 R U' R' D2 R2 x'" },
      { name: 'Ab Perm', algorithm: "x R2 D2 R U R' D2 R U' R x'" },
      { name: 'J Perm', algorithm: "R U R' F' R U R' U' R' F R2 U' R'" },
      { name: 'R Perm', algorithm: "R U' R' F' R U R' U' R' F R2 U' R' U R U R'" },
      { name: 'V Perm', algorithm: "R' U R' U' y R' F' R2 U' R' U R' F R F" },
      { name: 'H Perm', algorithm: "M2 U M2 U2 M2 U M2" },
      { name: 'Z Perm', algorithm: "M' U M2 U M2 U M' U2 M2" },
      { name: 'U Perm', algorithm: "R U' R U R U R U' R' U' R2" },
      { name: 'E Perm', algorithm: "x' R U' R' D R U R' D' R U R' D R U' R' D' x" },
      { name: 'N Perm', algorithm: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'" },
      { name: 'F Perm', algorithm: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R" },
      { name: 'G Perm', algorithm: "R2 U R' U R' U' R U' R2 U' D R' U R D'" }
    ]
  },
  '4x4': {
    'Centers': [
      { name: 'Opposite Centers', algorithm: "r U2 r' U2 r U2 r'" },
      { name: 'Adjacent Centers', algorithm: "r U r' U r U2 r'" }
    ],
    'Edge Pairing': [
      { name: 'Basic Pairing', algorithm: "Uw R U' R' Uw'" },
      { name: 'Flipped Edge', algorithm: "Uw R U' R' Uw' r U r'" },
      { name: 'Last Two Edges', algorithm: "Uw2 R U R' Uw2" }
    ],
    'OLL Parity': [
      { name: 'Standard OLL Parity', algorithm: "r U2 x r U2 r U2 r' U2 l U2 r' U2 r U2 r' U2 r'" },
      { name: 'Short OLL Parity', algorithm: "Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'" },
      { name: 'Faster OLL Parity', algorithm: "f R f' U R U' R' f R f'" }
    ],
    'PLL Parity': [
      { name: 'Standard PLL Parity', algorithm: "r2 U2 r2 Uw2 r2 Uw2" },
      { name: 'Alternative PLL Parity', algorithm: "Rw2 R2 U2 Rw2 R2 Uw2 Rw2 R2 Uw2" },
      { name: 'Short PLL Parity', algorithm: "r2 U2 r2 Uw2 r2 Uw2 U2" }
    ]
  },
  '5x5': {
    'Centers': [
      { name: 'Plus Formation', algorithm: "Rw U Rw' U Rw U2 Rw'" },
      { name: 'Bar Formation', algorithm: "Rw U2 Rw' U Rw U' Rw'" },
      { name: 'Last Two Centers', algorithm: "Rw U Rw' U Rw U Rw' U Rw U' Rw'" }
    ],
    'Edge Pairing': [
      { name: 'Free Slice Edge Pairing', algorithm: "Uw R U' R' Uw'" },
      { name: 'Last Eight Edges', algorithm: "Uw2 R U R' Uw2" },
      { name: 'Flipped Edge Fix', algorithm: "Dw R F' U R' F Dw'" }
    ],
    'Parity': [
      { name: 'Single Parity', algorithm: "Rw U2 Rw' U2 Rw U2 Rw' U2 Rw U2 Rw' U2 Rw U2 Rw'" },
      { name: 'Double Parity (OLL + PLL)', algorithm: "Perform OLL parity first, then solve normally" }
    ]
  },
  '6x6': {
    'Centers': [
      { name: 'Cross Centers', algorithm: "3Rw U 3Rw' U 3Rw U2 3Rw'" },
      { name: 'Plus Centers', algorithm: "3Rw U2 3Rw' U 3Rw U' 3Rw'" }
    ],
    'Edge Pairing': [
      { name: 'Free Slice Pairing', algorithm: "3Uw R U' R' 3Uw'" },
      { name: 'Inner Layer Pairing', algorithm: "3Uw2 R U R' 3Uw2" }
    ],
    'Parity': [
      { name: 'OLL Parity', algorithm: "3Rw U2 x 3Rw U2 3Rw U2 3Rw' U2 3Lw U2 3Rw' U2 3Rw U2 3Rw' U2 3Rw'" },
      { name: 'PLL Parity', algorithm: "3Rw2 U2 3Rw2 3Uw2 3Rw2 3Uw2" }
    ]
  },
  '7x7': {
    'Centers': [
      { name: 'Cross Formation', algorithm: "4Rw U 4Rw' U 4Rw U2 4Rw'" },
      { name: 'Plus Formation', algorithm: "4Rw U2 4Rw' U 4Rw U' 4Rw'" }
    ],
    'Edge Pairing': [
      { name: 'Free Slice Method', algorithm: "4Uw R U' R' 4Uw'" },
      { name: 'Inner Edge Pairing', algorithm: "4Uw2 R U R' 4Uw2" }
    ],
    'Parity': [
      { name: 'OLL Parity', algorithm: "4Rw U2 x 4Rw U2 4Rw U2 4Rw' U2 4Lw U2 4Rw' U2 4Rw U2 4Rw' U2 4Rw'" },
      { name: 'Single Parity', algorithm: "4Rw U2 4Rw' U2 4Rw U2 4Rw' U2 4Rw U2 4Rw'" }
    ]
  },
  'Pyraminx': {
    'Top First': [
      { name: 'Basic Algorithm', algorithm: "R U R' U R U R'" },
      { name: 'Left Algorithm', algorithm: "L' U' L U' L' U' L" }
    ],
    'Keyhole': [
      { name: 'Right Insert', algorithm: "R' U R U' R' U R" },
      { name: 'Left Insert', algorithm: "L U' L' U L U' L'" }
    ],
    'Last Layer': [
      { name: 'Sune', algorithm: "R U R' U R U R'" },
      { name: 'Anti-Sune', algorithm: "L' U' L U' L' U' L" },
      { name: 'H Perm', algorithm: "R U R' U R U R' U R U' R'" },
      { name: 'Pi', algorithm: "R U' R' U R U' R' U R U R'" }
    ]
  },
  'Skewb': {
    'Layer by Layer': [
      { name: 'Right Sledgehammer', algorithm: "R' L R L'" },
      { name: 'Left Sledgehammer', algorithm: "L R' L' R" },
      { name: 'Right Hedge Slammer', algorithm: "R' L' R L" },
      { name: 'Left Hedge Slammer', algorithm: "L R L' R'" }
    ],
    'Sarah\'s Intermediate': [
      { name: 'Adjacent Corner Swap', algorithm: "R L R' L' R L R' L'" },
      { name: 'Diagonal Corner Swap', algorithm: "R L' R' L R L' R' L" }
    ]
  },
  'Megaminx': {
    'F2L': [
      { name: 'Basic Insert', algorithm: "R U R' U' R U R'" },
      { name: 'Sledgehammer', algorithm: "R' F R F'" }
    ],
    'Last Layer': [
      { name: 'OLL 1', algorithm: "R U R' U R U' R' U R U' R' U R U2 R'" },
      { name: 'OLL 2', algorithm: "R U R' U R U2 R' U R U R' U R U' R'" },
      { name: 'PLL Star', algorithm: "R U R' F' R U R' U' R' F R2 U' R'" }
    ]
  },
  'Square-1': {
    'Cube Shape': [
      { name: 'Kite to Kite', algorithm: "(1,0) / (3,3) / (0,-3)" },
      { name: 'Barrel to Square', algorithm: "/ (3,0) / (3,0) / (3,0)" },
      { name: 'Shield to Square', algorithm: "(0,-1) / (0,3) / (0,-3) / (0,1)" }
    ],
    'Corner Orientation': [
      { name: 'Right Trigger', algorithm: "R U R' F' R U R' U' R' F R2 U' R'" },
      { name: 'Left Trigger', algorithm: "L' U' L F L' U' L U L F' L2 U L" }
    ],
    'Edge Orientation': [
      { name: 'Adjacent', algorithm: "R U R' U R U R' U R U' R'" },
      { name: 'Opposite', algorithm: "R U2 R' U' R U' R'" }
    ],
    'Permutation': [
      { name: 'Adjacent Corner Swap', algorithm: "R U R' F' R U R' U' R' F R2 U' R' U'" },
      { name: 'Diagonal Corner Swap', algorithm: "F R U' R' U' R U R' F' R U R' U' R' F R F'" }
    ]
  }
};

export function AlgorithmsPanel({ cubeType }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-y-auto h-full flex flex-col">
      <h2 className="text-xl py-3 px-4 sticky top-0 bg-gray-800 border-b border-gray-700 z-10">
        Algorithms for {cubeType}
      </h2>
      
      <div className="p-4 flex-1 overflow-y-auto">
        {Object.entries(ALGORITHMS[cubeType] || {}).map(([category, algs]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">{category}</h3>
            <ul className="space-y-2">
              {algs.map((alg, i) => (
                <li key={i} className="bg-gray-700 rounded p-3">
                  <div className="font-medium">{alg.name}</div>
                  <div className="font-mono text-sm mt-1">{alg.algorithm}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

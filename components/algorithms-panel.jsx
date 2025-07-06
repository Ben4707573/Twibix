"use client";

import React from 'react';

const ALGORITHMS = {
  '2x2': {
    'PBL': [
      { name: 'Adjacent Swap', algorithm: "R2 F2 R2" },
      { name: 'Diagonal Swap', algorithm: "R U' R F2 R' U R'" },
      { name: 'Y-Perm', algorithm: "F R U' R' U' R U R' F' R U R' U' R' F R F'" }
    ],
    'OLL': [
      { name: 'Sune', algorithm: "R U R' U R U2 R'" },
      { name: 'Anti-Sune', algorithm: "R U2 R' U' R U' R'" }
    ]
  },
  '3x3': {
    'F2L': [
      { name: 'Basic Case 1', algorithm: "U (R U R')" },
      { name: 'Basic Case 2', algorithm: "y' U' (L' U L)" }
    ],
    'OLL': [
      { name: 'Sune', algorithm: "R U R' U R U2 R'" },
      { name: 'Anti-Sune', algorithm: "R U2 R' U' R U' R'" },
      { name: 'Double-Sune', algorithm: "R U R' U R U' R' U R U2 R'" }
    ],
    'PLL': [
      { name: 'T Perm', algorithm: "R U R' U' R' F R2 U' R' U' R U R' F'" },
      { name: 'Y Perm', algorithm: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
      { name: 'J Perm', algorithm: "R U R' F' R U R' U' R' F R2 U' R'" }
    ]
  },
  '4x4': {
    'OLL Parity': [
      { name: 'Standard', algorithm: "r U2 x r U2 r U2 r' U2 l U2 r' U2 r U2 r' U2 r'" }
    ],
    'PLL Parity': [
      { name: 'Standard', algorithm: "r2 U2 r2 Uw2 r2 Uw2" }
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

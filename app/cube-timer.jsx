"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlgorithmsDrawer } from "@/components/algorithms-drawer";
import { UnifiedScrambleVisualizer } from "@/components/unified-scramble-visualizer";
import { SettingsMenu } from "@/components/settings-menu";

// Add CSS for focused timer mode
const FocusedTimerStyle = () => (
  <style jsx global>{`
    .focused-mode {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      height: 100vh !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      z-index: 1000 !important;
    }
    
    .focused-timer {
      font-size: 8rem !important;
      text-align: center !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  `}</style>
);
import { CSTimerCubeVisualizer } from "@/components/scramble-visualizer-fixed-version";

const SCRAMBLE_MOVES = {
  '2x2': ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2'],
  '3x3': ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2'],
  '4x4': ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2',
          'Rw', "Rw'", 'Rw2', 'Lw', "Lw'", 'Lw2', 'Uw', "Uw'", 'Uw2', 'Dw', "Dw'", 'Dw2', 'Fw', "Fw'", 'Fw2', 'Bw', "Bw'", 'Bw2'],
  '5x5': ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2',
          'Rw', "Rw'", 'Rw2', 'Lw', "Lw'", 'Lw2', 'Uw', "Uw'", 'Uw2', 'Dw', "Dw'", 'Dw2', 'Fw', "Fw'", 'Fw2', 'Bw', "Bw'", 'Bw2',
          '3Rw', "3Rw'", '3Rw2', '3Lw', "3Lw'", '3Lw2', '3Uw', "3Uw'", '3Uw2', '3Dw', "3Dw'", '3Dw2', '3Fw', "3Fw'", '3Fw2', '3Bw', "3Bw'", '3Bw2'],
  '6x6': ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2',
          'Rw', "Rw'", 'Rw2', 'Lw', "Lw'", 'Lw2', 'Uw', "Uw'", 'Uw2', 'Dw', "Dw'", 'Dw2', 'Fw', "Fw'", 'Fw2', 'Bw', "Bw'", 'Bw2',
          '3Rw', "3Rw'", '3Rw2', '3Lw', "3Lw'", '3Lw2', '3Uw', "3Uw'", '3Uw2', '3Dw', "3Dw'", '3Dw2', '3Fw', "3Fw'", '3Fw2', '3Bw', "3Bw'", '3Bw2'],
  '7x7': ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2',
          'Rw', "Rw'", 'Rw2', 'Lw', "Lw'", 'Lw2', 'Uw', "Uw'", 'Uw2', 'Dw', "Dw'", 'Dw2', 'Fw', "Fw'", 'Fw2', 'Bw', "Bw'", 'Bw2',
          '3Rw', "3Rw'", '3Rw2', '3Lw', "3Lw'", '3Lw2', '3Uw', "3Uw'", '3Uw2', '3Dw', "3Dw'", '3Dw2', '3Fw', "3Fw'", '3Fw2', '3Bw', "3Bw'", '3Bw2'],
  'pyraminx': ['U', "U'", 'L', "L'", 'R', "R'", 'B', "B'", 'u', "u'", 'l', "l'", 'r', "r'", 'b', "b'"],
  'skewb': ['U', "U'", 'L', "L'", 'R', "R'", 'B', "B'"],
  'sq1': ['(0,1)', '(1,0)', '(1,1)', '(2,0)', '(0,2)', '(3,0)', '(0,3)', '(2,2)', '(4,0)', '(0,4)', '(3,3)', '(2,-1)', '(-1,2)', '(1,-2)', '(-2,1)', '/'],
  'clock': ['UR', 'DR', 'DL', 'UL', 'U', 'R', 'D', 'L', 'ALL']  // Clock pin positions and rotations
};

function generateScramble(cubeType) {
  if (cubeType === 'clock') {
    // Official scramble: 9 pin moves, y2, 6 more moves
    const pins = ['UR', 'DR', 'DL', 'UL', 'U', 'R', 'D', 'L', 'ALL'];
    const moves = [];
    // First 9 moves
    for (let i = 0; i < pins.length; i++) {
      const num = Math.floor(Math.random() * 7); // 0-6
      const sign = Math.random() < 0.5 ? '+' : '-';
      moves.push(`${pins[i]}${num}${sign}`);
    }
    moves.push('y2');
    // Next 6 moves: U, R, D, L, ALL
    const postPins = ['U', 'R', 'D', 'L', 'ALL'];
    for (let i = 0; i < postPins.length; i++) {
      const num = Math.floor(Math.random() * 7);
      const sign = Math.random() < 0.5 ? '+' : '-';
      moves.push(`${postPins[i]}${num}${sign}`);
    }
    return moves.join(' ');
  }
  
  // If the puzzle type is not defined, default to 3x3
  const moves = SCRAMBLE_MOVES[cubeType] || SCRAMBLE_MOVES['3x3'];
  const scramble = [];
  let prev = '';
  let prevFace = '';
  
  // Helper function to get the base face of a move (e.g., 'R' from 'Rw', 'U' from "U'")
  const getBaseFace = (move) => {
    if (cubeType === 'sq1') {
      // Special handling for Square-1 notation
      if (move === '/' || move === "/'") return '/';
      return 'slice'; // Treat all slice turns as the same "face"
    }
    return move.replace(/[w'23]/g, '').toUpperCase();
  };
  
  // Helper function to check if two faces are opposites
  const checkOpposite = (face1, face2) => {
    if (cubeType === 'sq1') return face1 === face2; // For Sq1, don't allow consecutive identical moves
    
    return (face1 === 'U' && face2 === 'D') || 
           (face1 === 'D' && face2 === 'U') ||
           (face1 === 'R' && face2 === 'L') ||
           (face1 === 'L' && face2 === 'R') ||
           (face1 === 'F' && face2 === 'B') ||
           (face1 === 'B' && face2 === 'F');
  };
  
  // Length of scramble based on cube type
  let scrambleLength;
  if (cubeType === '2x2') {
    scrambleLength = 9;
  } else if (cubeType === '3x3') {
    scrambleLength = 20;
  } else if (cubeType === '4x4') {
    scrambleLength = 40;
  } else if (cubeType === '5x5') {
    scrambleLength = 60;
  } else if (cubeType === '6x6' || cubeType === '7x7') {
    scrambleLength = 80;
  } else if (cubeType === 'pyraminx') {
    scrambleLength = 10;
  } else if (cubeType === 'skewb') {
    scrambleLength = 8;
  } else if (cubeType === 'sq1') {
    // 12–15 pairs (so 24–30 moves)
    scrambleLength = (Math.floor(Math.random() * 4) + 12) * 2;
  } else if (cubeType === 'clock') {
    scrambleLength = 14; // Clock has a fixed format with 14 parts
  } else {
    scrambleLength = 20; // Default
  }
  
  if (cubeType === 'sq1') {
    // Alternate between (x,y) and /
    const pairs = Math.floor(scrambleLength / 2);
    const twists = [];
    for (let i = 0; i < pairs; i++) {
      // x and y in -6..6, not both zero
      let x, y;
      do {
        x = Math.floor(Math.random() * 13) - 6;
        y = Math.floor(Math.random() * 13) - 6;
      } while (x === 0 && y === 0);
      twists.push(`(${x},${y})`);
    }
    // Build scramble string: (x,y)/ (x,y)/ ...
    let scramble = [];
    for (let i = 0; i < twists.length; i++) {
      scramble.push(twists[i]);
      scramble.push('/');
    }
    // Remove trailing slash for a cleaner look
    if (scramble[scramble.length - 1] === '/') scramble.pop();
    return scramble.join(' ');
  }
  if (cubeType === 'pyraminx') {
    // Only use face moves for main scramble
    const pyraminxFaces = ['U', "U'", 'L', "L'", 'R', "R'", 'B', "B'"];
    let prevFace = '';
    let scramble = [];
    for (let i = 0; i < scrambleLength; i++) {
      let move, face;
      do {
        move = pyraminxFaces[Math.floor(Math.random() * pyraminxFaces.length)];
        face = move[0];
      } while (face === prevFace);
      scramble.push(move);
      prevFace = face;
    }
    // Add random tip moves at the end (same as before)
    const tips = ['u', "u'", 'l', "l'", 'r', "r'", 'b', "b'"];
    const usedTips = new Set();
    for (let i = 0; i < 4; i++) {
      if (Math.random() < 0.5) {
        let tip;
        do {
          tip = tips[Math.floor(Math.random() * 8)];
          const baseTip = tip.charAt(0);
          if (usedTips.has(baseTip)) continue;
          usedTips.add(baseTip);
          break;
        } while (true);
        scramble.push(tip);
      }
    }
    return scramble.join(' ');
  }
  if (cubeType === '5x5') {
    // Official 5x5 scramble: mix single and wide moves, avoid consecutive faces, 60 moves
    const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
    const suffixes = ["", "'", "2"];
    const wideSuffixes = ['w', "w'", "w2"];
    let scramble = [];
    let prevFace = '';
    let prevType = '';
    for (let i = 0; i < 60; i++) {
      let move, face, type;
      do {
        face = faces[Math.floor(Math.random() * faces.length)];
        // 50% chance wide move, 50% single
        if (Math.random() < 0.5) {
          // Wide move
          const suf = wideSuffixes[Math.floor(Math.random() * wideSuffixes.length)];
          move = face + suf;
          type = 'w';
        } else {
          // Single move
          const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
          move = face + suf;
          type = 's';
        }
      } while (face === prevFace);
      scramble.push(move);
      prevFace = face;
      prevType = type;
    }
    return scramble.join(' ');
  }
  // Default scramble logic for other cubes
  for (let i = 0; i < scrambleLength; i++) {
    let move;
    let face;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
      face = getBaseFace(move);
      if (cubeType === 'sq1') {
        if (i > 0) {
          const prevIsSlice = prev === '/' || prev === "/'" || prev === '';
          const currentIsSlice = move === '/' || move === "/'";
          if (prevIsSlice === currentIsSlice) {
            continue;
          }
        }
      }
    } while (face === prevFace || (prev && checkOpposite(face, prevFace)));
    scramble.push(move);
    prev = move;
    prevFace = face;
  }
  return scramble.join(' ');
}

function drawScramble(scramble) {
  return scramble.split(' ').map((move, index) => (
    <span key={index} className="inline-block dark:bg-gray-700 bg-gray-200 dark:text-white text-gray-800 px-2 py-1 rounded m-0.5">{move}</span>
  ));
}

  const calculateAverage = (times, count) => {
    if (times.length < count) return null;
    
    // Get the most recent times (including DNFs)
    const lastTimes = times.slice(-count);
    
    // Count DNF solves in the recent times
    const dnfCount = lastTimes.filter(t => t.status === 'DNF').length;
    
    // For averages of 5+: if more than 1 DNF, return DNF
    if (count >= 5 && dnfCount > 1) return 'DNF';
    
    // Filter out DNF solves
    const valid = lastTimes.filter(t => t.status !== 'DNF');
    if (valid.length < (count >= 5 ? count - 2 : count)) return 'DNF';
    
    // Get the most recent valid times
    const validTimes = valid.map(t => t.time || 1000); // Ensure no zero times
    
    // Sort times for average calculation
    const sorted = [...validTimes].sort((a, b) => a - b);
    
    // For ao5 and higher, exclude best and worst times
    if (count >= 5) {
      sorted.splice(0, 1); // Remove fastest
      sorted.splice(-1, 1); // Remove slowest
    }
    
    // Calculate the average
    const sum = sorted.reduce((acc, cur) => acc + cur, 0);
    return sum > 0 ? sum / sorted.length : 1000; // Ensure no zero average
  };

  const calculateMean = (times, count) => {
    if (times.length < count) return null;
    
    // Get the most recent times (including DNFs)
    const lastTimes = times.slice(-count);
    
    // Count DNF solves in the recent times
    const dnfCount = lastTimes.filter(t => t.status === 'DNF').length;
    
    // For means: if any DNF, return DNF
    if (dnfCount > 0) return 'DNF';
    
    // Filter out DNF solves
    const valid = lastTimes.filter(t => t.status !== 'DNF');
    if (valid.length < count) return 'DNF';
    
    // Get the most recent valid times
    const validTimes = valid.map(t => t.time || 1000); // Ensure no zero times
    
    // Calculate the simple arithmetic mean (no exclusions)
    const sum = validTimes.reduce((acc, cur) => acc + cur, 0);
    return sum > 0 ? sum / validTimes.length : 1000; // Ensure no zero mean
  };

export default function CubeTimerApp() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTimeRef, setStartTimeRef] = useState(null); // Store actual start time
  const [history, setHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cubeTimes');
      if (saved) {
        try {
          // Attempt to parse the saved data
          const parsedData = JSON.parse(saved);
          
          // Validate and fix any invalid times
          const fixedData = parsedData.map(entry => {
            // Ensure all entries have a valid time value (at least 100ms)
            if (!entry.time || entry.time < 100) {
              // Generate a random time between 1 and 15 seconds for invalid entries
              const randomTime = Math.floor(Math.random() * 14000) + 1000;
              return { ...entry, time: randomTime };
            }
            return entry;
          });
          
          return fixedData;
        } catch (e) {
          return [];
        }
      }
      return [];
    }
    return [];
  });
  const [cubeType, setCubeType] = useState('3x3');
  const [session, setSession] = useState('Normal');
  const [sessions, setSessions] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSessions = localStorage.getItem('cubeSessions');
      return savedSessions ? JSON.parse(savedSessions) : {
        '2x2': ['Normal'],
        '3x3': ['Normal'],
        '4x4': ['Normal'],
        '5x5': ['Normal'],
        '6x6': ['Normal'],
        '7x7': ['Normal'],
        'pyraminx': ['Normal'],
        'skewb': ['Normal'],
        'sq1': ['Normal'],
        'clock': ['Normal']
      };
    }
    return {
      '2x2': ['Normal'],
      '3x3': ['Normal'],
      '4x4': ['Normal'],
      '5x5': ['Normal'],
      '6x6': ['Normal'],
      '7x7': ['Normal'],
      'pyraminx': ['Normal'],
      'skewb': ['Normal'],
      'sq1': ['Normal'],
      'clock': ['Normal']
    };
  });
  const [newSessionModalOpen, setNewSessionModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [scramble, setScramble] = useState('Loading...');
  const [spaceState, setSpaceState] = useState('idle');
  const [touchState, setTouchState] = useState('idle'); // For mobile touch handling
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [showScrambleVisualizer, setShowScrambleVisualizer] = useState(true);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [inspectionTime, setInspectionTime] = useState(0);
  const [isInspecting, setIsInspecting] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [manualSolveModalOpen, setManualSolveModalOpen] = useState(false);
  const [manualTime, setManualTime] = useState('');
  const [manualScramble, setManualScramble] = useState('');
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [retryingIndex, setRetryingIndex] = useState(null); // Track which solve is being retried
  
  // Settings
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('cuboSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      } else {
        // Check if user is on mobile device for default settings
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         ('ontouchstart' in window) || 
                         (navigator.maxTouchPoints > 0);
        return {
          useSpaceBar: true,
          useInspection: false,
          inspectionDuration: 15, // Default inspection time is 15 seconds
          useSounds: true,
          darkMode: true,
          debugMode: false,
          hideDuringSolve: false, // Hide UI during solve, off by default
          useHoldDelay: !isMobile, // Disable hold delay on mobile by default, enable on desktop
          overwriteOnRetry: false, // Don't overwrite original solve when retrying, off by default
          abortKey: 'Escape' // Default abort key
        };
      }
    }
    return {
      useSpaceBar: true,
      useInspection: false,
      inspectionDuration: 15, // Default inspection time is 15 seconds
      useSounds: true,
      darkMode: true,
      debugMode: false,
      hideDuringSolve: false, // Hide UI during solve, off by default
      useHoldDelay: true, // Use the 0.5s hold delay, on by default for server-side rendering
      overwriteOnRetry: false, // Don't overwrite original solve when retrying, off by default
      abortKey: 'Escape' // Default abort key
    };
  });
  // Abort solve logic: stops timer and does not save the solve
  const handleAbortSolve = useCallback(() => {
    setIsRunning(false);
    setStartTimeRef(null);
    setTime(0);
    // Optionally, generate a new scramble after abort
    setScramble(generateScramble(cubeType));
  }, [cubeType]);

  useEffect(() => {
    setScramble(generateScramble(cubeType));
  }, [cubeType]);

  const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
  };
  
  const formatTimeRaw = (ms) => {
    if (ms < 0) ms = 0;
    return (ms / 1000).toFixed(2);
  };

  const startInspection = () => {
    setIsInspecting(true);
    // Use the user-configured inspection duration from settings
    setInspectionTime(settings.inspectionDuration);
  };

  // Play a short beep using Web Audio API
  function playBeep(frequency = 880, duration = 120, volume = 0.2) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.value = volume;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        ctx.close();
      }, duration);
    } catch (e) {
      // Fallback: do nothing if audio fails
    }
  }

  // Separate function to add a solve to history to ensure consistency
  const addSolveToHistory = useCallback((solve) => {
    
    setHistory(prev => {
      let newHistory;
      
      // Check if we're overwriting a retry
      if (retryingIndex !== null && settings.overwriteOnRetry) {
        // Overwrite the solve at the retry index
        newHistory = [...prev];
        newHistory[retryingIndex] = {
          ...solve,
          timestamp: newHistory[retryingIndex].timestamp, // Keep original timestamp for ordering
          manual: newHistory[retryingIndex].manual // Preserve manual flag if it was set
        };
        
        // Clear the retrying index
        setRetryingIndex(null);
      } else {
        // Normal behavior - add new solve
        newHistory = [...prev, solve];
      }
      
      // Directly update localStorage to ensure persistence
      try {
        localStorage.setItem('cubeTimes', JSON.stringify(newHistory));
      } catch (e) {
        // Handle localStorage errors silently
      }
      
      return newHistory;
    });
  }, [retryingIndex, settings.overwriteOnRetry]);

  const handleStartStop = useCallback(() => {
    
    if (isRunning) {
      // Stop the timer
      const endTime = Date.now();
      const startTime = startTimeRef;
      const finalTime = endTime - startTime;
      
      
      // First set running to false to stop the animation frame
      setIsRunning(false);
      setStartTimeRef(null);
      
      // Freeze the displayed time at the final value
      setTime(finalTime);
      
      // Only save times that are valid (greater than 100ms)
      if (finalTime >= 100) {
        // Create a solve object with all necessary details
        const solve = {
          time: finalTime,
          originalTime: finalTime, // Store the original time
          scramble: scramble,
          cubeType: cubeType,
          session: session,
          status: 'OK',
          timestamp: endTime
        };
        
        
        // Add to history directly
        addSolveToHistory(solve);
        
        // Generate a new scramble for the next solve
        setScramble(generateScramble(cubeType));
      } else {
        // Time too short, don't save
      }
    } else {
      // Start the timer
      const now = Date.now();
      setStartTimeRef(now);
      setTime(0);
      setIsRunning(true);
    }
  }, [isRunning, startTimeRef, time, scramble, cubeType, addSolveToHistory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === settings.abortKey && isRunning) {
        // Abort key pressed during solve: abort without saving
        e.preventDefault();
        handleAbortSolve();
        return;
      }
      if (e.code === 'Space' && settings.useSpaceBar) {
        e.preventDefault();
        if (!isRunning && !isInspecting && spaceState === 'idle') {
          // If hold delay is disabled or inspection is enabled, skip the ready state delay
          if (!settings.useHoldDelay || settings.useInspection) {
            setSpaceState('ready');
          } else {
            // Normal behavior with delay when hold delay is enabled
            setSpaceState('pre-start');
            setTimeout(() => setSpaceState('ready'), 500);
          }
        }
      } else if (isRunning) {
        // ANY key stops the timer when it's running
        e.preventDefault();
        handleStartStop();
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space' && settings.useSpaceBar) {
        e.preventDefault();
        if (spaceState === 'ready') {
          if (settings.useInspection && !isInspecting) {
            // Start inspection
            startInspection();
          } else {
            // Start the timer
            handleStartStop();
          }
        } else if (isRunning) {
          // Stop the timer
          handleStartStop();
        } else if (isInspecting) {
          // End inspection and start timing
          setIsInspecting(false);
          handleStartStop();
        }
        setSpaceState('idle');
      }
    };

    // Touch event handlers for mobile
    const handleTouchStart = (e) => {
      if (isRunning) {
        // If timer is running, any touch stops it
        e.preventDefault();
        handleStartStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Add touch listeners for stopping timer
    if (isRunning) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isRunning, spaceState, settings.useSpaceBar, settings.useInspection, settings.useHoldDelay, isInspecting, handleStartStop]);

  useEffect(() => {
    let animationFrameId;
    
    if (isRunning && startTimeRef) {
      // Use requestAnimationFrame for smoother updates
      const updateTimer = () => {
        const now = Date.now();
        const elapsed = now - startTimeRef;
        setTime(elapsed);
        
        animationFrameId = requestAnimationFrame(updateTimer);
      };
      
      animationFrameId = requestAnimationFrame(updateTimer);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, startTimeRef]);

  // Inspection timer
  useEffect(() => {
    let timer;
    let lastAnnounced = null;
    if (isInspecting) {
      timer = setInterval(() => {
        setInspectionTime(prevTime => {
          // Play beep at 7s and 3s if inspectionDuration is 15s and sounds are enabled
          if (
            settings.useSounds &&
            settings.inspectionDuration === 15 &&
            (prevTime === 7 || prevTime === 3)
          ) {
            playBeep(prevTime === 3 ? 1200 : 880, 120, 0.25);
          }
          if (prevTime <= 1) {
            // Time's up, auto-start the solve or apply penalty
            clearInterval(timer);
            setIsInspecting(false);
            handleStartStop(); // Start the solve
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isInspecting, handleStartStop, settings.useSounds, settings.inspectionDuration]);

  // Ensure history gets saved properly
  useEffect(() => {
    if (history.length > 0) {
      // This ensures the history is properly saved to localStorage
      // whenever it changes
      localStorage.setItem('cubeTimes', JSON.stringify(history));
    }
  }, [history]);

  const updateSolve = (index, update) => {
    setHistory(prev => {
      const updated = prev.map((item, i) => i === index ? { ...item, ...update } : item);
      
      // Update localStorage directly
      localStorage.setItem('cubeTimes', JSON.stringify(updated));
      
      return updated;
    });
  };

  const deleteSolve = (index) => {
    setHistory(prev => {
      const updated = prev.filter((_, i) => i !== index);
      
      // Update localStorage directly
      localStorage.setItem('cubeTimes', JSON.stringify(updated));
      
      return updated;
    });
  };

  const handleResetHistory = () => {
    setHistory([]);
    localStorage.removeItem('cubeTimes');
  };

  // Handle sharing a solve
  const handleShare = useCallback((solve) => {
    const timeStr = solve.status === 'DNF' 
      ? 'DNF' 
      : `${(solve.time/1000).toFixed(2)}s`;
    
    const content = `${solve.cubeType}:\n${timeStr}\n\n${solve.scramble}`;
    setShareContent(content);
    setShareModalOpen(true);
    setCopySuccess(false); // Reset copy success state
  }, []);

  // Copy to clipboard with fallback
  const copyToClipboard = async (text) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        return;
      }
      
      // Fallback for older browsers or insecure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      // Show manual copy instruction
      alert('Unable to copy automatically. Please manually select and copy the text above.');
    }
  };

  // Handle manual solve entry
  const handleManualSolveEntry = () => {
    // Validate time input
    const timeValue = parseFloat(manualTime);
    if (isNaN(timeValue) || timeValue <= 0) {
      alert('Please enter a valid time (e.g., 12.34)');
      return;
    }

    // Convert time from seconds to milliseconds
    const timeMs = Math.round(timeValue * 1000);
    
    // Validate time is reasonable (between 0.1 and 999 seconds)
    if (timeMs < 100 || timeMs > 999000) {
      alert('Time must be between 0.1 and 999 seconds');
      return;
    }

    // Use current scramble if no scramble provided
    const solveScramble = manualScramble.trim() || scramble;

    // Create the manual solve
    const manualSolve = {
      time: timeMs,
      originalTime: timeMs,
      scramble: solveScramble,
      cubeType: cubeType,
      session: session,
      status: 'OK',
      timestamp: Date.now(),
      manual: true // Mark as manually entered
    };

    addSolveToHistory(manualSolve);

    // Reset form and close modal
    setManualTime('');
    setManualScramble('');
    setManualSolveModalOpen(false);

    // Generate new scramble if we used the current one
    if (!manualScramble.trim()) {
      setScramble(generateScramble(cubeType));
    }
  };

  // Handle Enter key in manual solve form
  const handleManualSolveKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (manualTime.trim()) {
        handleManualSolveEntry();
      }
    }
  };

  // Setup the solve history button UI
  const SolveHistoryItem = ({ solve, index }) => {
    // Handle time display based on status
    let timeStr;
    if (solve.status === 'DNF') {
      timeStr = 'DNF';
    } else if (solve.time == null || solve.time < 10) {
      timeStr = '--';
    } else {
      timeStr = `${(solve.time/1000).toFixed(2)}s`;
    }
    
    // Handle status display - show +2 penalties and other statuses
    let statusStr = '';
    if (solve.status === '+2') {
      const penalties = solve.originalTime ? Math.floor((solve.time - solve.originalTime) / 2000) : 1;
      statusStr = penalties > 1 ? `(+${penalties*2})` : '(+2)';
    } else if (solve.status && solve.status !== 'OK' && solve.status !== 'DNF') {
      statusStr = `(${solve.status})`;
    }
    
    return (
      <li className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} shadow border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg px-3 py-2 space-y-1`}>
        <div className="flex justify-between items-center">
          <span className="font-medium">Solve #{index + 1}:</span>
          <span className="font-mono font-bold text-lg">
            {timeStr} {statusStr}
          </span>
        </div>
        <div className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{solve.scramble}</div>
        <div className="flex gap-2 text-sm mt-1 flex-wrap">
          <Button onClick={() => {
            // Handle backward compatibility for solves without originalTime
            const originalTime = solve.originalTime || solve.time;
            const currentPenalties = Math.max(0, Math.floor((solve.time - originalTime) / 2000));
            updateSolve(index, { 
              status: '+2', 
              time: originalTime + ((currentPenalties + 1) * 2000),
              originalTime: originalTime // Set originalTime if it doesn't exist
            });
          }} size="sm">+2</Button>
          <Button onClick={() => updateSolve(index, { status: 'DNF', time: null })} size="sm" variant="destructive">DNF</Button>
          <Button onClick={() => {
            const originalTime = solve.originalTime || solve.time;
            updateSolve(index, { 
              status: 'OK', 
              time: originalTime,
              originalTime: originalTime // Ensure originalTime is set
            });
          }} size="sm" variant="secondary">OK</Button>
          <Button onClick={() => deleteSolve(index)} size="sm" variant="outline">Delete</Button>
          <Button onClick={() => handleRetry(index)} size="sm">Retry</Button>
          <Button onClick={() => handleShare(solve)} size="sm" variant="outline">Share</Button>
        </div>
      </li>
    );
  };

  const handleRetry = (index) => {
    // Get the solve we're retrying
    const solveToRetry = filteredHistory[index];
    
    // Reset timer state
    setTime(0);
    setIsRunning(false);
    setStartTimeRef(null);
    setIsInspecting(false);
    
    // Use the same scramble from the original solve
    setScramble(solveToRetry.scramble);
    
    // Store which solve is being retried for potential overwrite
    if (settings.overwriteOnRetry) {
      setRetryingIndex(index);
    } else {
      setRetryingIndex(null);
      // Update the solve to mark it as retried (keep the original scramble)
      updateSolve(index, { status: 'Retry' });
    }
    
    // Start inspection if enabled, otherwise user can start manually
    if (settings.useInspection) {
      startInspection();
    }
  };

  // Handle the click of the start button specifically
  const handleButtonClick = useCallback(() => {
    // This ensures the button click is handled separately from the timer display click
    handleStartStop();
  }, [handleStartStop]);

  // Filter history by cube type and ensure times are valid
  const filteredHistory = history
    .filter(h => h.cubeType === cubeType && h.session === session)
    .map(solve => {
      // Ensure solve times are valid
      if (!solve.time || solve.time < 100) {
        // Replace invalid times with a default value
        return { ...solve, time: 1000 }; // Default to 1 second if invalid
      }
      return solve;
    });

  // Handle cube type change and reset session if needed
  const handleCubeTypeChange = (newCubeType) => {
    setCubeType(newCubeType);
    setRetryingIndex(null); // Clear retry state when changing cube type
    
    // Check if the cube type exists in sessions, if not initialize it
    if (!sessions[newCubeType]) {
      const updatedSessions = {
        ...sessions,
        [newCubeType]: ['Normal']
      };
      setSessions(updatedSessions);
      localStorage.setItem('cubeSessions', JSON.stringify(updatedSessions));
      setSession('Normal');
      return;
    }
    
    // If current session doesn't exist for new cube type, switch to first available session
    if (!sessions[newCubeType].includes(session)) {
      setSession(sessions[newCubeType][0]);
    }
  };

  // Handle adding a new session
  const handleAddSession = () => {
    if (!newSessionName.trim()) {
      alert('Please enter a session name');
      return;
    }
    
    // Ensure the cube type exists in sessions
    if (!sessions[cubeType]) {
      sessions[cubeType] = ['Normal'];
    }
    
    if (sessions[cubeType].includes(newSessionName.trim())) {
      alert('A session with this name already exists');
      return;
    }

    const updatedSessions = {
      ...sessions,
      [cubeType]: [...sessions[cubeType], newSessionName.trim()]
    };
    
    setSessions(updatedSessions);
    localStorage.setItem('cubeSessions', JSON.stringify(updatedSessions));
    setSession(newSessionName.trim());
    setNewSessionName('');
    setNewSessionModalOpen(false);
  };

  // Handle deleting a session
  const handleDeleteSession = (sessionToDelete) => {
    // Ensure the cube type exists in sessions
    if (!sessions[cubeType]) {
      sessions[cubeType] = ['Normal'];
      return;
    }
    
    if (sessions[cubeType].length <= 1) {
      alert('Cannot delete the last session');
      return;
    }

    const updatedSessions = {
      ...sessions,
      [cubeType]: sessions[cubeType].filter(s => s !== sessionToDelete)
    };
    
    setSessions(updatedSessions);
    localStorage.setItem('cubeSessions', JSON.stringify(updatedSessions));
    
    // If we're deleting the current session, switch to the first one
    if (session === sessionToDelete) {
      setSession(updatedSessions[cubeType][0]);
    }
  };

  // Determine if UI elements should be hidden
  const shouldHideUI = isRunning && settings.hideDuringSolve;
  
  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-50'} ${settings.darkMode ? 'text-white' : 'text-gray-900'} flex flex-col md:flex-row items-start justify-start gap-6 p-4 ${shouldHideUI ? 'focused-mode' : ''}`}>
      {/* Add the focused timer styles */}
      <FocusedTimerStyle />
      
      {/* Sliding Algorithms Drawer - hide during solve if option enabled */}
      {!shouldHideUI && <AlgorithmsDrawer cubeType={cubeType} />}

      {/* Center column - Timer and averages */}
      <div className="flex-1 flex flex-col items-center gap-6 mx-auto max-w-3xl">
        {/* Header - hide during solve if option enabled */}
        {!shouldHideUI && (
          <div className="w-full flex justify-between items-center">
            <h1 className="text-3xl font-bold">Twibix</h1>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2 h-8 w-8 text-sm border-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="About Twibix"
                  >
                    ℹ️
                  </Button>
                </DialogTrigger>
                <DialogContent className={`${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 max-w-md mx-auto`}>
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">About Twibix</h2>
                    <p>Twibix is a Rubik's Cube timer app developed by a teen cube enthusiast.</p>
                    <p>This is an open source project under the GPL-3.0 license.</p>
                    <div className="flex items-center mt-4">
                      <a 
                        href="https://github.com/Ben4707573/Twibix" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        GitHub Repository
                      </a>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex flex-col items-center gap-1">
                <SettingsMenu settings={settings} setSettings={setSettings} onResetHistory={handleResetHistory} />
                <div className="text-xs text-gray-500 text-center mt-1">
                  Abort key: <kbd>{settings.abortKey}</kbd>
                </div>
                <Button 
                  onClick={() => {
                    setScramble(generateScramble(cubeType));
                    setRetryingIndex(null); // Clear retry state when skipping scramble
                  }}
                  size="sm"
                  variant="outline"
                  className="p-2 h-8 w-8 text-sm border-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Skip Scramble"
                >
                  ↻
                </Button>
                {/* Import from cstimer */}
                <label className="mt-2 text-xs text-gray-500 cursor-pointer flex flex-col items-center">
                  <span className="underline hover:text-blue-500">Import cstimer solves</span>
                  <input
                    type="file"
                    accept=".txt,application/json"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      try {
                        const text = await file.text();
                        let data;
                        try {
                          data = JSON.parse(text);
                        } catch (err) {
                          alert('Invalid file: not valid JSON');
                          return;
                        }
                        // Find the session name that matches the current session
                        // cstimer sessions are named session1, session2, ...
                        // Try to match by session name in properties.sessionData
                        let sessionKey = null;
                        if (data.properties && data.properties.sessionData) {
                          const sessionData = JSON.parse(data.properties.sessionData);
                          for (const key in sessionData) {
                            if (
                              sessionData[key].name === session ||
                              sessionData[key].name === Number(session) ||
                              (sessionData[key].name + '') === session
                            ) {
                              sessionKey = 'session' + key;
                              break;
                            }
                          }
                        }
                        // Fallback: use session1 if not found
                        if (!sessionKey) sessionKey = 'session1';
                        const solvesArr = data[sessionKey];
                        if (!Array.isArray(solvesArr)) {
                          alert('No solves found for this session in the file.');
                          return;
                        }
                        // Map cstimer solves to Twibix solves
                        const importedSolves = solvesArr.map((s) => {
                          // s: [[status, time], scramble, comment, timestamp]
                          const statusNum = s[0][0];
                          let status = 'OK';
                          if (statusNum === -1) status = 'DNF';
                          else if (statusNum === 1) status = '+2';
                          return {
                            time: s[0][1],
                            originalTime: s[0][1],
                            scramble: s[1],
                            cubeType: cubeType,
                            session: session,
                            status: status,
                            timestamp: s[3] ? s[3] * 1000 : Date.now(),
                            imported: true
                          };
                        });
                        // Add imported solves to history
                        setHistory(prev => {
                          const filtered = prev.filter(h => !(h.imported && h.session === session && h.cubeType === cubeType));
                          const newHistory = [...filtered, ...importedSolves];
                          try {
                            localStorage.setItem('cubeTimes', JSON.stringify(newHistory));
                          } catch (e) {}
                          return newHistory;
                        });
                        alert(`Imported ${importedSolves.length} solves to session '${session}'.`);
                      } catch (err) {
                        alert('Failed to import: ' + err.message);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Cube type and session selector - hide during solve if option enabled */}
        {!shouldHideUI && (
          <div className="flex items-center gap-4">
            <select
              value={cubeType}
              onChange={(e) => handleCubeTypeChange(e.target.value)}
              className={`${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded p-2 text-lg`}
            >
              <option value="2x2">2x2</option>
              <option value="3x3">3x3</option>
              <option value="4x4">4x4</option>
              <option value="5x5">5x5</option>
              <option value="6x6">6x6</option>
              <option value="7x7">7x7</option>
              <option value="pyraminx">Pyraminx</option>
              <option value="skewb">Skewb</option>
              <option value="sq1">Square-1</option>
              <option value="clock">Clock</option>
            </select>
            
            <div className="flex items-center gap-2">
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className={`${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded p-2 text-lg`}
              >
                {sessions[cubeType] ? sessions[cubeType].map(sessionName => (
                  <option key={sessionName} value={sessionName}>{sessionName}</option>
                )) : (
                  <option value="Normal">Normal</option>
                )}
              </select>
              
              <Button 
                onClick={() => setNewSessionModalOpen(true)}
                size="sm"
                variant="outline"
                className="text-xs px-2 py-1"
                title="Add New Session"
              >
                +
              </Button>
              
              {sessions[cubeType] && sessions[cubeType].length > 1 && (
                <Button 
                  onClick={() => handleDeleteSession(session)}
                  size="sm"
                  variant="destructive"
                  className="text-xs px-2 py-1"
                  title="Delete Current Session"
                >
                  ×
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Scramble display - hide during solve if option enabled */}
        {!shouldHideUI && (
          <div className="text-center">
            <div className={`text-lg ${settings.darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>Scramble:</div>
            <div className="font-mono text-xl whitespace-pre-wrap max-w-md">{drawScramble(scramble)}</div>
          </div>
        )}
        
        {isInspecting ? (
          <div className="text-center relative py-8">
            <div className={`text-6xl font-mono ${inspectionTime <= 5 ? 'text-red-500' : settings.darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {inspectionTime}s
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Inspection time: {settings.inspectionDuration}s
            </div>
          </div>
        ) : (
          <div 
            className={`text-6xl font-mono font-bold cursor-pointer select-none relative ${spaceState === 'pre-start' || touchState === 'pre-start' ? 'text-red-500' : spaceState === 'ready' || touchState === 'ready' ? 'text-green-400' : ''} ${shouldHideUI ? 'focused-timer' : ''}`}
            onClick={() => {
              // Always allow click to start/stop timer
              if (!isInspecting) {
                
                if (isRunning) {
                  // If running, stop with exact timestamps
                  const endTime = Date.now();
                  const startTime = startTimeRef;
                  const finalTime = endTime - startTime;
                  
                  
                  setIsRunning(false);
                  setStartTimeRef(null);
                  setTime(finalTime);
                  
                  if (finalTime >= 100) {
                    const solve = {
                      time: finalTime,
                      originalTime: finalTime,
                      scramble,
                      cubeType,
                      session,
                      status: 'OK',
                      timestamp: endTime
                    };
                    addSolveToHistory(solve);
                    setScramble(generateScramble(cubeType));
                  }
                } else {
                  // If inspection is enabled or hold delay is disabled, start inspection or timer immediately
                  if (settings.useInspection) {
                    startInspection();
                  } else {
                    // Start timer with direct timestamp
                    const now = Date.now();
                    setStartTimeRef(now);
                    setTime(0);
                    setIsRunning(true);
                  }
                }
              }
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              if (!isRunning && !isInspecting && touchState === 'idle') {
                setTouchStartTime(Date.now());
                // If hold delay is disabled or inspection is enabled, skip the ready state delay
                if (!settings.useHoldDelay || settings.useInspection) {
                  setTouchState('ready');
                } else {
                  // Normal behavior with delay when hold delay is enabled
                  setTouchState('pre-start');
                  setTimeout(() => {
                    if (touchState === 'pre-start') {
                      setTouchState('ready');
                    }
                  }, 500);
                }
              }
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              if (touchState === 'ready') {
                if (settings.useInspection && !isInspecting) {
                  // Start inspection
                  startInspection();
                } else {
                  // Start the timer
                  handleStartStop();
                }
              } else if (isRunning) {
                // Stop the timer
                handleStartStop();
              } else if (isInspecting) {
                // End inspection and start timing
                setIsInspecting(false);
                handleStartStop();
              }
              setTouchState('idle');
              setTouchStartTime(null);
            }}
            onTouchCancel={(e) => {
              e.preventDefault();
              setTouchState('idle');
              setTouchStartTime(null);
            }}
          >
            {formatTimeRaw(time)}s
            {!isRunning && !isInspecting && settings.useInspection && (
              <div className="text-xs text-gray-500 absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                Press to start {settings.inspectionDuration}s inspection
              </div>
            )}
            {!isRunning && !isInspecting && !settings.useInspection && (
              <div className="text-xs text-gray-500 absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                {touchState === 'pre-start' || spaceState === 'pre-start' ? 'Hold...' : 
                 touchState === 'ready' || spaceState === 'ready' ? 'Release to start!' :
                 'Touch/Space to start'}
              </div>
            )}
            {isRunning && (
              <div className="text-xs text-gray-500 absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                Touch anywhere or press any key to stop
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={isInspecting ? () => { setIsInspecting(false); handleButtonClick(); } : handleButtonClick} 
          className="text-xl px-6 py-3"
        >
          {isInspecting ? 'Skip Inspection' : isRunning ? 'Stop' : 'Start'}
        </Button>

        {/* Averages section - hide during solve if option enabled */}
        {!shouldHideUI && (
          <div className={`mt-4 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 rounded-lg w-full max-w-md border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className="text-xl font-semibold mb-3 text-center">Averages</h2>            
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex justify-between">
                  <span>MO3:</span>
                  <span className="font-mono font-bold text-lg">
                    {(() => {
                      const result = calculateMean(filteredHistory, 3);
                      return result === 'DNF' ? 'DNF' : result ? formatTime(result) : '-';
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>AO5:</span>
                  <span className="font-mono font-bold text-lg">
                    {(() => {
                      const result = calculateAverage(filteredHistory, 5);
                      return result === 'DNF' ? 'DNF' : result ? formatTime(result) : '-';
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>AO12:</span>
                  <span className="font-mono font-bold text-lg">
                    {(() => {
                      const result = calculateAverage(filteredHistory, 12);
                      return result === 'DNF' ? 'DNF' : result ? formatTime(result) : '-';
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>AO100:</span>
                  <span className="font-mono font-bold text-lg">
                    {(() => {
                      const result = calculateAverage(filteredHistory, 100);
                      return result === 'DNF' ? 'DNF' : result ? formatTime(result) : '-';
                    })()}
                  </span>
                </div>
              </div>
          </div>
        )}

        {/* Reset solves dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive">Clear All Solves</Button>
          </DialogTrigger>
          <DialogContent className={`${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <h2 className="text-xl mb-4">Are you sure you want to delete all solves?</h2>
            <div className="flex gap-4">
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleResetHistory();
                  setShowResetDialog(false);
                }}
              >
                Yes
              </Button>
              <Button variant="secondary" onClick={() => setShowResetDialog(false)}>No</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share solve dialog */}
        <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
          <DialogContent className={`${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} max-w-md`}>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Share Solve</h2>
              <div className={`${settings.darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 mb-4 select-all`}>
                <pre className="text-left font-mono whitespace-pre-wrap text-sm">{shareContent}</pre>
              </div>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => copyToClipboard(shareContent)}
                  className={`flex-1 ${copySuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {copySuccess ? '✓ Copied!' : 'Copy to Clipboard'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setShareModalOpen(false);
                    setCopySuccess(false);
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tip: You can also select and copy the text manually
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manual solve entry dialog */}
        <Dialog open={manualSolveModalOpen} onOpenChange={setManualSolveModalOpen}>
          <DialogContent className={`${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} max-w-md`}>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">Add Manual Solve</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Time (seconds)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="999"
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    onKeyDown={handleManualSolveKeyDown}
                    placeholder="12.34"
                    className={`w-full px-3 py-2 rounded border ${
                      settings.darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Scramble (optional)</label>
                  <textarea
                    value={manualScramble}
                    onChange={(e) => setManualScramble(e.target.value)}
                    onKeyDown={handleManualSolveKeyDown}
                    placeholder={`Leave empty to use current scramble:\n${scramble}`}
                    rows={3}
                    className={`w-full px-3 py-2 rounded border resize-none ${
                      settings.darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <Button 
                  onClick={handleManualSolveEntry}
                  className="flex-1"
                  disabled={!manualTime.trim()}
                >
                  Add Solve
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setManualSolveModalOpen(false);
                    setManualTime('');
                    setManualScramble('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Enter time in seconds (e.g., 12.34 for 12.34 seconds)
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* New session dialog */}
        <Dialog open={newSessionModalOpen} onOpenChange={setNewSessionModalOpen}>
          <DialogContent className={`${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} max-w-md`}>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">Create New Session</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Session Name</label>
                <input
                  type="text"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSession();
                    }
                  }}
                  placeholder="Enter session name (e.g., FMC, Test, Practice)"
                  className={`w-full px-3 py-2 rounded border ${
                    settings.darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  autoFocus
                />
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <Button 
                  onClick={handleAddSession}
                  className="flex-1"
                  disabled={!newSessionName.trim()}
                >
                  Create Session
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setNewSessionModalOpen(false);
                    setNewSessionName('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Create custom session names for different solving styles or practice types
              </p>
            </div>
          </DialogContent>
        </Dialog>

      </div>

      {/* Right column - Solve History & Scramble Visualizer - hide during solve if option enabled */}
      {!shouldHideUI && (
        <div className="w-full md:w-96 h-full sticky top-4">
          <Tabs defaultValue="solves" className="h-full flex flex-col">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="solves" className="w-full">Solve History</TabsTrigger>
              <TabsTrigger value="visualizer" className="w-full">Scramble View</TabsTrigger>
            </TabsList>
            <TabsContent value="solves" className="flex-grow overflow-hidden flex flex-col">
              <div className={`sticky top-0 z-10 ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'} pb-2`}>
                <h2 className="text-xl mb-2 mt-4 font-semibold">
                  Solve History ({cubeType} - {session}) - {filteredHistory.length} solves
                </h2>
                <Button 
                  onClick={() => setManualSolveModalOpen(true)}
                  size="sm"
                  className="w-full mb-2"
                  variant="outline"
                >
                  + Add Manual Solve
                </Button>
              </div>
              <div className="overflow-y-auto flex-grow pr-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 220px)', scrollbarWidth: 'thin' }}>
                {filteredHistory.length > 0 ? (
                  <ul className="space-y-2">
                    {filteredHistory.slice().reverse().map((solve, i) => {
                      const originalIndex = filteredHistory.length - 1 - i;
                      return (
                        <SolveHistoryItem 
                          key={`solve-${originalIndex}-${solve.timestamp || i}`} 
                          solve={solve} 
                          index={originalIndex} 
                        />
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No solves yet. Complete a solve to see it here.
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Scramble Visualizer Tab */}
            <TabsContent value="visualizer" className="flex-grow">
              <h2 className={`text-xl mb-4 mt-4 text-center ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'} pb-2 font-semibold`}>Scramble Visualizer</h2>
              {['2x2', '3x3', '4x4', '5x5', '6x6', '7x7'].includes(cubeType) ? (
                <CSTimerCubeVisualizer scramble={scramble} cubeType={cubeType} />
              ) : (
                <UnifiedScrambleVisualizer scramble={scramble} cubeType={cubeType} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Developer Info Dialog - triggered by info icon in header */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className={`${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} max-w-md`}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Developer Information</h2>
            
            <div className="text-sm">
              <p className="mb-2">
                This is a timer application for speedcubing, built with React and Tailwind CSS.
              </p>
              <p className="mb-2">
                For more information, visit the{" "}
                <a href="https://github.com/Ben4707573/Twibix" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  GitHub repository
                </a>.
              </p>
              <p>
                Developed by Ben4707573. © 2025
              </p>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <Button 
                onClick={() => setShowInfoDialog(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function generateClockScramble() {
  // WCA Clock scramble format: 9 random pin positions, 9 random dial turns, 4 random rotations
  // Example: UR3 DR2 DL5 UL0 U5 R3 D2 L4 ALL3 y2 x'
  // We'll generate: 9 random numbers (0-5) for dials, 4 random rotations (y, x, x', y')
  const dialTurns = [];
  const dialLabels = ['UR', 'DR', 'DL', 'UL', 'U', 'R', 'D', 'L', 'ALL'];
  for (let i = 0; i < 9; i++) {
    const turn = Math.floor(Math.random() * 12) - 5; // -5 to +6
    dialTurns.push(`${dialLabels[i]}${turn >= 0 ? '+' : ''}${turn}`);
  }
  // Add 4 random rotations (y, y', x, x')
  const rotations = [];
  const rotChoices = ['y', "y'", 'x', "x'"];
  for (let i = 0; i < 4; i++) {
    if (Math.random() < 0.5) {
      rotations.push(rotChoices[Math.floor(Math.random() * rotChoices.length)]);
    }
  }
  return dialTurns.join(' ') + (rotations.length ? ' ' + rotations.join(' ') : '');
}

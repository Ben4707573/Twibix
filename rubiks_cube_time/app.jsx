import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const SCRAMBLE_MOVES = {
  '2x2': ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2'],
  '3x3': ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2'],
  '4x4': ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2']
};

function generateScramble(cubeType) {
  const moves = SCRAMBLE_MOVES[cubeType];
  const scramble = [];
  let prev = '';
  for (let i = 0; i < 11 + (cubeType === '3x3' ? 9 : cubeType === '4x4' ? 20 : 0); i++) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (prev && move[0] === prev[0]);
    scramble.push(move);
    prev = move;
  }
  return scramble.join(' ');
}

function drawScramble(scramble) {
  return scramble.split(' ').map((move, index) => (
    <span key={index} className="inline-block bg-gray-700 text-white px-2 py-1 rounded m-0.5">{move}</span>
  ));
}

function calculateAverage(times, count) {
  if (times.length < count) return null;
  const valid = times.filter(t => t.status !== 'DNF');
  if (valid.length < count) return null;
  const lastTimes = valid.slice(-count).map(t => t.time);
  const sorted = [...lastTimes].sort((a, b) => a - b);
  if (count >= 5) {
    sorted.splice(0, 1);
    sorted.splice(-1, 1);
  }
  const avg = sorted.reduce((acc, cur) => acc + cur, 0) / sorted.length;
  return `${(avg / 1000).toFixed(2)}s`;
}

export default function CubeTimerApp() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cubeTimes');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [cubeType, setCubeType] = useState('3x3');
  const [scramble, setScramble] = useState('Loading...');
  const [spaceState, setSpaceState] = useState('idle');

  useEffect(() => {
    setScramble(generateScramble(cubeType));
  }, [cubeType]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning && spaceState === 'idle') {
          setSpaceState('pre-start');
          setTimeout(() => setSpaceState('ready'), 500);
        }
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (spaceState === 'ready') {
          handleStartStop();
        } else if (isRunning) {
          handleStartStop();
        }
        setSpaceState('idle');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRunning, spaceState]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      const startTime = Date.now() - time;
      timer = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem('cubeTimes', JSON.stringify(history));
  }, [history]);

  const formatTime = (ms) => {
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      const newSolve = { time, scramble, cubeType, status: 'OK' };
      setHistory(prev => [...prev, newSolve]);
      setScramble(generateScramble(cubeType));
    } else {
      setTime(0);
      setIsRunning(true);
    }
  };

  const updateSolve = (index, update) => {
    setHistory(prev => prev.map((item, i) => i === index ? { ...item, ...update } : item));
  };

  const deleteSolve = (index) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleResetHistory = () => {
    setHistory([]);
    localStorage.removeItem('cubeTimes');
  };

  const filteredHistory = history.filter(h => h.cubeType === cubeType);

  const handleRetry = (index) => {
    setTime(0);
    setIsRunning(true);
    const retryScramble = generateScramble(cubeType);
    setScramble(retryScramble);
    updateSolve(index, { scramble: retryScramble, status: 'Retry' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row items-start justify-start gap-6 p-4">
      <div className="flex-1 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold">Rubik&apos;s Cube Timer</h1>

        <select
          value={cubeType}
          onChange={(e) => setCubeType(e.target.value)}
          className="bg-gray-800 text-white rounded p-2 text-lg"
        >
          <option value="2x2">2x2</option>
          <option value="3x3">3x3</option>
          <option value="4x4">4x4</option>
        </select>

        <div className="text-center">
          <div className="text-lg text-yellow-300">Scramble:</div>
          <div className="font-mono text-xl whitespace-pre-wrap max-w-md">{drawScramble(scramble)}</div>
        </div>

        <div className={`text-5xl font-mono ${spaceState === 'pre-start' ? 'text-red-500' : spaceState === 'ready' ? 'text-green-400' : ''}`}>{formatTime(time)}</div>

        <Button onClick={handleStartStop} className="text-xl px-6 py-3">
          {isRunning ? 'Stop' : 'Start'}
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Clear All Solves</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white">
            <h2 className="text-xl mb-4">Are you sure you want to delete all solves?</h2>
            <div className="flex gap-4">
              <Button variant="destructive" onClick={handleResetHistory}>Yes</Button>
              <Button variant="secondary">No</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full md:w-96">
        <Tabs defaultValue="solves">
          <TabsList className="w-full">
            <TabsTrigger value="solves" className="w-1/2">Solve History</TabsTrigger>
            <TabsTrigger value="averages" className="w-1/2">Averages</TabsTrigger>
          </TabsList>
          <TabsContent value="solves">
            <h2 className="text-xl mb-2 mt-4">Solve History ({cubeType})</h2>
            <ul className="space-y-2">
              {filteredHistory.map((entry, i) => (
                <li key={i} className="bg-gray-800 rounded px-3 py-2 space-y-1">
                  <div>
                    Solve #{i + 1}: {entry.status === 'DNF' ? 'DNF' : formatTime(entry.time)} {entry.status !== 'OK' && entry.status !== 'DNF' ? `(${entry.status})` : ''}
                  </div>
                  <div className="text-sm text-gray-400">{entry.scramble}</div>
                  <div className="flex gap-2 text-sm mt-1 flex-wrap">
                    <Button onClick={() => updateSolve(i, { status: '+2', time: entry.time + 2000 })} size="sm">+2</Button>
                    <Button onClick={() => updateSolve(i, { status: 'DNF' })} size="sm" variant="destructive">DNF</Button>
                    <Button onClick={() => updateSolve(i, { status: 'OK' })} size="sm" variant="secondary">OK</Button>
                    <Button onClick={() => deleteSolve(i)} size="sm" variant="outline">Delete</Button>
                    <Button onClick={() => handleRetry(i)} size="sm">Retry</Button>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="averages" className="mt-4">
            <div className="space-y-1">
              <div>AO3: {calculateAverage(filteredHistory, 3) || '-'}</div>
              <div>AO5: {calculateAverage(filteredHistory, 5) || '-'}</div>
              <div>AO20: {calculateAverage(filteredHistory, 20) || '-'}</div>
              <div>AO100: {calculateAverage(filteredHistory, 100) || '-'}</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Trophy, 
  Settings, 
  Pause, 
  Coins, 
  Shield, 
  Zap, 
  Magnet,
  X,
  Tv,
  LayoutGrid,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from './utils';

// --- Constants ---
const GRAVITY = 0.4;
const JUMP_FORCE = -8;
const OBSTACLE_SPEED = 3.5;
const SPAWN_INTERVAL = 1500; // ms
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 32;
const OBSTACLE_WIDTH = 60;
const GAP_SIZE = 160;

// --- Types ---
type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

interface Obstacle {
  id: number;
  x: number;
  topHeight: number;
  passed: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

// --- Components ---

export default function App() {
  // Game State
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('skyhop_highscore')) || 0);
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('skyhop_coins')) || 0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasRevived, setHasRevived] = useState(false);
  const [showAd, setShowAd] = useState<'INTERSTITIAL' | 'REWARDED' | null>(null);

  // Physics Refs
  const playerY = useRef(GAME_HEIGHT / 2);
  const playerVelocity = useRef(0);
  const obstacles = useRef<Obstacle[]>([]);
  const particles = useRef<Particle[]>([]);
  const frameId = useRef<number | null>(null);
  const lastSpawnTime = useRef(0);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // UI State for React rendering
  const [renderPlayerY, setRenderPlayerY] = useState(GAME_HEIGHT / 2);
  const [renderObstacles, setRenderObstacles] = useState<Obstacle[]>([]);

  // --- Game Loop ---
  const update = useCallback((time: number) => {
    if (gameState !== 'PLAYING') return;

    // 1. Update Player
    playerVelocity.current += GRAVITY;
    playerY.current += playerVelocity.current;

    // 2. Bound Player
    if (playerY.current < 0) {
      playerY.current = 0;
      playerVelocity.current = 0;
    }
    if (playerY.current > GAME_HEIGHT - PLAYER_SIZE) {
      handleGameOver();
      return;
    }

    // 3. Update Obstacles
    if (time - lastSpawnTime.current > SPAWN_INTERVAL) {
      const topHeight = Math.random() * (GAME_HEIGHT - GAP_SIZE - 100) + 50;
      obstacles.current.push({
        id: Date.now(),
        x: GAME_WIDTH,
        topHeight,
        passed: false
      });
      lastSpawnTime.current = time;
    }

    obstacles.current = obstacles.current
      .map(obs => ({ ...obs, x: obs.x - OBSTACLE_SPEED }))
      .filter(obs => obs.x > -OBSTACLE_WIDTH);

    // 4. Collision & Scoring
    const playerRect = {
      left: GAME_WIDTH / 4,
      right: GAME_WIDTH / 4 + PLAYER_SIZE,
      top: playerY.current,
      bottom: playerY.current + PLAYER_SIZE
    };

    obstacles.current.forEach(obs => {
      const topRect = { left: obs.x, right: obs.x + OBSTACLE_WIDTH, top: 0, bottom: obs.topHeight };
      const bottomRect = { left: obs.x, right: obs.x + OBSTACLE_WIDTH, top: obs.topHeight + GAP_SIZE, bottom: GAME_HEIGHT };

      // Check Collision
      if (
        (playerRect.right > topRect.left && playerRect.left < topRect.right && playerRect.top < topRect.bottom) ||
        (playerRect.right > bottomRect.left && playerRect.left < bottomRect.right && playerRect.bottom > bottomRect.top)
      ) {
        handleGameOver();
      }

      // Scoring
      if (!obs.passed && obs.x + OBSTACLE_WIDTH < playerRect.left) {
        obs.passed = true;
        setScore(s => {
          const newScore = s + 1;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('skyhop_highscore', newScore.toString());
          }
          return newScore;
        });
        // Juice: Small coin reward
        if (Math.random() > 0.8) {
          setCoins(c => {
            const newCoins = c + 1;
            localStorage.setItem('skyhop_coins', newCoins.toString());
            return newCoins;
          });
        }
      }
    });

    // 5. Sync State for Rendering
    setRenderPlayerY(playerY.current);
    setRenderObstacles([...obstacles.current]);

    frameId.current = requestAnimationFrame(update);
  }, [gameState, highScore]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      frameId.current = requestAnimationFrame(update);
    } else {
      if (frameId.current) cancelAnimationFrame(frameId.current);
    }
    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [gameState, update]);

  // --- Actions ---
  const handleJump = () => {
    if (gameState !== 'PLAYING') return;
    playerVelocity.current = JUMP_FORCE;
  };

  const handleStart = () => {
    setScore(0);
    setHasRevived(false);
    playerY.current = GAME_HEIGHT / 2;
    playerVelocity.current = 0;
    obstacles.current = [];
    lastSpawnTime.current = performance.now();
    setGameState('PLAYING');
  };

  const handleGameOver = () => {
    setGameState('GAMEOVER');
    // Screen shake simulation
    if (gameContainerRef.current) {
      gameContainerRef.current.classList.add('animate-shake');
      setTimeout(() => gameContainerRef.current?.classList.remove('animate-shake'), 500);
    }
    
    // Show interstitial every 3 deaths (simulated)
    const deathCount = Number(sessionStorage.getItem('death_count') || 0) + 1;
    sessionStorage.setItem('death_count', deathCount.toString());
    if (deathCount % 3 === 0) {
      setTimeout(() => setShowAd('INTERSTITIAL'), 800);
    }
  };

  const handleRevive = () => {
    setShowAd('REWARDED');
  };

  const completeRevive = () => {
    setShowAd(null);
    setHasRevived(true);
    playerY.current = GAME_HEIGHT / 2;
    playerVelocity.current = 0;
    // Clear nearby obstacles
    obstacles.current = obstacles.current.filter(obs => obs.x > GAME_WIDTH / 2 || obs.x < 0);
    setGameState('PLAYING');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // --- UI Components ---

  const AdOverlay = ({ type, onClose }: { type: 'INTERSTITIAL' | 'REWARDED', onClose: () => void }) => {
    const [timeLeft, setTimeLeft] = useState(type === 'REWARDED' ? 5 : 3);
    
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timer);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="absolute top-4 right-4">
          {timeLeft === 0 ? (
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
              <X className="w-6 h-6 text-white" />
            </button>
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-bold">
              {timeLeft}
            </div>
          )}
        </div>

        <div className="w-full max-w-xs bg-zinc-900 rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Tv className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {type === 'REWARDED' ? 'Watch to Revive!' : 'Sponsored Content'}
          </h3>
          <p className="text-zinc-400 text-sm mb-6">
            {type === 'REWARDED' 
              ? 'Watch this short video to continue your high score run!' 
              : 'This helps keep SkyHop free for everyone.'}
          </p>
          <div className="w-full h-40 bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse" />
            <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Ad Video Playing...</span>
          </div>
        </div>
        
        {type === 'REWARDED' && timeLeft === 0 && (
          <button 
            onClick={completeRevive}
            className="mt-8 px-8 py-3 bg-indigo-500 text-white font-bold rounded-full shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"
          >
            Claim Reward & Continue
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30">
      {/* Mobile Frame */}
      <div 
        ref={gameContainerRef}
        className="relative w-full max-w-[400px] h-[600px] bg-indigo-950 rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-zinc-900 ring-1 ring-white/10"
        onMouseDown={handleJump}
        onTouchStart={handleJump}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-purple-950" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-10 w-32 h-32 bg-indigo-400 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Game Canvas (Simulated with DOM) */}
        <div className="absolute inset-0">
          {/* Obstacles */}
          {renderObstacles.map(obs => (
            <React.Fragment key={obs.id}>
              {/* Top Pipe */}
              <div 
                className="absolute bg-emerald-500 border-b-4 border-emerald-600 rounded-b-lg shadow-lg"
                style={{ 
                  left: obs.x, 
                  top: 0, 
                  width: OBSTACLE_WIDTH, 
                  height: obs.topHeight 
                }}
              >
                <div className="absolute bottom-0 left-[-4px] right-[-4px] h-8 bg-emerald-400 rounded-b-lg border-b-4 border-emerald-600" />
              </div>
              {/* Bottom Pipe */}
              <div 
                className="absolute bg-emerald-500 border-t-4 border-emerald-600 rounded-t-lg shadow-lg"
                style={{ 
                  left: obs.x, 
                  top: obs.topHeight + GAP_SIZE, 
                  width: OBSTACLE_WIDTH, 
                  height: GAME_HEIGHT - (obs.topHeight + GAP_SIZE) 
                }}
              >
                <div className="absolute top-0 left-[-4px] right-[-4px] h-8 bg-emerald-400 rounded-t-lg border-t-4 border-emerald-600" />
              </div>
            </React.Fragment>
          ))}

          {/* Player */}
          <motion.div 
            className="absolute z-10"
            animate={{ 
              y: renderPlayerY,
              rotate: playerVelocity.current * 3
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
            style={{ 
              left: GAME_WIDTH / 4, 
              width: PLAYER_SIZE, 
              height: PLAYER_SIZE 
            }}
          >
            <div className="w-full h-full bg-yellow-400 rounded-lg shadow-lg border-2 border-yellow-500 flex items-center justify-center overflow-hidden">
              <div className="absolute top-2 right-2 w-2 h-2 bg-zinc-900 rounded-full" />
              <div className="absolute bottom-2 left-2 w-4 h-1 bg-zinc-900/20 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* HUD */}
        <div className="absolute top-8 left-0 right-0 px-8 flex justify-between items-start pointer-events-none z-20">
          <div className="flex flex-col">
            <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Score</span>
            <span className="text-white text-4xl font-black tabular-nums drop-shadow-md">{score}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Coins className="w-3 h-3 text-yellow-400" />
              <span className="text-white text-xs font-bold">{coins}</span>
            </div>
          </div>
        </div>

        {/* UI Overlays */}
        <AnimatePresence>
          {gameState === 'START' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-indigo-950/80 backdrop-blur-sm p-8"
            >
              <div className="mb-12 text-center">
                <motion.h1 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl"
                >
                  SKY<span className="text-yellow-400">HOP</span>
                </motion.h1>
                <p className="text-white/60 text-sm font-medium mt-2">ONE TAP ENDLESS ADVENTURE</p>
              </div>

              <button 
                onClick={handleStart}
                className="group relative w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl shadow-yellow-400/20 hover:scale-110 transition-transform active:scale-95"
              >
                <Play className="w-8 h-8 text-indigo-950 fill-current ml-1" />
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping opacity-20" />
              </button>

              <div className="mt-12 grid grid-cols-3 gap-4">
                <button className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Trophy className="w-5 h-5 text-white/80" />
                </button>
                <button className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
                  <LayoutGrid className="w-5 h-5 text-white/80" />
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-white/80" /> : <Volume2 className="w-5 h-5 text-white/80" />}
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-indigo-950/90 backdrop-blur-md p-8"
            >
              <h2 className="text-4xl font-black text-white mb-8">GAME OVER</h2>
              
              <div className="w-full bg-white/5 rounded-3xl p-6 border border-white/10 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/50 text-xs font-bold uppercase">Final Score</span>
                  <span className="text-white text-2xl font-black">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs font-bold uppercase">Best Score</span>
                  <span className="text-yellow-400 text-2xl font-black">{highScore}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                {!hasRevived && (
                  <button 
                    onClick={handleRevive}
                    className="w-full py-4 bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 hover:bg-indigo-400 transition-colors"
                  >
                    <Tv className="w-5 h-5" />
                    REVIVE (WATCH AD)
                  </button>
                )}
                
                <button 
                  onClick={handleStart}
                  className="w-full py-4 bg-yellow-400 text-indigo-950 font-bold rounded-2xl shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-3 hover:bg-yellow-300 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  TRY AGAIN
                </button>

                <button 
                  onClick={() => setGameState('START')}
                  className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-colors"
                >
                  MAIN MENU
                </button>
              </div>
            </motion.div>
          )}

          {showAd && (
            <AdOverlay 
              type={showAd} 
              onClose={() => {
                setShowAd(null);
                if (showAd === 'INTERSTITIAL') {
                  // Just close and stay on game over
                }
              }} 
            />
          )}
        </AnimatePresence>

        {/* Bottom Banner Ad Placeholder */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-zinc-900 flex items-center justify-center border-t border-white/10 z-30">
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.3em]">Sponsored Advertisement</span>
        </div>
      </div>

      {/* Side Info (Desktop Only) */}
      <div className="hidden lg:flex flex-col ml-12 w-80 gap-6">
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            Developer Console
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Platform</span>
              <span className="text-emerald-400 font-mono">Android (Simulated)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Engine</span>
              <span className="text-indigo-400 font-mono">React + Motion</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Ads Status</span>
              <span className="text-yellow-400 font-mono">Test Mode Active</span>
            </div>
          </div>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6">
          <h3 className="text-indigo-300 font-bold mb-2">Google Play Ready</h3>
          <p className="text-indigo-200/60 text-xs leading-relaxed">
            This project is structured for TWA (Trusted Web Activity) deployment. 
            The Unity source code is also available in the file tree for native builds.
          </p>
          <div className="mt-4 flex gap-2">
            <div className="px-2 py-1 bg-indigo-500/20 rounded text-[10px] text-indigo-300 font-bold">ADMOB</div>
            <div className="px-2 py-1 bg-indigo-500/20 rounded text-[10px] text-indigo-300 font-bold">FIREBASE</div>
            <div className="px-2 py-1 bg-indigo-500/20 rounded text-[10px] text-indigo-300 font-bold">GPG</div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-1deg); }
          75% { transform: translateX(5px) rotate(1deg); }
        }
        .animate-shake {
          animation: shake 0.1s ease-in-out 5;
        }
      `}} />
    </div>
  );
}

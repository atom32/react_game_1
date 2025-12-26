
import React, { useEffect, useState, useRef } from 'react';
import { Tab } from '../types';
import { BUILDINGS_CONFIG, GAME_WIDTH, GAME_HEIGHT, WALK_SPEED, SPRINT_SPEED } from '../constants';
import { Store, Warehouse, Skull, ChefHat, Hammer, Home, ShoppingBag, Heart, CircleAlert } from 'lucide-react';

interface GameMapProps {
  onInteract: (tab: Tab) => void;
  isActive: boolean;
  buildingIcons: Record<string, string>;
  mapBackground?: string;
}

const ICONS: Record<string, React.ReactNode> = {
  Store: <Store size={32} strokeWidth={2.5} />,
  Warehouse: <Warehouse size={32} strokeWidth={2.5} />,
  Skull: <Skull size={32} strokeWidth={2.5} />,
  ChefHat: <ChefHat size={32} strokeWidth={2.5} />,
  Hammer: <Hammer size={32} strokeWidth={2.5} />,
  Home: <Home size={32} strokeWidth={2.5} />,
  ShoppingBag: <ShoppingBag size={32} strokeWidth={2.5} />,
  Heart: <Heart size={32} strokeWidth={2.5} />,
};

const BuildingBase: React.FC<{ b: any; isClose: boolean; iconUrl?: string }> = ({ b, isClose, iconUrl }) => {
  return (
    <div 
      className="absolute transition-all duration-300"
      style={{ left: b.x, top: b.y, width: b.width, height: b.height, zIndex: Math.floor(b.y + b.height) }}
    >
      <div className={`relative w-full h-full transition-all ${isClose ? '-translate-y-2 scale-105' : ''}`}>
          {/* AoE2 Crisp Shadow */}
          <div className="absolute inset-x-4 -bottom-1 h-6 bg-black/50 blur-[4px] rounded-full transform skew-x-[25deg]"></div>
          
          <div 
              className={`absolute top-0 w-full h-full z-20 flex items-center justify-center transition-all ${isClose ? 'drop-shadow-[0_0_15px_rgba(255,255,0,0.4)]' : ''}`}
          >
              {iconUrl ? (
                <img 
                  src={iconUrl} 
                  className="w-full h-full object-contain brightness-105 saturate-110 contrast-110" 
                  style={{ filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.5))' }}
                />
              ) : (
                <div className={`w-3/4 h-3/4 bg-${b.color}-800/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center text-white border-2 border-white/20 shadow-2xl`}>
                    <div className="mb-2 opacity-50">{ICONS[b.icon]}</div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Constructing</span>
                </div>
              )}
          </div>
          
          {/* Label Tag */}
          <div className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-stone-900/95 text-[yellow] text-[10px] font-black uppercase px-4 py-1.5 rounded-sm border-x-4 border-stone-700 shadow-2xl tracking-[0.2em] whitespace-nowrap z-30 font-mono transition-opacity duration-300 ${isClose ? 'opacity-100' : 'opacity-80'}`}>
              {b.label}
          </div>
      </div>
    </div>
  );
};

const PlayerCharacter: React.FC<{ x: number; y: number; facing: 'left' | 'right'; isMoving: boolean; isSprinting: boolean; canInteract: boolean }> = ({ x, y, facing, isMoving, isSprinting, canInteract }) => {
  return (
    <div 
      className="absolute transition-transform z-[2000] pointer-events-none" 
      style={{ 
        left: x, 
        top: y, 
        transform: `translate(-50%, -100%)`,
        filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))'
      }}
    >
       {canInteract && (
         <div className="absolute -top-24 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="bg-yellow-400 p-2 rounded-full border-2 border-stone-900 shadow-lg">
                <CircleAlert size={20} className="text-stone-900" />
            </div>
         </div>
       )}

       <div className={`relative w-14 h-18 transition-transform duration-300 ${facing === 'left' ? '-scale-x-100' : ''}`}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/40 rounded-full blur-[2px]"></div>
          
          <div className={`relative w-full h-full ${isMoving ? (isSprinting ? 'animate-farmer-sprint' : 'animate-farmer-walk') : 'animate-pulse-slow'}`}>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-4 flex justify-between">
                  <div className={`w-3.5 h-4 bg-stone-900 rounded-b-lg border-b-2 border-black ${isMoving ? (isSprinting ? 'animate-leg-left-sprint' : 'animate-leg-left') : ''}`}></div>
                  <div className={`w-3.5 h-4 bg-stone-900 rounded-b-lg border-b-2 border-black ${isMoving ? (isSprinting ? 'animate-leg-right-sprint' : 'animate-leg-right') : ''}`}></div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-9 h-11 bg-stone-800 rounded-xl border-2 border-stone-950 overflow-hidden shadow-lg">
                  <div className="absolute top-0 inset-x-0 h-4 bg-blue-700"></div>
                  <div className="absolute top-0 left-1 w-2.5 h-full bg-stone-900/30"></div>
                  <div className="absolute top-0 right-1 w-2.5 h-full bg-stone-900/30"></div>
              </div>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-stone-200 rounded-[1rem] border-2 border-stone-400 shadow-md">
                  <div className="absolute top-4 left-2.5 w-1.5 h-1.5 bg-stone-900 rounded-full"></div>
                  <div className="absolute top-4 right-2.5 w-1.5 h-1.5 bg-stone-900 rounded-full"></div>
                  <div className="absolute -top-3 -left-2 w-14 h-4 bg-yellow-300 rounded-full border-b-2 border-yellow-500"></div>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-4 bg-yellow-400 rounded-t-full border-t border-yellow-600"></div>
              </div>
          </div>
       </div>
    </div>
  );
};

export const GameMap: React.FC<GameMapProps> = ({ onInteract, isActive, buildingIcons, mapBackground }) => {
  const [playerState, setPlayerState] = useState({ x: GAME_WIDTH/2, y: GAME_HEIGHT/2, isMoving: false, isSprinting: false, facing: 'right' as 'left'|'right' });
  const [closestBuilding, setClosestBuilding] = useState<Tab | null>(null);
  const posRef = useRef({ x: GAME_WIDTH/2, y: GAME_HEIGHT/2 });
  const keysRef = useRef<Record<string, boolean>>({});
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      keysRef.current[e.code] = true;
      if (e.code === 'KeyE' || e.code === 'Space') {
        const building = BUILDINGS_CONFIG.find(b => {
          const dx = b.x + b.width/2 - posRef.current.x;
          const dy = b.y + b.height/2 - posRef.current.y;
          return Math.sqrt(dx*dx + dy*dy) < 140;
        });
        if (building) onInteract(building.id);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { 
      window.removeEventListener('keydown', handleKeyDown); 
      window.removeEventListener('keyup', handleKeyUp); 
    };
  }, [isActive, onInteract]);

  useEffect(() => {
    const update = () => {
      if (!isActive) {
        requestRef.current = requestAnimationFrame(update);
        return;
      }

      let dx = 0; let dy = 0;
      if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) dy -= 1;
      if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) dy += 1;
      if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) dx -= 1;
      if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) dx += 1;
      
      const isSprinting = !!(keysRef.current['ShiftLeft'] || keysRef.current['ShiftRight']);
      const currentSpeed = isSprinting ? SPRINT_SPEED : WALK_SPEED;
      
      if (dx !== 0 || dy !== 0) {
          const length = Math.sqrt(dx * dx + dy * dy);
          dx = (dx / length) * currentSpeed;
          dy = (dy / length) * currentSpeed;
      }
      
      let newFacing = playerState.facing;
      if (dx < 0) newFacing = 'left';
      if (dx > 0) newFacing = 'right';
      
      const newX = Math.max(40, Math.min(GAME_WIDTH - 40, posRef.current.x + dx));
      const newY = Math.max(60, Math.min(GAME_HEIGHT - 60, posRef.current.y + dy));
      posRef.current = { x: newX, y: newY };
      
      setPlayerState(prev => ({ 
        ...prev, x: newX, y: newY, isMoving: dx !== 0 || dy !== 0, isSprinting: isSprinting, facing: newFacing
      }));
      
      const b = BUILDINGS_CONFIG.find(b => {
          const distDx = b.x + b.width/2 - newX;
          const distDy = b.y + b.height/2 - newY;
          return Math.sqrt(distDx*distDx + distDy*distDy) < 140;
      });
      setClosestBuilding(b ? b.id : null);
      
      requestRef.current = requestAnimationFrame(update);
    };

    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(update);

    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isActive]);

  return (
    <div className="relative w-full h-full bg-[#1a250f] flex items-center justify-center overflow-auto p-12 custom-scrollbar">
      <div 
        className="relative shadow-[0_0_150px_rgba(0,0,0,0.9)] border-[12px] border-stone-800/90 shrink-0 rounded-lg overflow-hidden" 
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Map Layer */}
        {mapBackground ? (
          <div className="absolute inset-0 z-0">
            <img src={mapBackground} className="w-full h-full object-cover brightness-[0.9] saturate-[1.1] contrast-[1.1]" alt="Estate Ground" />
            <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply opacity-20"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#2a3a1a] z-0">
               <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '80px 80px' }}></div>
          </div>
        )}

        {/* Buildings Layer */}
        <div className="relative z-10 w-full h-full">
           {BUILDINGS_CONFIG.map(b => <BuildingBase key={b.id} b={b} isClose={closestBuilding === b.id} iconUrl={buildingIcons[b.id]} />)}
        </div>
        
        {/* Player Layer */}
        <PlayerCharacter 
          x={playerState.x} 
          y={playerState.y} 
          facing={playerState.facing} 
          isMoving={playerState.isMoving} 
          isSprinting={playerState.isSprinting}
          canInteract={!!closestBuilding}
        />
        
        {/* Overlay FX */}
        <div className="absolute inset-0 pointer-events-none z-[5000] shadow-[inset_0_0_200px_rgba(0,0,0,0.4)]"></div>
        <div className="absolute inset-0 pointer-events-none z-[5001] bg-noise opacity-[0.04]"></div>
      </div>

      <style>{`
        .bg-noise {
          background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
        }

        @keyframes farmer-walk { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-4px) rotate(1deg); } }
        @keyframes leg-left { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px) rotate(-10deg); } }
        @keyframes leg-right { 0%, 100% { transform: translateY(-6px) rotate(10deg); } 50% { transform: translateY(0); } }
        
        @keyframes farmer-sprint { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-8px) rotate(4deg); } }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }

        .animate-farmer-walk { animation: farmer-walk 0.35s infinite ease-in-out; }
        .animate-leg-left { animation: leg-left 0.35s infinite ease-in-out; }
        .animate-leg-right { animation: leg-right 0.35s infinite ease-in-out; }
        
        .animate-farmer-sprint { animation: farmer-sprint 0.2s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 2.5s infinite ease-in-out; }
      `}</style>
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store';
import { BUILDINGS_CONFIG, GAME_WIDTH, GAME_HEIGHT, WALK_SPEED } from '../../constants';
import { Store, Warehouse, Skull, ChefHat, Hammer, Home, Sparkles, Heart, ShoppingBag } from 'lucide-react';

// --- Assets & Icons ---
const ICONS: Record<string, React.ReactNode> = {
  Store: <Store size={24} />,
  Warehouse: <Warehouse size={24} />,
  Skull: <Skull size={24} />,
  ChefHat: <ChefHat size={24} />,
  Hammer: <Hammer size={24} />,
  Home: <Home size={24} />,
  Heart: <Heart size={24} />,
  ShoppingBag: <ShoppingBag size={24} />,
};

// --- Player Component (2D) ---
const Player2D: React.FC<{ x: number; y: number; targetX: number; targetY: number }> = ({ x, y, targetX, targetY }) => {
    const isMoving = Math.abs(x - targetX) > 5 || Math.abs(y - targetY) > 5;
    const facingRight = targetX > x;

    return (
        <div 
            className="absolute transition-transform will-change-transform pointer-events-none z-[9999]"
            style={{ 
                left: x, 
                top: y, 
                transform: `translate(-50%, -100%)`,
                zIndex: Math.floor(y) // Dynamic depth
            }}
        >
            {/* Shadow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-black/40 blur-[2px] rounded-full"></div>
            
            {/* Character Body */}
            <div className={`relative w-12 h-12 transition-transform duration-200 ${facingRight ? '' : '-scale-x-100'}`}>
                <div className={`w-full h-full bg-yellow-400 rounded-full border-2 border-black flex items-center justify-center relative ${isMoving ? 'animate-bounce' : ''}`}>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full"></div> {/* Eye */}
                    <div className="absolute top-2 left-4 w-1 h-1 bg-white/50 rounded-full"></div> {/* Highlight */}
                </div>
                {/* Manager Hat */}
                <div className="absolute -top-4 -left-2 w-16 h-6 bg-red-600 rounded-full border-2 border-black"></div>
                <div className="absolute -top-8 left-2 w-8 h-6 bg-red-600 rounded-t-lg border-2 border-black border-b-0"></div>
            </div>
            
            {/* Name Tag */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest whitespace-nowrap">
                Manager
            </div>
        </div>
    );
};

// --- Building Component (2D) ---
const Building2D: React.FC<{ 
    config: typeof BUILDINGS_CONFIG[0]; 
    iconUrl?: string;
    onClick: () => void;
}> = ({ config, iconUrl, onClick }) => {
    // Dynamic Z-Index based on Y position (Painter's Algorithm)
    // We add height to Y because in isometric view, the "bottom" of the sprite determines depth
    const depth = Math.floor(config.y + config.height);

    return (
        <div
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="absolute group cursor-pointer transition-transform hover:scale-105 active:scale-95"
            style={{
                left: config.x,
                top: config.y,
                width: config.width,
                height: config.height,
                zIndex: depth
            }}
        >
            {/* Isometric Shadow */}
            <div className="absolute -bottom-4 left-4 w-full h-8 bg-black/40 blur-md rounded-[50%] transform skew-x-12 pointer-events-none"></div>

            {/* Building Sprite/Box */}
            <div className={`relative w-full h-full rounded-2xl overflow-hidden border-4 border-black/10 bg-${config.color}-800 shadow-2xl transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]`}>
                {iconUrl ? (
                    <img src={iconUrl} className="w-full h-full object-cover pixel-art" alt={config.label} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-80 text-white/50">
                        {ICONS[config.icon] || <Sparkles />}
                        <span className="text-[9px] font-black uppercase mt-2 tracking-widest">Constructing</span>
                    </div>
                )}
                
                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            </div>

            {/* Floating Label */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-2 z-50 pointer-events-none">
                 <div className="bg-stone-900 text-white px-4 py-2 rounded-xl border border-white/20 shadow-xl flex flex-col items-center">
                    <span className="text-xs font-black uppercase tracking-wider whitespace-nowrap">{config.label}</span>
                    <div className="text-[9px] text-stone-400">Click to Enter</div>
                 </div>
                 {/* Triangle Arrow */}
                 <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-stone-900 mx-auto mt-[-1px]"></div>
            </div>
        </div>
    );
};

export const GameScene: React.FC = () => {
  const { setActiveTab, buildingIcons, mapBackground } = useGameStore();
  
  // Local state for smooth player movement (Lerp)
  const [playerPos, setPlayerPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [targetPos, setTargetPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });

  // Animation Loop for Player
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
        setPlayerPos(prev => {
            const dx = targetPos.x - prev.x;
            const dy = targetPos.y - prev.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 1) return prev; // Stop if close enough

            const speed = 0.1; // Smoothing factor (0.1 = slow start/stop)
            return {
                x: prev.x + dx * speed,
                y: prev.y + dy * speed
            };
        });
        animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPos]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get click coordinates relative to the map container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // Adjust for scroll if needed, but here we assume fixed/scroll container
    const y = e.clientY - rect.top;
    
    // Simple bounds check
    // In a real scrolling map, we'd add scrollLeft/scrollTop
    setTargetPos({ x, y });
  };

  return (
    <div className="w-full h-full overflow-auto bg-[#1a1c15] relative custom-scrollbar flex items-center justify-center p-20">
        
        {/* The World Container */}
        <div 
            className="relative shrink-0 shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden bg-stone-900 border-[8px] border-stone-800"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            onClick={handleMapClick}
        >
            {/* Background Layer */}
            {mapBackground ? (
                <img src={mapBackground} className="absolute inset-0 w-full h-full object-cover opacity-80 pixel-art pointer-events-none" />
            ) : (
                <div className="absolute inset-0 bg-[#2d3a20] bg-noise opacity-80 pointer-events-none">
                    {/* Fallback Grid */}
                    <div className="w-full h-full opacity-10" 
                        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    </div>
                </div>
            )}

            {/* Buildings Layer (Sorted by DOM order/Z-index automatically handled in component) */}
            {BUILDINGS_CONFIG.map(b => (
                <Building2D 
                    key={b.id} 
                    config={b} 
                    iconUrl={buildingIcons[b.id]}
                    onClick={() => setActiveTab(b.id)} 
                />
            ))}

            {/* Player Layer */}
            <Player2D 
                x={playerPos.x} 
                y={playerPos.y} 
                targetX={targetPos.x}
                targetY={targetPos.y}
            />

            {/* Click Indicator (Target) */}
            {targetPos && (
                <div 
                    className="absolute w-4 h-4 border-2 border-white rounded-full animate-ping pointer-events-none z-0"
                    style={{ left: targetPos.x - 8, top: targetPos.y - 8 }}
                ></div>
            )}

             {/* Post-Processing Vignette */}
             <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-[10000]"></div>
        </div>
    </div>
  );
};

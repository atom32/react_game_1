
import React, { useEffect } from 'react';
import { GameState, Tab } from '../types';
import { Coins, Zap, Calendar, X, Store, Warehouse, Skull, ChefHat, Hammer, Home, Sparkles, Loader2 } from 'lucide-react';
import { BUILDINGS_CONFIG } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  gameState: GameState;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onEndDay: () => void;
  onUpgradeBuilding: (tab: Tab) => void;
  onGenerateIcons: () => void;
  isGenerating: boolean;
  GameSceneComponent: React.ReactNode; 
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, gameState, activeTab, onTabChange, onEndDay, onUpgradeBuilding, onGenerateIcons, isGenerating, GameSceneComponent 
}) => {
  const isGameActive = activeTab === 'MAP';
  const isAnatomy = activeTab === 'ANATOMY';
  const currentBuilding = BUILDINGS_CONFIG.find(b => b.id === activeTab);
  const currentLevel = currentBuilding ? (gameState.buildingLevels[currentBuilding.id] || 1) : 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'q' && activeTab !== 'MAP') {
        onTabChange('MAP');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, onTabChange]);

  const getIcon = (id: Tab, icon: string) => {
    if (gameState.buildingIcons[id]) return <img src={gameState.buildingIcons[id]} className="w-14 h-14 object-contain drop-shadow-lg" />;
    switch(icon) {
      case 'Store': return <Store size={40} />;
      case 'Warehouse': return <Warehouse size={40} />;
      case 'Skull': return <Skull size={40} />;
      case 'ChefHat': return <ChefHat size={40} />;
      case 'Hammer': return <Hammer size={40} />;
      case 'Home': return <Home size={40} />;
      default: return <Sparkles size={40} />;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      
      {/* LAYER 0: THE GAME WORLD (2D Map) */}
      <div className={`absolute inset-0 z-0 transition-all duration-700 ease-out ${!isGameActive ? 'scale-110 blur-md brightness-[0.2]' : 'scale-100 blur-0 brightness-100'}`}>
          {GameSceneComponent}
      </div>

      {/* LAYER 1: UI HUD (Pointer events allowed on buttons only) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        {/* Header HUD */}
        <header className="pointer-events-auto w-full max-w-7xl mx-auto bg-stone-950/90 border border-white/10 text-white shadow-2xl px-8 py-4 rounded-[2rem] flex justify-between items-center backdrop-blur-xl">
            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-white tracking-tighter leading-none flex items-center gap-2">
                    <span className="text-red-500">MARROW</span>
                    <span className="text-stone-600 font-light">&</span>
                    <span className="text-stone-300">MILL</span>
                    </h1>
                </div>
                
                <div className="h-8 w-px bg-white/10"></div>
                
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Coins size={20} className="text-yellow-500" />
                        <span className="text-lg font-black font-mono tracking-tight">${gameState.money.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Zap size={20} className="text-blue-500" />
                        <span className="text-lg font-black font-mono tracking-tight">{gameState.energy}<span className="text-stone-600 text-sm">/{gameState.maxEnergy}</span></span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onGenerateIcons}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-xl font-bold text-xs uppercase transition-all border border-indigo-500/30 ${isGenerating ? 'opacity-50' : ''}`}
                >
                    {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16} />}
                    {isGenerating ? 'Forging Assets...' : 'GenAI Visuals'}
                </button>
                <button onClick={onEndDay} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black shadow-lg flex items-center gap-2 text-xs uppercase transition-all">
                    <Calendar size={16} /> Next Day
                </button>
            </div>
        </header>

        {/* Footer HUD */}
        <footer className="pointer-events-auto mx-auto px-8 py-3 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            Click to Move • Click Buildings to Enter • Manage Resources wisely
        </footer>
      </div>

      {/* LAYER 2: MODAL OVERLAYS (Buildings / Inventory) */}
      {!isGameActive && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center p-8 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
             <div className={`pointer-events-auto w-full max-w-[1400px] h-full max-h-[85vh] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500 ${isAnatomy ? 'bg-stone-900 border border-white/10' : 'bg-[#f5f5f4]'}`}>
                
                {/* Building Header */}
                {!isAnatomy && currentBuilding && (
                  <div className={`bg-${currentBuilding.color}-700 p-8 text-white flex justify-between items-center shrink-0 shadow-lg`}>
                      <div className="flex items-center gap-6">
                          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                               {getIcon(currentBuilding.id, currentBuilding.icon)}
                          </div>
                          <div>
                              <h2 className="text-4xl font-black uppercase tracking-tighter">{currentBuilding.label}</h2>
                              <div className="flex items-center gap-3 mt-2">
                                  <span className="bg-black/30 px-3 py-1 rounded-lg text-[10px] font-bold uppercase border border-white/10">Lvl {currentLevel}</span>
                                  <span className="text-white/60 text-xs font-medium">Fully Operational</span>
                              </div>
                          </div>
                      </div>
                      <button onClick={() => onTabChange('MAP')} className="p-4 bg-black/20 hover:bg-red-600 rounded-2xl text-white transition-colors border border-white/10">
                        <X size={24} />
                      </button>
                  </div>
                )}

                {/* Anatomy Close Button */}
                {isAnatomy && (
                   <div className="absolute top-6 right-6 z-[3000]">
                      <button onClick={() => onTabChange('MAP')} className="p-3 bg-white/10 hover:bg-red-600 text-white rounded-xl transition-all border border-white/10">
                        <X size={20} />
                      </button>
                   </div>
                )}

                {/* Content Area */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar ${isAnatomy ? 'p-0' : 'p-8'}`}>
                    {children}
                </div>
             </div>
        </div>
      )}

    </div>
  );
};

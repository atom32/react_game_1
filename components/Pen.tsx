
import React from 'react';
import { GameState, Animal, AnimalLocation } from '../types';
import { ANIMAL_CONFIG } from '../livestockConfig';
import { Zap, Star, Info, Truck, Heart, Skull, Hammer, Home } from 'lucide-react';

interface PenProps {
  gameState: GameState;
  onMove: (id: string, location: AnimalLocation) => void;
  onEnhance: (id: string, type: 'WEIGHT' | 'QUALITY') => void;
  onShowDetail: (id: string) => void;
}

export const Pen: React.FC<PenProps> = ({ gameState, onMove, onEnhance, onShowDetail }) => {
  const inPen = gameState.animals.filter(a => a.location === 'PEN');

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-[2.5rem] border border-green-100 mb-4">
        <h3 className="text-2xl font-black text-green-900 flex items-center gap-3">
          <Truck className="text-green-600" /> Livestock Management
        </h3>
        <p className="text-green-600 font-bold text-sm">Review specs and reassign assets to specialized facilities.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {inPen.map(animal => {
          const config = ANIMAL_CONFIG[animal.type];
          
          return (
            <div key={animal.id} className="group bg-white p-5 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-xl transition-all flex items-center justify-between gap-8 relative overflow-hidden">
              {/* Left Side: Detail & Identity - Clear Separation */}
              <div className="flex items-center gap-6 shrink-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowDetail(animal.id);
                  }}
                  className="relative w-24 h-24 bg-stone-50 rounded-[2rem] flex items-center justify-center text-5xl border-2 border-transparent hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group/avatar overflow-hidden"
                  title="View Detail Profile"
                >
                  <span className="group-hover/avatar:scale-110 transition-transform z-10">
                    {animal.type === 'CHICKEN' && '🐔'}
                    {animal.type === 'PIG' && '🐷'}
                    {animal.type === 'SHEEP' && '🐑'}
                    {animal.type === 'COW' && '🐮'}
                  </span>
                  <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                    <Info className="text-green-600 mb-1" size={24} />
                  </div>
                  {animal.isPregnant && (
                    <div className="absolute top-1 right-1 bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] animate-pulse">
                      🤰
                    </div>
                  )}
                </button>
                
                <div>
                  <h4 className="text-xl font-black text-stone-800 flex items-center gap-2">
                    {animal.name}
                    <span className={`text-[10px] px-2 py-0.5 rounded-md ${animal.gender === 'MALE' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                      {animal.gender}
                    </span>
                  </h4>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${(animal.weight / config.maxWeight) * 100}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-stone-400">{animal.weight.toFixed(1)}kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: `${animal.quality}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-stone-400">Q:{animal.quality}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Action Controls - Interactive Zone */}
              <div className="flex items-center gap-8 pr-4">
                {/* Enhance Section */}
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-black text-stone-400 uppercase text-center tracking-widest">Growth ($100)</span>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => onEnhance(animal.id, 'WEIGHT')} 
                        className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Feed (Add Weight)"
                      >
                        <Zap size={18}/>
                      </button>
                      <button 
                        onClick={() => onEnhance(animal.id, 'QUALITY')} 
                        className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl hover:bg-yellow-500 hover:text-white transition-all shadow-sm"
                        title="Groom (Add Quality)"
                      >
                        <Star size={18}/>
                      </button>
                   </div>
                </div>
                
                <div className="w-px bg-stone-100 h-16 hidden md:block"></div>

                {/* Transport Section */}
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-black text-stone-400 uppercase text-center tracking-widest">Transport to</span>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => onMove(animal.id, 'SLAUGHTER')} 
                        className="p-3 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-600 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 min-w-[60px]"
                      >
                        <Skull size={16} />
                        <span className="text-[8px]">KILL</span>
                      </button>
                      <button 
                        onClick={() => onMove(animal.id, 'BREEDING')} 
                        className="p-3 bg-pink-50 text-pink-600 rounded-2xl font-black text-xs hover:bg-pink-500 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 min-w-[60px]"
                      >
                        <Heart size={16} />
                        <span className="text-[8px]">BREED</span>
                      </button>
                      <button 
                        onClick={() => onMove(animal.id, 'WORKSHOP')} 
                        className="p-3 bg-amber-50 text-amber-600 rounded-2xl font-black text-xs hover:bg-amber-500 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 min-w-[60px]"
                      >
                        <Hammer size={16} />
                        <span className="text-[8px]">CRAFT</span>
                      </button>
                      <button 
                        onClick={() => onMove(animal.id, 'HOUSE')} 
                        className="p-3 bg-purple-50 text-purple-600 rounded-2xl font-black text-xs hover:bg-purple-600 hover:text-white transition-all shadow-sm flex flex-col items-center gap-1 min-w-[60px]"
                      >
                        <Home size={16} />
                        <span className="text-[8px]">HOME</span>
                      </button>
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {inPen.length === 0 && (
        <div className="text-center py-20 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-100">
           <Truck size={48} className="mx-auto text-stone-200 mb-4" />
           <p className="text-stone-400 font-bold italic">No livestock in the current holding pen.</p>
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { GameState, Animal } from '../types';
import { ANIMAL_CONFIG } from '../livestockConfig';
import { MARKET_REFRESH_COST } from '../constants';
import { ShoppingCart, Truck, Scale, BadgeCheck, Zap, Info } from 'lucide-react';

interface MarketProps {
  gameState: GameState;
  onBuy: (animal: Animal) => void;
  onResupply: () => void;
  onShowDetail: (id: string) => void;
}

export const Market: React.FC<MarketProps> = ({ gameState, onBuy, onResupply, onShowDetail }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-blue-50 p-6 rounded-3xl border border-blue-100">
        <div>
          <h3 className="text-3xl font-black text-blue-900">Livestock Exchange</h3>
          <p className="text-blue-600">Premium quality animals for your park.</p>
        </div>
        <button 
          onClick={onResupply}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
        >
          <Truck size={20} />
          Resupply Market (${MARKET_REFRESH_COST})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gameState.marketAnimals.map((animal) => {
          const config = ANIMAL_CONFIG[animal.type];
          const price = Math.floor(config.basePrice * (animal.weight / (config.maxWeight * 0.1)) * (animal.quality / 50));
          const canAfford = gameState.money >= price;

          return (
            <div key={animal.id} className="bg-white rounded-[2rem] shadow-xl border border-stone-100 overflow-hidden hover:scale-105 transition-all relative">
              <button onClick={() => onShowDetail(animal.id)} className="absolute top-4 right-4 p-2 bg-stone-900/10 text-stone-600 rounded-full hover:bg-stone-900 hover:text-white transition-all z-20">
                <Info size={16} />
              </button>
              <div className="h-32 bg-stone-50 flex items-center justify-center text-5xl relative">
                <span className="absolute top-4 left-4 text-[10px] font-black uppercase text-stone-400 tracking-widest">{animal.gender}</span>
                {animal.type === 'CHICKEN' && '🐔'}
                {animal.type === 'PIG' && '🐷'}
                {animal.type === 'SHEEP' && '🐑'}
                {animal.type === 'COW' && '🐮'}
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                   <div className="flex justify-between text-sm font-bold">
                      <span className="text-stone-400 uppercase">Weight</span>
                      <span className="text-stone-900">{animal.weight.toFixed(1)}kg</span>
                   </div>
                   <div className="flex justify-between text-sm font-bold">
                      <span className="text-stone-400 uppercase">Quality</span>
                      <span className="text-blue-600">{animal.quality}/100</span>
                   </div>
                </div>
                <button 
                  onClick={() => onBuy(animal)}
                  disabled={!canAfford}
                  className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all
                    ${canAfford ? 'bg-blue-600 text-white shadow-blue-200 shadow-xl' : 'bg-stone-100 text-stone-400'}`}
                >
                  <ShoppingCart size={18} />
                  ${price}
                </button>
              </div>
            </div>
          );
        })}
        {gameState.marketAnimals.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-stone-400 border-2 border-dashed border-stone-200 rounded-[2rem] bg-stone-50">
             <Truck size={48} className="mb-2 opacity-20" />
             <p className="font-bold">Market empty. Resupply to get new stock.</p>
          </div>
        )}
      </div>
    </div>
  );
};

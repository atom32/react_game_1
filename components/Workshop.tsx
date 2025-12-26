
import React from 'react';
import { GameState, Recipe } from '../types';
import { CRAFTING_RECIPES, ITEMS } from '../constants';
import { Hammer, Camera, Scissors, Package } from 'lucide-react';

interface WorkshopProps {
  gameState: GameState;
  onCraft: (recipe: Recipe) => void;
  onSellGood: (itemId: string, count: number, price: number) => void;
  onLiveProcess: (id: string) => void;
  onShowDetail: (id: string) => void;
  onAnatomyStart: (corpseId: string) => void;
}

export const Workshop: React.FC<WorkshopProps> = ({ gameState, onCraft, onSellGood, onLiveProcess, onShowDetail, onAnatomyStart }) => {
  const inWS = gameState.animals.filter(a => a.location === 'WORKSHOP');
  
  // Get corpses from inventory
  const corpses = (Object.entries(gameState.inventory) as [string, number][])
    .filter(([id, count]) => ITEMS[id]?.category === 'CORPSE' && count > 0);

  return (
    <div className="space-y-12 pb-20">
        <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100">
            <h3 className="text-3xl font-black text-amber-900">Artisan Workshop</h3>
            <p className="text-amber-600 font-bold">Craft luxury goods, perform intricate anatomy, or prepare life-like animal mounts.</p>
        </div>

        {/* Anatomy Table Section */}
        <section className="bg-stone-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
                <Scissors size={200} />
            </div>
            <div className="relative z-10">
                <h4 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <Scissors className="text-red-500" /> Anatomical Dissection
                </h4>
                {corpses.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center italic text-stone-500">
                        No corpses available for dissection. Use the Slaughterhouse first.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {corpses.map(([id, count]) => (
                            <div key={id} className="bg-stone-800/80 border border-white/10 p-6 rounded-[2rem] flex flex-col items-center group">
                                <div className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all">💀</div>
                                <div className="text-center mb-6">
                                    <div className="font-black text-lg">{ITEMS[id].name}</div>
                                    <div className="text-stone-500 text-xs font-bold">QTY: {count}</div>
                                </div>
                                <button 
                                    onClick={() => onAnatomyStart(id)}
                                    className="w-full py-4 bg-red-700 hover:bg-red-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-lg shadow-red-900/40"
                                >
                                    Begin Anatomy
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>

        {/* Live Taxidermy Section */}
        <section>
            <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-stone-700">
                <Camera className="text-amber-500" /> Artisan Taxidermy (Live Processing)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {inWS.map(a => (
                    <div key={a.id} className="bg-white p-6 rounded-3xl border-2 border-dashed border-stone-200 flex flex-col items-center">
                         <button 
                            onClick={() => onShowDetail(a.id)}
                            className="text-4xl mb-3 hover:scale-110 transition-transform"
                            title="View Detail"
                         >
                            {a.type === 'CHICKEN' ? '🐔' : a.type === 'PIG' ? '🐷' : a.type === 'SHEEP' ? '🐑' : '🐮'}
                         </button>
                         <span className="font-bold">{a.name}</span>
                         <button 
                            onClick={() => onLiveProcess(a.id)}
                            className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-xl font-black text-xs hover:bg-amber-700 active:scale-95 shadow-lg"
                         >
                            CRAFT MOUNT
                         </button>
                    </div>
                ))}
                {inWS.length === 0 && (
                    <div className="col-span-3 text-center py-10 text-stone-400 italic bg-stone-50 rounded-3xl border-2 border-dashed border-stone-100">
                        No live animals in the workshop queue. Transport them from the Animal Pens.
                    </div>
                )}
            </div>
        </section>

        {/* Crafting Section */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100">
            <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-stone-700">
                <Hammer className="text-amber-600" /> Guild Crafting
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {CRAFTING_RECIPES.map(recipe => {
                    const canAfford = recipe.input.every(ing => (gameState.inventory[ing.itemId] || 0) >= ing.count);
                    return (
                        <div key={recipe.id} className="bg-stone-50 rounded-2xl p-5 border border-stone-100 flex flex-col justify-between">
                             <div>
                                <h5 className="font-black mb-1">{recipe.name}</h5>
                                <div className="text-[10px] text-stone-400 uppercase font-black mb-4">Output: {ITEMS[recipe.output.itemId].name}</div>
                                <div className="space-y-1 mb-6">
                                    {recipe.input.map(ing => (
                                        <div key={ing.itemId} className="flex justify-between text-[10px] font-bold">
                                            <span>{ITEMS[ing.itemId].name}</span>
                                            <span className={(gameState.inventory[ing.itemId] || 0) >= ing.count ? 'text-green-600' : 'text-red-500'}>
                                                {gameState.inventory[ing.itemId] || 0}/{ing.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                             </div>
                             <button 
                                onClick={() => onCraft(recipe)}
                                disabled={!canAfford}
                                className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                                    ${canAfford ? 'bg-amber-600 text-white shadow-lg' : 'bg-stone-200 text-stone-400'}`}
                             >
                                CRAFT
                             </button>
                        </div>
                    );
                })}
            </div>
        </section>
    </div>
  );
};

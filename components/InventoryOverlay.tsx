
import React from 'react';
import { GameState } from '../types';
import { ITEMS } from '../constants';
import { X, Package, Layers } from 'lucide-react';

interface InventoryOverlayProps {
  gameState: GameState;
  onClose: () => void;
}

export const InventoryOverlay: React.FC<InventoryOverlayProps> = ({ gameState, onClose }) => {
  const inventoryItems = (Object.entries(gameState.inventory) as [string, number][])
    .filter(([id, count]) => count > 0 && ITEMS[id])
    .map(([id, count]) => ({ ...ITEMS[id], count }));

  const categories = ['MEAT', 'BYPRODUCT', 'CORPSE', 'DISH', 'GOODS'] as const;

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-stone-900 w-full max-w-4xl h-full max-h-[80vh] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,1)] border border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-stone-950/50">
                <div className="flex items-center gap-4">
                    <div className="bg-stone-800 p-3 rounded-2xl text-blue-400">
                        <Package size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Industrial Inventory</h2>
                        <p className="text-stone-500 font-bold text-xs uppercase tracking-widest">Global Asset Overview</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-4 bg-stone-800 hover:bg-red-600 text-white rounded-2xl transition-all">
                    <X size={24} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
                {categories.map(cat => {
                    const itemsInCat = inventoryItems.filter(i => i.category === cat);
                    if (itemsInCat.length === 0) return null;

                    return (
                        <div key={cat} className="space-y-4">
                            <h3 className="text-xs font-black text-stone-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Layers size={14} /> {cat}s
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {itemsInCat.map(item => (
                                    <div key={item.id} className="bg-stone-800/50 p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                                        <div className="text-4xl mb-3">
                                            {cat === 'MEAT' && '🥩'}
                                            {cat === 'BYPRODUCT' && '🦴'}
                                            {cat === 'CORPSE' && '💀'}
                                            {cat === 'DISH' && '🍲'}
                                            {cat === 'GOODS' && '💎'}
                                        </div>
                                        <div className="text-white font-black text-sm mb-1">{item.name}</div>
                                        <div className="text-blue-400 font-mono text-xs font-black">x{item.count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {inventoryItems.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-stone-600 py-20">
                        <Package size={80} className="mb-6 opacity-20" />
                        <p className="text-2xl font-black italic">Storage facilities are empty.</p>
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className="p-6 bg-stone-950/50 border-t border-white/5 text-center">
                <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest">Press <span className="bg-stone-800 text-white px-2 py-1 rounded mx-1">B</span> to Close</p>
            </div>
        </div>
    </div>
  );
};

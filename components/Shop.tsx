
import React, { useState } from 'react';
import { GameState } from '../types';
import { ITEMS, SHOP_BUYABLES } from '../constants';
import { ShoppingBag, ArrowRight, ArrowLeft, Package, Sparkles, Sword, Apple } from 'lucide-react';

interface ShopProps {
  gameState: GameState;
  onSell: (items: Record<string, number>) => void;
  onBuy: (itemId: string, count: number) => void;
}

export const Shop: React.FC<ShopProps> = ({ gameState, onSell, onBuy }) => {
  const [selectedPlayerItem, setSelectedPlayerItem] = useState<string | null>(null);
  const [selectedShopItem, setSelectedShopItem] = useState<string | null>(null);

  const inventoryEntries = (Object.entries(gameState.inventory) as [string, number][])
    .filter(([id, count]) => count > 0 && ITEMS[id]);

  const shopItems = SHOP_BUYABLES.map(id => ITEMS[id]);

  const handleDoSell = () => {
    if (selectedPlayerItem) {
        onSell({ [selectedPlayerItem]: 1 });
        // Deselect if it was the last one
        if (gameState.inventory[selectedPlayerItem] <= 1) setSelectedPlayerItem(null);
    }
  };

  const handleDoBuy = () => {
    if (selectedShopItem) {
        onBuy(selectedShopItem, 1);
    }
  };

  const getIcon = (cat: string) => {
      switch(cat) {
          case 'MEAT': return '🥩';
          case 'BYPRODUCT': return '🦴';
          case 'CORPSE': return '💀';
          case 'DISH': return '🍲';
          case 'GOODS': return '💎';
          case 'TOOL': return <Sword size={18} className="text-stone-400" />;
          case 'FOOD': return <Apple size={18} className="text-red-400" />;
          default: return '📦';
      }
  };

  return (
    <div className="flex flex-col h-full gap-8">
        <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg">
                    <ShoppingBag size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-emerald-900 leading-none">Commerce Center</h3>
                    <p className="text-emerald-600 font-bold text-sm mt-1 uppercase tracking-widest">Trade processed goods for park resources</p>
                </div>
            </div>
            <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-2xl border border-emerald-200 shadow-inner">
                <span className="text-[10px] font-black text-emerald-600 uppercase block leading-none mb-1">Available Capital</span>
                <span className="text-2xl font-black text-stone-800">${gameState.money.toLocaleString()}</span>
            </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-7 gap-6 min-h-0">
            {/* LEFT: Player Inventory */}
            <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden flex flex-col">
                <div className="p-6 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                    <h4 className="font-black text-stone-800 uppercase tracking-tighter">My Goods</h4>
                    <span className="bg-stone-200 text-stone-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Sell items</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="grid grid-cols-1 gap-2">
                        {inventoryEntries.map(([id, count]) => {
                            const item = ITEMS[id];
                            return (
                                <button
                                    key={id}
                                    onClick={() => setSelectedPlayerItem(id)}
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between
                                        ${selectedPlayerItem === id ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-stone-50 hover:border-stone-100 bg-white'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl w-10 h-10 flex items-center justify-center bg-stone-100 rounded-xl">
                                            {getIcon(item.category)}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-black text-stone-800 text-sm leading-none">{item.name}</div>
                                            <div className="text-[10px] text-stone-400 font-bold uppercase mt-1">{item.category} • {count} in stock</div>
                                        </div>
                                    </div>
                                    <div className="font-black text-emerald-600">${item.price}</div>
                                </button>
                            );
                        })}
                        {inventoryEntries.length === 0 && (
                             <div className="h-full flex flex-col items-center justify-center text-stone-300 py-12">
                                <Package size={48} className="mb-2 opacity-20" />
                                <p className="font-bold italic">Nothing to sell</p>
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CENTER: Controls */}
            <div className="lg:col-span-1 flex flex-col justify-center items-center gap-8 py-4">
                <div className="flex flex-col gap-4 w-full">
                    <button 
                        onClick={handleDoSell}
                        disabled={!selectedPlayerItem}
                        className={`group relative py-6 rounded-3xl font-black text-xs shadow-2xl transition-all active:scale-90 flex flex-col items-center gap-2
                            ${selectedPlayerItem ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-stone-100 text-stone-300'}`}
                    >
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        SELL
                    </button>
                    
                    <div className="flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-stone-300 rounded-full"></div>
                    </div>

                    <button 
                         onClick={handleDoBuy}
                         disabled={!selectedShopItem || gameState.money < (ITEMS[selectedShopItem!]?.buyPrice || 0)}
                         className={`group relative py-6 rounded-3xl font-black text-xs shadow-2xl transition-all active:scale-90 flex flex-col items-center gap-2
                            ${selectedShopItem && gameState.money >= (ITEMS[selectedShopItem!]?.buyPrice || 0) 
                                ? 'bg-stone-900 text-white hover:bg-black' 
                                : 'bg-stone-100 text-stone-300'}`}
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        BUY
                    </button>
                </div>
            </div>

            {/* RIGHT: Shop Inventory */}
            <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden flex flex-col">
                <div className="p-6 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                    <h4 className="font-black text-stone-800 uppercase tracking-tighter">Store Listings</h4>
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                        <Sparkles size={10} /> Exclusive Goods
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                     <div className="grid grid-cols-1 gap-2">
                        {shopItems.map((item) => {
                            if (!item) return null;
                            const canAfford = gameState.money >= (item.buyPrice || 0);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedShopItem(item.id)}
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between
                                        ${selectedShopItem === item.id ? 'border-stone-900 bg-stone-50 shadow-md' : 'border-stone-50 hover:border-stone-100 bg-white'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl w-10 h-10 flex items-center justify-center bg-stone-100 rounded-xl">
                                            {getIcon(item.category)}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-black text-stone-800 text-sm leading-none">{item.name}</div>
                                            <div className="text-[10px] text-stone-400 font-bold uppercase mt-1">{item.category}</div>
                                        </div>
                                    </div>
                                    <div className={`font-black ${canAfford ? 'text-stone-900' : 'text-red-400'}`}>
                                        ${item.buyPrice}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Selected Info Footer */}
        <div className="bg-stone-900 rounded-3xl p-6 text-white flex justify-between items-center shadow-2xl">
             <div className="flex gap-10">
                 <div>
                    <span className="text-[10px] font-black text-stone-500 uppercase block mb-1">Selling Selection</span>
                    <span className="font-black text-emerald-400">{selectedPlayerItem ? ITEMS[selectedPlayerItem].name : '---'}</span>
                 </div>
                 <div className="w-px h-8 bg-white/10 self-center"></div>
                 <div>
                    <span className="text-[10px] font-black text-stone-500 uppercase block mb-1">Buying Selection</span>
                    <span className="font-black text-blue-400">{selectedShopItem ? ITEMS[selectedShopItem].name : '---'}</span>
                 </div>
             </div>
             <div className="flex gap-3">
                 <div className="text-right">
                    <div className="text-[10px] font-black text-stone-500 uppercase">Estimated Impact</div>
                    <div className="font-black text-xl">
                        {selectedPlayerItem ? `+$${ITEMS[selectedPlayerItem].price}` : selectedShopItem ? `-$${ITEMS[selectedShopItem].buyPrice}` : '$0'}
                    </div>
                 </div>
             </div>
        </div>
    </div>
  );
};

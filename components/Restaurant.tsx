import React from 'react';
import { GameState, Recipe } from '../types';
import { COOKING_RECIPES, ITEMS } from '../constants';
import { ChefHat, Flame, DollarSign, Lock } from 'lucide-react';

interface RestaurantProps {
  gameState: GameState;
  onCook: (recipe: Recipe) => void;
  onSellDish: (itemId: string, count: number, price: number) => void;
  // Fix: Added missing onShowDetail prop to satisfy App.tsx requirements
  onShowDetail: (id: string) => void;
}

export const Restaurant: React.FC<RestaurantProps> = ({ gameState, onCook, onSellDish, onShowDetail }) => {
  
  const canCook = (recipe: Recipe) => {
    if (gameState.energy < recipe.energyCost) return false;
    for (const input of recipe.input) {
        if ((gameState.inventory[input.itemId] || 0) < input.count) return false;
    }
    return true;
  };

  // Filter dishes in inventory
  const dishes = (Object.entries(gameState.inventory) as [string, number][]).filter(([id, count]) => {
      const item = ITEMS[id];
      return item && item.category === 'DISH' && count > 0;
  });

  return (
    <div className="space-y-8">
        <div>
            <h3 className="text-2xl font-bold text-stone-800">The Steakhouse</h3>
            <p className="text-stone-500">Cook raw meat into delicious dishes and serve customers.</p>
        </div>

        {/* Kitchen Area */}
        <section>
            <h4 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
                <Flame className="text-orange-500" /> Kitchen Menu
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {COOKING_RECIPES.map(recipe => {
                    const affordable = canCook(recipe);
                    const outputItem = ITEMS[recipe.output.itemId];
                    
                    return (
                        <div key={recipe.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 flex flex-col justify-between h-full hover:border-orange-200 transition-colors">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-bold text-lg text-stone-800">{recipe.name}</h5>
                                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold">-${recipe.energyCost}⚡</span>
                                </div>
                                <div className="text-sm text-stone-500 mb-4 space-y-1">
                                    <p className="font-semibold text-stone-700">Requires:</p>
                                    {recipe.input.map((ing, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <span>{ITEMS[ing.itemId]?.name || ing.itemId}</span>
                                            <span className={gameState.inventory[ing.itemId] >= ing.count ? 'text-green-600' : 'text-red-500'}>
                                                {gameState.inventory[ing.itemId] || 0}/{ing.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => onCook(recipe)}
                                disabled={!affordable}
                                className={`
                                    w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 mt-2
                                    ${affordable 
                                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200 shadow-lg' 
                                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'}
                                `}
                            >
                                <ChefHat size={16} /> Cook
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>

        {/* Serving Area */}
        <section className="bg-stone-100 rounded-xl p-6 border border-stone-200">
             <h4 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
                <DollarSign className="text-green-600" /> Service Counter
            </h4>
            
            {dishes.length === 0 ? (
                <div className="text-center py-8 text-stone-400 border-2 border-dashed border-stone-300 rounded-lg">
                    No dishes ready to serve. Get cooking!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dishes.map(([id, count]) => {
                        const item = ITEMS[id];
                        if (!item) return null;
                        const sellAllValue = item.price * count;

                        return (
                            <div key={id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-stone-200">
                                <div>
                                    <div className="font-bold text-stone-800">{item.name}</div>
                                    <div className="text-sm text-stone-500">Stock: <span className="font-mono font-bold">{count}</span></div>
                                    <div className="text-xs text-green-600 font-bold mt-1">${item.price} / each</div>
                                </div>
                                <button
                                    onClick={() => onSellDish(id, count, sellAllValue)}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-md active:scale-95 transition-transform"
                                >
                                    Sell All (${sellAllValue})
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    </div>
  );
};
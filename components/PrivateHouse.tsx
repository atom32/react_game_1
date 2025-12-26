import React from 'react';
import { GameState } from '../types';
import { ITEMS } from '../constants';
import { Heart, Trophy, LogOut, Sparkles } from 'lucide-react';

interface PrivateHouseProps {
  gameState: GameState;
  onPetAnimal: (id: string) => void;
  onMoveBack: (id: string) => void;
  // Fix: Added missing onShowDetail prop to satisfy App.tsx requirements
  onShowDetail: (id: string) => void;
}

export const PrivateHouse: React.FC<PrivateHouseProps> = ({ gameState, onPetAnimal, onMoveBack, onShowDetail }) => {
  // Fix: Filter by location HOUSE, not just isPet
  const residents = gameState.animals.filter(a => a.location === 'HOUSE');
  
  const collection = (Object.entries(gameState.inventory) as [string, number][])
    .filter(([id, count]) => ITEMS[id]?.category === 'GOODS' && count > 0)
    .map(([id]) => ITEMS[id]);

  return (
    <div className="space-y-10">
        <div className="relative bg-gradient-to-br from-purple-800 to-indigo-900 rounded-[3rem] p-10 text-white overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-10 -translate-y-10">
                <Heart size={250} fill="currentColor" />
            </div>
            <div className="relative z-10">
                <h3 className="text-4xl font-black mb-3">The Sanctuary</h3>
                <p className="text-purple-200 text-lg font-medium max-w-lg">A private retreat where your livestock can become beloved pets and your achievements are on display.</p>
            </div>
        </div>

        {/* Residents Section */}
        <section>
            <div className="flex items-center justify-between mb-8 border-b border-stone-200 pb-4">
                <h4 className="text-2xl font-black text-stone-800 flex items-center gap-3">
                    <Heart className="text-pink-500" fill="currentColor" /> Resident Animals ({residents.length})
                </h4>
                <p className="text-stone-400 text-sm font-bold uppercase tracking-widest">Sent from the pens</p>
            </div>
            
            {residents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-4 border-dashed border-stone-100 text-stone-300 font-black text-xl italic">
                    The house is quiet...<br/>
                    <span className="text-sm not-italic font-normal text-stone-400 mt-2 block">Transport livestock here from the Animal Pens to pet them.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {residents.map(animal => (
                        <div key={animal.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 flex flex-col items-center text-center relative group transition-all hover:scale-105 hover:shadow-2xl">
                            {animal.isPet && (
                                <div className="absolute top-6 left-6 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles size={10} /> Official Pet
                                </div>
                            )}
                            
                            {/* Fix: Added onShowDetail trigger on animal icon to allow viewing details from the house */}
                            <button 
                                onClick={() => onShowDetail(animal.id)}
                                className="text-6xl mb-4 animate-bounce-slow filter drop-shadow-lg hover:scale-110 transition-transform"
                                title="View Detail"
                            >
                                {animal.type === 'CHICKEN' && '🐔'}
                                {animal.type === 'PIG' && '🐷'}
                                {animal.type === 'SHEEP' && '🐑'}
                                {animal.type === 'COW' && '🐮'}
                            </button>
                            
                            <div className="font-black text-2xl text-stone-800 mb-1">{animal.name}</div>
                            <div className="flex gap-3 text-xs font-bold text-stone-400 uppercase tracking-tighter mb-6">
                                <span>Age: {animal.age}d</span>
                                <span>Quality: {animal.quality}</span>
                            </div>

                            <div className="flex w-full gap-3 mt-auto">
                                <button 
                                    onClick={() => onPetAnimal(animal.id)}
                                    className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-pink-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Heart size={16} fill="currentColor" /> PET
                                </button>
                                <button 
                                    onClick={() => onMoveBack(animal.id)}
                                    className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                                    title="Send back to Pen"
                                >
                                    <LogOut size={16} /> RETURN
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* Collection Section */}
        <section>
             <h4 className="text-2xl font-black text-stone-800 mb-8 flex items-center gap-3 border-b border-stone-200 pb-4">
                <Trophy className="text-yellow-500" fill="currentColor" /> Hall of Achievements
            </h4>
             {collection.length === 0 ? (
                <div className="text-center py-16 bg-stone-50 rounded-[2.5rem] border border-stone-100 text-stone-400 font-bold">
                    Collect luxury goods from the Workshop to fill this hall.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {collection.map(item => (
                        <div key={item.id} className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl border border-stone-700 hover:-translate-y-2 transition-transform">
                             <div className="bg-yellow-400/20 p-4 rounded-full mb-4 text-yellow-400 border border-yellow-400/20 shadow-inner">
                                <Trophy size={32} />
                             </div>
                             <div className="text-white font-black text-sm tracking-tight">{item.name}</div>
                             <div className="text-[10px] text-stone-500 mt-2 font-black uppercase tracking-[0.2em]">Certified Luxury</div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
`;
document.head.appendChild(style);
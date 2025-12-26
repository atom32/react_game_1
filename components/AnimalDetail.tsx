
import React from 'react';
import { Animal } from '../types';
import { ANIMAL_CONFIG } from '../livestockConfig';
import { X, Ruler, Scale, BadgeCheck, Zap, Calendar, Heart, Dna, Info } from 'lucide-react';

interface AnimalDetailProps {
  animal: Animal;
  onClose: () => void;
}

export const AnimalDetail: React.FC<AnimalDetailProps> = ({ animal, onClose }) => {
  const config = ANIMAL_CONFIG[animal.type];

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,1)] border border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Header / Hero */}
            <div className="relative h-64 bg-stone-900 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="text-[120px] filter drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)] animate-bounce-slow">
                    {animal.type === 'CHICKEN' && '🐔'}
                    {animal.type === 'PIG' && '🐷'}
                    {animal.type === 'SHEEP' && '🐑'}
                    {animal.type === 'COW' && '🐮'}
                </div>
                <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-red-500 text-white rounded-2xl transition-all">
                    <X size={24} />
                </button>
                <div className="absolute bottom-8 left-10">
                    <h2 className="text-4xl font-black text-white tracking-tighter">{animal.name}</h2>
                    <p className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px] mt-1">Species ID: {animal.id}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="p-10 grid grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                            <Scale size={24} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Current Weight</span>
                            <span className="text-xl font-black text-stone-800">{animal.weight.toFixed(2)} <span className="text-stone-300 text-sm">/ {config.maxWeight}kg</span></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Growth Stage</span>
                            <span className="text-xl font-black text-stone-800">{animal.age} Days Old</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-pink-50 p-3 rounded-2xl text-pink-600">
                            <Dna size={24} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Biological Gender</span>
                            <span className="text-xl font-black text-stone-800">{animal.gender}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="bg-yellow-50 p-3 rounded-2xl text-yellow-600">
                            <BadgeCheck size={24} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Specimen Quality</span>
                            <span className="text-xl font-black text-stone-800">{animal.quality}<span className="text-stone-300 text-sm">/100</span></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-red-50 p-3 rounded-2xl text-red-600">
                            <Heart size={24} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Relationship</span>
                            <span className="text-xl font-black text-stone-800">{animal.isPet ? 'Official Pet' : 'Livestock Asset'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                            <Info size={24} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Status</span>
                            <span className="text-xl font-black text-stone-800">{animal.isPregnant ? 'Gestation Cycle' : 'Healthy'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-stone-50 border-t border-stone-100 flex justify-between items-center">
                 <div className="flex gap-2">
                    {animal.isPregnant && <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Expectant</span>}
                    {animal.quality > 80 && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Elite Grade</span>}
                 </div>
                 <button onClick={onClose} className="px-8 py-3 bg-stone-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Close Profile</button>
            </div>
        </div>
    </div>
  );
};

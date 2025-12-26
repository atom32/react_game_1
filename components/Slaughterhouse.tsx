
import React, { useState } from 'react';
import { GameState } from '../types';
import { PROCESSING_METHODS } from '../constants';
import { Skull, MoveLeft, Info } from 'lucide-react';

interface SlaughterhouseProps {
  gameState: GameState;
  onSlaughter: (id: string, method: string) => void;
  onMoveBack: (id: string) => void;
  onShowDetail: (id: string) => void;
}

export const Slaughterhouse: React.FC<SlaughterhouseProps> = ({ gameState, onSlaughter, onMoveBack, onShowDetail }) => {
  const inSLA = gameState.animals.filter(a => a.location === 'SLAUGHTER');
  const [selectedMethod, setSelectedMethod] = useState('STANDARD');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
            <h3 className="text-2xl font-black text-red-900">Processing Queue</h3>
            <p className="text-red-600">Click animal icons to verify quality specs before processing.</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
            {PROCESSING_METHODS.map(m => (
                <button 
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id)}
                    className={`shrink-0 p-5 rounded-3xl border-2 transition-all ${selectedMethod === m.id ? 'bg-red-600 text-white border-red-700' : 'bg-white border-stone-100'}`}
                >
                    <div className="font-black text-sm">{m.name}</div>
                    <div className="text-[10px] opacity-70">-{m.cost}⚡</div>
                </button>
            ))}
        </div>

        <div className="space-y-4">
            {inSLA.map(animal => (
                <div key={animal.id} className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => onShowDetail(animal.id)} className="text-4xl hover:scale-110 transition-transform">
                          {animal.type === 'CHICKEN' ? '🐔' : animal.type === 'PIG' ? '🐷' : animal.type === 'SHEEP' ? '🐑' : '🐮'}
                        </button>
                        <div>
                            <div className="font-black text-lg">{animal.name}</div>
                            <div className="text-xs font-bold text-stone-400 uppercase">{animal.weight.toFixed(1)}kg • Q:{animal.quality}</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => onMoveBack(animal.id)} className="px-4 py-3 bg-stone-100 text-stone-600 rounded-2xl font-black text-xs">RETURN</button>
                        <button onClick={() => onSlaughter(animal.id, selectedMethod)} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-xs shadow-lg">PROCESS</button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

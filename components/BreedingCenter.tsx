
import React, { useState } from 'react';
import { GameState } from '../types';
import { Heart, Baby, MoveLeft, Sparkles, Info } from 'lucide-react';

interface BreedingCenterProps {
  gameState: GameState;
  onMating: (maleId: string | null, femaleId: string, mode: 'NATURAL' | 'ARTIFICIAL') => void;
  onMoveBack: (id: string) => void;
  onShowDetail: (id: string) => void;
}

export const BreedingCenter: React.FC<BreedingCenterProps> = ({ gameState, onMating, onMoveBack, onShowDetail }) => {
  const inBC = gameState.animals.filter(a => a.location === 'BREEDING');
  const [selectedMale, setSelectedMale] = useState<string | null>(null);
  const [selectedFemale, setSelectedFemale] = useState<string | null>(null);

  const startMating = (mode: 'NATURAL' | 'ARTIFICIAL') => {
      if (selectedFemale) {
          if (mode === 'NATURAL' && !selectedMale) return;
          if (mode === 'ARTIFICIAL' && selectedMale) return;
          onMating(selectedMale, selectedFemale, mode);
          setSelectedMale(null);
          setSelectedFemale(null);
      }
  };

  const isArtificialAvailable = selectedFemale && !selectedMale;
  const isNaturalAvailable = selectedFemale && selectedMale;

  return (
    <div className="space-y-8">
      <div className="bg-pink-50 p-8 rounded-[3rem] border border-pink-100 text-center">
          <Heart className="mx-auto text-pink-500 mb-4" size={48} fill="currentColor" />
          <h2 className="text-3xl font-black text-pink-900">Life Sciences Center</h2>
          <p className="text-pink-600 font-bold">Natural: Pair Male & Female. Artificial: Female Only.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-xl">
              <h3 className="font-black text-blue-600 mb-4 uppercase flex justify-between">Males Available</h3>
              <div className="space-y-3">
                  {inBC.filter(a => a.gender === 'MALE').map(m => (
                      <div key={m.id} className="flex gap-2">
                        <button onClick={() => setSelectedMale(selectedMale === m.id ? null : m.id)} 
                            className={`flex-1 p-4 rounded-2xl flex items-center justify-between border-2 transition-all 
                                ${selectedMale === m.id ? 'border-blue-500 bg-blue-50' : 'border-stone-50'}`}>
                            <span className="font-bold">{m.name}</span>
                        </button>
                        <button onClick={() => onShowDetail(m.id)} className="p-4 bg-stone-50 text-stone-400 rounded-2xl"><Info size={18}/></button>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-xl">
              <h3 className="font-black text-pink-600 mb-4 uppercase flex justify-between">Females Available</h3>
              <div className="space-y-3">
                  {inBC.filter(a => a.gender === 'FEMALE').map(f => (
                      <div key={f.id} className="flex gap-2">
                        <button onClick={() => setSelectedFemale(selectedFemale === f.id ? null : f.id)} 
                            className={`flex-1 p-4 rounded-2xl flex items-center justify-between border-2 transition-all 
                                ${selectedFemale === f.id ? 'border-pink-500 bg-pink-50' : 'border-stone-50'}`}>
                            <span className="font-bold">{f.name} {f.isPregnant && '🤰'}</span>
                        </button>
                        <button onClick={() => onShowDetail(f.id)} className="p-4 bg-stone-50 text-stone-400 rounded-2xl"><Info size={18}/></button>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="flex justify-center gap-6">
          <button 
            disabled={!isNaturalAvailable}
            onClick={() => startMating('NATURAL')}
            className={`px-10 py-5 rounded-3xl font-black shadow-2xl transition-all ${isNaturalAvailable ? 'bg-pink-400 text-white' : 'bg-stone-100 text-stone-300'}`}
          >
              <Heart size={20} className="inline mr-2" /> Natural Pair
          </button>
          <button 
            disabled={!isArtificialAvailable}
            onClick={() => startMating('ARTIFICIAL')}
            className={`px-10 py-5 rounded-3xl font-black shadow-2xl transition-all ${isArtificialAvailable ? 'bg-indigo-600 text-white' : 'bg-stone-100 text-stone-300'}`}
          >
              <Sparkles size={20} className="inline mr-2" /> Artificial ($500)
          </button>
      </div>
      {selectedMale && isArtificialAvailable === false && (
          <p className="text-center text-red-500 font-bold text-xs">Deselct Male to enable Artificial Insemination.</p>
      )}
    </div>
  );
};

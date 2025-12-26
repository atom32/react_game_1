
import React from 'react';
import { AnatomySession, AnatomyPart } from '../types';
import { ANIMAL_ANATOMY_MAP } from '../anatomyConfig';
import { ITEMS } from '../constants';
import { Scissors, ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';

interface AnatomyTableProps {
  session: AnatomySession;
  onExtract: (partId: string) => void;
  onComplete: () => void;
}

export const AnatomyTable: React.FC<AnatomyTableProps> = ({ session, onExtract, onComplete }) => {
  const parts = ANIMAL_ANATOMY_MAP[session.animalType];
  const finished = session.extractedParts.length === parts.length;

  const canExtract = (part: AnatomyPart) => {
    if (session.extractedParts.includes(part.id)) return false;
    if (part.requiresSequence) {
        return part.requiresSequence.every(reqId => session.extractedParts.includes(reqId));
    }
    return true;
  };

  return (
    <div className="h-full flex flex-col gap-6">
        {/* Header Overlay */}
        <div className="bg-stone-900 p-6 rounded-[2.5rem] border border-white/10 flex justify-between items-center shadow-2xl relative z-10">
            <div className="flex items-center gap-6">
                <button 
                    onClick={onComplete}
                    className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h3 className="text-3xl font-black text-white leading-none">Anatomy Table</h3>
                    <p className="text-red-500 font-bold text-xs mt-1 uppercase tracking-[0.3em]">Specimen: {session.animalType} Corpse</p>
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex flex-col items-center">
                    <span className="text-[10px] text-stone-500 font-black uppercase">Progress</span>
                    <span className="text-xl font-black text-white">{session.extractedParts.length}/{parts.length}</span>
                </div>
                <div className="bg-red-900/20 px-6 py-3 rounded-2xl border border-red-500/20 flex flex-col items-center">
                    <span className="text-[10px] text-red-500 font-black uppercase">Extraction Cost</span>
                    <span className="text-xl font-black text-white flex items-center gap-1">10<Zap size={14} className="text-blue-400" /></span>
                </div>
            </div>
        </div>

        {/* Dissection Arena */}
        <div className="flex-1 relative bg-stone-200 rounded-[4rem] border-[12px] border-stone-800 shadow-inner overflow-hidden flex items-center justify-center">
            {/* Visual Background - Metal Table */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
            
            <div className="relative w-[800px] h-[500px] bg-stone-300 rounded-[6rem] shadow-2xl border-4 border-stone-400 flex items-center justify-center overflow-hidden">
                {/* The Corpse Image/Placeholder */}
                <div className="text-[200px] grayscale filter blur-[2px] opacity-40 select-none">
                    {session.animalType === 'CHICKEN' && '🐔'}
                    {session.animalType === 'PIG' && '🐷'}
                    {session.animalType === 'SHEEP' && '🐑'}
                    {session.animalType === 'COW' && '🐮'}
                </div>

                {/* Anatomy Parts - Interactive Hotspots */}
                {parts.map(part => {
                    const isExtracted = session.extractedParts.includes(part.id);
                    const available = canExtract(part);
                    
                    return (
                        <div 
                            key={part.id}
                            className={`absolute flex flex-col items-center justify-center transition-all group z-20`}
                            style={{ 
                                left: `${part.x}%`, 
                                top: `${part.y}%`, 
                                width: part.width, 
                                height: part.height,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <button
                                onClick={() => available && onExtract(part.id)}
                                disabled={!available || isExtracted}
                                className={`
                                    relative w-full h-full rounded-full border-2 border-dashed flex items-center justify-center transition-all
                                    ${isExtracted ? 'bg-green-500/20 border-green-500/50 scale-90' : available ? 'bg-red-500/10 border-red-500/50 hover:bg-red-500/30 hover:scale-110 cursor-crosshair' : 'bg-stone-500/10 border-stone-500/20 cursor-not-allowed'}
                                `}
                            >
                                {isExtracted ? (
                                    <CheckCircle2 className="text-green-500" size={32} />
                                ) : (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1 rounded text-[10px] text-white font-black uppercase whitespace-nowrap">
                                        {part.label}
                                    </div>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Completion Modal */}
            {finished && (
                <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md flex flex-col items-center justify-center z-[100] animate-in fade-in duration-500">
                    <div className="bg-white p-12 rounded-[4rem] text-center shadow-2xl border-t-8 border-green-500 animate-in zoom-in-90 duration-500">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={48} />
                        </div>
                        <h4 className="text-4xl font-black text-stone-900 mb-2">Extraction Complete</h4>
                        <p className="text-stone-500 font-bold mb-10 max-w-xs mx-auto">All valuable components have been harvested and added to the global inventory.</p>
                        <button 
                            onClick={onComplete}
                            className="px-12 py-5 bg-stone-900 text-white rounded-3xl font-black text-xs tracking-widest uppercase hover:bg-black transition-all"
                        >
                            Return to Workshop
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Sidebar Log */}
        <div className="h-32 bg-stone-100 rounded-[2.5rem] border border-stone-200 p-6 overflow-hidden flex items-center gap-6">
            <div className="shrink-0 font-black text-[10px] text-stone-400 uppercase tracking-widest vertical-text border-r border-stone-200 pr-4 mr-2">Extraction Log</div>
            <div className="flex gap-4 overflow-x-auto pb-2 flex-1 scrollbar-hide">
                {session.extractedParts.length === 0 ? (
                    <div className="text-stone-300 italic font-bold">Awaiting first incision...</div>
                ) : (
                    session.extractedParts.map(pid => {
                        const p = parts.find(pp => pp.id === pid);
                        return (
                            <div key={pid} className="bg-white px-5 py-3 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3 shrink-0">
                                <span className="text-lg">🥩</span>
                                <div>
                                    <div className="text-[10px] font-black text-stone-800 leading-none">{p?.label}</div>
                                    <div className="text-[8px] text-green-600 font-bold mt-1">+{p?.outputCount} {ITEMS[p?.outputItemId || '']?.name}</div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>

        <style>{`
            .vertical-text {
                writing-mode: vertical-rl;
                text-orientation: mixed;
                transform: rotate(180deg);
            }
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
        `}</style>
    </div>
  );
};

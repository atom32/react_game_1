
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GameState, Tab, Animal, Recipe, AnimalLocation, AnatomySession, AnimalType } from './types';
import { MAX_ENERGY_DEFAULT, DAILY_EXPENSES, BUILDINGS_CONFIG, ITEMS, MARKET_REFRESH_COST, GAME_WIDTH, GAME_HEIGHT } from './constants';
import { ANIMAL_CONFIG } from './livestockConfig';
import { ANIMAL_ANATOMY_MAP } from './anatomyConfig';
import { GENERATE_MAP_PROMPT } from './prompts';
import { generateId, generateRandomAnimal, growAnimal } from './gameLogic';
import { Layout } from './components/Layout';
import { Market } from './components/Market';
import { Pen } from './components/Pen';
import { Slaughterhouse } from './components/Slaughterhouse';
import { Restaurant } from './components/Restaurant';
import { Workshop } from './components/Workshop';
import { PrivateHouse } from './components/PrivateHouse';
import { BreedingCenter } from './components/BreedingCenter';
import { Shop } from './components/Shop';
import { InventoryOverlay } from './components/InventoryOverlay';
import { AnimalDetail } from './components/AnimalDetail';
import { AnatomyTable } from './components/AnatomyTable';
import { GameMap } from './components/GameMap';

const INITIAL_STATE: GameState = {
  day: 1, 
  money: 999999, // DEBUG MODE
  energy: MAX_ENERGY_DEFAULT, 
  maxEnergy: MAX_ENERGY_DEFAULT,
  animals: [], 
  inventory: {}, 
  marketAnimals: [],
  buildingLevels: { MARKET: 1, PEN: 1, SLAUGHTER: 1, RESTAURANT: 1, WORKSHOP: 1, HOUSE: 1, BREEDING: 1, SHOP: 1 },
  buildingIcons: {},
  anatomySession: null
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<Tab>('MAP');
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [isGeneratingIcons, setIsGeneratingIcons] = useState(false);

  useEffect(() => {
    setGameState(prev => ({ ...prev, marketAnimals: Array.from({ length: 4 }, () => generateRandomAnimal(prev.day)) }));
    const handleKey = (e: KeyboardEvent) => { if (e.code === 'KeyB') setIsInventoryOpen(prev => !prev); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const notify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateAIVisuals = async () => {
    setIsGeneratingIcons(true);
    notify("Stage 1: Architecting Staggered Assets (45° Isometric)...", "info");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const newIcons: Record<string, string> = {};
      const buildingPromises = BUILDINGS_CONFIG.map(async (b) => {
        // Use gemini-2.5-flash-image for image generation tasks as per guidelines
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: b.prompt }] },
        });
        const part = response.candidates[0].content.parts.find(p => p.inlineData);
        if (part?.inlineData) return { id: b.id, data: `data:image/png;base64,${part.inlineData.data}` };
        return null;
      });

      const iconResults = await Promise.all(buildingPromises);
      iconResults.forEach(res => { if (res) newIcons[res.id] = res.data; });

      const layoutDescriptions = BUILDINGS_CONFIG.map(b => {
          const horiz = b.x < GAME_WIDTH / 3 ? 'west' : b.x > (GAME_WIDTH * 2) / 3 ? 'east' : 'center';
          const vert = b.y < GAME_HEIGHT / 3 ? 'north' : b.y > (GAME_HEIGHT * 2) / 3 ? 'south' : 'middle';
          return `a ${b.label} stone foundation at coordinates (${b.x}, ${b.y}) in the ${vert}-${horiz} sector`;
      }).join(', ');

      const mapPrompt = GENERATE_MAP_PROMPT(layoutDescriptions);

      notify("Stage 2: Fusing Terrain with Foundational Grid...", "info");

      // Use gemini-2.5-flash-image for image generation tasks
      const mapResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: mapPrompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      
      const mapPart = mapResponse.candidates[0].content.parts.find(p => p.inlineData);
      let mapBg = '';
      if (mapPart?.inlineData) mapBg = `data:image/png;base64,${mapPart.inlineData.data}`;

      setGameState(prev => ({ 
        ...prev, 
        buildingIcons: { ...prev.buildingIcons, ...newIcons },
        mapBackground: mapBg || prev.mapBackground 
      }));
      notify("Estate Infrastructure Fully Integrated.", "success");
    } catch (e) {
      console.error(e);
      notify("Construction Error: Visuals could not be rendered.", "error");
    } finally { setIsGeneratingIcons(false); }
  };

  const handleBuyAnimal = (animal: Animal) => {
    const config = ANIMAL_CONFIG[animal.type];
    const price = Math.floor(config.basePrice * (animal.weight / (config.maxWeight * 0.1)) * (animal.quality / 50));
    if (gameState.money < price) return notify("Insufficient Capital.", "error");
    setGameState(prev => ({ ...prev, money: prev.money - price, animals: [...prev.animals, animal], marketAnimals: prev.marketAnimals.filter(a => a.id !== animal.id) }));
    notify(`Asset acquired: ${animal.name}.`, "success");
  };

  const handleResupplyMarket = () => {
    const MARKET_CAPACITY = 4;
    const currentCount = gameState.marketAnimals.length;

    if (currentCount >= MARKET_CAPACITY) {
      return notify("Market is already fully stocked.", "info");
    }

    if (gameState.money < MARKET_REFRESH_COST) {
      return notify("Insufficient Capital for supply convoy.", "error");
    }

    const countNeeded = MARKET_CAPACITY - currentCount;
    const newAnimals = Array.from({ length: countNeeded }, () => generateRandomAnimal(gameState.day));

    setGameState(prev => ({
      ...prev,
      money: prev.money - MARKET_REFRESH_COST,
      marketAnimals: [...prev.marketAnimals, ...newAnimals]
    }));

    notify(`Supply convoy arrived with ${countNeeded} new livestock.`, "success");
  };

  const handleEnhance = (id: string, type: 'WEIGHT' | 'QUALITY') => {
    const cost = 100;
    if (gameState.money < cost) return notify("Low Funds.", "error");
    setGameState(prev => ({
      ...prev, money: prev.money - cost,
      animals: prev.animals.map(a => {
        if (a.id !== id) return a;
        return type === 'WEIGHT' 
          ? { ...a, weight: Math.min(ANIMAL_CONFIG[a.type].maxWeight * 1.1, a.weight + 2) }
          : { ...a, quality: Math.min(100, a.quality + 5) };
      })
    }));
    notify(`Specimen properties optimized.`, "success");
  };

  const handleSlaughter = (id: string, methodId: string) => {
    const animal = gameState.animals.find(a => a.id === id);
    if (!animal) return;
    const method = { STANDARD: 20, INDUSTRIAL: 50, ARTISAN: 40 }[methodId] || 20;
    if (gameState.energy < method) return notify("Energy Depleted.", "error");

    const config = ANIMAL_CONFIG[animal.type];
    const meatCount = Math.floor((animal.weight * config.outputs.meatRatio) / 2);
    const byproductCount = Math.floor(config.outputs.byproductRatio * (animal.quality / 50));

    setGameState(prev => {
      const newInv = { ...prev.inventory };
      newInv[config.outputs.meat] = (newInv[config.outputs.meat] || 0) + meatCount;
      newInv[config.outputs.byproduct] = (newInv[config.outputs.byproduct] || 0) + byproductCount;
      newInv[config.outputs.corpse] = (newInv[config.outputs.corpse] || 0) + 1;

      return {
        ...prev, energy: prev.energy - method,
        animals: prev.animals.filter(a => a.id !== id),
        inventory: newInv
      };
    });
    notify(`Material extraction complete.`, "success");
  };

  const handleAnatomyStart = (corpseId: string) => {
    const type = corpseId.split('_')[0] as AnimalType; // e.g. CHICKEN_CORPSE -> CHICKEN
    setGameState(prev => ({
        ...prev,
        anatomySession: { corpseId, animalType: type, extractedParts: [] }
    }));
    setActiveTab('ANATOMY');
  };

  const handleAnatomyExtract = (partId: string) => {
    const session = gameState.anatomySession;
    if (!session) return;
    const anatomyConfig = ANIMAL_ANATOMY_MAP[session.animalType].find(p => p.id === partId);
    if (!anatomyConfig) return;

    if (gameState.energy < 10) return notify("Energy too low for surgery.", "error");

    setGameState(prev => {
        const newInv = { ...prev.inventory };
        newInv[anatomyConfig.outputItemId] = (newInv[anatomyConfig.outputItemId] || 0) + anatomyConfig.outputCount;
        
        const newExtracted = [...session.extractedParts, partId];
        const allExtracted = newExtracted.length === ANIMAL_ANATOMY_MAP[session.animalType].length;

        // If finished, consume corpse
        if (allExtracted) {
            newInv[session.corpseId] = Math.max(0, (newInv[session.corpseId] || 0) - 1);
        }

        return {
            ...prev,
            energy: prev.energy - 10,
            inventory: newInv,
            anatomySession: { ...session, extractedParts: newExtracted }
        };
    });
    notify(`Extracted ${anatomyConfig.label}.`, "success");
  };

  const handleAnatomyComplete = () => {
    setGameState(prev => ({ ...prev, anatomySession: null }));
    setActiveTab('WORKSHOP');
  };

  const handleCook = (recipe: Recipe) => {
    if (gameState.energy < recipe.energyCost) return notify("Low Energy.", "error");
    setGameState(prev => {
      const newInv = { ...prev.inventory };
      recipe.input.forEach(i => {
          if (newInv[i.itemId]) newInv[i.itemId] -= i.count;
      });
      newInv[recipe.output.itemId] = (newInv[recipe.output.itemId] || 0) + recipe.output.count;
      return { ...prev, energy: prev.energy - recipe.energyCost, inventory: newInv };
    });
    notify(`Banquet prepared: ${recipe.name}.`, "success");
  };

  const handleCraft = (recipe: Recipe) => {
    if (gameState.energy < recipe.energyCost) return notify("Low Energy.", "error");
    setGameState(prev => {
      const newInv = { ...prev.inventory };
      recipe.input.forEach(i => {
          if (newInv[i.itemId]) newInv[i.itemId] -= i.count;
      });
      newInv[recipe.output.itemId] = (newInv[recipe.output.itemId] || 0) + recipe.output.count;
      return { ...prev, energy: prev.energy - recipe.energyCost, inventory: newInv };
    });
    notify(`Guild crafting successful: ${recipe.name}.`, "success");
  };

  const handleSellItems = (items: Record<string, number>) => {
    let profit = 0;
    setGameState(prev => {
      const newInv = { ...prev.inventory };
      Object.entries(items).forEach(([id, count]) => {
        profit += (ITEMS[id]?.price || 0) * count;
        newInv[id] -= count;
      });
      return { ...prev, money: prev.money + profit, inventory: newInv };
    });
    notify(`Merchant trade concluded. Profit: $${profit}.`, "success");
  };

  const handleBuyShopItem = (itemId: string, count: number) => {
    const item = ITEMS[itemId];
    const total = (item.buyPrice || 0) * count;
    if (gameState.money < total) return notify("Insufficient Capital.", "error");
    setGameState(prev => {
        const newInv = { ...prev.inventory };
        newInv[itemId] = (newInv[itemId] || 0) + count;
        return { ...prev, money: prev.money - total, inventory: newInv };
    });
    notify(`Supplies procured: ${item.name}.`, "success");
  };

  const handleMating = (maleId: string | null, femaleId: string, mode: 'NATURAL' | 'ARTIFICIAL') => {
    const energyCost = mode === 'NATURAL' ? 10 : 60;
    const moneyCost = mode === 'ARTIFICIAL' ? 500 : 0;
    if (gameState.energy < energyCost) return notify("Energy Depleted.", "error");
    if (gameState.money < moneyCost) return notify("Insufficient Capital.", "error");

    setGameState(prev => ({
      ...prev, energy: prev.energy - energyCost, money: prev.money - moneyCost,
      animals: prev.animals.map(a => a.id === femaleId ? { ...a, isPregnant: true, pregnancyDays: 0 } : a)
    }));
    notify(`Propagating new bloodline...`, "success");
  };

  const handleEndDay = () => {
    setGameState(prev => {
        const births: Animal[] = [];
        const nextDayAnimals = prev.animals.map(a => {
            const grown = growAnimal(a);
            const config = ANIMAL_CONFIG[a.type];
            if (grown.isPregnant && grown.pregnancyDays! >= config.pregnancyDays) {
                births.push(generateRandomAnimal(prev.day + 1, a.type));
                return { ...grown, isPregnant: false, pregnancyDays: 0 };
            }
            return grown;
        });
        return {
            ...prev, day: prev.day + 1, energy: prev.maxEnergy,
            animals: [...nextDayAnimals, ...births],
            marketAnimals: Array.from({ length: 4 }, () => generateRandomAnimal(prev.day + 1)),
            money: prev.money - DAILY_EXPENSES
        };
    });
    notify(`Cycle concluded. Kingdom resources replenished.`, "info");
  };

  const handleMoveAnimal = (id: string, location: AnimalLocation) => {
    setGameState(prev => ({ ...prev, animals: prev.animals.map(a => a.id === id ? { ...a, location } : a) }));
    notify(`Asset redeployed to ${location}.`, "info");
  };

  const selectedAnimal = gameState.animals.find(a => a.id === selectedAnimalId) || gameState.marketAnimals.find(a => a.id === selectedAnimalId);

  return (
    <>
      <Layout 
        gameState={gameState} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onEndDay={handleEndDay} 
        onUpgradeBuilding={() => {}}
        onGenerateIcons={generateAIVisuals}
        isGenerating={isGeneratingIcons}
        GameSceneComponent={
          <GameMap 
             onInteract={(tab) => setActiveTab(tab)}
             isActive={activeTab === 'MAP'}
             buildingIcons={gameState.buildingIcons}
             mapBackground={gameState.mapBackground}
          />
        }
      >
        {activeTab === 'MARKET' && <Market gameState={gameState} onBuy={handleBuyAnimal} onResupply={handleResupplyMarket} onShowDetail={setSelectedAnimalId} />}
        {activeTab === 'PEN' && <Pen gameState={gameState} onMove={handleMoveAnimal} onEnhance={handleEnhance} onShowDetail={setSelectedAnimalId} />}
        {activeTab === 'SLAUGHTER' && <Slaughterhouse gameState={gameState} onSlaughter={handleSlaughter} onMoveBack={(id) => handleMoveAnimal(id, 'PEN')} onShowDetail={setSelectedAnimalId} />}
        {activeTab === 'RESTAURANT' && <Restaurant gameState={gameState} onCook={handleCook} onSellDish={(id, count) => handleSellItems({[id]: count})} onShowDetail={setSelectedAnimalId} />}
        {activeTab === 'WORKSHOP' && <Workshop gameState={gameState} onCraft={handleCraft} onSellGood={(id, count) => handleSellItems({[id]: count})} onLiveProcess={(id) => handleSlaughter(id, 'ARTISAN')} onShowDetail={setSelectedAnimalId} onAnatomyStart={handleAnatomyStart} />}
        {activeTab === 'BREEDING' && <BreedingCenter gameState={gameState} onMating={handleMating} onMoveBack={(id) => handleMoveAnimal(id, 'PEN')} onShowDetail={setSelectedAnimalId} />}
        {activeTab === 'HOUSE' && <PrivateHouse gameState={gameState} onPetAnimal={(id) => setGameState(prev => ({ ...prev, animals: prev.animals.map(a => a.id === id ? { ...a, isPet: true } : a) }))} onMoveBack={(id) => handleMoveAnimal(id, 'PEN')} onShowDetail={setSelectedAnimalId} />}
        {activeTab === 'SHOP' && <Shop gameState={gameState} onSell={handleSellItems} onBuy={handleBuyShopItem} />}
        {activeTab === 'ANATOMY' && gameState.anatomySession && <AnatomyTable session={gameState.anatomySession} onExtract={handleAnatomyExtract} onComplete={handleAnatomyComplete} />}
      </Layout>

      {isInventoryOpen && <InventoryOverlay gameState={gameState} onClose={() => setIsInventoryOpen(false)} />}
      {selectedAnimal && <AnimalDetail animal={selectedAnimal} onClose={() => setSelectedAnimalId(null)} />}
      {notification && (
        <div className={`fixed bottom-10 right-10 px-8 py-5 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-white font-black z-[9000] border-4 border-black/20 animate-in slide-in-from-right duration-300
            ${notification.type === 'success' ? 'bg-green-700' : notification.type === 'error' ? 'bg-red-700' : 'bg-blue-700'}`}>
            {notification.msg}
        </div>
      )}
    </>
  );
}

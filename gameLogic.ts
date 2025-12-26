
import { Animal, AnimalType, AnimalLocation } from './types';
import { ANIMAL_CONFIG } from './livestockConfig';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateRandomAnimal = (day: number, forceType?: AnimalType): Animal => {
  const types: AnimalType[] = ['CHICKEN', 'PIG', 'SHEEP', 'COW'];
  const type = forceType || types[Math.floor(Math.random() * types.length)];
  const config = ANIMAL_CONFIG[type];
  
  const weightVariance = (Math.random() * 0.4) + 0.8; 
  const qualityVariance = Math.floor(Math.random() * 20) - 10;

  return {
    id: generateId(),
    type,
    name: `${config.name} #${Math.floor(Math.random() * 1000)}`,
    age: 1,
    weight: Math.floor((config.maxWeight * 0.1) * weightVariance), 
    quality: Math.min(100, Math.max(1, config.baseQuality + qualityVariance)),
    isPet: false,
    acquiredAt: day,
    gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
    location: 'PEN'
  };
};

export const growAnimal = (animal: Animal): Animal => {
  const config = ANIMAL_CONFIG[animal.type];
  
  // Pregnancy logic
  let isPregnant = animal.isPregnant;
  let pregnancyDays = animal.pregnancyDays || 0;
  
  if (isPregnant) {
    pregnancyDays++;
  }

  const growthFactor = 1 - (animal.weight / (config.maxWeight * 1.2));
  const actualGrowth = Math.max(0, config.growthRate * growthFactor * (1 + Math.random() * 0.5));
  
  return {
    ...animal,
    age: animal.age + 1,
    weight: Math.min(config.maxWeight * 1.1, animal.weight + actualGrowth),
    quality: Math.min(100, animal.quality + (Math.random() > 0.7 ? 1 : 0)),
    isPregnant,
    pregnancyDays
  };
};

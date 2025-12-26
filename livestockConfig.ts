
import { AnimalType } from './types';

// Centralized configuration for all livestock stats, pricing, and outputs
export const ANIMAL_CONFIG: Record<AnimalType, any> = {
  CHICKEN: { 
    name: 'Chicken', 
    basePrice: 50, 
    growthRate: 0.5, 
    maxWeight: 5, 
    baseQuality: 50, 
    slaughterCost: 5, 
    pregnancyDays: 2, 
    outputs: { meat: 'CHICKEN_MEAT', byproduct: 'FEATHERS', corpse: 'CHICKEN_CORPSE', meatRatio: 0.6, byproductRatio: 2 } 
  },
  PIG: { 
    name: 'Pig', 
    basePrice: 200, 
    growthRate: 2, 
    maxWeight: 120, 
    baseQuality: 50, 
    slaughterCost: 15, 
    pregnancyDays: 4, 
    outputs: { meat: 'PORK', byproduct: 'PIG_SKIN', corpse: 'PIG_CORPSE', meatRatio: 0.7, byproductRatio: 1 } 
  },
  SHEEP: { 
    name: 'Sheep', 
    basePrice: 300, 
    growthRate: 1.5, 
    maxWeight: 80, 
    baseQuality: 60, 
    slaughterCost: 20, 
    pregnancyDays: 4, 
    outputs: { meat: 'MUTTON', byproduct: 'WOOL', corpse: 'SHEEP_CORPSE', meatRatio: 0.5, byproductRatio: 3 } 
  },
  COW: { 
    name: 'Cow', 
    basePrice: 500, 
    growthRate: 3, 
    maxWeight: 600, 
    baseQuality: 70, 
    slaughterCost: 30, 
    pregnancyDays: 6, 
    outputs: { meat: 'BEEF', byproduct: 'LEATHER', corpse: 'COW_CORPSE', meatRatio: 0.6, byproductRatio: 1 } 
  },
};

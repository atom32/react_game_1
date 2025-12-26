
export type AnimalType = 'CHICKEN' | 'PIG' | 'COW' | 'SHEEP';
export type AnimalLocation = 'PEN' | 'SLAUGHTER' | 'HOUSE' | 'BREEDING' | 'WORKSHOP';
export type Gender = 'MALE' | 'FEMALE';

export interface Animal {
  id: string;
  type: AnimalType;
  name: string;
  age: number; 
  weight: number; 
  quality: number; 
  isPet: boolean;
  acquiredAt: number;
  gender: Gender;
  location: AnimalLocation;
  isPregnant?: boolean;
  pregnancyDays?: number;
}

export type ItemCategory = 'MEAT' | 'BYPRODUCT' | 'DISH' | 'GOODS' | 'CORPSE' | 'TOOL' | 'FOOD' | 'ORGAN';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  buyPrice?: number;
}

export interface InventoryItem extends Item {
  count: number;
}

export interface Recipe {
  id: string;
  name: string;
  input: { itemId: string; count: number }[];
  output: { itemId: string; count: number };
  energyCost: number;
  unlockCost: number;
}

export interface AnatomyPart {
  id: string;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  outputItemId: string;
  outputCount: number;
  requiresSequence?: string[]; // IDs of parts that must be removed first
}

export interface AnatomySession {
  corpseId: string;
  animalType: AnimalType;
  extractedParts: string[];
}

export type Tab = 'MAP' | 'MARKET' | 'PEN' | 'SLAUGHTER' | 'RESTAURANT' | 'WORKSHOP' | 'HOUSE' | 'BREEDING' | 'SHOP' | 'INVENTORY' | 'ANATOMY';

export interface GameState {
  day: number;
  money: number;
  energy: number;
  maxEnergy: number;
  animals: Animal[];
  inventory: Record<string, number>;
  marketAnimals: Animal[];
  buildingLevels: Record<string, number>;
  buildingIcons: Record<string, string>;
  mapBackground?: string; 
  anatomySession: AnatomySession | null;
}



import { AnimalType, Item, Recipe, Tab, AnatomyPart } from './types';
import { BUILDING_PROMPTS } from './prompts';

export const MAX_ENERGY_DEFAULT = 500;
export const DAILY_EXPENSES = 50; 
export const MAX_BUILDING_LEVEL = 5;
export const MARKET_REFRESH_COST = 100;

export const GAME_WIDTH = 1400;
export const GAME_HEIGHT = 900;

export const WALK_SPEED = 4.5;
export const SPRINT_SPEED = 8.5;

export const BUILDING_UPGRADE_COSTS: Record<number, number> = {
  1: 500,
  2: 1500,
  3: 4000,
  4: 10000,
  5: 25000
};

export const SHOP_BUYABLES = ['BASIC_FEED', 'PREMIUM_FEED', 'IRON_CLEAVER', 'ENERGY_DRINK'];

export const BUILDINGS_CONFIG: { id: Tab; x: number; y: number; width: number; height: number; color: string; label: string; icon: string; prompt: string }[] = [
  { id: 'MARKET', x: 150, y: 120, width: 180, height: 180, color: 'blue', label: 'Livestock Market', icon: 'Store', prompt: BUILDING_PROMPTS.MARKET },
  { id: 'PEN', x: 550, y: 80, width: 180, height: 180, color: 'green', label: 'Animal Pens', icon: 'Warehouse', prompt: BUILDING_PROMPTS.PEN },
  { id: 'BREEDING', x: 950, y: 140, width: 180, height: 180, color: 'pink', label: 'Breeding Center', icon: 'Heart', prompt: BUILDING_PROMPTS.BREEDING },
  { id: 'SHOP', x: 115, y: 380, width: 180, height: 180, color: 'emerald', label: 'General Store', icon: 'ShoppingBag', prompt: BUILDING_PROMPTS.SHOP },
  { id: 'HOUSE', x: 620, y: 410, width: 180, height: 180, color: 'purple', label: 'My House', icon: 'Home', prompt: BUILDING_PROMPTS.HOUSE },
  { id: 'SLAUGHTER', x: 130, y: 640, width: 180, height: 180, color: 'red', label: 'Slaughterhouse', icon: 'Skull', prompt: BUILDING_PROMPTS.SLAUGHTER },
  { id: 'WORKSHOP', x: 500, y: 650, width: 180, height: 180, color: 'amber', label: 'Workshop', icon: 'Hammer', prompt: BUILDING_PROMPTS.WORKSHOP },
  { id: 'RESTAURANT', x: 980, y: 580, width: 180, height: 180, color: 'orange', label: 'Steakhouse', icon: 'ChefHat', prompt: BUILDING_PROMPTS.RESTAURANT },
];

export const ITEMS: Record<string, Item> = {
  CHICKEN_MEAT: { id: 'CHICKEN_MEAT', name: 'Raw Chicken', category: 'MEAT', price: 10 },
  PORK: { id: 'PORK', name: 'Raw Pork', category: 'MEAT', price: 25 },
  BEEF: { id: 'BEEF', name: 'Raw Beef', category: 'MEAT', price: 50 },
  MUTTON: { id: 'MUTTON', name: 'Raw Mutton', category: 'MEAT', price: 35 },
  FEATHERS: { id: 'FEATHERS', name: 'Feathers', category: 'BYPRODUCT', price: 5 },
  PIG_SKIN: { id: 'PIG_SKIN', name: 'Pig Skin', category: 'BYPRODUCT', price: 10 },
  LEATHER: { id: 'LEATHER', name: 'Raw Hide', category: 'BYPRODUCT', price: 20 },
  WOOL: { id: 'WOOL', name: 'Wool', category: 'BYPRODUCT', price: 15 },
  FRIED_CHICKEN: { id: 'FRIED_CHICKEN', name: 'Fried Chicken', category: 'DISH', price: 45 },
  ROAST_PORK: { id: 'ROAST_PORK', name: 'Roast Pork', category: 'DISH', price: 90 },
  STEAK: { id: 'STEAK', name: 'Premium Steak', category: 'DISH', price: 180 },
  LAMB_CHOPS: { id: 'LAMB_CHOPS', name: 'Lamb Chops', category: 'DISH', price: 120 },
  PILLOW: { id: 'PILLOW', name: 'Pillow', category: 'GOODS', price: 60 },
  FOOTBALL: { id: 'FOOTBALL', name: 'Football', category: 'GOODS', price: 80 },
  WALLET: { id: 'WALLET', name: 'Wallet', category: 'GOODS', price: 150 },
  SWEATER: { id: 'SWEATER', name: 'Sweater', category: 'GOODS', price: 100 },
  TROPHY_MOUNT: { id: 'TROPHY_MOUNT', name: 'Animal Mount', category: 'GOODS', price: 400 },
  CHICKEN_CORPSE: { id: 'CHICKEN_CORPSE', name: 'Chicken Corpse', category: 'CORPSE', price: 30 },
  PIG_CORPSE: { id: 'PIG_CORPSE', name: 'Pig Corpse', category: 'CORPSE', price: 120 },
  SHEEP_CORPSE: { id: 'SHEEP_CORPSE', name: 'Sheep Corpse', category: 'CORPSE', price: 180 },
  COW_CORPSE: { id: 'COW_CORPSE', name: 'Cow Corpse', category: 'CORPSE', price: 350 },
  BASIC_FEED: { id: 'BASIC_FEED', name: 'Standard Feed', category: 'FOOD', price: 5, buyPrice: 20 },
  PREMIUM_FEED: { id: 'PREMIUM_FEED', name: 'Premium Grain', category: 'FOOD', price: 20, buyPrice: 75 },
  IRON_CLEAVER: { id: 'IRON_CLEAVER', name: 'Iron Cleaver', category: 'TOOL', price: 100, buyPrice: 500 },
  ENERGY_DRINK: { id: 'ENERGY_DRINK', name: 'Red Cow Drink', category: 'FOOD', price: 15, buyPrice: 50 },
  // Organs
  LIVER: { id: 'LIVER', name: 'Prime Liver', category: 'ORGAN', price: 60 },
  HEART_ORG: { id: 'HEART_ORG', name: 'Pure Heart', category: 'ORGAN', price: 100 },
  KIDNEY: { id: 'KIDNEY', name: 'Clean Kidney', category: 'ORGAN', price: 50 },
  EYE: { id: 'EYE', name: 'Glistening Eye', category: 'ORGAN', price: 80 },
};

export const PROCESSING_METHODS = [
  { id: 'STANDARD', name: 'Standard Processing', cost: 20 },
  { id: 'INDUSTRIAL', name: 'Industrial Batch', cost: 50 },
  { id: 'ARTISAN', name: 'Artisan Butchery', cost: 40 },
];

export const COOKING_RECIPES: Recipe[] = [
  { id: 'R_CHICKEN', name: 'Fry Chicken', input: [{ itemId: 'CHICKEN_MEAT', count: 1 }], output: { itemId: 'FRIED_CHICKEN', count: 2 }, energyCost: 10, unlockCost: 0 },
  { id: 'R_PORK', name: 'Roast Pork', input: [{ itemId: 'PORK', count: 1 }], output: { itemId: 'ROAST_PORK', count: 2 }, energyCost: 15, unlockCost: 100 },
  { id: 'R_SHEEP', name: 'Grill Lamb', input: [{ itemId: 'MUTTON', count: 1 }], output: { itemId: 'LAMB_CHOPS', count: 2 }, energyCost: 15, unlockCost: 150 },
  { id: 'R_COW', name: 'Grill Steak', input: [{ itemId: 'BEEF', count: 1 }], output: { itemId: 'STEAK', count: 3 }, energyCost: 25, unlockCost: 500 }
];

export const CRAFTING_RECIPES: Recipe[] = [
  { id: 'C_PILLOW', name: 'Sew Pillow', input: [{ itemId: 'FEATHERS', count: 5 }], output: { itemId: 'PILLOW', count: 1 }, energyCost: 10, unlockCost: 0 },
  { id: 'C_FOOTBALL', name: 'Stitch Football', input: [{ itemId: 'PIG_SKIN', count: 2 }], output: { itemId: 'FOOTBALL', count: 1 }, energyCost: 15, unlockCost: 200 },
  { id: 'C_SWEATER', name: 'Knit Sweater', input: [{ itemId: 'WOOL', count: 3 }], output: { itemId: 'SWEATER', count: 1 }, energyCost: 20, unlockCost: 200 },
  { id: 'C_WALLET', name: 'Craft Wallet', input: [{ itemId: 'LEATHER', count: 1 }], output: { itemId: 'WALLET', count: 2 }, energyCost: 25, unlockCost: 500 }
];

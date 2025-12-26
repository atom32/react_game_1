
import { AnimalType, AnatomyPart } from './types';

// Centralized configuration for dissection parts, coordinates, and dependency logic
export const ANIMAL_ANATOMY_MAP: Record<AnimalType, AnatomyPart[]> = {
  CHICKEN: [
    { id: 'c_wing_l', label: 'Left Wing', x: 30, y: 40, width: 60, height: 40, outputItemId: 'FEATHERS', outputCount: 5 },
    { id: 'c_wing_r', label: 'Right Wing', x: 70, y: 40, width: 60, height: 40, outputItemId: 'FEATHERS', outputCount: 5 },
    { id: 'c_breast', label: 'Breast Meat', x: 50, y: 55, width: 80, height: 60, outputItemId: 'CHICKEN_MEAT', outputCount: 4 },
    { id: 'c_heart', label: 'Chicken Heart', x: 50, y: 48, width: 30, height: 30, outputItemId: 'HEART_ORG', outputCount: 1, requiresSequence: ['c_breast'] },
  ],
  PIG: [
    { id: 'p_skin', label: 'Outer Hide', x: 50, y: 50, width: 220, height: 140, outputItemId: 'PIG_SKIN', outputCount: 5 },
    { id: 'p_loin', label: 'Pork Loin', x: 50, y: 45, width: 100, height: 50, outputItemId: 'PORK', outputCount: 10, requiresSequence: ['p_skin'] },
    { id: 'p_liver', label: 'Pig Liver', x: 45, y: 60, width: 50, height: 50, outputItemId: 'LIVER', outputCount: 1, requiresSequence: ['p_skin'] },
    { id: 'p_eye', label: 'Eye of Swine', x: 80, y: 35, width: 25, height: 25, outputItemId: 'EYE', outputCount: 2 },
  ],
  SHEEP: [
    { id: 's_wool', label: 'Thick Wool', x: 50, y: 50, width: 200, height: 130, outputItemId: 'WOOL', outputCount: 8 },
    { id: 's_ribs', label: 'Lamb Ribs', x: 45, y: 55, width: 90, height: 60, outputItemId: 'MUTTON', outputCount: 12, requiresSequence: ['s_wool'] },
    { id: 's_heart', label: 'Sheep Heart', x: 52, y: 48, width: 40, height: 40, outputItemId: 'HEART_ORG', outputCount: 1, requiresSequence: ['s_wool'] },
  ],
  COW: [
    { id: 'cow_hide', label: 'Vast Hide', x: 50, y: 50, width: 250, height: 160, outputItemId: 'LEATHER', outputCount: 10 },
    { id: 'cow_tenderloin', label: 'Tenderloin', x: 40, y: 45, width: 120, height: 50, outputItemId: 'BEEF', outputCount: 20, requiresSequence: ['cow_hide'] },
    { id: 'cow_liver', label: 'Huge Liver', x: 60, y: 55, width: 70, height: 70, outputItemId: 'LIVER', outputCount: 2, requiresSequence: ['cow_hide'] },
    { id: 'cow_kidney', label: 'Kidney', x: 35, y: 65, width: 50, height: 50, outputItemId: 'KIDNEY', outputCount: 1, requiresSequence: ['cow_hide'] },
  ],
};


export const BUILDING_PROMPTS = {
  MARKET: "Age of Empires II style, 45-degree isometric building sprite, medieval market stall with wooden crates and blue canvas roof, stone base, 2D equidistant view, sharp sprite art, white background",
  PEN: "Age of Empires II style, 45-degree isometric building sprite, medieval farm barn, stone walls, timber frames, thatched roof, 2D equidistant view, sharp sprite art, white background",
  BREEDING: "Age of Empires II style, 45-degree isometric building sprite, medieval stone manor or monastery wing, pink banners, 2D equidistant view, sharp sprite art, white background",
  SHOP: "Age of Empires II style, 45-degree isometric building sprite, merchant guild hall, dark stone, emerald-colored roof tiles, 2D equidistant view, sharp sprite art, white background",
  HOUSE: "Age of Empires II style, 45-degree isometric building sprite, nobleman's cottage, purple flags, stone tower, lush vine details, 2D equidistant view, sharp sprite art, white background",
  SLAUGHTER: "Age of Empires II style, 45-degree isometric building sprite, medieval dark mill, red wood panels, stone chimney, water-powered mechanics, 2D equidistant view, sharp sprite art, white background",
  WORKSHOP: "Age of Empires II style, 45-degree isometric building sprite, medieval blacksmith forge, brick walls, timber beams, orange forge glow, 2D equidistant view, sharp sprite art, white background",
  RESTAURANT: "Age of Empires II style, 45-degree isometric building sprite, grand medieval feast hall, tavern style, orange banners, outdoor stone tables, 2D equidistant view, sharp sprite art, white background"
};

export const GENERATE_MAP_PROMPT = (layoutDescriptions: string) => `
Age of Empires II Definitive Edition isometric terrain sprite. 
High-detail 16:9 45-degree equidistant perspective map of a medieval farm estate. 
The ground layout features organic, staggered building foundations at these positions: ${layoutDescriptions}. 
Foundations are made of weathered gray stone masonry, perfectly flush with the ground. 
Terrain details: Dark lush grass, winding dirt paths connecting foundations, small rocky outcroppings, and patches of dry mud. 
Everything follows a strict 45-degree isometric grid. Bird-eye view, no interface, sharp sprite-based rendering, warm medieval lighting.
`;

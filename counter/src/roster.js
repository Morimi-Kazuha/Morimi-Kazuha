// Alpha bounds are measured from the tracked 96x96 transparent PNGs.
// Sprite art remains unmodified; viewBox scale uses nearest-neighbor display.
// Larger front silhouettes use wider centers; the four smaller sprites keep 73 px spacing.
export const ROSTER = Object.freeze([
  { name: 'dragonite', center: 50, scale: 1.18, bounds: [18, 7, 82, 87], duration: 3.1, delay: 0.2 },
  { name: 'rillaboom', center: 146, scale: 1.14, bounds: [7, 8, 88, 88], duration: 2.8, delay: 1.0 },
  { name: 'volcarona', center: 242, scale: 1.12, bounds: [10, 15, 86, 81], duration: 3.6, delay: 0.8 },
  { name: 'gengar', center: 338, scale: 1.3, bounds: [17, 20, 75, 76], duration: 2.9, delay: 1.7 },
  { name: 'incineroar', center: 434, scale: 1.12, bounds: [5, 11, 90, 88], duration: 3.3, delay: 0.6 },
  { name: 'bulbasaur', center: 525, scale: 1.8, bounds: [28, 30, 63, 63], duration: 2.7, delay: 1.4 },
  { name: 'charmander', center: 598, scale: 1.7, bounds: [30, 29, 68, 71], duration: 3.4, delay: 2.0 },
  { name: 'squirtle', center: 671, scale: 1.7, bounds: [29, 29, 67, 68], duration: 3.0, delay: 1.1 },
  { name: 'pikachu', center: 744, scale: 1.7, bounds: [31, 24, 70, 70], duration: 2.6, delay: 0.4 },
]);

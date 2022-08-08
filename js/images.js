export const images = {
  mercury: new Image(),
  venus: new Image(),
  earth: new Image(),
  moon: new Image(),
  mars: new Image(),
  phobos: new Image(),
  deimos: new Image(),
  jupiter: new Image(),
  saturn: new Image(),
  uranus: new Image(),
  neptune: new Image(),
  europa: new Image(),
  io: new Image(),
  ganymede: new Image(),
  callisto: new Image(),
};

Object.keys(images).map(key => (images[key].src = `./assets/${key}.png`));

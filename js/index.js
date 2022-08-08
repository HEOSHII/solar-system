import { images } from './images.js';
import { Satellite, Planet } from './classes.js';

const canvas = document.getElementById('canvas');
export const context = canvas.getContext('2d');

export const deg = n => (n * Math.PI) / 180;
export let width, height, centerX, centerY;

const setSize = () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  centerX = width / 2;
  centerY = height / 2;
};
setSize();
window.onresize = setSize;

const planets = {
  mercury: new Planet(7, 2.5, 90, 0, images.mercury),
  venus: new Planet(10, 1.7, 120, 0, images.venus),
  earth: new Planet(15, 1, 230, 0, images.earth),
  mars: new Planet(25, 0.5, 400, 0, images.mars),
  jupiter: new Planet(35, 0.35, 500, 0, images.jupiter),
  saturn: new Planet(27, 0.3, 600, 0, images.saturn),
  uranus: new Planet(25, 0.2, 700, 0, images.uranus),
  neptune: new Planet(27, 0.1, 800, 0, images.neptune),
};

const satellites = {
  moon: new Satellite(5, 3.5, 40, 0, images.moon),
  phobos: new Satellite(7, 4, 40, 0, images.phobos),
  deimos: new Satellite(4, 6, 60, 0, images.deimos),
  io: new Satellite(4, 5, 50, 0, images.io),
  europa: new Satellite(3, 3, 60, 0, images.earth),
  ganymede: new Satellite(5, 2, 70, 0, images.ganymede),
  callisto: new Satellite(4.8, 1.7, 90, 0, images.callisto),
};

const stars = {
  speed: { x: 5, y: 2 },
  colors: ['#FFFFFF', '#F0FFFF', '#F0F8FF', '#F5FFFA', '#F0FFF0', 'darkred'],
  count: width + height,
  create() {
    const arr = [];
    for (let i = 0; i < this.count; i++) {
      arr.push({
        x: (Math.random() * width).toFixed(0),
        y: (Math.random() * height).toFixed(0),
        radius: Math.random().toFixed(1),
        color: this.colors[(Math.random() * this.colors.length).toFixed(0)],
        shift: {
          x: this.speed.x,
          y: this.speed.y,
        },
      });
    }
    return arr;
  },
};

const starsForRender = stars.create();

// ========== METHODS ========== //
const drawStars = () => {
  starsForRender.map(star => {
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, deg(270));
    context.fillStyle = star.color;
    context.fill();
    star.x -= star.shift.x;
    star.y -= star.shift.y;
    star.x = star.x < 0 ? star.x + width : star.x;
    star.y = star.y < 0 ? star.y + height : star.y;
  });
};

const drawSun = () => {
  const sunRadius = 25;
  const lightRadius = 200;
  const sunShiningGradient = context.createRadialGradient(
    centerX,
    centerY,
    sunRadius + 5,
    centerX,
    centerY,
    lightRadius,
  );
  sunShiningGradient.addColorStop(0, 'rgba(255,255,200, 1)');
  sunShiningGradient.addColorStop(1, 'transparent');

  context.beginPath();
  context.arc(centerX, centerY, lightRadius, 0, deg(360));
  context.fillStyle = sunShiningGradient;
  context.fill();

  context.beginPath();
  context.arc(centerX, centerY, sunRadius, 0, deg(360));
  context.fillStyle = 'rgb(255,255,215)';
  context.fill();
};

const drawPlanets = () => {
  planets.mercury.draw();
  planets.venus.draw();
  planets.earth.draw([satellites.moon]);
  planets.mars.draw([satellites.phobos, satellites.deimos]);
  planets.jupiter.draw([
    satellites.io,
    satellites.europa,
    satellites.ganymede,
    satellites.callisto,
  ]);
  planets.saturn.draw();
  planets.uranus.draw();
  planets.neptune.draw();
};

const nextFrame = () => {
  context.clearRect(0, 0, width, height);
  drawStars();
  drawPlanets();
  drawSun();
};

const loop = () => {
  nextFrame();
  window.requestAnimationFrame(loop);
};

nextFrame();
loop();

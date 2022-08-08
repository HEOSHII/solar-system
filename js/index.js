import { images } from './images.js';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

let centerX = window.innerWidth / 2;
let centerY = window.innerHeight / 2;

const deg = n => (n * Math.PI) / 180;

window.onresize = () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  centerX = width / 2;
  centerY = height / 2;
};

class Satellite {
  /**
   * @param {number}radius
   * @param {number}speed
   * @param {number}distance
   * @param {number}angle
   * @param {HTMLCanvasElement}image
   */
  constructor(radius, speed, distance, angle, image) {
    this.radius = radius;
    this.speed = speed;
    this.distance = distance;
    this.angle = angle;
    this.image = image;
  }
}

class Planet extends Satellite {
  /**@param {[]}satellites */
  draw(satellites) {
    this.angle -= this.speed;
    resetAngle(this.angle);
    context.beginPath();
    let r = this.distance;
    let d = deg(this.angle);
    const coordX = centerX + r * Math.sin(d);
    const coordY = centerY + r * Math.cos(d);

    context.beginPath();
    context.drawImage(
      this.image,
      coordX - this.radius,
      coordY - this.radius,
      this.radius * 2,
      this.radius * 2,
    );
    context.beginPath();
    const shadow = context.createLinearGradient(coordX, coordY, centerX - 30, centerY - 30);
    shadow.addColorStop(0, 'rgba(0,0,0,.9)');
    shadow.addColorStop(0.05, 'transparent');
    context.arc(coordX, coordY, this.radius + 1, 0, deg(360));
    context.fillStyle = shadow;
    context.fill();
    if (!satellites) {
      return;
    } else {
      satellites.forEach(satellite => {
        satellite.angle -= satellite.speed;
        resetAngle(satellite);
        context.beginPath();
        r = satellite.distance;
        d = deg(satellite.angle);
        const satX = coordX + r * Math.sin(d);
        const satY = coordY + r * Math.cos(d);
        context.beginPath();
        context.drawImage(
          satellite.image,
          satX - satellite.radius,
          satY - satellite.radius,
          satellite.radius * 2,
          satellite.radius * 2,
        );

        context.arc(satX, satY, satellite.radius + 1, 0, deg(360));
        context.fillStyle = shadow;
        context.fill();
      });
    }
  }
}

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
  satellite: new Satellite(5, 6, 20, 0, images.satellite),
  phobos: new Satellite(7, 4, 40, 0, images.phobos),
  deimos: new Satellite(4, 6, 60, 0, images.deimos),
  io: new Satellite(4, 5, 50, 0, images.io),
  europa: new Satellite(3, 3, 60, 0, images.earth),
  ganymede: new Satellite(5, 2, 70, 0, images.ganymede),
  callisto: new Satellite(4.8, 1.7, 90, 0, images.callisto),
};

const generalSettings = {
  started: true,
  speed: 15,
  planetsGo: null,
};

// ======= SETUP STARS ========= //
const starsCoord = [];
const startsCount = 2000;
const starColors = ['#FFFFFF', '#F0FFFF', '#F0F8FF', '#F5FFFA', '#F0FFF0', 'darkred'];
for (let i = 0; i < startsCount; i++) {
  starsCoord.push({
    x: (Math.random() * width).toFixed(0),
    y: (Math.random() * height).toFixed(0),
    size: Math.random().toFixed(1),
    color: starColors[(Math.random() * starColors.length).toFixed(0)],
  });
}
//============================= //
// ========== METHODS ========== //
const drawStars = () => {
  for (const star of starsCoord) {
    context.beginPath();
    context.arc(star.x, star.y, star.size, 0, deg(270));
    context.fillStyle = star.color;
    context.fill();
    star.x -= star.size * 4;
    star.y -= star.size * 2;
    star.x = star.x < 0 ? star.x + width : star.x;
    star.y = star.y < 0 ? star.y + height : star.y;
  }
};

const drawSun = () => {
  const sunRadius = 50;
  const lightRadius = 500;
  const sunShiningGradient = context.createRadialGradient(
    centerX,
    centerY,
    sunRadius + 5,
    centerX,
    centerY,
    lightRadius,
  );
  sunShiningGradient.addColorStop(0, 'rgba(255,255,200, 1)');
  sunShiningGradient.addColorStop(0.7, 'transparent');

  context.beginPath();
  context.arc(centerX, centerY, lightRadius, 0, deg(360));
  context.fillStyle = sunShiningGradient;
  context.fill();

  context.beginPath();
  context.arc(centerX, centerY, sunRadius, 0, deg(360));
  context.fillStyle = 'rgb(255,255,215)';
  context.fill();
};

const resetAngle = planet => ([planet].angle === -360 ? ([planet].angle = 0) : [planet].angle);

const init = () => {
  context.clearRect(0, 0, width, height);
  drawStars();
  drawSun();
  planets.mercury.draw();
  planets.venus.draw();
  planets.earth.draw([satellites.moon, satellites.satellite]);
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

const loop = speed => {
  generalSettings.started = true;
  generalSettings.planetsGo = setInterval(init, speed);
};

loop(generalSettings.speed);

window.onclick = () => {
  generalSettings.started = !generalSettings.started;
  generalSettings.started ? loop(generalSettings.speed) : clearInterval(generalSettings.planetsGo);
};

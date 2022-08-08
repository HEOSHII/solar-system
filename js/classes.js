import { context, deg, centerX, centerY } from './index.js';

const resetAngle = planet => ([planet].angle === -360 ? ([planet].angle = 0) : [planet].angle);

export class Satellite {
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

export class Planet extends Satellite {
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
    context.arc(coordX, coordY, this.radius + 0.5, 0, deg(360));
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

        context.arc(satX, satY, satellite.radius + 0.5, 0, deg(360));
        context.fillStyle = shadow;
        context.fill();
      });
    }
  }
}

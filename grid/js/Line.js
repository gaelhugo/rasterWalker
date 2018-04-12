'use strict';

const FOLDER = './seq/';
const PREFIX = 'frame';
const SUFFIX = '.jpg';
const MAX = 24;  // 24;
const SPEED = 2;
const DIMENSION = {
  'width': 1280,
  'height': 720,
};
let PX;
let particle;
let allThings = [];
let PARTICLE_AMOUNT = 42200;
let ANGLE = 580;
let LSize = 1;
class App {
  constructor() {
    this.counter = 0;
    this.fps = 0;
    this.canvas = document.createElement('canvas');
    this.canvas.width = DIMENSION.width;
    this.canvas.height = DIMENSION.height;
    this.ctx = this.canvas.getContext('2d');
    /* globalCompositeOperation :
  normal | multiply | screen | overlay |
  darken | lighten | color-dodge | color-burn | hard-light |
  soft-light | difference | exclusion | hue | saturation |
  color | luminosity
*/
    this.ctx.globalCompositeOperation = 'difference';
    this.ctx.globalAlpha = 0.1;
    this.imageData;
    document.body.appendChild(this.canvas);
    this.allImages = [];
    this.loadImage(0);

    let selector = document.getElementById('angleSelector');
    let lengthSelector = document.getElementById('lenghtSelector');
    selector.addEventListener('change', this.onChange.bind(this));
    lengthSelector.addEventListener('change', this.onLChange.bind(this));
  }
  onChange(e) {
    ANGLE = e.target.value;
    console.log(ANGLE);
  }
  onLChange(e) {
    LSize = e.target.value;
    console.log(LSize);
  }
  loadImage(i) {
    let img = new Image();
    img.onload = (function(e) {
                   this.allImages.push(img);
                   if (this.allImages.length == MAX) {
                     PX.ticker.add(this.draw, this);
                   } else {
                     i++;
                     this.loadImage(i);
                   }
                 }).bind(this);
    img.src = FOLDER + PREFIX + i + SUFFIX;
  }
  draw() {
    if (this.fps % SPEED == 0) {
      this.ctx.drawImage(
          this.allImages[this.counter], 0, 0, DIMENSION.width,
          DIMENSION.height);
      let imageData =
          this.ctx.getImageData(0, 0, DIMENSION.width, DIMENSION.height);
      // this.ctx.clearRect(0, 0, DIMENSION.width, DIMENSION.height);
      this.processDatas(imageData);
      this.counter++;
      if (this.counter > (MAX - 1)) {
        this.counter = 0;
      }
      this.fps = 0;
    }
    this.fps++;
  }
  processDatas(imageData) {
    for (let i = 0; i < particle.length; i++) {
      let index =
          4 * (particle[i].originx + particle[i].originy * DIMENSION.width);
      let brightness = 0.34 * imageData.data[index] +
          0.5 * imageData.data[index + 1] + 0.16 * imageData.data[index + 2];
      let val = 1 - (brightness / 255);
      let angle = ANGLE * val - 10;
      particle[i].rotation = (angle * 1) * Math.PI / 180;
      if (particle[i].previousAngle - angle < 0.001) {
        particle[i].size = (particle[i].size > 0) ? particle[i].size - 0.2 : 0;
        particle[i].sizeX =
            (particle[i].sizeX > 0) ? particle[i].sizeX - 0.2 : 0;
        // particle[i].y+=20;
      } else {
        particle[i].size =
            (particle[i].size < LSize) ? particle[i].size + 0.2 : LSize;
        particle[i].sizeX =
            (particle[i].sizeX < 1) ? particle[i].sizeX + 0.2 : 1;
        // particle[i].y = particle[i].originy* 1.5 + 60;
      }
      particle[i].scale.set(particle[i].sizeX, particle[i].size * 2);
      particle[i].rotation = (angle) * Math.PI / 180;
      particle[i].previousAngle = angle;
      particle[i].direction = {
        'x': Math.cos((angle) * Math.PI / 180) * particle[i].size,
        'y': Math.sin((angle) * Math.PI / 180) * particle[i].size
      };
    }
  }
}

window.onload = function() {
  PX = new PIXI.Application(1280, 1280, {antialias: true});
  document.body.appendChild(PX.view);

  particle = [];
  // GRID CREATION
  for (let y = 0; y < DIMENSION.height; y += 5) {
    for (let x = 0; x < DIMENSION.width; x += 4) {
      // if (x > 460 && x < 820) {
      let graphics = PIXI.Sprite.fromImage('no_line2.png');
      graphics.originx = x;
      graphics.originy = y;
      graphics.x = x * 1.5 - 320;
      graphics.y = y * 1.5 + 0;
      graphics.size = 0;
      graphics.sizeX = 0;
      graphics.scale.set(0, 0);
      graphics.previousAngle = 0;
      // graphics.tint = 0;
      particle.push(graphics);
      // }
    }
  }
  PARTICLE_AMOUNT = particle.length;
  let sprites = new PIXI.particles.ParticleContainer(PARTICLE_AMOUNT, {
    scale: true,
    // position: true,
    rotation: true,
    // uvs: true,
    // alpha: true,
  });
  for (let i = 0; i < particle.length; i++) {
    sprites.addChild(particle[i]);
  }


  PX.stage.addChild(sprites);
  // let totalSprites =
  //     PX.renderer instanceof PIXI.WebGLRenderer ? PARTICLE_AMOUNT : 2;
  PX.renderer.backgroundColor = 0xffffff;


  new App();
};

'use strict';

const DIMENSION = {
  'width': 1000,
  'height': 1000,
};

class App {
  constructor() {
    console.log('loaded');
    this.canvas = document.createElement('canvas');
    this.canvas.width = DIMENSION.width;
    this.canvas.height = DIMENSION.height;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.text = 'Les etoiles de la pub ';
    this.indexLettre = 0;
    this.loadImage('andy.jpg');
  }

  loadImage(imageurl) {
    console.log('charger l\'image');
    this.img = new Image();
    this.img.onload = this.onImageLoaded.bind(this);
    this.img.src = imageurl;
  }
  onImageLoaded(e) {
    this.ctx.drawImage(this.img, 0, 0);
    this.imageDatas =
        this.ctx.getImageData(0, 0, this.img.width, this.img.height);
    // this.ctx.clearRect(0, 0, DIMENSION.width, DIMENSION.height);
    // this.draw();
    this.PX = new PIXI.Application(
        DIMENSION.width, DIMENSION.height, {antialias: true});
    document.body.appendChild(this.PX.view);
    this.allGraphics = [];
    for (let y = 0; y < this.img.height; y += 9) {
      for (let x = 0; x < this.img.width; x += 9) {
        let graphic = PIXI.Sprite.fromImage('circle.png');
        graphic.originx = x;
        graphic.originy = y;
        graphic.x = x * 2;
        graphic.y = y * 2;
        graphic.anchor.set(0.5);
        this.allGraphics.push(graphic);
      }
    }

    this.sprites = new PIXI.particles.ParticleContainer(
        this.allGraphics.length,
        {
            // scale: true,
            // position: true,
            // rotation: true,
            // alpha: true,
            // uvs: true,
        });

    for (let i = 0; i < this.allGraphics.length; i++) {
      this.sprites.addChild(this.allGraphics[i]);
    }
    this.PX.stage.addChild(this.sprites);

    this.PX.ticker.add(this.draw, this);
  }

  // convert 0..255 R,G,B values to a hexidecimal color string
  rgbToHex(r, g, b) {
    let bin = r << 16 | g << 8 | b;
    return (function(h) {
      return new Array(7 - h.length).join('0') + h;
    })(bin.toString(16).toUpperCase());
  }

  draw() {
    console.log('draw from PIXI');

    for (let i = 0; i < this.allGraphics.length; i++) {
      let x = this.allGraphics[i].originx;
      let y = this.allGraphics[i].originy;

      let index = (y * this.img.width + x) * 4;
      let red = this.imageDatas.data[index];
      let green = this.imageDatas.data[index + 1];
      let blue = this.imageDatas.data[index + 2];
      let brightness = Math.round(red * 0.3 + green * 0.59 + blue * 0.11);
      this.allGraphics[i].tint = '0x' + this.rgbToHex(red, green, blue);
    }

    // this.ctx.drawImage(this.img, 0, 0);
    // this.imageDatas =
    //     this.ctx.getImageData(0, 0, this.img.width, this.img.height);
    // this.ctx.clearRect(0, 0, DIMENSION.width, DIMENSION.height);
    // this.ctx.fillStyle = '#ffffff';
    //
    // for (let y = 0; y < this.img.height; y += 6) {
    //   for (let x = 0; x < this.img.width; x += 6) {
    //     let index = (y * this.img.width + x) * 4;
    //     let red = this.imageDatas.data[index];
    //     let green = this.imageDatas.data[index + 1];
    //     let blue = this.imageDatas.data[index + 2];
    //     let brightness = Math.round(red * 0.3 + green * 0.59 + blue * 0.11);
    //
    //     let radius = (brightness / 255) * 6 + Math.random() * 2;
    //
    //     this.ctx.fillStyle = 'rgba(' + red + ',' + blue + ',' + blue + ',1)';
    //     // this.ctx.fillRect(x, y, 6, 6);
    //     if (brightness > 50) {
    //       // this.ctx.beginPath();
    //       // this.ctx.arc(x * 2, y * 2, radius, 0, Math.PI * 2, false);
    //       // this.ctx.fill();
    //       // this.ctx.closePath();
    //
    //       this.ctx.fillStyle = 'rgb(255,255,255)';
    //       this.ctx.fillStyle = 'rgba(' + red + ',' + blue + ',' + blue +
    //       ',1)'; this.ctx.font = radius * 4 + 'px Arial';
    //       this.ctx.fillText(this.text[this.indexLettre], x * 2, y * 2);
    //
    //       if (this.indexLettre >= this.text.length - 1) {
    //         this.indexLettre = 0;
    //       } else {
    //         this.indexLettre++;
    //       }
    //     }
    //   }
    // }
    // requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = function() {
  new App();
};

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
    // document.body.appendChild(this.img);

    this.draw();
  }

  draw() {
    this.ctx.drawImage(this.img, 0, 0);
    this.imageDatas =
        this.ctx.getImageData(0, 0, this.img.width, this.img.height);
    this.ctx.clearRect(0, 0, DIMENSION.width, DIMENSION.height);
    this.ctx.fillStyle = '#ffffff';

    for (let y = 0; y < this.img.height; y += 6) {
      for (let x = 0; x < this.img.width; x += 6) {
        let index = (y * this.img.width + x) * 4;
        let red = this.imageDatas.data[index];
        let green = this.imageDatas.data[index + 1];
        let blue = this.imageDatas.data[index + 2];
        let brightness = Math.round(red * 0.3 + green * 0.59 + blue * 0.11);

        let radius = (brightness / 255) * 6 + Math.random() * 2;

        this.ctx.fillStyle = 'rgba(' + red + ',' + blue + ',' + blue + ',1)';
        // this.ctx.fillRect(x, y, 6, 6);
        if (brightness > 50) {
          // this.ctx.beginPath();
          // this.ctx.arc(x * 2, y * 2, radius, 0, Math.PI * 2, false);
          // this.ctx.fill();
          // this.ctx.closePath();

          this.ctx.fillStyle = 'rgb(255,255,255)';
          this.ctx.fillStyle = 'rgba(' + red + ',' + blue + ',' + blue + ',1)';
          this.ctx.font = radius * 4 + 'px Arial';
          this.ctx.fillText(this.text[this.indexLettre], x * 2, y * 2);

          if (this.indexLettre >= this.text.length - 1) {
            this.indexLettre = 0;
          } else {
            this.indexLettre++;
          }
        }
      }
    }
    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = function() {
  new App();
};

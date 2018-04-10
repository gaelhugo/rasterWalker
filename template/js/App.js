'use strict';

const DIMENSION = {
  'width': 1280,
  'height': 720,
}

class App {
  constructor() {
    console.log('loaded');
    this.canvas = document.createElement('canvas');
    this.canvas.width = DIMENSION.width;
    this.canvas.height = DIMENSION.height;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
  }
}

window.onload = function() {
  new App();
};

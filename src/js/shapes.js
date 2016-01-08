Shape = function(game, x, y, frame, color) {
  color = color || 0xffff00;
  Phaser.Sprite.call(this, game, x+Game.w, y, 'shapes', frame);
  this.initialX = x;
  this.initialY = y;
  this.anchor.setTo(0.5);
  this.tint = color;
  this.inSlot = false;
  this.inputEnabled = true;
  this.input.enableDrag(true);
};


Shape.prototype = Object.create(Phaser.Sprite.prototype);
Shape.prototype.constructor = Shape;


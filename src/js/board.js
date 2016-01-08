Slot = function(game, x, y, frame, color) {
  color = color || 0xffff00;
  Phaser.Sprite.call(this, game, x, y, 'shapes', frame);
  this.initialX = x;
  this.initialY = y;
  this.anchor.setTo(0.5);
  this.tint = color;
};

Slot.prototype = Object.create(Phaser.Sprite.prototype);
Slot.prototype.constructor = Slot;

Board = function(game, slots_deck) {
    //Calculate Board Dimensions to create a square
    //that will fit all the pieces
    this.game = game;
    this.slots = game.add.group();
    this.tiles = game.add.group();

    var square = 1;
    var square_index = 1;
    while (square < shape_count) {
      square = Math.pow(square_index, 2);
      square_index += 1;
    }
    var board_size = Math.sqrt(square);   

    var margin = (Game.w-(160*(board_size-1)))/2; //half sprite size + space size minus the gap after the last piece
    var counter = 0;
    for(var j = 0; j < board_size;j++) {
      for(var i = 0; i < board_size;i++) {
        if (slots_deck[counter] !== undefined) {
          var slot_x = margin + i*160; //32 + 128 or half iconsize plus spacing size  
          var slot_y = 310+j*160;

          var tile = this.game.add.sprite(slot_x, slot_y, 'shapes',0);
          tile.anchor.setTo(0.5, 0.5);
          tile.tint = 0xdcdcdc;
          tile.alpha = 0.5;
          this.tiles.add(tile);
          this.slots.add(new Slot(this.game, slot_x, slot_y, slots_deck[counter], 0xdcdcdc)); //draw shapes

          // this.game.add.tween(shape).to({x: shape.initialX, y: shape.initialY}, 100, Phaser.Easing.Linear.Out, true, 0); //snap in place
        }
        counter +=1;
      }
    }
 
};


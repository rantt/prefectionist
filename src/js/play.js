/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var score = 0;
var slots,tiles,shapes;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);


    // this.shapeSprite = this.game.add.sprite(Game.w/2, Game.h/2, 'shapes');
    // this.shapeSprite.anchor.setTo(0.5, 0.5);

    slots = this.game.add.group();
    tiles = this.game.add.group();
    shapes = this.game.add.group();

    // console.log(this.shapeSprite.animations.frameTotal);

    Shape = function(game, x, y, frame) {
      Phaser.Sprite.call(this, game, x, y, 'shapes', frame);
      this.initialX = x;
      this.initialY = y;
      this.anchor.setTo(0.5, 0.5);
      this.tint = 0xff00ff;
    };

    Shape.prototype = Object.create(Phaser.Sprite.prototype);
    Shape.prototype.constructor = Shape;

    //Create Shapes
    var shape_count = 9;
    for(var i = 1; i < 9; i++) {

      var slot_x = Game.w/4-100+(i*64);
      var slot_y = Game.h/2; 

      var tile = this.game.add.sprite(slot_x, slot_y, 'shapes',0);
      tile.anchor.setTo(0.5, 0.5);
      tile.tint = 0xdcdcdc;
      tile.alpha = 0.5;
      tiles.add(tile);

      slots.add(new Shape(this.game, slot_x, slot_y, i)); //draw shapes
      // this.game.add.sprite(0+i*64, Game.h/2, 'shapes',0);

      var shape_x = Game.w/4+(i*42);
      var shape_y = 200; 
      var shape = new Shape(this.game, shape_x, shape_y, i);
      shape.inputEnabled = true;
      shape.input.enableDrag(true);
      shape.events.onDragStop.add(this.onDragStop, this);
      // shape.input.enableSnap(42,42,false,true);
      shapes.add(shape); //draw shapes

    }

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);


    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
    console.log(slots);
  },
  onDragStop(shape, pointer) {
    console.log('on drag stop' + slots.length);  
    var slot;
    for(var i=0; i < slots.length;i++) {
      if (slots.children[i].frame === shape.frame){
        slot = slots.children[i];
        break;
      }
    }

    boundsShape = shape.getBounds();
    boundsSlot = slot.getBounds();
    if (Phaser.Rectangle.intersects(boundsShape, boundsSlot)) {
      //TODO:
      //*  Snap in Place
      //*  Score Point

      this.game.add.tween(shape).to({x: slot.initialX, y: slot.initialY}, 50, Phaser.Easing.Linear.Out, true, 0);
      console.log('score point');
    }else {
      this.game.add.tween(shape).to({x: shape.initialX, y: shape.initialY}, 300, Phaser.Easing.Linear.Out, true, 0);
      // shape.x = shape.initialX; 
      // shape.y = shape.initialY; 
    }

    // this.game.physics.arcade.overlap(sprite, slots, function(player, enemy) {
    //   console.log('overlapping true');  
    // }, null, this);

  },
  update: function() {

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/GAMETITLE/'; 
    var twitter_name = 'rantt_';
    var tags = ['1GAM'];

    window.open('http://twitter.com/share?text=My+best+score+is+'+score+'+playing+GAME+TITLE+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
  },

  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('Health: ' + tri.health, 32, 96);
  // }

};

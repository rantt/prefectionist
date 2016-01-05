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

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);


    // this.shapeSprite = this.game.add.sprite(Game.w/2, Game.h/2, 'shapes');
    // this.shapeSprite.anchor.setTo(0.5, 0.5);

    this.shapes = this.game.add.group();
    this.slots = this.game.add.group();

    // console.log(this.shapeSprite.animations.frameTotal);

    Shape = function(game, x, y, frame) {
      Phaser.Sprite.call(this, game, x, y, 'shapes', frame);
      this.anchor.setTo(0.5, 0.5);
      this.tint = 0xff00ff;
    };

    Shape.prototype = Object.create(Phaser.Sprite.prototype);
    Shape.prototype.constructor = Shape;

    //Create Shapes
    var shape_count = 9;
    for(var i = 1; i < 9; i++) {
      var shape_x = Game.w/4+(i*42);
      var shape_y = 200; 
      this.shapes.add(new Shape(this.game, shape_x, shape_y, i)); //draw shapes

      var slot_x = Game.w/4-100+(i*64);
      var slot_y = Game.h/2; 

      var tile = this.game.add.sprite(slot_x, slot_y, 'shapes',0);
      tile.anchor.setTo(0.5, 0.5);
      tile.tint = 0xdcdcdc;
      tile.alpha = 0.5;

      this.slots.add(new Shape(this.game, slot_x, slot_y, i)); //draw shapes
      // this.game.add.sprite(0+i*64, Game.h/2, 'shapes',0);

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

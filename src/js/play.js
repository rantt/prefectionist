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
var shape_count=shapes_left = 8;
var slots,tiles,shapes;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);


    // this.shapeSprite = this.game.add.sprite(Game.w/2, Game.h/2, 'shapes');
    // this.shapeSprite.anchor.setTo(0.5, 0.5);

    //TODO:
    //Need to add a timer, could use a set time amount
    //or possibly a short solve time but it get's increase with every
    //right answer

    var bmd = this.game.add.bitmapData(this.game.width, 30);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.game.width, 30);
    bmd.ctx.fillStyle = '#fff';
    bmd.ctx.fill();
    // bmd.ctx.beginPath();
    // bmd.ctx.rect(0, 0, this.game.width, 30);  
    // bmd.ctx.rect(16, 16, 16, 16);
    // bmd.ctx.fillStyle = '#00bfff'; //blue


    this.count_down = this.game.add.sprite(Game.w/2, 270, bmd);
    this.count_down.anchor.setTo(0.5);
    this.count_down.limit = 10000;
    this.time_limit = this.game.time.now + 10000;

     
    function shuffle(deck){
      var tmp_deck = deck.slice();

      var result = []; 
      while (tmp_deck.length > 0) {  
        var index = Math.floor(Math.random() * tmp_deck.length);
        result.push(tmp_deck.splice(index, 1)[0]);
      }
      return result;
    }

    var ordered_deck = [];
    for(var i = 1;i <= shape_count; i++) {
      ordered_deck.push(i);
    }
    console.log(ordered_deck);

    this.shapes_deck = shuffle(ordered_deck);
    this.slots_deck = shuffle(ordered_deck);

    console.log(this.shapes_deck,this.slots_deck);

    slots = this.game.add.group();
    tiles = this.game.add.group();
    shapes = this.game.add.group();

    Shape = function(game, x, y, frame, color) {
      color = color || 0xffff00;
      Phaser.Sprite.call(this, game, x, y, 'shapes', frame);
      this.scale.x = 2; //reg size is 32px, but 64 works better
      this.scale.y = 2;
      this.initialX = x;
      this.initialY = y;
      this.anchor.setTo(0.5, 0.5);
      // this.tint = 0xff00ff;
      // this.tint = 0xffff00;
      this.tint = color;
    };

    Shape.prototype = Object.create(Phaser.Sprite.prototype);
    Shape.prototype.constructor = Shape;

    //Calculate Board Dimensions to create a square
    //that will fit all the pieces
    var square = 1;
    var square_index = 1;
    while (square < shape_count) {
      square = Math.pow(square_index, 2);
      square_index += 1;
    }
    var board_size = Math.sqrt(square);   

    // var margin = (Game.w-(64*board_size+(board_size - 1)*128))/2; //where is the spirte size and 128 is the spacing size 
    var margin = (Game.w-(160*(board_size-1)))/2; //half sprite size + space size minus the gap after the last piece
    var counter = 0;
    console.log('margin'+margin);
    for(var j = 0; j < board_size;j++) {
      for(var i = 0; i < board_size;i++) {
        if (this.shapes_deck[counter] !== undefined) {
          var slot_x = margin + i*160; //32 + 128 or half iconsize plus spacing size  
          var slot_y = Game.w/2+j*160;

          var tile = this.game.add.sprite(slot_x, slot_y, 'shapes',0);
          tile.anchor.setTo(0.5, 0.5);
          tile.tint = 0xdcdcdc;
          tile.alpha = 0.5;
          tile.scale.x = 2;
          tile.scale.y = 2;
          tiles.add(tile);

          slots.add(new Shape(this.game, slot_x, slot_y, this.shapes_deck[counter], 0xdcdcdc)); //draw shapes
        }
        counter +=1;

      }
    }
    
    for(var k = 1; k <= shape_count;k++) {
      var shape_x = 40+(k*80);
      var shape_y = 200; 
      var shape = new Shape(this.game, shape_x, shape_y, this.shapes_deck[k-1]);
      shape.inputEnabled = true;
      shape.input.enableDrag(true);
      shape.events.onDragStop.add(this.onDragStop, this);
      shapes.add(shape); 
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
  onDragStop:  function(shape, pointer) {
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
      shapes_left -= 1;
      this.time_limit += 3000;
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
    if (this.game.time.now > this.time_limit) {
      this.game.state.start('Menu');
      console.log('GAME OVER');
    }

    if (shapes_left == 0) {
      this.game.state.start('Menu');
      console.log('YOU WIN');
    }

    this.count_down.scale.x = (1 - this.game.time.now/this.time_limit);
    console.log(this.count_down.scale.x);
    if (this.count_down.scale.x > 0.7) {
      this.count_down.tint = 0x00ff00;
      console.log('not bad');
    }else if (this.count_down.scale.x > 0.3) {
      this.count_down.tint = 0xffff00;
    }else if (this.count_down.scale.x > 0) {
      this.count_down.tint = 0xff0000;
    }
    // if (this.count_down.scale.x > 0.80) {
    //   this.count_down.tint = 0x00ff00;
    // }

    // console.log(this.game.time.now/this.time_limit);

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

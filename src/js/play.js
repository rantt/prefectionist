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


var wKey,aKey,sKey,dKey;
var level = 1;
var adjustDifficulty = 0;
var retries = 0;
//31 Total Shapes
// var shape_count=shapes_left = 4;
var shape_count,shapes_left;
var slots,tiles,shapes,limit;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
		// this.game.stage.backgroundColor = '#213D5E';
		this.game.stage.backgroundColor = '#192331';
    // this.game_timer = this.game.time.now + 2000;
    // this.start_time = this.game.time.now;

      // if (difficulty === 'easy') {
      //   limit = 5000;
      // }else if (difficulty === 'normal') {
      //   limit = 3000;
      // }else if (difficulty === 'hard') {
      //   limit = 1500;
      // }
    this.setDifficulty();


    this.showing_message = true;
    this.holding_pointer = false;
    this.winning = true;

    this.scoreSnd = this.game.add.sound('score'); 
    this.scoreSnd.volume = 0.2;

    this.failSnd = this.game.add.sound('fail'); 
    this.failSnd.volume = 0.2;

    this.lostSnd = this.game.add.sound('lost'); 
    // this.lostSnd.volume = 0.2;

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);


    // this.twitterButton = new TwitterButton(this.game);
    this.message_screen = this.game.add.sprite(Game.w/2, Game.h/2, this.makeBox(Game.w, Game.h));
    this.message_screen.anchor.setTo(0.5);
    this.message_screen.tint = 0x222222;
    this.message_screen.alpha = 0.5;
    this.message_screen.visible = false;

    this.message_text = this.game.add.bitmapText(Game.w/2, Game.h/2, 'minecraftia','Level '+level,48);
    this.message_text.anchor.setTo(0.5);
    this.message_text.visible = false;

    //Create Twitter button as invisible, show during win condition to post highscore
    // this.twitter_button = new TwitterButton(this.game);
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;

  },
  setDifficulty: function() {
    if (difficulty === 'easy') {
      limit = 5000;
    }else if (difficulty === 'normal') {
      limit = 3000;
    }else if (difficulty === 'hard') {
      limit = 1500;
    }
  },
  loadLevel: function(level) {
    // if (this.level_loading === true) {
    //   return;
    // }

    if (level === 1) {
      shapes_left=shape_count = 4;
    }else if(level === 2) {
      shapes_left=shape_count = 9;
    }else if(level === 3) {
      shapes_left=shape_count = 16;
    }else if (level === 4) {
      shapes_left=shape_count = 25;
    }

    var bmd = this.makeBox(this.game.width, 30);
    this.count_down = this.game.add.sprite(Game.w/2, 200, bmd);

    this.count_down.anchor.setTo(0.5);
    // this.count_down.limit = 2000;
    this.time_limit = this.game.time.now + limit;

    var ordered_deck = [];
    for(var i = 1;i < 31; i++) {
      ordered_deck.push(i);
    }
    var starter_deck = [];

    while(starter_deck.length < shape_count) {
      var index = Math.floor(Math.random() * ordered_deck.length);
      starter_deck.push(ordered_deck.splice(index, 1)[0]);
     // var choice = rand(1,shape_count); 
     // if (choice.
     // starter_deck.push(choice);
     // console.log(starter_deck);
    }
    console.log(starter_deck);

    //Randomize the order of the shapes and the board
    // this.shapes_deck = this.shuffle(ordered_deck);
    // this.slots_deck = this.shuffle(ordered_deck);

    this.shapes_deck = this.shuffle(starter_deck);
    this.slots_deck = this.shuffle(starter_deck);

    this.board = new Board(this.game, this.slots_deck);
    slots = this.board.slots;
    tiles = this.board.tiles;
    shapes = this.game.add.group();

    //Add Shapes 
    for(var k = 1; k <= shape_count;k++) {
      var shape_x = k*96;
      var shape_y = 100; 

      var shape = new Shape(this.game, shape_x, shape_y, this.shapes_deck[k-1]);
      shape.events.onDragStop.add(this.onDragStop, this);

      shapes.add(shape); 
      this.game.add.tween(shape).to({x: shape.initialX, y: shape.initialY}, 100, Phaser.Easing.Linear.Out, true, 0); //snap in place
    }
    // this.level_loading = false;
  },
  makeBox: function(x,y) {
    var bmd = this.game.add.bitmapData(x, y);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, x, y);
    bmd.ctx.fillStyle = '#fff';
    bmd.ctx.fill();
    return bmd;
  },
  shuffle:  function(deck){
    var tmp_deck = deck.slice();

    var result = []; 
    while (tmp_deck.length > 0) {  
      var index = Math.floor(Math.random() * tmp_deck.length);
      result.push(tmp_deck.splice(index, 1)[0]);
    }
    return result;
  },
  onDragStop:  function(shape, pointer) {

    var slot,title;

    for(var i=0; i < slots.length;i++) {
      if (slots.children[i].frame === shape.frame){
        slot = slots.children[i];
        tile = tiles.children[i];
        break;
      }
    }

    boundsShape = shape.getBounds();
    boundsSlot = slot.getBounds();
    if (Phaser.Rectangle.intersects(boundsShape, boundsSlot)) {
      this.scoreSnd.play();
      this.game.add.tween(shape).to({x: slot.initialX, y: slot.initialY}, 50, Phaser.Easing.Linear.Out, true, 0); //snap in place
      tile.tint = 0xffff00;

      shape.input.enableDrag(false);
      shape.inputEnabled = false;
      shape.inSlot = true;
      shapes_left -= 1;
      //Don't let the time bonus stack too high
      // this.time_limit += 2000;
      // if (this.time_limit > this.game.time.now + 2000) {
      //   this.time_limit = this.game.time.now + 2000;
      // }

      // this.time_limit = this.game.time.now + 2000;
      this.time_limit = this.game.time.now + limit;
      //Reposition Stack
      var position = 0;
      for(var i=0; i < shapes.length;i++) {
        var s = shapes.children[i];
        if ((s.frame !== shape.frame) && (s.inSlot === false)) {
          s.initialX = 100+position*96;
          this.game.add.tween(s).to({x: s.initialX}, 50, Phaser.Easing.Linear.Out, true, 0);
          position += 1;
        }
      }
    }else {
      //Put Piece Back
      this.failSnd.play();
      this.game.add.tween(shape).to({x: shape.initialX, y: shape.initialY}, 200, Phaser.Easing.Linear.Out, true, 0);
    }


  },
  update: function() {

    if (this.game.input.activePointer.isUp) {
      this.holding_pointer = false;
    }

     if (level === 5) {
        this.message_screen.visible = true;
        this.twitterButton.visible = true;
        this.message_text.visible = true;
        this.message_text.setText("You WIN! With "+retries+" retries.\nDifficulty "+difficulty+"\nClick To Play Again!");

      //Play Again?
      if (this.game.input.activePointer.isDown && this.holding_pointer === false) {
        level = 1;
        this.game.state.start('Menu');
      }

     }else if (this.showing_message === true) {
      if (this.game.input.activePointer.isDown && this.holding_pointer === false) {
        this.holding_pointer = true;
        this.showing_message = false;
        this.level_loaded = false;
        this.message_text.visible = false;
      }else {
        var msg = '';
        if (this.winning === false) {
          msg = "Try Again?";
        }
        this.message_screen.visible = true;
        this.message_text.setText(msg+"\nLevel "+level+"\nClick To Start!");
        this.message_text.visible = true;
      }
    }else {
      if (this.level_loaded === false) {
        this.loadLevel(level);
        this.level_loaded = true;
      }
      if (this.game.time.now > this.time_limit) {
        if (difficulty === 'easy' || difficulty === 'normal') {
          adjustDifficulty += 1;
          if (adjustDifficulty === 3) {
            limit += 1000;
            adjustDifficulty = 0;
          }
        } 
        retries += 1;


        this.winning = false;
        this.lostSnd.play();
        this.game.plugins.ScreenShake.start(40);
        this.holding_pointer = true;
        // this.game_timer = this.game.time.now+ 2000;
        shape_count=shapes_left = 25;
        this.level_loaded = false;
        this.showing_message = true;
        this.resetGame();
        // this.game.state.start('Menu');
      }

      if (shapes_left === 0) {
        console.log('YOU WIN');
        this.winning = true;
        // this.game_timer = this.game.time.now + 2000;
        level += 1;
        this.level_loaded = false;
        this.showing_message = true;
        this.setDifficulty();
        this.resetGame();
      }

      this.count_down.scale.x = (this.time_limit - this.game.time.now)/limit;

      // console.log(this.game.time.now +'/'+this.time_limit);
      if (this.count_down.scale.x > 0.7) {
        this.count_down.tint = 0x00ff00;
      }else if (this.count_down.scale.x > 0.3) {
        this.count_down.tint = 0xffff00;
      }else if (this.count_down.scale.x > 0) {
        this.count_down.tint = 0xff0000;
      }

    }


    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  resetGame: function() {
    this.count_down.kill();
    tiles.forEach(function(tile) {
      tile.kill();
    });
    shapes.forEach(function(shape) {
      shape.kill();
    });
    slots.forEach(function(slot) {
      slot.kill();
    });
  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/prefectionist/'; 
    // var game_url = 'http://rantt.itch.io/prefectionist'; 
    var twitter_name = 'rantt_';
    // var tags = ['onegameaweek'];
    var tags = [''];
    window.open('http://twitter.com/share?text=I+beat+PREfectionist+on+'+difficulty+'+mode+with+'+retries+'+retries+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');


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
  render: function() {
    game.debug.text('limit' + limit, 32, 96);
  }

};

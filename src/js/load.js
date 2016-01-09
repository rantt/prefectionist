//768x1024 px

var Game = {
  w: 768,
  h: 1024 
};

Game.Boot = function(game) {
  this.game = game;
};

Game.Boot.prototype = {
  preload: function() {
    // console.log('blah'+Game.w);
		// this.game.stage.backgroundColor = '#FFF';
		// this.game.stage.backgroundColor = '#dcdcdc';
		this.game.stage.backgroundColor = '#213D5E';
		this.game.load.image('loading', 'assets/images/loading.png');
		this.game.load.image('title', 'assets/images/title.png');
		this.game.load.image('instructions', 'assets/images/instructions.png');
    this.game.load.bitmapFont('minecraftia', 'assets/fonts/font.png', 'assets/fonts/font.xml'); //load default font


    //Scale Image to Fit Window
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.maxHeight = window.innerHeight;
    this.game.scale.maxWidth = window.innerHeight*(Game.w/Game.h);

  },
  create: function() {
   this.game.state.start('Load');
  }
};

Game.Load = function(game) {
  this.game = game;
};

Game.Load.prototype = {
  preload: function() {
    
    //Debug Plugin
    // this.game.add.plugin(Phaser.Plugin.Debug);
    
    var screenShake = this.game.plugins.add(Phaser.Plugin.ScreenShake);
    this.game.plugins.ScreenShake = screenShake;

    //Loading Screen Message/bar
    var loadingText = this.game.add.text(Game.w, Game.h, 'Loading...', { font: '30px Helvetica', fill: '#000' });
  	loadingText.anchor.setTo(0.5, 0.5);
  	var preloading = this.game.add.sprite(Game.w/2-64, Game.h/2+50, 'loading');
  	this.game.load.setPreloadSprite(preloading);

    this.game.load.atlasXML('shapes', 'assets/images/shapes.png','assets/atlas/shapes.xml'); 
    this.game.load.atlasXML('startbtn', 'assets/images/startbtn.png','assets/atlas/startbtn.xml'); 

    //Load button for twitter
    this.game.load.image('twitter','assets/images/twitter.png');
    this.game.load.image('easy','assets/images/easy.png');
    this.game.load.image('normal','assets/images/normal.png');
    this.game.load.image('hard','assets/images/hard.png');

    // Music Track
    // this.game.load.audio('music','soundtrack.mp3');
    this.game.load.audio('score', 'assets/audio/score.wav');
    this.game.load.audio('fail', 'assets/audio/fail.wav');
    this.game.load.audio('lost', 'assets/audio/lost.wav');

  },
  create: function() {
    this.game.state.start('Menu');
  }
};

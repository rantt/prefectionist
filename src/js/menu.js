/*global Game*/


difficulty = 'normal';

Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {
        
        this.game.stage.backgroundColor = '#192331';
        this.titleText = this.game.add.bitmapText(Game.w/2, Game.h/2-100, 'minecraftia', "PREfectionist", 64 );
        this.titleText.anchor.setTo(0.5);
        this.titleText.tint = 0xffff00;

        this.game.add.tween(this.titleText)
          .to( {angle: 15}, 1000, Phaser.Easing.Linear.In)
          .to( {angle: -15}, 1000, Phaser.Easing.Linear.In)
          .start();
        this.difficultyButtons = this.game.add.group()

        this.easyButton = this.game.add.button(Game.w/2, Game.h/2+75,'easy', this.difficultySelect, this); 
        this.easyButton.anchor.setTo(0.5);
        this.difficultyButtons.add(this.easyButton);


        this.normalButton = this.game.add.button(Game.w/2, Game.h/2+110,'normal', this.difficultySelect, this); 
        this.normalButton.anchor.setTo(0.5);
        this.normalButton.tint = 0xffff00;
        this.difficultyButtons.add(this.normalButton);

        this.hardButton = this.game.add.button(Game.w/2, Game.h/2+155,'hard', this.difficultySelect, this); 
        this.hardButton.anchor.setTo(0.5);

        this.difficultyButtons.add(this.hardButton);

        // Start Message
        this.startButton = this.game.add.button(Game.w/2, Game.h/2+220,'startbtn', this.begin, this,1); 
        this.startButton.anchor.setTo(0.5);

    },
    begin: function() {
        this.game.state.start('Play');
    },
    difficultySelect: function(button) {
      this.difficultyButtons.forEach(function(btn) {
        btn.tint = 0xffffff;
      });
      button.tint = 0xffff00;
      difficulty = button.key

      console.log(button);
    }, 
    makeButton: function(x,y,text) {
      var bmd = this.game.add.bitmapData(x, y);
      bmd.ctx.beginPath();
      bmd.ctx.rect(0, 0, x, y);
      bmd.ctx.fillStyle = '#000';
      bmd.ctx.fill();
      return bmd;
    },
};

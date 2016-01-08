var TwitterButton = function(game) {
  // this.game = game

  // Phaser.Button.call(this, game, game.world.centerX, game.world.centerY + 200,'twitter', this.sendMsg(), this, 0, 0, 0);
  // Phaser.Button.call(this, this.game, this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.sendMsg(), this, 0, 0, 0);
  Phaser.Button.call(this, game, game.world.centerX, game.world.centerY + 200,'twitter');
  console.log(this); 
  // Phaser.Button.call(this, game, Game.w/2, Game.h/2,'twitter');
  // this.anchor.set(0.5);
  // this.visible = true;
};


TwitterButton.prototype = Object.create(Phaser.Button.prototype);

TwitterButton.prototype.sendMsg = function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/GAMETITLE/'; 
    var twitter_name = 'rantt_';
    var tags = ['1GAM'];

    window.open('http://twitter.com/share?text=My+best+score+is+'+score+'+playing+GAME+TITLE+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');

};

TwitterButton.prototype.constructor = TwitterButton;

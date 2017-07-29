cc.Class({
    extends: cc.Component,

    properties: {
        background: {
            default: null,
            type: cc.Node
        },
        btn_start: {
            default: null,
            type: cc.Node
        },
        gameoverLayer: {
           default: null,
           type: cc.Layout
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        lifeLabel: {
            default: null,
            type: cc.Label
        },
        pauseLabel: {
          default: null,
          type: cc.Label
        },
        candies: {
          default: [],
          type: cc.Prefab
        },
        candyLayer: {
          default: null,
          type: cc.Layout
        },
        eat_candyAudio: {
          default: null,
          url: cc.AudioClip
        },
        splashAudio: {
          default: null,
          url: cc.AudioClip
        },
        tempomin: 0,
        tempomax: 0,
        score: 0,
        maxLife: 0,
        maxCandy: 0,
        isLaunch: false,
        audioControl: true
    },
 
    // use this for initialization
    onLoad: function () {
        var candiesCount = 0;
        var delta = 0;
        
        var self = this;
        
        self.scheduleOnce(function(){
            this.candiesCount = 0;
            self.initGame();
        }, 1);
        
        self.node.on('candy_die', function(event){
            
            self.addScore(1);
            candiesCount--;
            if(self.audioControl === true){
                cc.audioEngine.playEffect(self.eat_candyAudio, false);
            }
        }, self);
        
        this.candyLayer.node.setContentSize(this.background.width, this.background.height);
        
        this.btn_start.setPositionX(1000);
    },
    
    onPause: function()
    {
       if(cc.director.isPaused()){
           cc.director.resume();
           this.pauseLabel.node.active = false;
       }else{
           cc.director.pause();
           this.pauseLabel.node.active = true;
       }
    },
    
    gameOver: function()
    {
       if(this.life ===0 ){
           this.isLaunch = false;
           this.gameoverLayer.node.active = true;
           
           this.btn_start.setPositionX(0);
           
           this.candyLayer.node.stopAllActions();
           this.candyLayer.node.removeAllChildren();
           
       }else{
           if(this.audioControl === true){
                cc.audioEngine.playEffect(this.splashAudio, false);
           }
           this.life--;
           this.lifeLabel.string = "x" + this.life;
       }
    },
    
    initGame: function(){
        this.life = this.maxLife;
        
        this.score = 0;
        this.lifeLabel.string = "x" + this.life;
        
        this.isLaunch = true;
    },

    spawCandy: function(dt){
      //var delta; 
        
      if(this.isLaunch === false){
          return;
      }  
      
      if(this.candiesCount > this.maxCandy){
          return;
      }
      
      this.delta += dt;
      if(this.delta < 1){
          return;
      }
      
      this.delta =0;
      
      var candyLayer = this.candyLayer.node;
      
      var winsize = candyLayer.getContentSize();
      
      var candiesAmount = this.candies.length - 1;
      
      //var candy = cc.instantiate(this.candies[0]);
      var candy = cc.instantiate(this.candies[Math.ceil(candiesAmount * cc.random0To1())]);
      
      candy.setPosition(this.newCandyPosition());
      
      var tempo = cc.random0To1() * this.tempomax + this.tempomin;
      
      var self = this;
      
      var moveby = cc.moveBy(tempo, 0, -winsize.height-30);
      
      var sequence = cc.sequence(moveby, 
                                cc.removeSelf(true), 
                                cc.callFunc(function() {self._candiesCount--;}, self),
                                cc.callFunc(function() {self.gameOver();}, self));
      
      candy.runAction(sequence);
      
      candyLayer.addChild(candy);
      
      this.candiesCount++;
      
    },

    newCandyPosition: function(){
        var winsize = this.candyLayer.node.getContentSize();
        
        var x = winsize.width * cc.random0To1();
        
        var y = winsize.height - 100;
        
        return cc.p(x, y);
    },

    addScore: function(newScore)
    {
      this.score += newScore;
      
      this.scoreLabel.string = this.score.toString();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt){
        this.spawCandy(dt);     
    },
});

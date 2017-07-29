cc.Class({
    extends: cc.Component,

    

    // use this for initialization
    onLoad: function () {
        cc.director.preloadScene('Game');
        
        this.node.on('touchend', function(){
            cc.audioEngine.stopAll();
            cc.director.loadScene('Game');
        });
        
        var audioUrl = cc.url.raw("Audio/bg-sound.mp3");
        cc.audioEngine.playEffect(audioUrl, true, 0.1);
        
    },

});

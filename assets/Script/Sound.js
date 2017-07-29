cc.Class({
    extends: cc.Component,

    properties: {
        sound_on: {
            default: null,
            type: cc.Sprite
        },
        sound_off: {
            default: null,
            type: cc.Sprite
        }
    },

    // use this for initialization
    onLoad: function () {
        this.soundOn();
        this.soundOff();
    },
    
    soundOn: function(){
        var self = this.sound_on;
        this.sound_on.node.on('touchend', function(){
            self.node.setPositionX(1000);
            cc.audioEngine.pauseAll();
            
            self.node.parent.parent.getComponent('Game').audioControl = false;
            
        });
    },
    soundOff: function(){
        var self = this.sound_on;
        this.sound_off.node.on('touchend', function(){
            self.node.setPositionX(0);
            cc.audioEngine.resumeAll();
            
            self.node.parent.parent.getComponent('Game').audioControl = true;
        });
    },
});

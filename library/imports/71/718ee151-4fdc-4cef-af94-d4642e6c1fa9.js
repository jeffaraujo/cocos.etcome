"use strict";
cc._RF.push(module, '718eeFRT9xM76+U1GQubB+p', 'Sound');
// Script/Sound.js

'use strict';

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
    onLoad: function onLoad() {
        this.soundOn();
        this.soundOff();
    },

    soundOn: function soundOn() {
        var self = this.sound_on;
        this.sound_on.node.on('touchend', function () {
            self.node.setPositionX(1000);
            cc.audioEngine.pauseAll();

            self.node.parent.parent.getComponent('Game').audioControl = false;
        });
    },
    soundOff: function soundOff() {
        var self = this.sound_on;
        this.sound_off.node.on('touchend', function () {
            self.node.setPositionX(0);
            cc.audioEngine.resumeAll();

            self.node.parent.parent.getComponent('Game').audioControl = true;
        });
    }
});

cc._RF.pop();
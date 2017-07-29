"use strict";
cc._RF.push(module, '757afOpnFxCY5IXar2sJu+v', 'btn_Iniciar');
// Script/btn_Iniciar.js

'use strict';

cc.Class({
    extends: cc.Component,

    // use this for initialization
    onLoad: function onLoad() {
        cc.director.preloadScene('Game');

        this.node.on('touchend', function () {
            cc.audioEngine.stopAll();
            cc.director.loadScene('Game');
        });

        var audioUrl = cc.url.raw("Audio/bg-sound.mp3");
        cc.audioEngine.playEffect(audioUrl, true, 0.1);
    }

});

cc._RF.pop();
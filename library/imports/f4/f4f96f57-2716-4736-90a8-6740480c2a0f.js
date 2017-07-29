"use strict";
cc._RF.push(module, 'f4f969XJxZHNpCoZ0BIDCoP', 'Candy');
// Script/Candy.js

'use strict';

cc.Class({
    extends: cc.Component,

    // use this for initialization
    onLoad: function onLoad() {
        this.node.on('touchend', function () {
            this.node.dispatchEvent(new cc.Event.EventCustom('candy_die', true));
            this.node.removeFromParent();
        }, this);
    }

});

cc._RF.pop();
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Candy":[function(require,module,exports){
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
},{}],"Game":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'cf481Ep8LNDbZmaWqZlxEmf', 'Game');
// Script/Game.js

"use strict";

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
    onLoad: function onLoad() {
        var candiesCount = 0;
        var delta = 0;

        var self = this;

        self.scheduleOnce(function () {
            this.candiesCount = 0;
            self.initGame();
        }, 1);

        self.node.on('candy_die', function (event) {

            self.addScore(1);
            candiesCount--;
            if (self.audioControl === true) {
                cc.audioEngine.playEffect(self.eat_candyAudio, false);
            }
        }, self);

        this.candyLayer.node.setContentSize(this.background.width, this.background.height);

        this.btn_start.setPositionX(1000);
    },

    onPause: function onPause() {
        if (cc.director.isPaused()) {
            cc.director.resume();
            this.pauseLabel.node.active = false;
        } else {
            cc.director.pause();
            this.pauseLabel.node.active = true;
        }
    },

    gameOver: function gameOver() {
        if (this.life === 0) {
            this.isLaunch = false;
            this.gameoverLayer.node.active = true;

            this.btn_start.setPositionX(0);

            this.candyLayer.node.stopAllActions();
            this.candyLayer.node.removeAllChildren();
        } else {
            if (this.audioControl === true) {
                cc.audioEngine.playEffect(this.splashAudio, false);
            }
            this.life--;
            this.lifeLabel.string = "x" + this.life;
        }
    },

    initGame: function initGame() {
        this.life = this.maxLife;

        this.score = 0;
        this.lifeLabel.string = "x" + this.life;

        this.isLaunch = true;
    },

    spawCandy: function spawCandy(dt) {
        //var delta; 

        if (this.isLaunch === false) {
            return;
        }

        if (this.candiesCount > this.maxCandy) {
            return;
        }

        this.delta += dt;
        if (this.delta < 1) {
            return;
        }

        this.delta = 0;

        var candyLayer = this.candyLayer.node;

        var winsize = candyLayer.getContentSize();

        var candiesAmount = this.candies.length - 1;

        //var candy = cc.instantiate(this.candies[0]);
        var candy = cc.instantiate(this.candies[Math.ceil(candiesAmount * cc.random0To1())]);

        candy.setPosition(this.newCandyPosition());

        var tempo = cc.random0To1() * this.tempomax + this.tempomin;

        var self = this;

        var moveby = cc.moveBy(tempo, 0, -winsize.height - 30);

        var sequence = cc.sequence(moveby, cc.removeSelf(true), cc.callFunc(function () {
            self._candiesCount--;
        }, self), cc.callFunc(function () {
            self.gameOver();
        }, self));

        candy.runAction(sequence);

        candyLayer.addChild(candy);

        this.candiesCount++;
    },

    newCandyPosition: function newCandyPosition() {
        var winsize = this.candyLayer.node.getContentSize();

        var x = winsize.width * cc.random0To1();

        var y = winsize.height - 100;

        return cc.p(x, y);
    },

    addScore: function addScore(newScore) {
        this.score += newScore;

        this.scoreLabel.string = this.score.toString();
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this.spawCandy(dt);
    }
});

cc._RF.pop();
},{}],"Sound":[function(require,module,exports){
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
},{}],"btn_Iniciar":[function(require,module,exports){
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
},{}]},{},["Candy","Game","Sound","btn_Iniciar"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvQ2FuZHkuanMiLCJhc3NldHMvU2NyaXB0L0dhbWUuanMiLCJhc3NldHMvU2NyaXB0L1NvdW5kLmpzIiwiYXNzZXRzL1NjcmlwdC9idG5fSW5pY2lhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDSTs7QUFHQTtBQUNBO0FBQ0k7QUFDRztBQUNBO0FBQ0Y7QUFDSjs7QUFWSTs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7QUFDSTtBQUNJO0FBQ0E7QUFGUTtBQUlaO0FBQ0k7QUFDQTtBQUZPO0FBSVg7QUFDRztBQUNBO0FBRlk7QUFJZjtBQUNJO0FBQ0E7QUFGUTtBQUlaO0FBQ0k7QUFDQTtBQUZPO0FBSVg7QUFDRTtBQUNBO0FBRlU7QUFJWjtBQUNFO0FBQ0E7QUFGTztBQUlUO0FBQ0U7QUFDQTtBQUZVO0FBSVo7QUFDRTtBQUNBO0FBRmM7QUFJaEI7QUFDRTtBQUNBO0FBRlc7QUFJYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQS9DUTs7QUFrRFo7QUFDQTtBQUNJO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKOztBQUVEOztBQUVBO0FBQ0g7O0FBRUQ7QUFFRztBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNIOztBQUVEO0FBRUc7QUFDSTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFFSDtBQUNHO0FBQ0s7QUFDSjtBQUNEO0FBQ0E7QUFDSDtBQUNIOztBQUVEO0FBQ0k7O0FBRUE7QUFDQTs7QUFFQTtBQUNIOztBQUVEO0FBQ0U7O0FBRUE7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBRWtEO0FBQXNCO0FBQ3RCO0FBQWlCOztBQUVuRTs7QUFFQTs7QUFFQTtBQUVEOztBQUVEO0FBQ0k7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUVFOztBQUVBO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7QUEzTEk7Ozs7Ozs7Ozs7QUNBVDtBQUNJOztBQUVBO0FBQ0k7QUFDSTtBQUNBO0FBRk07QUFJVjtBQUNJO0FBQ0E7QUFGTztBQUxIOztBQVdaO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0k7QUFDQTs7QUFFQTtBQUVIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBOztBQUVBO0FBQ0g7QUFDSjtBQXRDSTs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBSUE7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFFSDs7QUFqQkkiLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gIFxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2NhbmR5X2RpZScsIHRydWUpKTtcclxuICAgICAgICAgICB0aGlzLm5vZGUucmVtb3ZlRnJvbVBhcmVudCgpOyBcclxuICAgICAgICB9LCB0aGlzKTtcclxuICAgIH0sXHJcblxyXG4gICAgXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYnRuX3N0YXJ0OiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdhbWVvdmVyTGF5ZXI6IHtcclxuICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgIHR5cGU6IGNjLkxheW91dFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NvcmVMYWJlbDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGlmZUxhYmVsOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwYXVzZUxhYmVsOiB7XHJcbiAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgdHlwZTogY2MuTGFiZWxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNhbmRpZXM6IHtcclxuICAgICAgICAgIGRlZmF1bHQ6IFtdLFxyXG4gICAgICAgICAgdHlwZTogY2MuUHJlZmFiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5keUxheWVyOiB7XHJcbiAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgdHlwZTogY2MuTGF5b3V0XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlYXRfY2FuZHlBdWRpbzoge1xyXG4gICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzcGxhc2hBdWRpbzoge1xyXG4gICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZW1wb21pbjogMCxcclxuICAgICAgICB0ZW1wb21heDogMCxcclxuICAgICAgICBzY29yZTogMCxcclxuICAgICAgICBtYXhMaWZlOiAwLFxyXG4gICAgICAgIG1heENhbmR5OiAwLFxyXG4gICAgICAgIGlzTGF1bmNoOiBmYWxzZSxcclxuICAgICAgICBhdWRpb0NvbnRyb2w6IHRydWVcclxuICAgIH0sXHJcbiBcclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNhbmRpZXNDb3VudCA9IDA7XHJcbiAgICAgICAgdmFyIGRlbHRhID0gMDtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2VsZi5zY2hlZHVsZU9uY2UoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdGhpcy5jYW5kaWVzQ291bnQgPSAwO1xyXG4gICAgICAgICAgICBzZWxmLmluaXRHYW1lKCk7XHJcbiAgICAgICAgfSwgMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2VsZi5ub2RlLm9uKCdjYW5keV9kaWUnLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzZWxmLmFkZFNjb3JlKDEpO1xyXG4gICAgICAgICAgICBjYW5kaWVzQ291bnQtLTtcclxuICAgICAgICAgICAgaWYoc2VsZi5hdWRpb0NvbnRyb2wgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdChzZWxmLmVhdF9jYW5keUF1ZGlvLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBzZWxmKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNhbmR5TGF5ZXIubm9kZS5zZXRDb250ZW50U2l6ZSh0aGlzLmJhY2tncm91bmQud2lkdGgsIHRoaXMuYmFja2dyb3VuZC5oZWlnaHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYnRuX3N0YXJ0LnNldFBvc2l0aW9uWCgxMDAwKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uUGF1c2U6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgIGlmKGNjLmRpcmVjdG9yLmlzUGF1c2VkKCkpe1xyXG4gICAgICAgICAgIGNjLmRpcmVjdG9yLnJlc3VtZSgpO1xyXG4gICAgICAgICAgIHRoaXMucGF1c2VMYWJlbC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgY2MuZGlyZWN0b3IucGF1c2UoKTtcclxuICAgICAgICAgICB0aGlzLnBhdXNlTGFiZWwubm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgZ2FtZU92ZXI6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgIGlmKHRoaXMubGlmZSA9PT0wICl7XHJcbiAgICAgICAgICAgdGhpcy5pc0xhdW5jaCA9IGZhbHNlO1xyXG4gICAgICAgICAgIHRoaXMuZ2FtZW92ZXJMYXllci5ub2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgdGhpcy5idG5fc3RhcnQuc2V0UG9zaXRpb25YKDApO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgIHRoaXMuY2FuZHlMYXllci5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XHJcbiAgICAgICAgICAgdGhpcy5jYW5keUxheWVyLm5vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICBcclxuICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgIGlmKHRoaXMuYXVkaW9Db250cm9sID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5zcGxhc2hBdWRpbywgZmFsc2UpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLmxpZmUtLTtcclxuICAgICAgICAgICB0aGlzLmxpZmVMYWJlbC5zdHJpbmcgPSBcInhcIiArIHRoaXMubGlmZTtcclxuICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuICAgIGluaXRHYW1lOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMubGlmZSA9IHRoaXMubWF4TGlmZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLmxpZmVMYWJlbC5zdHJpbmcgPSBcInhcIiArIHRoaXMubGlmZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmlzTGF1bmNoID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgc3Bhd0NhbmR5OiBmdW5jdGlvbihkdCl7XHJcbiAgICAgIC8vdmFyIGRlbHRhOyBcclxuICAgICAgICBcclxuICAgICAgaWYodGhpcy5pc0xhdW5jaCA9PT0gZmFsc2Upe1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9ICBcclxuICAgICAgXHJcbiAgICAgIGlmKHRoaXMuY2FuZGllc0NvdW50ID4gdGhpcy5tYXhDYW5keSl7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHRoaXMuZGVsdGEgKz0gZHQ7XHJcbiAgICAgIGlmKHRoaXMuZGVsdGEgPCAxKXtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdGhpcy5kZWx0YSA9MDtcclxuICAgICAgXHJcbiAgICAgIHZhciBjYW5keUxheWVyID0gdGhpcy5jYW5keUxheWVyLm5vZGU7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgd2luc2l6ZSA9IGNhbmR5TGF5ZXIuZ2V0Q29udGVudFNpemUoKTtcclxuICAgICAgXHJcbiAgICAgIHZhciBjYW5kaWVzQW1vdW50ID0gdGhpcy5jYW5kaWVzLmxlbmd0aCAtIDE7XHJcbiAgICAgIFxyXG4gICAgICAvL3ZhciBjYW5keSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FuZGllc1swXSk7XHJcbiAgICAgIHZhciBjYW5keSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FuZGllc1tNYXRoLmNlaWwoY2FuZGllc0Ftb3VudCAqIGNjLnJhbmRvbTBUbzEoKSldKTtcclxuICAgICAgXHJcbiAgICAgIGNhbmR5LnNldFBvc2l0aW9uKHRoaXMubmV3Q2FuZHlQb3NpdGlvbigpKTtcclxuICAgICAgXHJcbiAgICAgIHZhciB0ZW1wbyA9IGNjLnJhbmRvbTBUbzEoKSAqIHRoaXMudGVtcG9tYXggKyB0aGlzLnRlbXBvbWluO1xyXG4gICAgICBcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICBcclxuICAgICAgdmFyIG1vdmVieSA9IGNjLm1vdmVCeSh0ZW1wbywgMCwgLXdpbnNpemUuaGVpZ2h0LTMwKTtcclxuICAgICAgXHJcbiAgICAgIHZhciBzZXF1ZW5jZSA9IGNjLnNlcXVlbmNlKG1vdmVieSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MucmVtb3ZlU2VsZih0cnVlKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuY2FsbEZ1bmMoZnVuY3Rpb24oKSB7c2VsZi5fY2FuZGllc0NvdW50LS07fSwgc2VsZiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuY2FsbEZ1bmMoZnVuY3Rpb24oKSB7c2VsZi5nYW1lT3ZlcigpO30sIHNlbGYpKTtcclxuICAgICAgXHJcbiAgICAgIGNhbmR5LnJ1bkFjdGlvbihzZXF1ZW5jZSk7XHJcbiAgICAgIFxyXG4gICAgICBjYW5keUxheWVyLmFkZENoaWxkKGNhbmR5KTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMuY2FuZGllc0NvdW50Kys7XHJcbiAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBuZXdDYW5keVBvc2l0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciB3aW5zaXplID0gdGhpcy5jYW5keUxheWVyLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgeCA9IHdpbnNpemUud2lkdGggKiBjYy5yYW5kb20wVG8xKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHkgPSB3aW5zaXplLmhlaWdodCAtIDEwMDtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gY2MucCh4LCB5KTtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkU2NvcmU6IGZ1bmN0aW9uKG5ld1Njb3JlKVxyXG4gICAge1xyXG4gICAgICB0aGlzLnNjb3JlICs9IG5ld1Njb3JlO1xyXG4gICAgICBcclxuICAgICAgdGhpcy5zY29yZUxhYmVsLnN0cmluZyA9IHRoaXMuc2NvcmUudG9TdHJpbmcoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KXtcclxuICAgICAgICB0aGlzLnNwYXdDYW5keShkdCk7ICAgICBcclxuICAgIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHNvdW5kX29uOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc291bmRfb2ZmOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNvdW5kT24oKTtcclxuICAgICAgICB0aGlzLnNvdW5kT2ZmKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzb3VuZE9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcy5zb3VuZF9vbjtcclxuICAgICAgICB0aGlzLnNvdW5kX29uLm5vZGUub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgc2VsZi5ub2RlLnNldFBvc2l0aW9uWCgxMDAwKTtcclxuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGF1c2VBbGwoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNlbGYubm9kZS5wYXJlbnQucGFyZW50LmdldENvbXBvbmVudCgnR2FtZScpLmF1ZGlvQ29udHJvbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzb3VuZE9mZjogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXMuc291bmRfb247XHJcbiAgICAgICAgdGhpcy5zb3VuZF9vZmYubm9kZS5vbigndG91Y2hlbmQnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBzZWxmLm5vZGUuc2V0UG9zaXRpb25YKDApO1xyXG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5yZXN1bWVBbGwoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNlbGYubm9kZS5wYXJlbnQucGFyZW50LmdldENvbXBvbmVudCgnR2FtZScpLmF1ZGlvQ29udHJvbCA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG59KTtcclxuIiwiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IucHJlbG9hZFNjZW5lKCdHYW1lJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BBbGwoKTtcclxuICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdHYW1lJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGF1ZGlvVXJsID0gY2MudXJsLnJhdyhcIkF1ZGlvL2JnLXNvdW5kLm1wM1wiKTtcclxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KGF1ZGlvVXJsLCB0cnVlLCAwLjEpO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9
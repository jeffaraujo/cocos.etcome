cc.Class({
    extends: cc.Component,

  
    // use this for initialization
    onLoad: function () {
        this.node.on('touchend', function(){
           this.node.dispatchEvent(new cc.Event.EventCustom('candy_die', true));
           this.node.removeFromParent(); 
        }, this);
    },

    
});

cc.Class({
    extends: cc.Component,

    properties: {
        speedY: cc.Integer,
        count: 0,
        speedX: cc.Integer,
        bulletShow: true
    },

    // use this for initialization
    onLoad: function () {
    },
    //碰撞检测
    onCollisionEnter: function(other, self){
        // this.bulletGroup.destroyBullet(self.node);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.count += dt;
        let delay = this.node.parent.getComponent('bulletG').delay;
        if(delay <= this.count){
            if(this.bulletShow){
                this.node.opacity = 255;
            }else{
                this.node.opacity = 0;
            }
            this.node.y -= dt * this.speedY;
            this.node.x += dt * this.speedX;
        }
    },
});

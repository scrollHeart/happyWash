
cc.Class({
	extends: cc.Component,

	properties: {
		speedMax: 0,
		speedMin: 0,		
		score: {
			default: 0,
			type: cc.Integer
		},
		initSpriteFrame: {
			default: null,
			type: cc.SpriteFrame
		}
	},
	onLoad () {
		// 速度随机[speedMax, speedMin]
		this.speed = Math.random() * (this.speedMax - this.speedMin + 1) + this.speedMin;
		// 开启碰撞系统
		let manager = cc.director.getCollisionManager();
		manager.enabled = true;
		this.eatInit();
	},
	eatInit() {
		let li = this.node.children;
		let len = li.length;
		for(let i = 0; i < len; i++){
			let nSprite = li[i].getComponent(cc.Sprite);
			nSprite.spriteFrame = this.initSpriteFrame;
		}
	},
	onCollisionEnter (other, self){

		// 可视化销毁节点
		this.eatGroup.particleDestroy(self.node, self.node.group, self.node.name);
		this.onHandleDestroy();
	},
	update (dt){
		this.node.y -= dt * this.speed;
		// //出屏幕后 回收节点
		if (this.node.y < -(this.node.parent.height / 2 + this.node.height / 2)){
			this.eatGroup.destroyEat(this.node);
		}
	},
	onHandleDestroy: function () {
		this.eatGroup.destroyEat(this.node);
	}	
});

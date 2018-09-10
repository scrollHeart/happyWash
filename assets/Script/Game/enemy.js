var Common = require('Common');
cc.Class({
    extends: cc.Component,

    properties: {
        // HP: {
        //     default: 0,
        //     type: cc.Integer,
        //     tooltip: '敌机血量',
        // },
        speedMax: 0,
        speedMin: 0,
        initSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: '初始化图像'
        },
        monster: {
            default: null,
            type: cc.AudioClip
				},
				roarMusic: {
					default: null,
					type: cc.AudioClip
				}
    },
    onLoad: function () {

        // 速度随机[speedMax, speedMin]
        this.speed = Math.random() * (this.speedMax - this.speedMin + 1) + this.speedMin;
        // 开启碰撞系统
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
				this.enemyInit();
				this.num = 0;
				this.once = 0;
    },
    enemyInit: function () {
        // this.enemyHp = this.HP;
        // 找到node的Sprite组件
        let nSprite = this.node.getComponent(cc.Sprite);
        // 初始化spriteFrame
        if (nSprite.spriteFrame != this.initSpriteFrame){
            nSprite.spriteFrame = this.initSpriteFrame;
        }

    },
    explodingAnim: function () {
			// 播放怪物死掉音效
			cc.audioEngine.play(this.monster);
			// 
			this.onHandleDestroy();
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        
			this.node.y -= dt * this.speed;
			if(this.node.name == 'boss'){

				var actionTo = cc.moveTo(0.5, cc.v2(this.node.x, 300));
				
				let _ul = this.node.children;
				let len = _ul.length;
				let xLen = this.node.parent.width / 2;
				let yLen = this.node.parent.height / 2;
				let eachOn = true;
				
				for(let i = 0; i < len; i++){
					let _li = _ul[i].children;
					_li.forEach(function(item, index, array){
						if(item.x > xLen || item.y > yLen || item.x < -xLen || item.y < -yLen){
						}else{
							eachOn = false;
						}
					})
				}
				if(eachOn){
					this.num++;
					if(this.num < 2){
						this.node.runAction(actionTo);
						// 怪物低吼
						cc.audioEngine.play(this.roarMusic, false);

						for(let i = 0; i < len; i++){
							let _li = _ul[i].children;
							_li.forEach(function(item, index, array){

								item.y = 0;
								item.x = 0;
								item.opacity = 0;
								item.getComponent('bullet').count = 0;
                item.getComponent('bullet').bulletShow = true;
							})
						}

					}
				}

				if(this.node.y < - (this.node.parent.height / 2)){
					this.once++;
					if(this.once < 2){
						Common.commonState.bossShow = 'go';       
					}
				}
			}
			//出屏幕后 回收节点
			if (this.node.y < -(this.node.parent.height / 2 + this.node.height / 2)){
				this.num = 0;
				this.once = 0;
				this.enemyGroup.destroyEnemy(this.node);
			}
		},
		fadeBullet: function (){
			// 遍历到当前屏幕上的子弹，使其消失（透明度为零）
			let _ul = this.node.children;
			let len = _ul.length;
			let xLen = this.node.parent.width / 2;
			let yLen = this.node.parent.height / 2;	

			for(let i = 0; i < len; i++){
				let _li = _ul[i].children;
				_li.forEach(function(item, index, array){
					if(item.opacity == 255){
						if(item.x < xLen || item.y < yLen || item.x > -xLen || item.y > -yLen){
							
							item.getComponent('bullet').bulletShow = false;
						}
					}
				})
			}		
		},
    onHandleDestroy: function () {
			
			// Demo中零时使用，后续要使用对象池，参考bullet
			this.enemyGroup.destroyEnemy(this.node);
    }
});

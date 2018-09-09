var Common = require('Common');
const eatG = cc.Class({
	name: 'eatG',
	properties: {
		name: '',
		prefab: cc.Prefab,	
		freq: 0,
		poolAmount: 0
	}
});
var eatGroup = cc.Class({
	extends: cc.Component,
	properties: {
		eatGroup: {
			default: [],
			type: eatG
		},
		particleGroup: {
			default: null,
			type: cc.Node
		}
	},
	onLoad () {
		Common.batchInitNodePool(this, this.eatGroup);
	},
	// 食物出动
	startAction: function () {
		// 每组食物都需要设置定时器
		for(let i = 0; i < this.eatGroup.length; i++) {
			let groupName = this.eatGroup[i].name;
			let freq = this.eatGroup[i].freq;
			this[groupName] = function (i) {
				if(Common.commonState.bossShow == 'normal'){
					
					this.genNewEat(this.eatGroup[i]);
				}
			}.bind(this, i)
			this.schedule(this[groupName], freq);
		}
	},
	// 生成食物
	genNewEat: function (eatInfo) {
		let poolName = eatInfo.name + 'Pool';
		
		let newNode = Common.genNewNode(this[poolName], eatInfo.prefab, this.node);
		let pos = this.getNewEatPosition(newNode);
		newNode.setPosition(pos);
		newNode.getComponent('eat').eatGroup = this;
		// 初始化食物状态
		newNode.getComponent('eat').eatInit();
	},
	//食物随机生成的位置
	getNewEatPosition: function(newEat) {
	
		//位于上方，先不可见
		let randx = (Math.random() - 0.5) * 2 * (this.node.parent.width / 2 - newEat.width);
		let randy = this.node.parent.height / 2 + newEat.height / 2;

		return cc.v2(randx,randy);
	},
	// 销毁
	destroyEat: function (node) {
		Common.putBackPool(this, node);
	},
	destroyGroup (particleNode, group, name){
		// 可视化销毁 "eatGroup"组节点
		// 1.粒子消散
		this.particleDestroy(particleNode, group, name);
		// 2.节点设为透明
		particleNode.opacity = 0;
		
		let lis = particleNode.parent.children;
		let opArr = lis.filter(function(item){
			return (item.opacity != 0)
		})
		// "eatGroup"组节点全部被吃掉，销毁节点，返回对象池中
		if(opArr.length == 0){
			this.destroyEat(particleNode.parent);
		}
	},
	// 粒子消散
	particleDestroy (particleNode, group,name){
		let parName = name + '_particle';

		let index = this.particleGroup.children.forEach(function(item, index, array){
			
			if(item.name == parName){
				let curX,curY
				switch (group){
					case 'eatGroup':
					curX = particleNode.parent.x + particleNode.x;
					curY = particleNode.parent.y + particleNode.y;
					break;
					case 'eat':
					curX = particleNode.x;
					curY = particleNode.y;
					break;					
				}
				
				item.x = curX;
				item.y = curY;
				item.getComponent(cc.ParticleSystem).resetSystem();
			}			
		})
	}
});

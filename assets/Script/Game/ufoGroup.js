var Common = require('Common');

const ufoG = cc.Class({
  name: 'ufoG',
  properties: {
		name: '',
		prefab: cc.Prefab,
		freq: 0,
		poolAmount: 0
   } 
})
var ufoGroup = cc.Class({
	extends: cc.Component,
	properties: {
		ufoGroup: {
			default: [],
			type: ufoG
		},
		mainScript: {
			default: null,
			type: require('main')
		},
		winMusic: {
			default: null,
			type: cc.AudioClip
		}
	},
	onLoad () {
		Common.batchInitNodePool(this, this.ufoGroup);
		let num = 0,
				numNew = 0;
		let numSchedule = this.schedule(function(){
			numNew = Math.floor(Common.commonState.gameScore/300);
				if(numNew > num){
					// 发放一颗星星	
					for(let i = 0; i < this.ufoGroup.length; i++){
						let groupName = this.ufoGroup[i].name;

						if(groupName == 'star'){
							this.genNewUfo(this.ufoGroup[i]);
						}
					}
					num = numNew;
				}
		}, 2);

		let bossSchedule = this.schedule(function(){
		
			if(Common.commonState.bossShow == 'go'){
				// 播放胜利音乐
				cc.audioEngine.play(this.winMusic, false);
				
				for(let j = 0; j < this.ufoGroup.length; j++){
					let groupName = this.ufoGroup[j].name;

					if(groupName == 'star'){
						for(let i = 0; i < 10; i++){
							this.genNewUfo(this.ufoGroup[j]);
						}
					}else if(groupName == 'heart'){
						for(let i = 0; i < 2; i++){
							this.genNewUfo(this.ufoGroup[j]);
						}
					}else if(groupName == 'mines'){
						for(let i = 0; i < 5; i++){
							this.genNewUfo(this.ufoGroup[j]);
						}							
					}
				}	
				this.scheduleOnce(function(){

					Common.commonState.bossShow = 'normal';
				}, 0.5)					
			}
		}, 1)
	},
	// ufo(加血，炸弹)展现到屏幕
	startAction (){
		for(let i = 0; i < this.ufoGroup.length; i++){
			let groupName = this.ufoGroup[i].name;
			if(groupName != 'star'){

				let freq = this.ufoGroup[i].freq;
				this[groupName] = function (i) {
					if(Common.commonState.bossShow == 'show'){

					}else{
						this.genNewUfo(this.ufoGroup[i]);
					}
				}.bind(this, i)
				this.schedule(this[groupName], freq);
			}
		}
	},
	genNewUfo (ufoInfo){
		let poolName = ufoInfo.name + 'Pool';
		let newNode = Common.genNewNode(this[poolName], ufoInfo.prefab, this.node);
		let pos = this.getNewUfoPosition(newNode);
		newNode.setPosition(pos);
		newNode.getComponent('ufo').ufoGroup = this;
		// 初始化ufo状态
		newNode.getComponent('ufo').ufoInit();
	},
	getNewUfoPosition (newUfo){
		if(Common.commonState.bossShow == 'go'){
			let randx = (Math.random() - 0.5) * 2 * 200;
			let randy = 150;
			return cc.v2(randx,randy);
		}else{

			let randx = (Math.random() - 0.5) * 2 * (this.node.parent.width / 2 - newUfo.width);
			let randy = this.node.parent.height / 2 + newUfo.height / 2;
			return cc.v2(randx,randy);
		}
	},
	// 销毁
	destroyUfo (node){
		Common.putBackPool(this, node);
	}
});

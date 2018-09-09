var Common = require('Common');

const enemyG = cc.Class({
    name: 'enemyG',
    properties: {
        name: '',
        prefab: cc.Prefab,
        freq: 0,
        poolAmount: 0
    }
});

var EnemyGroup = cc.Class({
    extends: cc.Component,
    properties: {
        enemyGroup: {
            default: [],
            type: enemyG,
        },
        mainScript: {
            default: null,
            type: require('main'),
        },
        bossLabel: {
            default: null,
            type: cc.Sprite
        },
        warningMusic: {
            default: null,
            type: cc.AudioClip
        },
        roarMusic: {
            default: null,
            type: cc.AudioClip
        }
    },
    onLoad: function () {
        Common.batchInitNodePool(this, this.enemyGroup);
        let num = 0,
            numNew = 0;
        this.schedule(function(){
			numNew = Math.floor(Common.commonState.gameScore/300);
				if(numNew > num){
					// boss来袭	
					for(let i = 0; i < this.enemyGroup.length; i++){
						let groupName = this.enemyGroup[i].name;
						if(groupName == 'boss'){
                            this.bossLabel.node.opacity = 255;
                            Common.commonState.bossShow = 'show';
                            cc.audioEngine.play(this.warningMusic, false);

                            this.scheduleOnce(function(){
                                this.genNewEnemy(this.enemyGroup[i]);
                                // 怪物低吼
                                cc.audioEngine.play(this.roarMusic, false);
                                this.bossLabel.node.opacity = 0;
                            },1)
						}
					}
					num = numNew;
				}
		}, 2);
    },
    // 敌机出动
    startAction: function () {
        // 每组敌机都需要设置定时器
        for(let i = 0; i < this.enemyGroup.length; i++) {
            let groupName = this.enemyGroup[i].name;
            if(groupName != 'boss'){

                let freq = this.enemyGroup[i].freq;
                this[groupName] = function (i) {
                    this.genNewEnemy(this.enemyGroup[i]);
                }.bind(this, i)
                this.schedule(this[groupName], freq);
            }
        }
    },
    // 生成敌机
    genNewEnemy: function (enemyInfo) {
        let poolName = enemyInfo.name + 'Pool';
        let newNode = Common.genNewNode(this[poolName], enemyInfo.prefab, this.node);
        let pos = this.getNewEnemyPosition(newNode);
        newNode.setPosition(pos);
        newNode.getComponent('enemy').enemyGroup = this;
        // 初始化敌机状态
        newNode.getComponent('enemy').enemyInit();
    },
    //敌机随机生成的位置
    getNewEnemyPosition: function(newEnemy) {
        //位于上方，先不可见
        let randx = (Math.random() - 0.5) * 2 * (this.node.parent.width / 2 - newEnemy.width);
        let randy = this.node.parent.height / 2 + newEnemy.height / 2;
        return cc.v2(randx,randy);
    },
    // 销毁
    destroyEnemy: function (node) {

		for(let i = 0; i < node.children.length; i++){
			let finds = node.children[i].children;
			finds.forEach(function(item, index, array){
                
                item.y = 0;
                item.x = 0;
                item.opacity = 0;
                item.getComponent('bullet').count = 0;
                item.getComponent('bullet').bulletShow = true;
			})
		}        
        Common.putBackPool(this, node);
    }
});

module.exports = EnemyGroup;
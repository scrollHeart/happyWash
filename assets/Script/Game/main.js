var Common = require('Common');
cc.Class({
	extends: cc.Component,
	properties: () =>({
		enemyGroup: {
			default: null,
			type:require('enemyGroup')
		},
		eatGroup: {
			default: null,
			type: require('eatGroup')
		},
		ufoGroup: {
			default: null,
			type: require('ufoGroup')
		},
		hero: {
			default: null,
			type: require('hero')
		},
		scoreDisplay: cc.Label,
		pause: cc.Button,
		pauseSprite: {
			default: [],
			type: cc.SpriteFrame,
			tooltip:'暂停按钮图片组',
		},
		bombAmount: cc.Label,
		// 音频
		gameMusic: {
			default: null,
			url: cc.AudioClip
		},
		selectMusic: {
			default: null,
			url: cc.AudioClip
		},
		disableMusic: {
			default: null,
			url: cc.AudioClip
		},
		gameOverMusic: {
			default: null,
			url: cc.AudioClip
		},
		startMusic: {
			default: null,
			url: cc.AudioClip
		},
		starAmount: cc.Label
	}),   
	onLoad () {
		this.initState();
		this.eatGroup.startAction();
		this.enemyGroup.startAction();
		this.ufoGroup.startAction();
		// 游戏背景音乐
		this.current = cc.audioEngine.play(this.gameMusic, true);
		// 播放开始音效
		cc.audioEngine.play(this.startMusic, false);
	},
	initState () {
		Common.commonState.pauseState = false;
		// 初始化炸弹数量
		this.bombAmount.string = 'x' + String(2);
		Common.commonState.bombAmount = 0;
		// 初始化星星数量
		Common.commonState.starAmount = 0;
		this.setStar();
		Common.commonState.gameScore = 0;
		Common.commonState.bossShow = 'normal';
	},
	setBomb (){
		Common.commonState.bombAmount++;
		let bombAmount = eval(this.bombAmount.string.substr(1)) + 1;
		this.bombAmount.string = 'x' + String(bombAmount);
	},
	setStar (){
		this.starAmount.string = String(Common.commonState.starAmount);
	},
	// 暂停
	handlePause (){
		// 按键音效
		if(Common.commonState.pauseState){
			this.pause.normalSprite = this.pauseSprite[0];
			this.pause.pressedSprite = this.pauseSprite[0];
			this.pause.hoverSprite = this.pauseSprite[0];
			// 开始正在运行的场景
			cc.director.resume();	
			cc.audioEngine.play(this.selectMusic, false);
			// 添加Hero拖拽监听
			this.hero.onDrag();	
			// 恢复播放的所有音频
			cc.audioEngine.resume(this.current);
			
			return Common.commonState.pauseState = !Common.commonState.pauseState;

		}else{

			// 暂停正在运行的场景
			cc.director.pause();
			// 移除Hero拖拽监听
			this.hero.offDrag();
			// 暂停正在播放的所有音频
			cc.audioEngine.pauseAll();
			cc.audioEngine.play(this.selectMusic, false);
	
			this.pause.normalSprite = this.pauseSprite[1];
			this.pause.pressedSprite = this.pauseSprite[1];
			this.pause.hoverSprite = this.pauseSprite[1];		
			return Common.commonState.pauseState = !Common.commonState.pauseState;
		}
	},
	// 使用tnt炸弹
	useBomb (){
		if(!Common.commonState.pauseState){

			cc.audioEngine.play(this.selectMusic, false);
	
			let bombAmount =	parseInt(this.bombAmount.string.substr(1));
	
			if(bombAmount > 0){
				// 把当前的node.children 赋值给一个新的对象
				let enemy = new Array(...this.enemyGroup.node.children);
				
				for(let i = 0; i < enemy.length; i++) {
					if(enemy[i].name == 'shit'){
						enemy[i].getComponent('enemy').explodingAnim();
					}else if(enemy[i].name == 'boss'){
						enemy[i].getComponent('enemy').fadeBullet();
					}
				}
				bombAmount--;
			}
			this.bombAmount.string = 'x' + String(bombAmount);	
		}else{
			cc.audioEngine.play(this.disableMusic, false);
		}
	},
	// 分数
	changeScore: function (score) {
		Common.commonState.gameScore += score;
		this.scoreDisplay.string = Common.commonState.gameScore.toString();
	},	
	// 游戏结束
	gameOver: function () {
		Common.clearAllPool();
		cc.director.loadScene('End');
		Common.commonState.bossShow = 'normal';
		// 播放结束音乐
		cc.audioEngine.play(this.gameOverMusic, false);
	},
	onDestroy: function () {
		cc.audioEngine.stop(this.current);
	}		
});

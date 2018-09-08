var Common = require('Common');
cc.Class({
	extends: cc.Component,

	properties: {
		newScore: {
			default: null,
			type: cc.Label
		},
		newStar: {
			default: null,
			type: cc.Label
		},
		newBomb: {
			default: null,
			type: cc.Label
		},
		restartBtn: {
			default: null,
			type: cc.Button
		},
		gobackBtn: {
			default: null,
			type: cc.Button
		}, 
		selectMusic: {
			default: null,
			url: cc.AudioClip
		}   
	},
	onLoad: function () {
		this.newScore.string = Common.commonState.gameScore ? Common.commonState.gameScore.toString() : '0';
		this.newStar.string = Common.commonState.starAmount ? Common.commonState.starAmount.toString() : '0';
		this.newBomb.string = Common.commonState.bombAmount ? Common.commonState.bombAmount.toString() : '0';
	},
	reStart (){
		cc.audioEngine.play(this.selectMusic, false);
		cc.director.loadScene('Game');
	},
	goBack (){
		cc.audioEngine.play(this.selectMusic, false);
		cc.director.loadScene('Start');
	}
});

cc.Class({
	extends: cc.Component,

	properties: {
		button: {
			default: null,
			type: cc.Button
		},
		// 音频
		selectMusic: {
			default: null,
			type: cc.AudioClip
		}
	},

	// use this for initialization
	onLoad: function () {
		cc.director.preloadScene('Game');
	},
	startGame: function(){
		cc.audioEngine.play(this.selectMusic, false);
		cc.director.loadScene('Game');
	},
	// called every frame
	update: function (dt) {

	},
});

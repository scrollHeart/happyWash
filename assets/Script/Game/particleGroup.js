const particleG = cc.Class({
	name: 'particleG',
	properties: {
		name: '',
		prefab: cc.Prefab
	}
});
cc.Class({
	extends: cc.Component,

	properties: {
		particleGroup: {
			default: [],
			type: particleG
		}		
	},
	onLoad () {
		this.particleInit();	
	},
	particleInit (){
		let parLen = this.particleGroup.length;
		for(let i = 0; i < parLen; i++){
			let node = cc.instantiate(this.particleGroup[i].prefab);
			node.parent = this.node;
			node.setPosition(0, 0);
		}
	},
	start () {

	},

	// update (dt) {},
});

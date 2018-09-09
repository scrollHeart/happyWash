var Common = require('Common');
cc.Class({
  extends: cc.Component,
  properties: () =>({
    mainScript: {
      default: null,
      type: require('main')
    },  
    eatMusic: {
      default: null,
      type: cc.AudioClip
    },
    injuryMusic: {
      default: null,
      type: cc.AudioClip
    },
    hp: {
      default: null,
      type: cc.Node
    },
    blood: {
      default: null,
      type: cc.SpriteFrame
    },
    half: {
      default: null,
      type: cc.SpriteFrame
    },
    empty: {
      default: null,
      type: cc.SpriteFrame
    }
  }),
  onLoad () {
    // 监听拖动事件
    this.onDrag();
    // 获取碰撞检测系统
    let manager = cc.director.getCollisionManager();
    // 开启碰撞检测系统
    manager.enabled = true;  
    this.hpNum = 5;   
  },
  onDrag () {
    this.node.on('touchmove', this.onHandleHeroMove, this);
  },
  // 去掉拖动监听
  offDrag () {
    this.node.off('touchmove', this.onHandleHeroMove, this);
  },
  onHandleHeroMove (event) {
    // touchmove事件中 event.getLocation() 获取当前已左下角为锚点的触点位置（world point）
    let position = event.getLocation();
    // 实际hero是background的子元素，所以坐标应该是随自己的父元素进行的，所以我们要将“world point”转化为“node point”
    let location = this.node.parent.convertToNodeSpaceAR(position);
    this.node.setPosition(location);
  },
  onCollisionEnter (other, self) {
    
    if(other.node.group == 'enemyBullet'){      
      // 碰撞到敌方体内子弹，不做血量计算
      if(other.node.opacity == 0){
        return;
      }
      this.dropBlood(0.5);
      // this.
    }
    if(other.node.group == 'enemy'){

      switch (other.node.name){
        case 'shit':
          this.dropBlood(1);
          break;
        case 'boss':
          this.dropBlood(3);
          break;          
      }
    }
    if(other.node.group == 'ufo'){
      // 若是心❤️，就加血        
      if(other.node.name == 'heart'){
        this.addBlood();
      }
      // 若是炸弹💣，加入到屏幕下方的炸弹库
      if(other.node.name == 'mines'){
        this.mainScript.setBomb();
      }
      if(other.node.name == 'star'){
        Common.commonState.starAmount += 1;
        this.mainScript.setStar();
      }
    }
    if(other.node.group == 'eatGroup'){
      // 消除音效      
      this.current = cc.audioEngine.play(this.eatMusic, false, 0.5);

      // 计算得分
      let groupNode = other.node.parent;
      let score = groupNode.getComponent('eat').score;
      this.mainScript.changeScore(score);
      
    // 可视化销毁 "eatGroup"组节点
      this.mainScript.eatGroup.destroyGroup(other.node, other.node.group, other.node.name);        
    }
  },
  dropBlood: function(reduceHp){
    let _index = 0;
    let half = this.half;
    let empty = this.empty;
    let hpMax = 5;
    let hpMin = 0;
    let decimal = 0;

    this.hpNum = this.hpNum - reduceHp;
    decimal = this.hpNum - Math.floor(this.hpNum);

    if(this.hpNum <= 0){
      this.hp.children.forEach(function(item, index, array){
        item.getComponent(cc.Sprite).spriteFrame = empty;
      })
      this.onHandleDestroy();
      return;
    }else if(this.hpNum < hpMax && this.hpNum > hpMin && decimal != 0.5){
      switch (reduceHp){
        case 0.5:
          _index = this.hpNum;
          this.hp.children[_index].getComponent(cc.Sprite).spriteFrame = empty;
          cc.audioEngine.play(this.injuryMusic, false);

          break;
        case 1:
          _index = this.hpNum;
          this.hp.children[_index].getComponent(cc.Sprite).spriteFrame = empty;
          cc.audioEngine.play(this.injuryMusic, false);
          break;
        case 3:
          for(let i = 0; i < 3; i++){
            _index = this.hpNum + i;
            this.hp.children[_index].getComponent(cc.Sprite).spriteFrame = empty;
          }
          cc.audioEngine.play(this.injuryMusic, false);
          break;
      }
    }else if(this.hpNum < hpMax && this.hpNum > hpMin  && decimal == 0.5){
      switch (reduceHp){
        case 0.5:
          _index = this.hpNum - 0.5;
          this.hp.children[_index].getComponent(cc.Sprite).spriteFrame = half;
          cc.audioEngine.play(this.injuryMusic, false);

          break;
        case 1:
          _index = this.hpNum + 0.5;
          this.hp.children[_index].getComponent(cc.Sprite).spriteFrame = empty;
          this.hp.children[_index - 1].getComponent(cc.Sprite).spriteFrame = half;
          cc.audioEngine.play(this.injuryMusic, false);

          break;
        case 3:
          for(let i = 0; i < 3; i++){
            _index = this.hpNum + i;
            this.hp.children[_index].getComponent(cc.Sprite).spriteFrame = empty;
          }
          this.hp.children[_index - 1].getComponent(cc.Sprite).spriteFrame = half;
          cc.audioEngine.play(this.injuryMusic, false);

          break;
      }
    }
  },
  addBlood: function(){
    // _index: ❤️的索引值, decimal: 小数部分
    let _index = 0, decimal = 0;
    this.hpNum++;
    decimal = this.hpNum - Math.floor(this.hpNum);

    if(this.hpNum > 5 && decimal != 0.5){
      this.hpNum = 5;

    }else if(this.hpNum >5 && decimal == 0.5){
      this.hpNum = 5;
      _index = this.hpNum - 1;
      this.hp.children[_index].getComponent(cc.Sprite).spriteFrame = this.blood;

    }else  if(this.hpNum > 1 && decimal == 0.5){
      _index = this.hpNum - 0.5;
      this.hp.children[_index].getComponent(cc.Sprite).spriteFrame = this.half;
      this.hp.children[_index - 1].getComponent(cc.Sprite).spriteFrame = this.blood; 

    }else if(this.hpNum >= 1 && decimal != 0.5){
      _index = this.hpNum - 1 ;
      this.hp.children[_index].getComponent(cc.Sprite).spriteFrame = this.blood;
    }
  },
  onHandleDestroy: function () {
    // 暂停正在运行的场景，该暂停只会停止游戏逻辑执行，但是不会停止渲染和 UI 响应
    this.offDrag();
    // 游戏结束转场
    this.mainScript.gameOver();
  }    
});


var Common = {
    commonState: {
      poolObj: {}
    },
    // 批处理对象池
    batchInitNodePool: function (that, objArray) {
			for(let i=0; i< objArray.length; i++) {
				let objInfo = objArray[i];
				this.initNodePool(that, objInfo);
			}
    },
    // 初始化对象池
    initNodePool: function (that, objInfo) {
			let name = objInfo.name;
			let poolName = name + 'Pool';
			that[poolName] = new cc.NodePool();
			// 在commonState中备份，方便clear
			this.commonState.poolObj = {};
			this.commonState.poolObj[poolName] = that[poolName];
			// 创建对象，并放入池中
			for (let i = 0; i < objInfo.poolAmount; i++) {
				let newNode = cc.instantiate(objInfo.prefab);
				that[poolName].put(newNode);
			}
    },

    // 生成节点
    genNewNode: function (pool, prefab, nodeParent) {
			let newNode = null;
			if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
				if(nodeParent.name == 'eatGroup'){
					
					let len = pool._pool.length;
					for(let i = 0; i < len; i++){

						let lis = pool._pool[i].children;
						lis.forEach(function(item, index, array){
							item.opacity = 255; 
						})
					}
				}
				newNode = pool.get();
			} else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
				newNode = cc.instantiate(prefab);
			}
			nodeParent.addChild(newNode);
			return newNode;
    },

    // 销毁节点
    putBackPool: function (that, node) {
        
        let poolName = node.name + "Pool";
        that[poolName].put(node);
    },
    
    // 清空缓冲池
    clearAllPool: function () {
        // this.commonState.poolObj, function (pool) {
        //     pool.clear();
        // })
        let pool = this.commonState.poolObj;
        for(let key in pool){
            pool[key].clear();
        }
        // pool.clear();
    }
};

module.exports = Common;
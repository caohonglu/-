// pages/shopCart/cartData/cartData.js
Component({
  /**
   * 组件的属性列表
   * cartData 购物车数据
   * flag 是否全选
  **/
  properties: {
    cartData:{
      type:Array
    },
    index: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: false
  },
  ready(){
  
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 改变选中
     * list_index: 店铺下标,
     * cartData_index: 店铺商品下标
     * flag: 是否选中
    **/
    change(data){
      let index = data.currentTarget.dataset.index
      this.triggerEvent('changeFlag', { 
        list_index: this.data.index, 
        cartData_index: index, 
        flag: !this.data.cartData[index].flag
      })
    },
    /**
     * 添加商品数量
    **/
    addNumber(data){
      let index = data.currentTarget.dataset.index;
      console.log(index);
      this.setData({
        ['cartData[' + index + '].number']:this.data.cartData[index].number * 1 + 1
      })
    },
    /**
     * 减少商品数量
    **/
    subtract(data){
      let index = data.currentTarget.dataset.index;
      console.log(index);
      if(this.data.cartData[index].number > 1){
        this.setData({
          ['cartData[' + index + '].number']:this.data.cartData[index].number * 1 - 1
        })
      }
    }
  }
})

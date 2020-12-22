// pages/shopCart/shopItem/shopItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cartdata: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取选中总价
     **/
    getAllPrice(data) {
      let arr = [];
      for (let i of data.detail.data) {
        if (i.flag) {
          arr.push(i);
        }
      }
      return false
      this.setData({
        allPrice: Math.round(data.detail.price * 100) / 100,
        chooseData: arr
      })
    },
    /**
     * 全选  来自于cartdata
     */
    goodcheckALl(e) {
      this.setData({
        flag: e.detail.flag
      })
    },
    /**
     * 改变选中
     * shopindex: 店铺下标,
     * cartData_index: 店铺商品下标
     * flag: 是否选中
    **/
    change(data) {
      let cartData_index = data.currentTarget.dataset.index
      let shopindex = data.currentTarget.dataset.shopindex
      this.triggerEvent('changeFlag', {
        shopindex: shopindex,
        cartData_index: cartData_index,
        flag: !this.data.cartdata[shopindex].list[cartData_index].flag
      })
    },
    /**
     * 添加商品数量
    **/
    addNumber(data) {
      let cartData_index = data.currentTarget.dataset.index
      let shopindex = data.currentTarget.dataset.shopindex
      this.triggerEvent('changeGoodsNumber', {
        shopindex: shopindex,
        cartData_index: cartData_index,
        number: Number(this.data.cartdata[shopindex].list[cartData_index].number) + 1,
        flag: this.data.cartdata[shopindex].list[cartData_index].flag
      })
    },
    /**
     * 减少商品数量
    **/
    subtract(data) {
      let cartData_index = data.currentTarget.dataset.index
      let shopindex = data.currentTarget.dataset.shopindex
      let nums = Number(this.data.cartdata[shopindex].list[cartData_index].number) - 1
      this.triggerEvent('changeGoodsNumber', {
        shopindex: shopindex,
        cartData_index: cartData_index,
        number: nums <= 0 ? 1 : nums,
        flag: this.data.cartdata[shopindex].list[cartData_index].flag
      })
    }
  }
})

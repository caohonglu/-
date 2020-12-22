// pages/goodsItem/buypeople/buypeople.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avatar:{
      type: Array
    },
    totalSale:{
      type: String
    },
    monthSale: {
      type: Number
    },
    goodsid: {
      type: Number
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
    go() {
      wx.navigateTo({
        url: `/pages/goodsItem/buypeopleDetail/buypeopleDetail/buypeopleDetail?id=${this.data.goodsid}`,
      })
    }
  }
})

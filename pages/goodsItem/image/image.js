// pages/goodsItem/image/image.js
Component({
  /**
   * 组件的属性列表
   * banner 伦比他
   * price 价格
   * goodsName 商品名称
  **/
  properties: {
    goodsid:{
      type: Number
    },
    banner:{
      type:Array
    },
    price:{
      type:String
    },
    goodsName:{
      type:String
    },
    kdf: {
      type: String
    },
    monthSale: {
      type: String
    },
    stocks: {
      type: Number
    },
    line_price: {
      type: String
    },
    short_name: {
      type: String
    },
    goodstype: {
      type: Number,
      value: 0,
      observer(val) {
        console.log('is_flash_sale',val)
      }
    },
    min_price:{
      type: String
    },
    max_price:{
      type: String
    },
    video_url: {
      type: String
    },
    video_pic_url: {
      type: String
    },
    video_status: {
      type: String
    },
    simple_info: {
      type: String
    },
    older_with_newer: {
      type: Boolean
    },
    open_group_preferential: {
      type: Boolean
    },
    group_type: {
      type: String
    }
  },
  lifetimes: {
    attached () {
      this.setData({
        is_open: wx.getStorageSync('Config').is_stock
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shareFlag: false,
    is_open: false,
    autoplay: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goCart () {
      wx.navigateTo({
        url: '/pages/shopCart/shopCart/shopCart',
      })
    },
    showShare(){
      this.triggerEvent('showShare')
    },
    toshare(){
      wx.navigateTo({
        url: `/pages/share/share?id=${this.data.goodsid}`,
      })
    },
    move(){
      return false
    },
    /**
     * 修改轮播图自动滚动
     */
    changeswiper () {
      this.setData({
        autoplay: false
      })
    }
  }
})

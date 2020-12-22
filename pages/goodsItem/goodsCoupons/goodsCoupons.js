// pages/goodsItem/goodsCoupons/goodsCoupons.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    background: '',
    fontcolor:'',
    couponsData: [],
    layerFlag: false
  },
  /**
   * 生命周期
   */
  lifetimes:{
    attached () {
      this.setData({
        background: wx.getStorageSync('background'),
        fontcolor: wx.getStorageSync('nabigationFontColor')
      })
      this.getData()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取红包列表
     */
    getData () {
      getApp().ajax({
        url: 'ShopRedEnvelope',
        data: {
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        this.setData({
          couponsData: res.data
        })
      })
    },
    /**
     * 
     */
    couponsShow () {
      this.setData({
        layerFlag: !this.data.layerFlag
      })
    },
    /**
     * getCoupons
     */
    getCoupons (e) {
      getApp().ajax({
        url: 'ShopRedEnvelope',
        method: "post",
        data: {
          type_id: e.currentTarget.dataset.id
        }
      }).then(res => {
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 2000
        })
      })
    }
  }
})

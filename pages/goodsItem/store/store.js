// pages/goodsItem/store/store.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    label:{
      type: Array,
      observer (val) {
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    name: '',
    pic_url: '',
    detail_info: '',
    is_open: false
  },
  attached () {
    this.getInfo()
    this.setData({
      is_open: wx.getStorageSync('Config').is_merchant_info
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getInfo () {
      wx.request({
        url: `${wx.getStorageSync('url')}ShopAppInfo`,
        data:{
          key: wx.getStorageSync('shopkey')
        },
        success: res => {
          if(res.data.status == 200){
            this.setData({
              name: res.data.data.name,
              pic_url: res.data.data.pic_url,
              detail_info: res.data.data.detail_info
            })
          }
        }
      })
    },
    goIndex () {
      wx.redirectTo({
        url: '/pages/index/index/index',
      })
    }
  }
})

// pages/group/changegroup/changegroup/changegroup.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.postFormIds()
    app.setTheme()
    this.getData()
    wx.setNavigationBarTitle({
      title: '选择团长',
    })
  },
  search (e) {
    this.getData(e.detail.area_name)
  },
  getData(area_name='') {
    wx.getLocation({
      success: res => {
        wx.setStorageSync('longitude', res.longitude)
        wx.setStorageSync('latitude', res.latitude)
        app.ajax({
          url: `shopTuanUser`,
          data: {
            longitude: res.longitude,
            latitude: res.latitude,
            key: wx.getStorageSync('shopkey'),
            name: area_name
          },
        }).then(res => {
          this.setData({
            data: res.data
          })
        }).catch(res => {
          this.setData({
            data: []
          })
        })
      },
      fail: res => {
        wx.showToast({
          title: '获取定位失败',
        })
      }
    })
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
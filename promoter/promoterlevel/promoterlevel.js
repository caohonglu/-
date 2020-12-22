// pages/group/grouplevel/grouplevel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: wx.getStorageSync('user').avatar,
    nickname: wx.getStorageSync('user').nickname,
    experience: 365,
    nextexperience: 600,
    preferential: 0,
    level_name: '团长'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '推客等级',
    })
    this.getData()
  },
  getData(){
    getApp().ajax({
      url: 'shopTuanLevel'
    }).then(res => {
      console.log(res.data)
      this.setData({
        preferential: res.data.info * 1,
        nextexperience: res.data.next_level,
        experience: res.data.leader,
        nowexperience: res.data.leader_exp,
        level_name: res.data.level
      })
    })
  }
})
// pages/spellGroup/willGroup/willGroup.js
import { countdown } from '../../../utils/util.js'
let willGroup
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_info: {},
    avatar: [],
    poor: 0,
    background: '',
    expire_time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(willGroup)
  },
  onUnload: function () {
    clearInterval(willGroup)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '等待成团',
    })
    this.setData({
      background: wx.getStorageSync('background')
    })
    console.log(this.options)
    this.getData(this.options.group_id, this.options.order_sn)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /** */
  getData(id, order_sn) {
    console.log('请求开始', id, order_sn)
    getApp().ajax({
      url: `groupList/${id}`,
      data: {
        type: 1,
        order_sn
      }
    }).then(res => {
      console.log('请求成功',res)
      if(this.options.hasOwnProperty('user_id')){
        wx.setStorageSync('shareInfo', { sharePeople_id: this.options.user_id, leader_id: this.options.leader_id })
      }
      this.setData({
        goods_info: res.data.goods_info,
        avatar: res.data.list,
        poor: parseInt(res.data.poor),
        expire_time: countdown(res.data.list[0].expire_time)
      })
      willGroup = setInterval(() => {
        this.setData({
          expire_time: countdown(res.data.list[0].expire_time)
        })
        console.log(countdown(res.data.list[0].expire_time))
      }, 1000)
    })
  },
  /**
   * 跳转到商品详情页
   */
  go(){
    wx.navigateTo({
      url: `/pages/goodsItem/goodsItem/goodsItem?id=${this.data.goods_info.goods_id}`,
    })
  }
})
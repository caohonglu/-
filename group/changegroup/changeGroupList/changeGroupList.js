// pages/group/changegroup/changeGroupList/changeGroupList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    avatar: wx.getStorageSync('avatar')
  },  

  /**
   * 组件的方法列表
   */
  methods: {
    catchArea(e) {
      console.log(e.currentTarget.dataset.area)
      wx.setStorageSync('area', e.currentTarget.dataset.area)
      wx.setStorageSync('area_id', e.currentTarget.dataset.area.uid)
      /**绑定团长请求 */
      wx.navigateBack()
      getApp().ajax({
        url: 'shopTuanUserLast/' + e.currentTarget.dataset.area.uid,
        method: 'put'
      })
    } 
  }
})

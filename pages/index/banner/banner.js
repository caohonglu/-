// pages/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    style: 2
  },

  /**
   * 组件的方法列表
   */
  methods: {
    go (e) {
      console.log(e.currentTarget.dataset.link)
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    },
    tijiao(e){
      console.log(e)
    }
  }
})

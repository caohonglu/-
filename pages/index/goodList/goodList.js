// pages/goodList/goodList.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val) {
        if(val.details){
          let data = val.details.imgs
          let str = ''
          console.log(data)
          for (let i in data) {
            if(data[i].link != ""){
              if (i == data.length - 1) {
                str += data[i].link
              } else if (data[i].link == "" && i == data.length - 1) {
                str = str.slice(0, str.length - 1)
              } else {
                str += `${data[i].link},`
              }
            }
          }
          this.getData(str)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    gooddata:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData(data){
      wx.request({
        url: `${wx.getStorageSync('url')}shop/goods/goods`,
        data:{
          id: data,
          key: wx.getStorageSync('shopkey')
        },
        success: res => {
          if(res.data.status === 200){
            this.setData({
              gooddata: res.data.data
            })
          }
        }
      })
    },
    go(e) {
      wx.navigateTo({
        url: `/pages/goodsItem/goodsItem/goodsItem?id=${e.currentTarget.dataset.link}`,
      })
    }
  }
})

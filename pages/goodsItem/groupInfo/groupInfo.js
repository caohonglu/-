// pages/goodsItem/goodsclassify/goodsclassify.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsName:{
      type: String
    },
    start_time: {
      type: String,
      observer(val) {
        let mount = getTime(new Date(val*1000).toLocaleString().split('/')[1])
        let day = getTime(new Date(val*1000).toLocaleString().split('/')[2].split(' ')[0])
        this.setData({
          startTime: mount + '/' + day
        })
      } 
    },
    send_time: {
      type: String,
      observer(val) {
        let mount = getTime(new Date(val * 1000).toLocaleString().split('/')[1])
        let day = getTime(new Date(val * 1000).toLocaleString().split('/')[2].split(' ')[0])
        this.setData({
          sendTime: mount + '/' + day
        })
      }
    },
    end_time: {
      type: String,
      observer(val) {
        let mount = getTime(new Date(val * 1000).toLocaleString().split('/')[1])
        let day = getTime(new Date(val * 1000).toLocaleString().split('/')[2].split(' ')[0])
        this.setData({
          endTime: mount + '/' + day
        })
      }
    },
    monthSale: {
      type: String
    },
    stocks: {
      type: Number
    },
    short_name: {
      type: String
    },
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
    startTime: '',
    sendTime: '',
    endTime: '',
    is_open: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
function getTime(val) {
  if (val.length == 1) {
    val = '0' + val
  }
  return val
}
// pages/supplier/supplierform/supplerform.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: [
      { name: '自有品牌', value: '1', checked: true },
      { name: '代理品牌', value: '2', checked: false }
    ],
    images: [],
    background: '',
    banner: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '供货商申请',
    })
  },
  onShow () {
    this.setData({
      background: wx.getStorageSync('background')
    })
    this.getImage()
  },
  getImage () {
    getApp().ajax({
      url: 'shopSuppliersImg',
      data: {
        key: wx.getStorageSync('shopkey')
      }
    }).then(res => {
      console.log(res)
      this.setData({
        banner: res.data.pic_url
      })
    })
  },
  chooseImage () {
    wx.chooseImage({
      success: res => {
        console.log(res.tempFilePaths)
        this.uploadImage(res.tempFilePaths,0)
      },
    })
  },

  uploadImage (src, index) {
    wx.uploadFile({
      url: `${wx.getStorageSync('url')}shopGoodsCommentUploads`,
      filePath: src[index],
      name: 'pic_url',
      header: {
        'Access-Token': wx.getStorageSync("jwt")
      },
      success: res => {
        console.log(res)
        let arr = this.data.images
        arr.push(JSON.parse(res.data).data)
        this.setData({
          images: arr
        })
        if (src.length - 1 != index){
          return this.uploadImage(src, ++index)
        }
      }
    })
  },
  post(e) {
    console.log(e)
    for (let i in e.detail.value){
      if (e.detail.value[i] == ''){
        wx.showToast({
          title: '请填写完整内容后提交',
          icon: 'none'
        })
        return false
      }
    }
    getApp().ajax({
      url: 'shopSuppliers',
      method: 'post',
      data: {
        ...e.detail.value,
        pic_urls: this.data.images.join(',')
      }
    }).then(res => {
      wx.showToast({
        title: '提交成功',
      })
    })
  }
})
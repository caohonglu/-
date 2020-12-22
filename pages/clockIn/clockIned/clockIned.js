let app = getApp()
Page({
  data: {
    active: 0,
    shareImage:'',
    page: false,
    id:''
  },
  onLoad (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    this.getCode()
    wx.setNavigationBarTitle({
      title: '打卡完毕',
    })
    getApp().postFormIds()
  },
  tab_btn: function (e) {
    let active = e.currentTarget.dataset.index
    let previous = getCurrentPages()[getCurrentPages().length - 2].route == 'pages/clockIn/clockIn/clockIn' ? getCurrentPages()[getCurrentPages().length - 2] : getCurrentPages()[getCurrentPages().length - 3]
    let delta = getCurrentPages()[getCurrentPages().length - 2].route == 'pages/clockIn/clockIn/clockIn' ? 1 : 2
    previous.getData()
    previous.setData({
      active: active
    })
    wx.navigateBack({
      delta: delta
    })
  },
  /**
   * 跳转到打卡首页
   */
  index() {
    wx.redirectTo({
      url: '/pages/index/index/index',
    })
  },
  getCode () {
    let date = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1}-${new Date().getUTCDate()}`
    app.ajax({
      url: `shopSignToDay/${this.data.id}`
    }).then(res => {
      this.setData({
        shareImage: res.data[0].pic_url
      })
    })
  },
  /**
   * 是否显示底部导航栏
  */
  show(e) {
    console.log(e)
    this.setData({
      page: true
    })
  },
  getAuthSetting(){
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum']) {//如果拥有存照片的权限
          this.toPhone()
        } else if (res.authSetting['scope.writePhotosAlbum'] == false) {
          wx.openSetting({
            success: res => {
              console.log(res)
            }
          })
          
        } else {
          wx.authorize({//获取寸照片权限
            scope: 'scope.writePhotosAlbum',
            success: res => {
              console.log('授权成功')
            }
          })
        }
      }
    })
  },
  toPhone () {
    wx.showLoading({
      title: '',
    })
    wx.downloadFile({
      url: this.data.shareImage,
      success: res => {
        wx.hideLoading()
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            wx.showToast({
              title: '图片保存完毕',
              icon: 'none'
            })
          },
          fail: err => {
            wx.showToast({
              title: '图片保存失败',
              icon: 'none'
            })
          }
        })
      }
    })
    return false
    
  }
})
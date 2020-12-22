let app = getApp()
Page({
  /**
   * id Number 活动id
   * qcode String 小程序二维码
   * lianxu Number 连续签到天数
   * leiji Number 累计签到天数
   * pic_url String 签到背景图
   * shareImg String 分享图片
   * text String 签到内容
   * focus Boolean 文本框获取焦点
   * quotations Array 打卡语录
   */
  data: {
    active: 0,
    page: false,
    id:'',
    qcode:'',
    lianxu:'',
    leiji:'',
    pic_url:'/images/clockIn/b.png',
    shareImg:'',
    text:'卡都不打?',
    focus: false,
    quotations:[],
    avatar: wx.getStorageSync('avatar')
  },
  onLoad(){
    this.getData()
    getApp().postFormIds()
    wx.setNavigationBarTitle({
      title: '打卡',
    })
  },
  /**
   * 点击顶部菜单进行跳转
   */
  tab_btn: function (e) {
    let active = e.currentTarget.dataset.index
    let previous = getCurrentPages()[getCurrentPages().length - 2]
    previous.getData()
    previous.setData({
      active: active
    })
    wx.navigateBack({})
  },
  /**
   * 下载头像
   */
  downAvatar (){
    wx.downloadFile({
      url:wx.getStorageSync('avatar'),
      success: res => {
        this.setData({
          avatar: res.tempFilePath
        })
      }
    })
  },
  /**
   * 打卡请求
   */
  quotations () {
    wx.showLoading({
      title: '',
    })
    this.toimg()
  },
  /**
   * 填写内容
   */
  write (e) {
    if(e.detail.value){ //手动输入内容
      this.setData({
        text: e.detail.value
      })
    }else{//点击选中内容
      this.setData({
        text: e.currentTarget.dataset.text
      })
    }
  },
  /**
   * bindfocus
   */
  bindfocus () {
    this.setData({
      focus: true
    })
  },
  /**
   * 选择图片
   */
  chooseImg(){
    wx.chooseImage({
      count:1,
      success: res => {
        this.setData({
          pic_url: res.tempFilePaths[0]
        })
      },
    })
  },

  /**
   * 跳回首页
   */
  index() {
    wx.redirectTo({
      url: '/pages/index/index/index',
    })
  },

  /**
   * 是否显示底部导航栏
  */
  show(e) {
    this.setData({
      page: true
    })
  },
  /**
   * 获取二维码
   */
  getCode (id) {
    wx.request({
      url: `${wx.getStorageSync('url')}shopSigns/${id}`,
      method:'get',
      header: {
        'Access-Token': wx.getStorageSync('jwt'),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if(res.data.status == 200){
          wx.downloadFile({
            url: res.data.data.qcode,
            success: img => {
              this.setData({
                qcode: img.tempFilePath,
                lianxu: res.data.data.lianxu,
                leiji: res.data.data.leiji
              })
            }
          })
          
        }
      }
    })
  },
  /**
   * 获取活动id
   */
  getData () {
    app.ajax({
      url: 'shopSignIn',
      data: {
        key: wx.getStorageSync('shopkey')
      }
    }).then(res => {
      this.getCode(res.data[0].id)
      wx.downloadFile({
        url: res.data[0].pic_url_sign,
        success: img => {
          this.setData({
            id: res.data[0].id,
            quotations: res.data[0].quotations.split(','),
            pic_url: img.tempFilePath
          })
        }
      })
    })
  },
  /**
   * 合成图片
   */
  toimg () {
    let canvas = wx.createCanvasContext('toimg')
    let width = wx.getSystemInfoSync().screenWidth
    canvas.drawImage(this.data.pic_url, 0, 0, width, width)
    /**
     * 绘制圆形图片
     * imgtopAleft 图片边距
     * imgWidth 图片宽度
     * signContentLeft 签到内容左边距
     * signContentTop 签到内容上边距
     * signContentFontSize 签到内容字体大小
     */
    let imgtopAleft = width * 0.04
    let imgWidth = width * 0.1
    let signContentLeft = imgtopAleft + imgWidth + width * 0.02
    let signContentTop = imgtopAleft + imgWidth / 2
    let signContentFontSize = width * 0.037
    let bottomContext = width - width * 0.3

    /**
     * 绘制签到内容
     */
    canvas.setTextBaseline('middle') //设置文字对齐方式
    canvas.setFillStyle('white') //设置文字颜色
    canvas.setFontSize(signContentFontSize) //设置文字大小
    canvas.fillText(this.data.text, signContentLeft, signContentTop) //绘制文字内容及区域
    canvas.save() //保存上下文

    /**
     * 绘制头像
     */
    canvas.arc(imgtopAleft + imgWidth / 2, imgtopAleft + imgWidth / 2, imgWidth / 2, 0, 2 * Math.PI) //绘制圆形
    canvas.clip() //剪切图形
    canvas.drawImage(this.data.avatar, imgtopAleft, imgtopAleft, imgWidth, imgWidth)  //绘制头像
    canvas.restore() //恢复之前保存的上下文
    console.log('2')
    /**
     * 绘制日期
     * dateFontsize 日期字体大小
     */
    let dateFontsize = width * 0.05 //计算日期字体大小
    canvas.setFontSize(dateFontsize) //设置日期字体大小
    canvas.fillText(`${new Date().getUTCMonth()+1}月${new Date().getUTCDate()}日`, imgtopAleft, bottomContext)  //绘制日期
    console.log('3')
    /**
     * 绘制累计打卡
     */
    let signTitleFontsize = width * 0.032
    let signTitleTop = bottomContext + width * 0.096
    let singDayFontsize = width * 0.05
    let signDayTop = signTitleTop + singDayFontsize * 1.17
    let continuousSignLeft = imgtopAleft + width * 0.32
    let leiji = String(this.data.leiji)
    canvas.setFontSize(signTitleFontsize)
    canvas.fillText('累计打卡', imgtopAleft, signTitleTop)
    canvas.fillText('天', imgtopAleft + singDayFontsize * leiji.length * 0.7, signDayTop + (singDayFontsize - signTitleFontsize * 1.25))
    canvas.setFontSize(singDayFontsize)
    canvas.fillText(leiji, imgtopAleft, signDayTop)
    console.log('4')
    /**
     * 连续打卡
     */

    let lianxu = String(this.data.lianxu)
    canvas.setFontSize(signTitleFontsize)
    canvas.fillText('连续打卡', continuousSignLeft, signTitleTop)
    canvas.fillText('天', continuousSignLeft + singDayFontsize * lianxu.length * 0.7, signDayTop + (singDayFontsize - signTitleFontsize * 1.25))
    canvas.setFontSize(singDayFontsize)
    canvas.fillText(lianxu, continuousSignLeft, signDayTop)
    let q2codeWidth = width * 0.218
    let q2codeLeft = width - width * 0.218 - width * 0.04
    canvas.drawImage(this.data.qcode, q2codeLeft, q2codeLeft, q2codeWidth, q2codeWidth)  //绘制头像
    console.log('5')
    try{
      canvas.draw(false, res => {
        console.log('画图完毕', res)
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: 'toimg',
            destWidth: 600,
            destHeight: 600,
            success: res => {
              console.log(res.tempFilePath)
              this.postImg(res.tempFilePath)
            }
          })
        }, 1000)
      })
    }catch(err){
      console.log('报错了哟',err)
    }
    
  },
  /**
   * 上传图片
   */
  postImg (src) {
    wx.uploadFile({
      url: `${wx.getStorageSync('url')}shopSign`,
      filePath: src,
      name: 'pic_url',
      formData:{
        sign_id:this.data.id
      },
      header: {
        'Access-Token': wx.getStorageSync('jwt'),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        let data = JSON.parse(res.data)
        console.log(data)
        wx.hideLoading()
        if (data.status == 200){
          wx.navigateTo({
            url: `../clockIned/clockIned?id=${this.data.id}`,
          })
        }else{
          wx.showToast({
            title: data.message,
          })
        }
      }
    })
  }
})
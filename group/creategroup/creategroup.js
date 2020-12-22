// pages/group/creategroup/creategroup.js
let timine
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu:['地下城与勇士','英雄连门','假面骑士 zi-o','假面骑士 ooo','梦比优斯奥特曼'],
    avatar: '',
    nick_name: '',
    sex:['男','女','保密'],
    sexIndex:0,
    name: '',
    phone: '',
    showPhome: false,
    area:'',
    latitude:'',
    longitude:'',
    address:'',
    addr: '', 
    vercode:'',
    banner_pic_url:'',
    remark:'', 
    is_self: 1,
    phoneFlag: false,
    time:60,
    uid:0,
    edit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      avatar: wx.getStorageSync('user').avatar,
      nick_name: wx.getStorageSync('user').nickname
    })
    if(options.id){
      this.getTuanInfo()
      this.setData({
        edit: true
      })
    }
    this.getUserInfo()
    getApp().postFormIds()
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '申请团长',
    })
  },
  getUserInfo(){
    getApp().ajax({
      url: 'shopUserInfo'
    }).then(res => {
      this.setData({
        avatar: res.data.avatar,
        nick_name: res.data.nickname
      })
      this.getTuanConfig()
    })
  },
  show(){
    this.setData({
      is_seif: !this.data.is_seif
    })
  },
  getTuanInfo(){
    getApp().ajax({
      url: 'tuanLeader'
    }).then(res => {
      console.log(res)
      this.setData({
        name: res.data.realname,
        phone: res.data.phone,
        address: `${res.data.provice_name},${res.data.city_name},${res.data.area_names}`,
        is_self: res.data.is_self == 1 ? true:false,
        flag: res.data.is_self == 1 ? true : false,
        province_code: res.data.province_code,
        area_code: res.data.area_code,
        province_code: res.data.province_code,
        city_code:res.data.city_code,
        latitude: res.data.latitude,
        longitude: res.data.longitude,
        area: res.data.area_name,
        remark: res.data.remarks,
        addr: res.data.addr,
        uid: res.data.uid,
      })
    }).catch(res => {
    })
  },
  getTuanConfig(){
    wx.request({
      url: `${wx.getStorageSync('url')}shopTuanConfig`,
      data:{
        key: wx.getStorageSync('shopkey')
      },
      method: 'get',
      header: {
        'Access-Token': wx.getStorageSync('jwt')
      },
      success: res => {
        console.log(res)
        this.setData({
          banner_pic_url: res.data.data.banner_pic_url
        })
      }
    })
  },
  //提交数据
  panduan (e) {
    getApp().addFormId(e.detail.formId)
    let data = e.detail.value
    data.is_self = this.data.is_self
    console.log(data)
    for(let i in data){
      console.log(i)
      if(data[i] === '' && i != 'remarks'){
        wx.showToast({
          title: '有参数未填',
          icon: 'none'
        })
        return false
      } 
    }
    console.log(this.options)
    if(this.options.id){
      this.putData(data)
    }else{
      this.postData(data)
    }
  },
  postData(data){
    console.log('didid')
    if (wx.getStorageSync('SubscribeTemplateId')['check']){
      wx.requestSubscribeMessage({
        tmplIds: [wx.getStorageSync('SubscribeTemplateId')['check']],
        success: res => {
          wx.request({
            url: `${wx.getStorageSync('url')}shopTuanUser`,
            data: data,
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Access-Token': wx.getStorageSync('jwt')
            },
            method: 'post',
            success: res => {
              console.log(res)
              if (res.data.status == 200) {
                wx.showToast({
                  title: '申请提交完毕,请等待商家审核',
                  icon: 'none'
                })
                setTimeout(() => {
                  wx.navigateBack()
                }, 1000)
              } else if (res.data.status == 500) {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            }
          })
        }
      })
    }else {
      wx.request({
        url: `${wx.getStorageSync('url')}shopTuanUser`,
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Access-Token': wx.getStorageSync('jwt')
        },
        method: 'post',
        success: res => {
          console.log(res)
          if (res.data.status == 200) {
            wx.showToast({
              title: '申请提交完毕,请等待商家审核',
              icon: 'none'
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          } else if (res.data.status == 500) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      })
    }
    
  },
  putData(data){
    getApp().ajax({
      url: `updateTuanLeader`,
      data: data,
      method: 'put'
    }).then(res => {
      wx.showToast({
        title: '资料修改完毕',
        icon: 'none'
      })
      wx.navigateBack()
    }).catch(err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  chooseSex(e){
    console.log(e)
    this.setData({
      sexIndex: e.detail.value
    })
  },
  chooseAddress(e){
    console.log(e.detail)
    this.setData({
      province_code: e.detail.code[0],
      city_code: e.detail.code[1],
      area_code: e.detail.code[2],
      address: e.detail.value
    })
  },
  chooseArea(e){
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        this.setData({
          area: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
  }, 
  writePhone (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取验证码
  getVercode(){
    console.log(this.data.phone)
    if ("" == this.data.phone){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }
    if (!/^[1][0-9][0-9]{9}$/.test(this.data.phone)){
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
      return false
    }
    wx.request({
      url: `${wx.getStorageSync('url')}sms`,
      data:{
        phone: this.data.phone
      },
      header: {
        'Access-Token': wx.getStorageSync('jwt')
      },
      success: res=>{
        console.log(res)
        if(res.data.status == 200){
          this.setData({
            phoneFlag: true
          })
          timine = setInterval(() => {
            this.setData({
              time: this.data.time - 1
            })
            if (this.data.time == 0) {
              clearInterval(timine)
              this.setData({
                time: 60,
                phoneFlag: false
              })
            }
          }, 1000)
        }
      }
    })
  }
})
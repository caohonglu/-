// pages/home/addAddress/addAddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   * name 姓名
   * phone 手机号
   * address 详细地址
   * province 省
   * city 市
   * area 区
   * street 街道(小程序该项为空)
   * is_default 是否默认
   * status false表示新增,true表示编辑
  **/
  data: {
    name:'',
    phone:'',
    address:'',
    province:'',
    city:'',
    area:'',
    street:'',
    is_default:false,
    status:false,
    postcode: '000000',
    longitude: 0,
    latitude: 0,
    loction_address: '',
    loction_name: ''
  },
  /**
   * 跳转到emmmmmmm 收货地址页面
  **/
  go(){
    wx.redirectTo({
      url: '../address/address'
    })  
  },

  /**
   * 设置默认地址
  **/
  changeSwitch(data){
    this.setData({
      is_default:data.detail.value
    })
  },
  /**
   * 提交地址到后台
  **/
  postShopContact(e){
    let data = e.detail.value
    let key = {
      name: '请输入收货人姓名',
      phone: '请输入手机号',
      address: '请填写详细地址',
      loction_address: '请选择所在地'
    }
    console.log(data)
    for(let i in data){
      if(data[i].length === 0){
        wx.showToast({
          title: key[i],
          icon: 'none'
        })
        return false
      }
    }
    data.longitude = this.data.longitude
    data.latitude = this.data.latitude
    data.loction_name = this.data.loction_name
    data.is_default = this.data.is_default ? 1 : 0
    console.log(data)
    getApp().addFormId(e.detail.formId)
    wx.showToast({
      title:'提交中',
      icon:'loading'
    })
    app.ajax({
      url: this.data.status ? `shopContact/${this.data.id}` : 'shopContact',
      method: this.data.status ? 'put' : 'post',
      data: data
    }).then(res => {
      this.data.status ? wx.navigateBack() : wx.redirectTo({
        url: '../address/address'
      })
    })
  },
  /**
   * 地址选择器
  **/
  bindRegionChange(data){
    this.setData({
      province:data.detail.value[0],
      city:data.detail.value[1],
      area:data.detail.value[2]
    })
  },
  /**
   * 获取信息
  **/
  getData(id){
    wx.request({
      url:wx.getStorageSync('url') + 'shopContact/' + id,
      method:'get',
      header:{
        'Access-Token':wx.getStorageSync('jwt')
      },
      success: res =>{
        this.setData({
          ...res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
  **/
  onLoad: function () {
    getApp().postFormIds()
    app.setTheme()
    if(this.options.id){
      this.getData(this.options.id);
    }
    wx.setNavigationBarTitle({
      title: '新增收货地址'
    })
  },
  /**
   * 选择所在地
   */
  chooseLocal () {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          loction_name: res.name,
          loction_address: res.address
        })
      }
    })
  }
})
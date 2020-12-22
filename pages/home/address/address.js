// pages/home/address/address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   * addressData 地址列表
  **/
  data: {
    addressData:'',
    noLogin: false
  },
  /**
   * 生命周期函数--监听页面显示
  **/
  onShow: function () {
    getApp().postFormIds()
    app.setTheme()
    this.shopContact();
    wx.setNavigationBarTitle({
      title: '收货地址'
    })
  },
  /**
   * 获取收货地址
  **/
  shopContact(){
    wx.request({
      url: wx.getStorageSync('url') + 'shopContact',
      method:'get',
      header:{
        'Access-Token':wx.getStorageSync('jwt')
      },
      success: res => {
        console.log(res)
        if(res.data.status == 200){
          this.setData({
            addressData:res.data.data
          })
        }else if(res.data.status == 204){
          this.setData({
            addressData:[]
          })
        }else if(res.data.status == 1001){
          this.setData({
            noLogin: true
          })
        }
      }
    })
  },
  /**
   * 显示操作条,用户自己选择操作
   * id 点击事件所在元素的id,其实就是当前列表的id
  **/
  show(data){
    let id = data.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList:['编辑','删除'],
      success:res => {
        if(res.tapIndex == 0){
          wx.navigateTo({
            url: '../addAddress/addAddress?id='+id
          })  
        }else if(res.tapIndex == 1){
          this.delData(id)
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
   * 删除收货地址
  **/
  delData(id){
    wx.showModal({
      title:'提示',
      content:'确定删除该收货地址?',
      success: res => {
        if(res.confirm){
          wx.request({
            url:wx.getStorageSync('url') + 'shopContact/' + id,
            method:'delete',
            header:{
              'Access-Token':wx.getStorageSync('jwt')
            },
            success: res =>{
              if(res.data.status == 200){
                this.shopContact();
                wx.showToast({
                  title:'删除成功',
                  icon:'success',
                  duration:1000
                })
              }
            }
          })
        }
      }
    })
  },
  /**
   * 跳转到新建
  */
  go(){
    wx.navigateTo({
      url: '../addAddress/addAddress'
    })  
  },
  /**
   * 跳转到我的
  */
  back(){
    wx.switchTab({
      url: '../my/my'
    })  
  }
})
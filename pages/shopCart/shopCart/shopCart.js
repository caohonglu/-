// pages/shopCart/shopCart/shopCart.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   * show 是否显示删除选项
   * cartData 购物车数据
   * flag 全选选项
   * allPrice 选中项总价格
   * chooseData 选中的数据
   * showLogin 用于控制是否显示登陆栏,如果token过期,则显示
   **/
  data: {
    show: true,
    cartData: [],
    allPrice: '',
    flag: false,
    chooseData: [],
    noLogin: false,
    page: false,
    nodataFlag: true,
    background: 'red'
  },


  /**
   * 生命周期函数--监听页面显示
   **/
  onShow: function() {
    getApp().postFormIds()
    this.setData({
      flag: false,
      background: wx.getStorageSync('background')
    })
    app.setTheme()
    this.getCartList();
    wx.setNavigationBarTitle({
      title: '购物车'
    })
    wx.setStorageSync('leader_discount', 0)
    wx.setStorageSync('tuanNum', 0)
  },
  /**
   * 商品全选或者反全选
   **/
  checkALl(data) {
    this.setAllGoodsIsBind(data.detail.flag).then(res => {
      this.setData({
        flag: data.detail.flag,
        cartData: res.data,
        allPrice: res.price,
        chooseData: data.detail.flag ? res.data : []
      })
    })
  },
  /**
   * 修改商品选中
   */
  changeCartData(e) {
    let data = this.data.cartData
    data[e.detail.shopindex].list[e.detail.cartData_index].flag = e.detail.flag
    let goodsChange = this.selectGoodsIsBind(data)
    this.setData({
      allPrice: goodsChange.price,
      cartData: data,
      flag: !data.map(i => i.list.map(i => i.flag)).flat().includes(false),
      chooseData: goodsChange.chooseData
    })
  },
  /**
   * 修改数量
   */
  changeGoodsNumber(e) {
    let data = this.data.cartData
    data[e.detail.shopindex].list[e.detail.cartData_index].number = e.detail.number
    let goodsChange = []
    if (e.detail.flag){
      goodsChange = this.selectGoodsIsBind(data)
    }
    this.setData({
      price: e.detail.flag ? goodsChange.price : this.data.cartData,
      cartData: data,
      chooseData: goodsChange.chooseData
    })
  },
  /**
   * 显示删除
   **/
  showDel(data) {
    this.setData({
      show: data.detail.flag
    })
  },
  /**
   * 获取购物车列表
   **/
  getCartList() {
    getApp().ajax({
      url: 'shopCarts'
    }).then(res => {
      // 后端返回不了我想要的数据格式, 自行处理
      let arr = res.data.map(e => {
        return { 
          supplier_id: e[0].supplier_id,
          supplier_name: e[0].supplier_name,
          list: e
        }
      })
      this.setData({
        cartData: arr,
        nodataFlag: false
      })
    }).catch(err => {
      if (err.status === 204){
        this.setData({
          cartData: [],
          nodataFlag: true
        })
      }
    })
  },
  show () {
    this.setData({
      page: true
    })
  },
  /**
   * 设置所有商品为全选
   */
  setAllGoodsIsBind (flag) {
    return new Promise((reslove, reject) => {
      let price = 0
      let data = this.data.cartData.map(e => {
        return {
          ...e, 
          list: e.list.map(i => {
            flag ? price += Number(i.price) * i.number : 0
            return { 
              ...i, 
              flag: flag 
            } 
          }) 
        }
      })
      reslove({ price: flag ? price : 0, data})
    })
  },
  /**
   * 查询商品选中项
   * 先过滤掉非选中数据, 丢尽数组里, 进行降维操作, 组成一维数组, 计算总和
   */
  selectGoodsIsBind(data) {
    let chooseData = data.map(e => {
      return {
        ...e, list: e.list.filter(i => {
          return i.flag
        })
      }
    }).filter(i => { console.log(i.list); return i.list.length != 0 })

    let price = data.map(e => {
      return e.list.filter(i => {
        return i.flag
      }).map(f => f.price * f.number)
    }).flat().reduce((pre,cur,index)=>{
      return Number(pre) + Number(cur)
    })
    return {price, chooseData}
  }
})
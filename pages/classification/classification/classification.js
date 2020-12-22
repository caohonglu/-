let app = getApp()
let index = 0
Page({
  /**
   * active: 选中侧边栏下标
   * current: 选中二级分类下标
   * shopAdminCategory: 一级分类列表
   * shopCategory: 二级分类列表
   * foorterFlag: 底部边距
   * data: 数据列表
   * background: 背景色
   * layerFlag: 分类弹出层
   * propertyList: 商品规格列表
   * cartGood: 购物车列表
   * cartProperty: 购物车规格列表
   * propertyindex: 弹出层选择规格下标
   * cartindex: 标记(计数,用于更新购物车数据)
   * ajaxFlag: 是否允许发起请求
   * loginFlag: 是否登录
   * page: 第几页
   * m_category_id: 分类id
   * supplier_id: 供应商id
   */
  data: {
    active: 0,
    current: 0,
    shopAdminCategory:[],
    shopCategory:[],
    data:[],
    foorterFlag: false,
    background: '',
    layerFlag: false,
    propertyList: [],
    cartGood:{},
    cartProperty:{},
    propertyindex:0,
    cartindex: 0,
    ajaxFlag: true,
    loginFlag: false,
    page: 1,
    m_category_id: 0,
    supplier_id: 0
  },
  onLoad() {
    app.setTheme()
    wx.setNavigationBarTitle({
      title: '商品分类',
    })
  },
  onShow(){
    this.getOneList()
    this.setData({
      background: wx.getStorageSync('background') || 'red'
    })
    getApp().login().then(res => {
      this.setData({
        loginFlag: true
      })
    })
    if (this.options.hasOwnProperty('user_id')) {
      wx.setStorageSync('shareInfo', { sharePeople_id: this.options.user_id, leader_id: this.options.leader_id })
    }
  },
  tab1: function (e) {
    this.setData({
      active: e.currentTarget.dataset.index,
      current: 0
    })
    this.getTwoList(e.currentTarget.dataset.id)
  },
  tab2: function (e) {
    this.setData({
      current: e.currentTarget.dataset.index,
      m_category_id: e.currentTarget.dataset.id,
      page: 1,
      data: []
    })
    this.getData()
  },
  getOneList() {
    //shopAdminCategory
    app.ajax({
      url: `shopAdminCategory`,
      data: {
        key: wx.getStorageSync('shopkey')
      },
    }).then(res => {
      this.setData({
        shopAdminCategory: res.data.data
      })
      this.getTwoList(res.data.data[0].id)
    })
  },
  getTwoList(id) {
    //shopAdminCategory
    app.ajax({
      url: `shopCategory/${id}`,
      data: {
        key: wx.getStorageSync('shopkey')
      }
    }).then(res => {
      this.setData({
        shopCategory: res.data,
        m_category_id: res.data[0].id,
        page: 1,
        data: []
      })
      this.getData()
    }).catch(err => {
      this.setData({
        shopCategory: [],
        page: 1,
        m_category_id: 0,
        data: []
      })
    })
  },
  /**
   * 获取选中二级分类的商品数据
   */
  getData(id) {
    //shopAdminCategory
    let data = this.data.data
    app.ajax({
      url: `shopGoods`,
      data: {
        key: wx.getStorageSync('shopkey'),
        m_category_id: this.data.m_category_id,
        current_page: this.data.page
      }
    }).then(res => {
      this.setData({
        data: [...data, ...res.data],
        page: this.data.page + 1
      })
    }).catch(res => {
      this.setData({
        data: [...data, ...res.data]
      })
    })
  },
  onReachBottom () {
    this.getData()
  },
  /**
   * 跳转商品详情
   */
  toItem(e){
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.is_bargain) {
      wx.navigateTo({
        url: `/bargaining/pages/goodItem/goodItem/goodItem?id=${e.currentTarget.dataset.id}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/goodsItem/goodsItem/goodsItem?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.name}`,
      })
    }
    
  },
  go(e){
    wx.redirectTo({
      url: e.currentTarget.dataset.url,
    })
  },
  show(e){
    console.log(e)
    this.setData({
      foorterFlag: e.detail.flag
    })
  },
  //初始化商品列表
  initcartData(e){
    console.log(e,'aaaaaaaaaaaa')
    this.setData({
      cartGood: e.detail.cartGood,
      cartProperty: e.detail.cartProperty
    })
  },
  //添加到购物车,并通知购物车更新数据
  addShopCart(e,type){
    let data
    if (e.type == 'property'){
      data = {
        id:e.id,
        stock_id: e.stock_id,
        supplier_id: e.supplier_id
      }
      
    }else{
      data = this.data.data[e.currentTarget ? e.currentTarget.dataset.index : e.index ]
    }
    if (this.data.ajaxFlag === true){
      this.setData({
        ajaxFlag: false
      })
      console.log(this.data.ajaxFlag)
      getApp().ajax({
        url: 'shopCart',
        method: 'post',
        data: {
          goods_id: data.id,
          stock_id: data.stock_id || data.stock[0].id,
          number: type == 'reduce' ? -1 : 1,
          supplier_id: data.supplier_id
        }
      }).then(res => {
        console.log(res)
        this.setData({
          cartindex: this.data.cartindex + 1,
          ajaxFlag: true
        })
      }).catch(err => {
        this.setData({
          ajaxFlag: true
        })
      })
    }
    
  },
  //设置规格分类
  showProperty(e){
    let data = this.data.data[e.currentTarget.dataset.index]
    index = e.currentTarget.dataset.index
    console.log(data)
    this.setData({
      propertyList: data.stock,
      supplier_id: this.data.data[e.currentTarget.dataset.index].supplier_id
    })
    this.showLayer()
    
  },
  //显示弹窗
  showLayer(){
    this.setData({
      layerFlag: !this.data.layerFlag,
      propertyindex: 0
    })
  },
  //切换弹窗分类
  changeProperty(e){
    this.setData({
      propertyindex: e.currentTarget.dataset.index
    })
  },
  //弹窗分类添加购物车
  propertyToCart(e){
    let data = {
      type: 'property',
      id: this.data.propertyList[this.data.propertyindex].goods_id,
      stock_id: this.data.propertyList[this.data.propertyindex].id,
      supplier_id: this.data.supplier_id
    }
    this.addShopCart(data, e.currentTarget.dataset.type == 'reduce' ? 'reduce' : 'add')
  },
  operationShopCart(e){
    console.log(this.data.data[e.currentTarget.dataset.index])
    this.addShopCart({index:e.currentTarget.dataset.index}, 'reduce')
  },
  //分享
  onShareAppMessage(){
    return {
      title: wx.getStorageSync('shopInfo').name,
      path: `/pages/classification/classification/classification?user_id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`
    }
  }
})
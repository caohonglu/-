 let app = getApp()
import { liveappid } from '../../../config.js'
/**
 * @namespace
 * @property {object} data - data
 * @property {number} data.id - 商品的id,用于获取商品数据
 * @property {object[]} data.banner - 轮播图列表
 * @property {string} data.price - 商品价格
 * @property {string} data.goodsName - 商品名称
 * @property {string} data.kdf - 邮费
 * @property {string} data.monthSale - 商品月销量
 * @property {object[]} data.label - 商品标签
 * @property {string} data.stocks - 商品库存
 * @property {string} data.is_flash_sale - 是否秒杀商品
 * @property {string} data.line_price - 商品划线价  
 * @property {string} data.short_name - 商品短标题
 * @property {string} data.max_price - 商品最大价格
 * @property {string} data.min_price - 商品最小价格
 * @property {string} data.end_time - 商品下架时间
 * @property {string} data.start_time - 商品售卖时间
 * @property {string} data.send_time - 商品发货时间
 * @property {object[]} data.avatar - 购买人头像列表
 * @property {object[]} data.avatar[].avatar - 购买人头像
 * @property {string} data.totalSale - 商品已售数量
 * @property {string} data.video_url - 商品视频链接
 * @property {string} data.video_pic_url - 商品视频封面(已弃用)
 * @property {string} data.video_status - 视频审核状态
 * @property {string} data.simple_info - 商品描述
 * @property {boolean} data.interFlag - 计时器开关
 * @property {boolean} data.is_group - 是否拼团商品
 * @property {number} data.goodstype - 商品状态 0： 普通商品， 1： 秒杀商品， 2： 拼团商品
 * @property {number} data.older_with_newer - 是否老带新
 * @property {number} data.open_group_preferential - 是否开团优惠
 * @property {number} data.group_type - 是否阶梯团
 * @property {number} data.group_number - 几人团
 * @property {array} data.attribute - 商品属性
 * @property {string} data.info_bottom - 商品底部通用
*/
Page({
  data: {
    scene: '',
    id:'',
    banner:[],
    html:'',
    price:'',
    goodsName:'',
    show:false,
    btnStatus:'',
    kdf:'',
    showLogin: false,
    monthSale:'',
    copyright: '',
    nickName:'',
    stocks:0,
    is_flash_sale: 0,
    line_price:'',
    short_name: '',
    max_price:'',
    min_price:'',
    end_time:'',
    start_time: '',
    send_time: '',
    avatar: [],
    totalSale:'',
    shareFlag: false,
    video_url:'',
    video_pic_url:'',
    video_status:'',
    simple_info: '',
    interFlag: false,
    is_group: false,
    goodstype: 0,
    older_with_newer:  false,
    property: [],
    tuanNum: 0,
    submit_type: 0,
    group_id: 0,
    type: '0',
    service_goods_is_ship: '0',
    open_group_preferential: false,
    group_type: '',
    attribute: [],
    info_bottom: '',
    info_header: '',
    supplier_id: 0,
    appid: '',
    roomid: 0
  },

  /**
   * 生命周期函数--监听页面显示
  **/
  onLoad(options){
    console.log(decodeURIComponent(options.scene))
    if (options.scene) {
      if (new RegExp(/u_id/g).test(decodeURI(options.scene))){
        let obj = Object.fromEntries(decodeURIComponent(options.scene).split('&').map(i => i.split('=')))
        console.log(obj)
        this.setData({
          scene: obj.id,
          l_id: obj.l_id,
          u_id: obj.u_id
        })
        obj = null
      }else{
        this.setData({
          scene: options.scene
        })
      }
    }
  },
  onShow(options) {
    this.getLive()
    getApp().setTheme()
    getApp().postFormIds()
    wx.setNavigationBarTitle({ title: '商品详情' })
    this.setData({
      id: this.options.id || this.data.scene,
      interFlag: false,
      appid: liveappid
    })
    getApp().login()
    this.getData()
    this.getGoodsInfo()
    this.getBottom()
    this.getHeader()
  },
  onHide(){
    this.setData({
      show: false,
      interFlag: true
    })
  },
  onUnload(){
    this.setData({
      interFlag: true
    })
  },
  /**
   * 获取直播列表
   */
  getLive () {
    app.ajax({
      url: 'shopLive',
      data: {
        status: 1
      }
    }).then(res => {
      console.log('roomid', res)
      this.setData({
        roomid: res.data.roomid
      })
    })
  },
  /**
   * 获取商品列表
  **/
  getData(){
    app.ajax({
      url: `shopGoods/${this.data.id}`,
      data: {
        key: wx.getStorageSync('shopkey'),
        leader_id: wx.getStorageSync('area_id') || 0
      }
    }).then(res => {
      this.setData({
        banner: res.data.pic_urls,
        price: res.data.price,
        goodsName: res.data.name,
        kdf: res.data.kdf,
        monthSale: res.data.totalSale.total,
        label: res.data.label,
        stocks: res.data.stocks,
        is_flash_sale: parseInt(res.data.is_flash_sale),
        line_price: res.data.line_price,
        short_name: res.data.short_name,
        max_price: res.data.max_group_price || res.data.max_price,
        min_price: res.data.min_group_price || res.data.min_price,
        end_time: res.data.end_time || '',
        start_time: res.data.start_time || '',
        send_time: res.data.send_time || '',
        avatar: res.data.avatar,
        totalSale: res.data.totalSale.num,
        video_url: res.data.video_url,
        video_pic_url: res.data.video_pic_url,
        video_status: res.data.video_status,
        simple_info: res.data.simple_info,
        is_group: res.data.is_open_assemble == 1,
        goodstype: res.data.is_open_assemble == 0 ? res.data.is_flash_sale == 1 ? 1 : 0 : 2,
        older_with_newer: res.data.group ? res.data.group.older_with_newer == 1 : false,
        open_group_preferential: res.data.group ? res.data.group.is_leader_discount == 1 && res.data.group.is_show == 1 : false,
        group_type: res.data.group ? res.data.group.type == 1 ? res.data.group.number + "人团":"阶梯团" : '',
        property: Object.keys(res.data.property),
        service_goods_is_ship: res.data.service_goods_is_ship,
        type: res.data.type,
        attribute: res.data.attribute,
        is_info_header: wx.getStorageSync('Config').is_info_header,
        supplier_id: res.data.supplier_id
      })
      if (this.options.hasOwnProperty('secne')){
        let obj = Object.fromEntries(decodeURIComponent(this.options.scene).split('&').map(i => i.split('=')))
        wx.setStorageSync('shareInfo', { sharePeople_id: obj.u_id, leader_id: this.options.obj.l_id })
      }
      if (this.options.hasOwnProperty('user_id')) {
        wx.setStorageSync('shareInfo', { sharePeople_id: this.options.user_id, leader_id: this.options.leader_id })
      }
    })
  },

  /**
   * 获取商品详情
   * @Callback 商品详情
   * @param {string} html - 商品富文本
   */
  getGoodsInfo () {
    app.ajax({
      url: `shopGoodsinfo/${this.data.id}`,
      data: {
        key: wx.getStorageSync('shopkey')
      }
    }).then(res => {
      this.setData({
        html: res.data.detail_info
      })
    })
  },

  /**
   * 显示弹出层,设置值
   * @param {object} data - 弹层按钮显示数据
  **/
  showLayer(data){
    try{
      this.setData({
        show: true,
        btnStatus: data.detail.status,
        tuanNum: data.detail.tuanNum,
        submit_type: data.detail.submit_type
      })
    } catch (err) {
      this.setData({
        show: true,
        btnStatus: data.detail.status
      })
    }
    
  },
  colseLayer(){
    this.setData({
      show: false,
      btnStatus: '',
      tuanNum: 0,
      group_id: 0
    })
  },
  /**
   * getjwt
   */
  getjwt () {
    
  },
  /**
   * 显示隐藏分享页面
   */
  showShare() {
    this.setData({
      shareFlag: !this.data.shareFlag
    })
  },
  setTuanId(e){
    this.setData({
      group_id: e.detail.groupid
    })
  },
  /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title: `${this.data.goodsName}`,
      path: `/pages/goodsItem/goodsItem/goodsItem?id=${this.data.id}&user_id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`,
      imageUrl: this.data.banner[0]
    }
  },
  /**
   * 获取底部
   */
  getBottom () {
    if (wx.getStorageSync('Config').is_info_bottom){
      getApp().ajax({
        url: 'shopDiy',
        data: {
          key: 'info_bottom'
        },
        noLogin: true
      }).then(res => {
        this.setData({
          info_bottom: res.data
        })
      })
    }
  },
  getHeader() {
    if (wx.getStorageSync('Config').is_info_header) {
      getApp().ajax({
        url: 'shopDiy',
        data: {
          key: 'info_header'
        },
        noLogin: true
      }).then(res => {
        this.setData({
          info_header: res.data
        })
      })
    }
  }
})
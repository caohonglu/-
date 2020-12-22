// pages/shopCart/footer/footer.js
Component({
  /**
   * 组件的属性列表
   * show 是否显示删除
   * allPrice 选中商品总价
   * chooseData 选中商品参数,序列化后传到生成订单页面
  **/
  properties: {
    show:{
      type:Boolean,
      value:true
    },
    allPrice:{
      type:Number
    },
    chooseData:{
      type:Array,
      observer(val){
        console.log('获取到的shuju',val)
        if(val.length == 0){
          this.setData({
            checked: false
          })
        }
      }
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  attached () {
    console.log('我进来了')
    this.setData({
      checked: false
    })
  },
  /**
   * 组件的初始数据
   * checked 全选,false为反全选,true为全选
  **/
  data: {
    background: wx.getStorageSync('background')
  },

  /**
   * 组件的方法列表
  **/
  methods: {
    /**
     * 全选
    **/
    change(){
      this.setData({
        checked: !this.data.checked
      })
      this.triggerEvent('checkALl',{flag:this.data.checked})
    },
    /**
     * 跳转到参数提交页
    */
    toCreatedOrder(){
      if (wx.getStorageSync('is_bool')) {
        wx.showToast({
          title: '现在是休市时间,无法购买',
          icon: 'none'
        })
        return false
      }
      if (this.data.chooseData.length != 0){
        wx.setStorageSync('shopcartData', this.data.chooseData)
        wx.navigateTo({
          url: '/pages/createOrder/createOrder/createOrder'
        })
      }
    },
    /**
     * 删除
    */
    delGoods(){
      let ids = this.data.chooseData.map(i => i.list).flat().map(i => i.id)
      getApp().ajax({
        url: 'shopCart',
        method: 'delete',
        data: {
          ids
        }
      }).then(res => {
        this.triggerEvent('regetData', {})
      })
    }
  }
})

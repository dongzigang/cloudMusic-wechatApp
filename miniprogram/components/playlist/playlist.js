// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playItem:{
      type:Object
    }
  },
  observers:{
    ['playItem.playCount'](val){
      this.setData({
        _count:this._tranNum(val,2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToPlayList(){
      wx.navigateTo({
        url: `/pages/musiclist/musiclist?id=${this.properties.playItem.id}`,
      })
    },
    _tranNum(num,point){
      let _num = Math.floor(num)
      let _numStr = _num.toString()
      if(_numStr.length < 6){
        return _num
      }
      else if (_numStr.length >= 6 && _numStr.length <= 8){
        return (_num / 10000).toFixed(point) + '万'
      }
      else if (_numStr.length > 8){
        return (_num / 1000000).toFixed(point) + '百万'
      }
    }
  }
})

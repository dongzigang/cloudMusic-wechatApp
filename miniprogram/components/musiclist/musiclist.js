// components/musiclist/musiclist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:Array
  },
  pageLifetimes: {
    show() {
      this.setData({
        playingId:parseInt(app.getPlayMusicId())
      })

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    playingId:-1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e){
      const dataset= e.currentTarget.dataset
      const musicid = dataset.musicid
      const index = dataset.index
      this.setData({
        playingId: musicid
      })
      wx.navigateTo({
        url:`/pages/player/player?id=${musicid}&index=${index}`
      })
    }
  }
})

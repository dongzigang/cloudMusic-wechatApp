// pages/player/player.js
let musicList = []
let nowPlayingIndex = -1
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isLyricShow:false,
    isPlaying:false,
    lyric:'',
    isSame:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIndex = options.index
    musicList = wx.getStorageSync('musicList')
    this._loadMusicDetail(options.id)
  },
  // 加载音乐
  _loadMusicDetail(id){
    if (id == app.getPlayMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    let music = musicList[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title:music.name
    })
    this.setData({
      picUrl:music.al.picUrl,
      isPlaying:false,
    })
    app.setPlayMusicId(id)
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'musicUrl',
        musicId:id
      }
    }).then((res)=>{
      if (res.result.data[0].url == null) {
        wx.showToast({
          title: '无权限播放',
        })
        return
      }
      if (!this.data.isSame) {
        backgroundAudioManager.src = res.result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name
      }
      this.setData({
        isPlaying:true,
      })
      this._getLyric(id)
    })
  },
  // 获取歌词
  _getLyric(id){
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'lyric',
        musicId:id
      }
    }).then((res)=>{
      let lyric = '暂无歌词'
      const lrc = res.result.lrc.lyric
      if(lrc){
        lyric = lrc
      }
      console.log(lyric)
      this.setData({
        lyric:lyric
      })
    })
  },
  onChangeLyricShow(){
    this.setData({
      isLyricShow:!this.data.isLyricShow
    })
  },
  onPlay(){
    this.setData({
      isPlaying:true
    })
  },
  onPause(){
    this.setData({
      isPlaying:false
    })
  },
  timeUpdate(event){
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  togglePlaying(){
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    }
    else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying:!this.data.isPlaying,
    })
  },
  onPrev(){
    nowPlayingIndex--
    if(nowPlayingIndex<0){
      nowPlayingIndex = musicList.length-1
    }
    this._loadMusicDetail(musicList[nowPlayingIndex].id)
  },
  onNext(){
    nowPlayingIndex++
    if(nowPlayingIndex === musicList.length){
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musicList[nowPlayingIndex].id)
  }
})

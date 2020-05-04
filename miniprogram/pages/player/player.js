// pages/player/player.js
let musicList = []
let nowPlayingIndex = -1
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isLyricShow:false,
    isPlaying:false,
    lyric:'',
    isSame:'',
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
    backgroundAudioManager.stop()
    let music = musicList[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title:music.name
    })
    this.setData({
      picUrl:music.al.picUrl,
      isPlaying:false,
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'musicUrl',
        musicId:id
      }
    }).then((res)=>{
      console.log(res)
      backgroundAudioManager.src = res.result.data[0].url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      backgroundAudioManager.epname = music.al.name
      this.setData({
        isPlaying:true,
      })
    })
  },
  onChangeLyricShow(){

  },
  onPlay(){

  },
  onPause(){

  },
  timeUpdate(){

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

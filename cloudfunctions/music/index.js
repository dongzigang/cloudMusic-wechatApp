// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL = 'http://musicapi.xiecheng.live'
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  // 获取首页歌单列表
  app.router('playList',async(ctx,next) => {
    ctx.body =  await cloud.database()
    .collection('playList')
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then((res)=>{
      return res
    })
  })
  // 获取歌单歌曲列表
  app.router('musicList',async(ctx,next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
        .then((res) => {
          return JSON.parse(res)
        })
  })
  // 获取音乐信息
  app.router('musicUrl',async(ctx,next) => {
    ctx.body = await rp(BASE_URL + '/song/url?id=' + parseInt(event.musicId))
      .then((res) => {
        return JSON.parse(res)
      })
  })
  // 获取歌词
  app.router('lyric',async(ctx,next) => {
    ctx.body = await rp(BASE_URL + '/lyric?id=' + parseInt(event.musicId))
      .then((res) => {
        return JSON.parse(res)
      })
  })
  return app.serve()
}

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const rp = require('request-promise');

const URL = 'http://musicapi.xiecheng.live/personalized'

const playListCollection = db.collection('playList')

const MIX_LIMIT = 10

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取数据库数据条数
  const constResult = await  playListCollection.count()
  const total = constResult.total
  const batchTimes= Math.ceil(total / MIX_LIMIT)   // 读取次数
  const tasks = [] // 分次读取的 promise 队列
  for (let i = 0; i < batchTimes; i++){
    let task = playListCollection.skip(i * MIX_LIMIT).limit(MIX_LIMIT).get()
    tasks.push(task)
  }
  let dbList = {
    data:[]
  } // 分次读取最后的结果
  if(tasks.length > 0){
    dbList = (await  Promise.all(tasks)).reduce((acc,cur)=>{
      return {
        data:acc.data.concat(cur.data)
      }
    })
  }
  // id列表
  const dbIdList = dbList.data.map((item)=>{
    return item.id
  })
  // 请求网易云接口
  const playlist = await rp(URL).then((res) => {
        return JSON.parse(res).result
      })
  let addCount = 0
  // 新数据将被插入数据库
  for(let i=0;i<playlist.length;i++){
    if(!dbIdList.includes(playlist[i].id)){
      await playListCollection.add({
        data:{...playlist[i],createTime:db.serverDate()}
      }).then((res)=>{
        addCount += 1
      }).catch((err)=>{

      })
    }
  }
  return addCount
}

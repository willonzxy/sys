/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-03-12 11:03:03 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-03-13 14:55:00
 */
/* 数据库连接中间件 */
import setting from '../config/config.json'
import mongoose from 'mongoose'

/**
 * 对外暴露整个数据实例对象
 */
function ndbc(){
    return new Promise((resolve,reject)=>{
        let db = mongoose.createConnection(setting.database.mongodb.url); // 创建数据库实例连接
    
        db.once('open',(res)=>{
            resolve(db)
            console.log('数据库成功打开');
        });
        
        db.on('error',(err)=>{
            reject(err)
            console.log(`数据库打开失败${err}`);
        });
    })
}

export default ndbc
/* export default async function dbc(ctx,next) {
    ctx.db = await dbConnect();
    console.log('dbc setting.....')
    await next()
} */
/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-03-20 10:55:52 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-04-14 23:18:00
 */
/* 上传文件服务支持,最后返回存放地址,最好如果有时间，可以加一个鉴权 */
const fs = require('fs');
const path = require('path');
const scene_list = [
    'licence',
    'area',
    'warehouse',
    'user'
]

export default async function(ctx,next){
    let files = ctx.request.files,
        scene_id = ctx.query.scene_id,
        attr = ctx.query.attr;
    if(!scene_id){
        ctx.body = { status:2 , msg:'scene_id param is required' }
    }
    if(!scene_list.includes(scene_id)){
        ctx.body = { status:2 , msg:'scene_id param is illegel' }
    }
    // 注意 identityUrl 这里是上传文件时的属性名
    let oldPath = files[attr || scene_id].path;//文件在客户端临时的保存路径C:\Users\Willon\AppData\Local\Temp\upload_fd011f8ff31c8f65ae65f9819584b606
    let newName = Array.prototype.slice.call(/.+[\\/](.+)/.exec(oldPath) || '')[1]//截取文件名 linux 与 window 不一样
    console.log(newName)
    if(!newName){
        ctx.body = {status:2,msg:'上传失败 获取文件名失败'}
    }
    try {
        let res = await new Promise((resolve,reject)=>{
            fs.rename(oldPath,path.resolve(`${__dirname}/../../public/${scene_id}/${newName}`),function(err){
                if(err){
                    console.log(err);
                    reject({status:2,msg:'文件上传失败'})
                    return
                }
                resolve({status:1,path:`/${scene_id}/${newName}`,msg:'success'})
            });
        })
        ctx.body = res
    } catch (error) {
        ctx.body = error
    }
}
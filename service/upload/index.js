/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-03-20 10:55:52 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-03-29 10:45:42
 */
/* 上传文件服务支持,最后返回存放地址,最好如果有时间，可以加一个鉴权 */
const fs = require('fs');
const path = require('path');
const scene_list = [
    'licence'
]

export default async function(ctx,next){
    let files = ctx.request.files,
        scene_id = ctx.query.scene_id;
    if(!scene_id){
        ctx.body = { status:2 , msg:'scene_id param is required' }
    }
    if(!scene_list.includes(scene_id)){
        ctx.body = { status:2 , msg:'scene_id param is illegel' }
    }
    console.log(files[scene_id].path)
    // 注意 identityUrl 这里是上传文件时的属性名
    let oldPath = files[scene_id].path;//文件在客户端临时的保存路径C:\Users\Willon\AppData\Local\Temp\upload_fd011f8ff31c8f65ae65f9819584b606
    let newName = oldPath.substring(oldPath.lastIndexOf('\\')+1);//截取文件名
    try {
        let res = await new Promise((resolve,reject)=>{
            fs.rename(oldPath,`${__dirname}/../../public/${scene_id}/${newName}`,function(err){
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
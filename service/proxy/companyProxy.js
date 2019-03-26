/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-03-20 10:11:44 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-03-20 10:28:30
 */

/* 公司注册的时候 */
const register = async function(ctx,next){
    let files = ctx.request.files;
    let oldPath = files.identityUrl.path;//文件在客户端临时的保存路径C:\Users\Willon\AppData\Local\Temp\upload_fd011f8ff31c8f65ae65f9819584b606
    let newName = oldPath.substring(oldPath.lastIndexOf('\\')+1);//截取文件名
    let oldName = files.identityUrl.name;//用户文件的名字
    let ext = path.extname(oldName);
    if (!fs.existsSync(__dirname+'/../../../public/assets/'+uid)) {
        fs.mkdir(__dirname+'/../../../public/assets/'+uid,(err,status)=>{
            if(err){
                console.log('创建文件夹失败');
                console.log(err);
                res.send({status:2,msg:'文件上传失败'});
                return
            }
            
        });
    }else{
        fs.rename(oldPath,__dirname+'/../../../public/assets/'+uid+'/'+newName+ext,function(err){
            if(err){
                console.log(err);
                res.send({status:2,msg:'文件上传失败'});
                return
            }
            User.completeInfo({_id:Mongoose.Types.ObjectId(req.params.id)},{flag:'audit',identity:identityCode,identityUrl:'/assets/'+uid+'/'+newName+ext},'').then(
                success => res.send({status:1,msg:verbose.completeInfoSuccess}),
                err => res.send({status:2,msg:err})
            )
            
        });
    }
    
}

export { register }
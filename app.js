import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import staticServer from 'koa-static'
import path from 'path'
import NDBC from './middleware/ndbc.js'
import Service from './middleware/service.js'
import Schema from './model/schema.js'
import UploadService from './service/upload/index.js'
import EMAIL from './service/sendEmail/index.js'
import {
      companyRegister,warnConfigCreated,translate,
      roleCreatedProxy,tableDataSet,userCreatedProxy,
      dirCreateProxy,areaCreateProxy,
      getMenu,
      checkLogin,
      roleSelectProxy,
      userSelectProxy,
      areaSelectProxy,
      devCreateProxy,
      devSelectProxy,
      companySelectProxy,
      warnSelectProxy,
      roleProxy,
      msgSelectProxy,
} from './service/proxy/loggicProxy.js'
import cors from 'koa2-cors'
import fs from 'fs'
import session from 'koa-session';
import { USER_ROLE } from './compose/roleMap.js'
import { resolve } from 'upath';
import { reject } from 'any-promise';
let app = new Koa(),router = new Router(),{ user,msg,company,area,warehouse,warn,dir,power,role,dev} = Schema;

app.use(staticServer(path.resolve(__dirname,'./public')))
//app.use(cors())
app.keys = ['some secret hurr'];
const CONFIG = {
   key: 'koa:sess',   //cookie key (default is koa:sess)
   maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));

app.use(koaBody({
    multipart:true,
    // encoding:'gzip', 开启这个会使其他上传请求415 贼坑
    formidable:{
      uploadDir:path.join(__dirname,'public/upload'),
      keepExtensions: true,
      maxFieldsSize:2 * 1024 * 1024,
      onFileBegin:(name,file) => {
        /* // console.log(file);
        // 获取文件后缀
        const ext =getUploadFileExt(file.name);
        // 最终要保存到的文件夹目录
        const dir = path.join(__dirname,`public/upload/${getUploadDirName()}`);
        // 检查文件夹是否存在如果不存在则新建文件夹
        checkDirExist(dir);
        // 重新覆盖 file.path 属性
        file.path = `${dir}/${getUploadFileName(ext)}`; */
      },
      onError:(err)=>{
        console.log(err);
      }
    }
}));
(async () => {
    try {
      
        const ndbc = await NDBC();
        const UserService = Service(ndbc,'user',user),
            MsgService = Service(ndbc,'msg',msg),
            CompanyService = Service(ndbc,'company',company),
            AreaService = Service(ndbc,'area',area),
            WarehouseService = Service(ndbc,'warehouse',warehouse),
            WarnConfigService = Service(ndbc,'warn',warn),
            PowerCtrlService = Service(ndbc,'power',power),
            RoleCtrlService = Service(ndbc,'role',role),
            DevService = Service(ndbc,'dev',dev),
            DirService = Service(ndbc,'dir',dir);
            
            app.context.ndbc = ndbc;
            app.context.service = {};
            app.context.service.user = UserService;
            app.context.service.power = PowerCtrlService;
            // app.context.service.msg = MsgService;
            app.context.service.company = CompanyService;
            app.context.service.area = AreaService;
            app.context.service.dev = DevService;
            // app.context.service.warehouse = WarehouseService;
            // app.context.service.warnconfig = WarnConfigService;
            app.context.service.dir = DirService
            app.context.service.role = RoleCtrlService
            

            /** 信息数据 */
            router.get('/msg',msgSelectProxy,MsgService.select)
                  .post('/msg',MsgService.created)
            /** 公司 */
            router.get('/company',roleProxy(USER_ROLE.company_admin),companySelectProxy,CompanyService.select)
                  .post('/company',companyRegister,CompanyService.created)
                  //.post('/company/login',checkLogin)
                  .put('/company/:id',roleProxy(USER_ROLE.company_admin),CompanyService.put)
                  .patch('/company/:id',roleProxy(USER_ROLE.platform_admin),CompanyService.patch)
                  .del('/company/:id',roleProxy(USER_ROLE.platform_admin),CompanyService.del)
            /** 区域 */
            router.get('/area',roleProxy(USER_ROLE.company_admin),areaSelectProxy,AreaService.select)
                  .post('/area',roleProxy(USER_ROLE.company_admin),areaCreateProxy,AreaService.created)
                  .del('/area/:id',roleProxy(USER_ROLE.company_admin),AreaService.del)
                  .put('/area/:id',roleProxy(USER_ROLE.company_admin),AreaService.put)
            /** 存储管理 */
            router.get('/warehouse',WarehouseService.select)
                  .get('/warehouse/selectbyname',WarehouseService.select)
                  .post('/warehouse',WarehouseService.created)
                  .del('/warehouse/:id',WarehouseService.del)
            /** 统一图片上传接口 */
            router.post('/upload',UploadService)
            /** 预警配置 */
            router.get('/warn',roleProxy(USER_ROLE.company_admin),warnSelectProxy,WarnConfigService.select)
                  .post('/warn',roleProxy(USER_ROLE.company_admin),warnConfigCreated,WarnConfigService.created)
                  .del('/warn/:id',roleProxy(USER_ROLE.company_admin),WarnConfigService.del)
                  .patch('/warn/:id',roleProxy(USER_ROLE.company_admin),WarnConfigService.patch)
                  .put('/warn/:id',roleProxy(USER_ROLE.company_admin),warnConfigCreated,WarnConfigService.put)
            /** 字典管理 */
            router.get('/dir',DirService.select)
                  .post('/dir',dirCreateProxy,DirService.created)
                  .del('/dir/:id',DirService.del)
                  .patch('/dir/:id',DirService.patch)
                  .put('/dir/:id',DirService.put)
            
            /** 字典管理 */
            router.get('/dev',devSelectProxy,DevService.select)
                  .post('/dev',devCreateProxy,DevService.created)
                  .del('/dev/:id',DevService.del)
                  .patch('/dev/:id',DevService.patch)
                  .put('/dev/:id',DevService.put)
            
            /** 人员管理 */
            router.get('/user',userSelectProxy,UserService.select)
                  .post('/user',userCreatedProxy,UserService.created)
                  .del('/user/:id',UserService.del)
                  .patch('/user/:id',UserService.patch)
                  .put('/user/:id',UserService.put)
                  .post('/user/login',checkLogin)

            /** 权限管理 */
            router.get('/power',PowerCtrlService.select)
                  .post('/power',translate,PowerCtrlService.created)
                  .del('/power/:id',PowerCtrlService.del)
                  .patch('/power/:id',PowerCtrlService.patch)
                  .put('/power/:id',PowerCtrlService.put)

            /** 角色管理 */
            router.get('/role',roleSelectProxy,RoleCtrlService.select)
                  .post('/role',roleCreatedProxy,RoleCtrlService.created)
                  .del('/role/:id',RoleCtrlService.del)
                  .patch('/role/:id',RoleCtrlService.patch)
                  .put('/role/:id',RoleCtrlService.put)

            router.get('/ownmenu',getMenu)

            router.get('/session',async ctx=>{
                  if(ctx.session.loginStatus){
                        ctx.body = {status:1,session:ctx.session,msg:'login'}
                  }else{
                        ctx.body = {status:2,msg:'no login'}
                  }
            })
            router.get('/sendemail',async ctx=>{
                  let msg =  await EMAIL();
                  ctx.body = msg || {status:1,msg:'success'};
            })

            /** 数据表格权限 */
            router.get('/tabledataset',tableDataSet)

            /** 文件导出 */
            // router.get('/download',async ctx=>{
            //   let file = await new Promise(resolve=>{
            
            //     fs.readFile(path.resolve(__dirname,'./package.json'),(err,buffer)=>{
            //       resolve(buffer)
            //     })
            //   })
            //   ctx.set({'Content-Type':'text/plain'})
            //   ctx.body = file
            // })

            router.post('/file',async ctx=>{
                  console.log('....')
                  let attr = Date.now();
                  let data = ctx.request.body;
                  let info = await new Promise((resolve,reject)=>{
                        fs.writeFile(path.resolve(__dirname,'./public/'+attr +'.json'),JSON.stringify(data),(err)=>{
                              if(err){
                                    resolve({msg:'download error',status:2})
                              }
                              resolve({url:`http://localhost:4000/${attr}.json`,status:1,attr})
                        })
                  })
                  ctx.body = info
                  
            })

            app.use(router.routes())
            app.listen(4000,()=>{
                console.log('server running......')
            })
            
            // fs.rename(oldPath,path.resolve(`${__dirname}/../../public/${scene_id}/${newName}`),function(err){
            //       if(err){
            //             console.log(err);
            //             reject({status:2,msg:'文件上传失败'})
            //             return
            //       }
            //       resolve({status:1,path:`/${scene_id}/${newName}`,msg:'success'})
            // });
            /** 数据查询 */
            // let timer = setInterval(async ()=>{
            //       let 
            // },2000)
    } catch (error) {
        console.log(error)
    }
})()
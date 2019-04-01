import Koa from 'koa'
import Router from 'koa-trie-router'
import koaBody from 'koa-body'
import path from 'path'
import NDBC from './middleware/ndbc.js'
import Service from './middleware/service.js'
import Schema from './model/schema.js'
import UploadService from './service/upload/index.js'
import {companyRegister} from './service/proxy/companyProxy.js'
import cors from 'koa2-cors'
let app = new Koa(),router = new Router(),{ user,msg,company,area,sensor } = Schema;
app.use(cors())
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
            SensorService = Service(ndbc,'sensor',sensor);
            app.context.ndbc = ndbc;
            app.context.service = {};
            app.context.service.user = UserService;
            app.context.service.msg = MsgService;
            app.context.service.company = CompanyService;
            app.context.service.area = AreaService;
            app.context.service.sensor = SensorService;
            router.get('/user',UserService.select).post('/user',UserService.created)
            router.get('/msg',MsgService.select).post('/msg',MsgService.created)
            router.get('/company',CompanyService.select)
            .post('/company/register',companyRegister,CompanyService.created)
            .post('/company/login',CompanyService.find_one)
            router.get('/area',AreaService.select).post('/area',AreaService.created)
            router.get('/sensor',SensorService.select).post('/sensor',SensorService.created)
            router.post('/upload',UploadService)
            app.use(router.middleware())
            app.listen(4000,()=>{
                console.log('server running......')
            })
    } catch (error) {
        console.log(error)
    }
})()
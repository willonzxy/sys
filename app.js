import Koa from 'koa'
import Router from 'koa-trie-router'
import koaBody from 'koa-body'
import path from 'path'
import NDBC from './middleware/ndbc.js'
import Service from './middleware/service.js'
import Schema from './model/schema.js'
let app = new Koa(),router = new Router(),{ user,msg,company,area,sensor } = Schema;
app.use(koaBody({
    multipart:true, // 支持文件上传
    encoding:'gzip',
    formidable:{
      uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
      keepExtensions: true,    // 保持文件的后缀
      maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
      onFileBegin:(name,file) => { // 文件上传前的设置
        // console.log(`name: ${name}`);
        // console.log(file);
      },
    }
  }));
(async ()=>{
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
            router.get('/company',CompanyService.select).post('/company',CompanyService.created)
            router.get('/area',AreaService.select).post('/area',AreaService.created)
            router.get('/sensor',SensorService.select).post('/sensor',SensorService.created)
            app.use(router.middleware())
            app.listen(3000,()=>{
                console.log('server running......')
            })
    } catch (error) {
        console.log(error)
    }
})()
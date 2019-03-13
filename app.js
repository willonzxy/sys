import Koa from 'koa'
import Router from 'koa-trie-router'
import koaBody from 'koa-body'
import path from 'path'
import NDBC from './middleware/ndbc.js'
import Service from './middleware/service.js'
import Schema from './model/schema.js'
let app = new Koa(),router = new Router(),{ user } = Schema;
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
        const UserService = Service(ndbc,'user',user);
            app.context.ndbc = ndbc;
            app.context.service = {};
            app.context.service.user = UserService;
            router.get('/user',UserService.select).post('/user',UserService.created)
            app.use(router.middleware())
            app.listen(3000,()=>{
                console.log('server running......')
            })
    } catch (error) {
        console.log(error)
    }
})()
import Koa from 'koa'
import Router from 'koa-trie-router'
import dbc from './middleware/dbc.js'
import Action from './middleware/baseAction.js'
import Schema from './model/schema.js'
let app = new Koa(),router = new Router(),{ user } = Schema;

app.use(dbc) // 桥接数据库实例对象
/* console.log(Action(app.context.db,'user',user))
app.use(Action(app.context.db,'user',user))    // 用ctx.db实例化异步操作对象 */

router.get('/user',ctx=>{
    ctx.body = {msg:'success'}
})

app.use(router.middleware())

app.listen(3000,()=>{
    console.log('server running......')
})

/* (async function(){
    try {
        let userAction = await new Action('user',user);
        console.log(userAction.__proto__.list)
        router.get('/user',userAction.list).post('/user',userAction.add).delete('/user',userAction.removeById)
        app.use(router.middleware())
        app.listen(3000,()=>{
            console.log('服务器启动成功')
        })
    } catch (error) {
        console.log(error)
        console.log('服务器启动失败')
    }
})()
     */
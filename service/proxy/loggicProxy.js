/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-03-20 10:11:44 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-04-16 03:45:17
 */
import Schema from '../../model/schema.js'
import Config from '../../config/config.json'
import MenuMap from '../../compose/menuMap.js'
/* 公司注册的时候 */
const companyRegister = async function(ctx,next){
    let data = { ...ctx.request.body,companyinfo_created_date:Date.now(),company_status:0 }
    ctx.request.body = data;
    await next()
}

const warnConfigCreated = async function(ctx,next){
    let warn_list = await ctx.service.dir.list({d_id:ctx.request.body.warnconfig_d_id})
    ctx.request.body.warnconfig_name = warn_list.list[0].dir_name;
    let data = {date:Date.now(),warnconfig_status:0,...ctx.request.body}
    ctx.request.body = data
    await next()
}

const translate = async function(ctx,next){
    let { collection_id,action_id } = ctx.request.body;
    // 用d_id翻译出name
    let collection_name = await ctx.service.dir.list({d_id:collection_id})
    let action = await ctx.service.dir.list({d_id:action_id})
    ctx.request.body = {...ctx.request.body,collection_name:collection_name.list[0].dir_name,action:action.list[0].dir_name}
    await next()
}

const roleCreatedProxy = async function(ctx,next){
    ctx.request.body && (ctx.request.body.power_list = ctx.request.body.power_list[0])
    ctx.request.body && (ctx.request.body.table_data_list = ctx.request.body.table_data_list.toString().split(','))
    await next()
}

const userCreatedProxy = async function(ctx,next){
    let role_list = await ctx.service.role.list({_id:ctx.request.body.role_id})
    let role_name = role_list.list[0].role_name;
    ctx.request.body.user_role_name = role_name;
    await next()
}

const dirCreateProxy = async function(ctx,next){
    let { p_id } = ctx.request.body;
    let list =  await ctx.service.dir.list({d_id:p_id});
    let name = list.list[0].dir_name;
    ctx.request.body.p_name = name;
    await next()
}

const areaCreateProxy = async function(ctx,next){
    let { sensor_list } = ctx.request.body;
    let list = await ctx.service.dir.list({p_id:'W'});
    sensor_list.map(i=>{
        return list.list.filter(item=>item.d_id === i)[0].dir_name
    })
    ctx.request.body.sensor_list
    console.log(ctx.request.body.sensor_list)
    await next()
}

const checkLogin =  async (ctx,next)=>{
    let data = await ctx.service.company._findOne(ctx.request.body)
    if(data){
        ctx.session.loginStatus = true;
        ctx.session.tel = ctx.request.body.tel;
        ctx.body = {status:1,msg:'success'}
    }else{
        ctx.loginStatus = false
        ctx.body = {status:2,msg:'error'}
    }
    await next()
}

const tableDataSet = async (ctx,next) =>{
    console.log(ctx.session.tel)
    let keys = await ctx.service.dir.list({p_id:'C'});
    let arr = [];
    keys.list && keys.list.forEach(item=>{
        let ks = Object.keys(Schema[item.d_id]),temp = [],allValue = [];
            ks.forEach((ele,index)=>{ // 集合字段
            if(!Config.filterAttr.includes(ele)){ // 过滤敏感属性
                temp.push({
                    title:ele,
                    value:ele,
                    key:ele+index,
                })
                allValue.push(ele)
            }
            
        })
        let obj = {
            title:item.d_id,
            value:allValue,
            key:item._id,
            children:temp
        }
        arr.push(obj)
    })
    ctx.body = {data:{list:arr},status:1,msg:'very important data'}
    await next()
}

const getMenu = async (ctx,next)=>{
    // 从session 获取 role
    const role = 'domain';
    // 加载原始菜单
    const allMenu = MenuMap[role]; // obj
    delete allMenu.msg // 测试删除数据阅览功能
    // 获取当前目录集合权限 ，过滤出菜单栏
    const ownMenu = Object.keys(allMenu) // 默认 , 应从power_id > power >collection_name
    ctx.body = ownMenu.map(key=>allMenu[key])
    await next()
}

export { 
    companyRegister,
    warnConfigCreated,
    translate,
    roleCreatedProxy,
    tableDataSet,
    userCreatedProxy,
    dirCreateProxy,
    areaCreateProxy,
    getMenu,
    checkLogin,
}
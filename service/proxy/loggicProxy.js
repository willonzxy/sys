/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-03-20 10:11:44 
 * @Last Modified by: 伟龙
 * @Last Modified time: 2019-04-18 18:58:29
 */
import Schema from '../../model/schema.js'
import Config from '../../config/config.json'
import MenuMap from '../../compose/menuMap.js'
const super_domain_tel = '13189679384'
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
    //console.log(collection_name,action)
    ctx.request.body = {...ctx.request.body,collection_name:collection_name.list[0].dir_name,action:action.list[0].dir_name}
    await next()
}

const roleCreatedProxy = async function(ctx,next){
    ctx.request.body && (ctx.request.body.power_list = ctx.request.body.power_list[0])
    ctx.request.body && (ctx.request.body.table_data_list = ctx.request.body.table_data_list.toString().split(','))
    ctx.request.body.role_scene = ctx.session.role
    await next()
}

const roleSelectProxy = async function(ctx,next){
    ctx.query.role_scene = ctx.session.role
    await next()
}

const userCreatedProxy = async function(ctx,next){
    let role_list = await ctx.service.role.list({_id:ctx.request.body.role_id})
    let role_name = role_list.list[0].role_name;
    ctx.request.body.user_role_name = role_name;
    ctx.request.body.company_id = ctx.session.user.user_company_id || ctx.session.user._id;
    await next()
}

const dirCreateProxy = async function(ctx,next){
    let { p_id } = ctx.request.body;
    if(p_id){
        let list = await ctx.service.dir.list({d_id:p_id});
        let name = list.list[0].dir_name;
        ctx.request.body.p_name = name;
        ctx.request.body.p_id = list.list[0].d_id
    }else{
        ctx.request.body.p_id = 'DIR',
        ctx.request.body.p_name = '目录';
    }
    
    await next()
}

const areaCreateProxy = async function(ctx,next){
    let { sensor_list } = ctx.request.body;
    let list = await ctx.service.dir.list({p_id:'S',pageSize:10000});
    sensor_list.map(i=>{
        return list.list.filter(item=>item.d_id === i)[0].dir_name
    })
    ctx.request.body.sensor_list
    //console.log(ctx.request.body.sensor_list)
    await next()
}

const checkLogin =  async (ctx,next)=>{
    let which = ctx.request.body.domain;
    if(which){
        delete ctx.request.body.domain
        let data = await ctx.service.company._findOne(ctx.request.body)
        if(data){
            ctx.session.loginStatus = true;
            ctx.session.tel = data.tel;
            if(data.tel === super_domain_tel){
                ctx.session.role = 'super_domain';
                ctx.session.user = data;
                return ctx.body = {status:1,msg:'success',super_domain:true}
            }else{
                ctx.session.role = 'domain';
                ctx.session.user = data;
                ctx.body = {status:1,msg:'success'}
            }
        }else{
            ctx.session.loginStatus = false
            ctx.body = {status:2,msg:'error'}
        }
    }else{ // 由公司管理员 添加的工作人员进入了工作系统
        delete ctx.request.body.domain
        let data = await ctx.service.user._findOne(ctx.request.body)
        if(data){
            ctx.session.loginStatus = true;
            ctx.session.tel = data.tel;
            ctx.session.role = 'common';
            ctx.session.user = data
            ctx.body = {status:1,msg:'success'}
        }else{
            ctx.session.loginStatus = false
            ctx.body = {status:2,msg:'error'}
        }
    }
    
    await next()
}

const tableDataSet = async (ctx,next) =>{
    let keys = await ctx.service.dir.list({p_id:'C',pageSize:10000});
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
    try {
        // 从session 获取 role
        const role = ctx.session.role || 'domain'
        // 加载原始菜单
        //console.log(role)
        role === 'common' && ( role = 'domain' );
        const allMenu = MenuMap[role]; // 默认全部输出再过滤
        //delete allMenu.msg // 测试删除数据阅览功能
        // 获取当前目录集合权限 ，过滤出菜单栏
        const ownMenu = Object.keys(allMenu) // 默认 , 应从power_id > power >collection_name
        let power_list = [],table_data_list = [];
        let powers = [],collections = [],data = {};
        if(role === 'domain'){
            let company_role = ctx.session.user.company_role; // array 包含role_id
            for(let len = company_role.length; len-- ;){
                let temp = await ctx.service.role.list({
                    _id:company_role[len],
                    role_scene:'super_domain'
                })
                if(!temp.list.length){
                    continue
                }
                power_list.push(temp.list[0].power_list)
                table_data_list.push(temp.list[0].table_data_list)
            }
            table_data_list = table_data_list.toString().split(','); // 展平
            power_list = power_list.toString().split(','); // 展平
            for(let i = power_list.length;i--;){ // 通过power_id -> power 的详情
                let temp = await ctx.service.power.list({
                    _id:power_list[i]
                })
                if(!temp.list.length){
                    continue
                }
                powers.push(temp.list[0])
            }
            //console.log(powers)
        
            powers.forEach(item=>{
                let c = item.collection_id; // 组织集合名称与其动作
                if(collections.includes(c)){
                    data[c].actions.push(item.action_id)
                }else{
                    data[c] = {}
                    data[c].actions = [item.action_id]
                    collections.push(c)
                }
            })
           // console.log(data)
           
            ctx.body = {
                status:1,
                menu:Object.keys(data).map(key=>allMenu[key]),
                collections:data,
                table_data_list
            }
        }else if(role === 'common'){
            let role = ctx.session.user.role; // array 包含role_id
            for(let len = role.length; len-- ;){
                let temp = await ctx.service.role.list({
                    _id:role[len],
                    role_scene:'domain'
                })
                if(!temp.list.length){
                    continue
                }
                power_list.push(temp.list[0].power_list)
                table_data_list.push(temp.list[0].table_data_list)
            }
            table_data_list = table_data_list.toString().split(','); // 展平
            power_list = power_list.toString().split(','); // 展平
            let powers = [],collections = [],data = {};
            for(let i = power_list.length;i--;){ // 通过power_id -> power 的详情
                let temp = await ctx.service.power.list({
                    _id:power_list[i]
                })
                if(!temp.list.length){
                    continue
                }
                powers.push(temp.list[0])
            }
            powers.forEach(item=>{
                let c = item.collection_name; // 集合名称
                if(collections.includes(c)){
                    data[c].actions.push(item.action_id)
                }else{
                    data[c] = {}
                    data[c].actions = [item.action_id]
                }
            })
            ctx.body = {
                status:1,
                menu:Object.keys(data).map(key=>allMenu[key]),
                collections:data,
                table_data_list
            }
        }else{
            ctx.body = ownMenu.map(key=>allMenu[key])
        }
    } catch (error) {
        console.log(error)
        ctx.body = {status:2,msg:'get power_list and meun error'}
    }
    await next()
}

const handlePoweList = function(arr){
    
}

const powerProxy = async (ctx,next)=>{
    if(ctx.session.loginStatus){
        await next()
    }else{
        ctx.body = {status:2,msg:'no login forbiden'}
    }
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
    roleSelectProxy,
    powerProxy
}
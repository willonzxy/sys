/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-03-20 10:11:44 
 * @Last Modified by: 伟龙
 * @Last Modified time: 2019-05-11 21:08:34
 */
import Schema from '../../model/schema.js'
import Config from '../../config/config.json'
import MenuMap from '../../compose/menuMap.js'
import SENDEMAIL from '../sendEmail/index.js';
import {USER_ROLE} from '../../compose/roleMap.js';
const super_domain_tel = '13189679384';

const roleProxy = function(roleLevel,shouldLogin = true){

    const proxy = async function(ctx,next){
        if(shouldLogin && !ctx.session.loginStatus){
            ctx.status = 403;
            return ctx.body = {status:2,msg:'forbidden',path:ctx.path}
        }
        if(ctx.session.user.user_role_name !== 'platform_admin'){
            let company_id = ctx.session.user.user_company_id;
            let companys = await ctx.service.company.list({_id:company_id}); // array 包含role_id
            let company_status = companys.list[0].company_status;
            let user_status = ctx.session.user.user_status;
            if(company_status != 1){
                return ctx.body = { status:2,msg:'该公司状态未被激活,请联系平台管理员' }
            }
            if(user_status != 1){
                return ctx.body = { status:2,msg:'该用户状态未被激活,请联系公司管理员或相关负责人' }
            }
            if(USER_ROLE[ctx.session.user.user_role_name] < roleLevel){ // 约定的角色权限低于阈值就不能访问受保护的资源
                let u_role_list = ctx.session.user.role_list; // array 包含role_id
                let powers = [],collections = [],data = {} ,power_list = [];
                for(let len = u_role_list.length; len-- ;){
                    let temp = await ctx.service.role.list({
                        _id:u_role_list[len],
                        role_scene:ctx.session.user.user_role_name
                    })
                    if(!temp.list.length){
                        continue
                    }
                    power_list.push(temp.list[0].power_list)
                }
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
                
                powers.forEach(item=>{
                    let c = item.collection_name; // 集合名称
                    if(collections.includes(c)){
                        data[c].actions.push(item.action_id)
                    }else{
                        data[c] = {}
                        data[c].actions = [item.action_id]
                        collections.push(c)
                    }
                })
                if(!Object.keys(data).includes(ctx.path.replace('/',''))){
                    ctx.status = 403;
                    return ctx.body = {status:2,msg:'role limit',path:ctx.path}    
                }
                
            }
        }
        await next()
    }

    return proxy
}
/* 公司注册的时候 */
const companyRegister = async function(ctx,next){
    let data = { ...ctx.request.body,companyinfo_created_date:Date.now(),company_status:0 }
    ctx.request.body = data;
    await next()
}

const companySelectProxy = async function(ctx,next){
    let role = ctx.session.role;
    console.log(role)
    if(role !== 'platform_admin'){
        ctx.query._id = ctx.session.user.user_company_id;
    }
    await next()
}

const warnSelectProxy = async function(ctx,next){
    ctx.request.body.warn_company_id = ctx.session.user.user_company_id
    //console.log(ctx.request.body.sensor_list)
    await next()
}

/**
 * @description
 * @author willon
 * @date 2019-04-26
 * @param {*} ctx
 * @param {function} next
 */
async function warnConfigCreated(ctx,next){
    let { 
        user_company_name,
        user_name,
        user_company_id,
        _id
    } = ctx.session.user; // 当前登录用户的额信息
    let {
        receive,
        warn_area_id,
        max_val,
        min_val,
        warn_dev_id,
        msg,
        warn_d_id
    } = ctx.request.body; // post请求body数据
    let dir_list = await ctx.service.dir.list({d_id:warn_d_id}); // 数据库操作
    let area_list = await ctx.service.area.list({_id:warn_area_id});
    let dev_list = await ctx.service.dev.list({
        dev_company_id:user_company_id,
        dev_id:warn_dev_id
    });
    let warn_dev_name = dev_list.list[0].dev_name;
    let warn_area_name = area_list.list[0].area_name;
    let warn_dir_name = dir_list.list[0].dir_name;
    let unit = dir_list.list[0].dir_desc;
    let receive_name_list = [];
    for(let len = receive.length;len--;){
        let user = await ctx.service.user.list({_id:receive[len]});
        let {user_name:receive_name} = user.list[0];
        receive_name_list.push(receive_name)
    }
    ctx.request.body = {
        ...ctx.request.body,
        warn_dir_name,
        warn_area_name,
        warn_area_id,
        warn_dev_id,
        warn_dev_name,
        warn_company_id:user_company_id,
        warn_creator_id:_id,
        warn_creator_name:user_name,
        unit,
        receive_name_list
    }
    let data = {date:Date.now(),warnconfig_status:0,...ctx.request.body};
    ctx.request.body = data;
    await next();
    /**  
    * 遍历接收人数组逐个发送邮件
    */
    for(let len = receive.length;len--;){
        let user = await ctx.service.user.list({_id:receive[len]});
        let {user_name:receive_name,email} = user.list[0];
        await SENDEMAIL({
            user_company_name,
            user_name,
            caption:'农业气象监测指标订阅反馈',
            max_val,
            min_val,
            warn_area_name,
            warn_dev_name,
            unit,
            warn_dir_name,
            receive_name,
            to:email,
            msg,
        })
    }
   
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
    ctx.request.body.role_scene = ctx.session.role === 'platform_admin' ? 'company_admin' : 'common_user';
    await next()
}

const userSelectProxy = async function(ctx,next){
    if(ctx.session.role === 'platform_admin'){
        //let filter = {user_role_name:'platform_admin',};
        ctx.query.user_role_name = ['platform_admin','company_admin'];
    }else{
        //let filter = {user_role_name:{$ne:'platform_admin'}};
        ctx.query.user_role_name = ['common_user','company_admin'];
        ctx.query.user_company_id = ctx.session.user.user_company_id;
        console.log(ctx.query)
    }
    //ctx.query = {...ctx.query,user_role_name:{$ne:filter_user_role_name}}
    await next()
}
const roleSelectProxy = async function(ctx,next){
    ctx.query.role_scene = ctx.session.role === 'platform_admin' ? 'company_admin' : 'common_user';
    await next()
}

const userCreatedProxy = async function(ctx,next){
    let company_id = ctx.request.body.user_company_id;
    let companys = await ctx.service.company.list({_id:company_id})
    let user_company_name = companys.list[0].company_name; 
    ctx.request.body.user_company_name = user_company_name;
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

const areaSelectProxy = async function(ctx,next){
    // let company_id = ctx.session.user.user_company_id;
    // let areas = await ctx.service.area.list({area_company_id:company_id})
    // ctx.body = {data:{list:areas.list},status:1,msg:'area data'}
    ctx.query.area_company_id = ctx.session.user.user_company_id;
    await next()
}

const areaCreateProxy = async function(ctx,next){
    ctx.request.body.area_company_id = ctx.session.user.user_company_id
    //console.log(ctx.request.body.sensor_list)
    await next()
}

const devCreateProxy = async function(ctx,next){
    let dev_area_id = ctx.request.body.dev_area_id
    let areas = await ctx.service.area.list({_id:dev_area_id})
    ctx.request.body.dev_area_name = areas.list[0].area_name
    ctx.request.body.dev_company_id = ctx.session.user.user_company_id
    await next()
}
const devSelectProxy = async function(ctx,next){
    ctx.query.dev_company_id = ctx.session.user.user_company_id;
    await next()
}
/**  
 * 1 登录认证
 * 2 找出这个用户角色
 * 
*/
const checkLogin =  async (ctx,next)=>{
    let {tel,password} = ctx.request.body;
    let data = await ctx.service.user._findOne({tel,password})
    if(data){
        ctx.session.loginStatus = true;
        //ctx.session.tel = data.tel;
        ctx.session.role = data.user_role_name;
        data.password && delete data.password;
        ctx.session.user = data;
        return ctx.body = {status:1,msg:'login success',user_role_name:data.user_role_name}
    }else{
        ctx.session.loginStatus = false
        ctx.body = {status:2,msg:'error'}
    }
// if(which){
    //     delete ctx.request.body.domain
    //     let data = await ctx.service.company._findOne(ctx.request.body)
    //     if(data){
    //         ctx.session.loginStatus = true;
    //         ctx.session.tel = data.tel;
    //         if(data.tel === super_domain_tel){
    //             ctx.session.role = 'super_domain';
    //             ctx.session.user = data;
    //             return ctx.body = {status:1,msg:'success',super_domain:true}
    //         }else{
    //             ctx.session.role = 'domain';
    //             ctx.session.user = data;
    //             ctx.body = {status:1,msg:'success'}
    //         }
    //     }else{
    //         ctx.session.loginStatus = false
    //         ctx.body = {status:2,msg:'error'}
    //     }
    // }else{ // 由公司管理员 添加的工作人员进入了工作系统
    //     delete ctx.request.body.domain
    //     let data = await ctx.service.user._findOne(ctx.request.body)
    //     if(data){
    //         ctx.session.loginStatus = true;
    //         ctx.session.tel = data.tel;
    //         ctx.session.role = 'common';
    //         ctx.session.user = data
    //         ctx.body = {status:1,msg:'success'}
    //     }else{
    //         ctx.session.loginStatus = false
    //         ctx.body = {status:2,msg:'error'}
    //     }
    // }
    
    await next()
}

const tableDataSet = async (ctx,next) =>{
    let keys = await ctx.service.dir.list({p_id:'C',pageSize:10000});
    let arr = [],role = ctx.session.user.user_role_name;
    // console.log(keys)
    if(role !== 'platform_admin'){
        keys = keys.list.filter(i=>ctx.session.user.own_collections.includes(i.d_id)) // 集合过滤；
    }else{
        keys = keys.list;
    }
    keys.forEach(item=>{
        let ks = Object.keys(Schema[item.d_id]),temp = [],allValue = [];
            ks.forEach((ele,index)=>{ // 集合字段
            if(!Config.filterAttr.includes(ele)){ // 过滤敏感属性和自有属性
                if(role === 'platform_admin' ){
                    temp.push({
                        title:ele,
                        value:ele,
                        key:ele+index,
                    })
                }else if(ctx.session.user.own_table_data_list.includes(ele)){
                    temp.push({
                        title:ele,
                        value:ele,
                        key:ele+index,
                    })
                }
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

/**
 * @description
 * @author willon
 * @date 2019-04-26
 * @param {*} ctx
 * @param {function} next
 */
async function getMenu(ctx,next){
    try {
        // 从session 获取 role
        const role = ctx.session.role || 'common_user';
         // 默认全部输出再过滤
        const allMenu = MenuMap[role];
        // 获取当前目录集合权限 ，过滤出菜单栏
        const ownMenu = Object.keys(allMenu);
        // 默认 , 应从power_id > power >collection_name
        let power_list = [],table_data_list = [];
        let powers = [],collections = [],data = {};
        let user_status = ctx.session.user.user_status;
        if(role === 'company_admin'){
            let company_id = ctx.session.user.user_company_id;
            let companys = await ctx.service.company.list({_id:company_id}); // array 包含role_id
            let company_status = companys.list[0].company_status;
            if(company_status != 1){
                return ctx.body = { status:2,msg:'该公司状态未被激活,请联系平台管理员' }
            }
            if(user_status != 1){
                return ctx.body = { status:2,msg:'该用户状态未被激活,请联系公司管理员或相关负责人' }
            }
            let company_role = companys.list[0].company_role_list;
            for(let len = company_role.length; len-- ;){
                let temp = await ctx.service.role.list({
                    _id:company_role[len],
                    role_scene:role
                })
                if(!temp.list.length){
                    continue
                }
                power_list.push(temp.list[0].power_list)
                table_data_list.push(temp.list[0].table_data_list)
            }
            table_data_list = table_data_list.toString().split(','); // 快速展平多维数据
            power_list = power_list.toString().split(',');
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
                let c = item.collection_id; // 组织集合名称与其动作的数据结构
                if(collections.includes(c)){
                    data[c].actions.push(item.action_id)
                }else{
                    data[c] = {}
                    data[c].actions = [item.action_id]
                    collections.push(c)
                }
            })
            ctx.session.user.own_collections = Object.keys(data);
            ctx.session.user.own_table_data_list = table_data_list;
            ctx.body = {
                status:1,
                menu:Object.keys(data).map(key=>allMenu[key]).filter(i=>i),
                collections:data,
                table_data_list
            }
        }else if(role === 'common_user'){
            if(user_status != 1){
                return ctx.body = { status:2,msg:'该用户状态未被激活,请联系公司管理员或相关负责人' }
            }
            let u_role_list = ctx.session.user.role_list; // array 包含role_id
            for(let len = u_role_list.length; len-- ;){
                let temp = await ctx.service.role.list({
                    _id:u_role_list[len],
                    role_scene:role
                })
                if(!temp.list.length){
                    continue
                }
                power_list.push(temp.list[0].power_list)
                table_data_list.push(temp.list[0].table_data_list)
            }
            table_data_list = table_data_list.toString().split(','); // 展平
            power_list = power_list.toString().split(','); // 展平
            // let powers = [],collections = [],data = {};
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
                    collections.push(c);
                }
            })
            ctx.session.user.own_collections = Object.keys(data);
            ctx.session.user.own_table_data_list = table_data_list;
            ctx.body = {
                status:1,
                menu:Object.keys(data).map(key=>allMenu[key]).filter(i=>i),
                collections:data,
                table_data_list
            }
        }else{
            ctx.body = {status:1,menu:ownMenu.map(key=>allMenu[key]),msg:'success'}
        }
    } catch (error) {
        console.log(error)
        ctx.body = {status:2,msg:'get power_list and meun error'}
    }
    await next()
}

const powerProxy = async (ctx,next)=>{
    if(ctx.session.loginStatus){
        await next()
    }else{
        ctx.body = {status:2,msg:'no login forbiden'}
    }
}
const msgSelectProxy = async (ctx,next)=>{
    let msg_date = ctx.query.msg_date;
    if(!!msg_date){
        msg_date = JSON.parse(msg_date)
        let from = msg_date[0],to = msg_date[1];
        ctx.query = {...ctx.query,msg_date:JSON.stringify({"$gte":from,"$lt":to})};
    }
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
    roleSelectProxy,
    powerProxy,
    userSelectProxy,
    areaSelectProxy,
    devCreateProxy,
    devSelectProxy,
    companySelectProxy,
    warnSelectProxy,
    roleProxy,
    msgSelectProxy,
}
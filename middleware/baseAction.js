/* import dbModel from '../model/dao.js';
import { ConnectionBase } from 'mongoose';

async function Action(name,schema){
    this.dbM = await dbModel(name,schema)
    return this
}

Action.prototype.add = async (ctx,next) => {
    this.dbM.add(ctx.body)
    .then(() => ctx.body = {status:1,msg:'success'})
    .catch(err => ctx.body = {status:2,msg:err})
}

Action.prototype.removeById = async (ctx,next) => {
    this.dbM.removeById(ctx.query.id)
    .then(() => ctx.body = {status:1,msg:'success'})
    .catch(err => ctx.body = {status:2,msg:err})
}

Action.prototype.list = async function(ctx,next){
    console.log(this)
    let search = ctx.query;
    this.dbM.list(search)
    .then(data => ctx.body = {status:1,msg:'success',data})
    .catch(err => ctx.body = {status:2,msg:err})
}
 */
/** action接入中间件，装载到db对象上 */
import dbModel from '../model/dao.js';
let extendAction = {
    add(ctx,next){
        this.add(ctx.body)
        .then(() => ctx.body = {status:1,msg:'success'})
        .catch(err => ctx.body = {status:2,msg:err})
    },
    removeById(ctx,next){
        this.removeById(ctx.query.id)
        .then(() => ctx.body = {status:1,msg:'success'})
        .catch(err => ctx.body = {status:2,msg:err})
    },
    list(ctx,next){
        console.log(this)
        let search = ctx.query;
        this.list(search)
        .then(data => ctx.body = {status:1,msg:'success',data})
        .catch(err => ctx.body = {status:2,msg:err})
    }
}

async function Action(name,schema,service = {}){
    let action = dbModel(db,name,schema);
    action = { ...action , ...extendAction, ...service }
    console.log('userAction对象......')
    console.log(action) 
    return async function(ctx,next){
        if( typeof ctx.service === 'object' ){
            ctx.service[name] = action;
        }else{
            ctx.service = {};
            ctx.service[name] = action;
        }
        await next()
    }
}

export default Action
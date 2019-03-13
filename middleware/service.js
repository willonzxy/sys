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
import dbAction from '../model/action.js';
let extendAction = {
    async created(ctx,next){
       /*  ctx.body = ctx.request.body */
        await this.add(ctx.request.body)
            .then(() => ctx.body = {status:1,msg:'success'} )
            .catch(err => ctx.body = {status:2,msg:err})
        
    },
    async removeById(ctx,next){
        await this.removeById(ctx.query.id)
        .then(() =>ctx.body = {status:1,msg:'success'})
        .catch(err => ctx.body = {status:2,msg:err} )
    },
    async select(ctx,next){
        let query = ctx.query;
        if(!Object.keys(query).length){
            ctx.body = {status:2,msg:'query must required'}
        }
        await this.list(query)
        .then(data => ctx.body = {status:1,msg:'success',data})
        .catch(err => ctx.body = {status:2,msg:err})
    }
}

function Action(db,name,schema,service = {}){
    let dbM = dbAction(db,name,schema),temp = { ...extendAction, ...service };
    for(let key in temp){
        if(!dbM.hasOwnProperty(key)){
            if(typeof temp[key] === 'function'){
                dbM[key] = temp[key].bind(dbM)
            }else{
                dbM[key] = temp[key]
            }
        }
    }
    return dbM
}

export default Action
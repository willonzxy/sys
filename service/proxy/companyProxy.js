/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-03-20 10:11:44 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-04-01 13:58:49
 */

/* 公司注册的时候 */
const companyRegister = async function(ctx,next){
    let data = { ...ctx.request.body,date:Date.now(),status:0 }
    ctx.request.body = data;
    await next()
}

export { companyRegister }
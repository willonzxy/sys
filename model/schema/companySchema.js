/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-02-27 19:42:43 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-02-27 22:16:44
 */

module.exports = {
    company_name:{type:String,default:'未填写',required:true},
    ip:{type:String,required:true}, // 公司的公网ip
    site:{type:String,required:true},
    tel:{type:String,required:true}, // 公司负责人电话
    date:{type:Number,required:true}, // 创建监控申请的时间
    deadline:{type:Number,required:true}, // 平台使用截止日期
    status:{type:Number,required:true}, // active timeout
    url:{type:String,required:true} // url就是的对应前端的路由 ，部署后发给公司负责人
};


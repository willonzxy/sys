/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-02-27 19:42:43 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-02-27 22:06:10
 */

module.exports = {
    company_id:{type:String,required:true,default:'未填写'},
    type:{type:String,required:true,default:'未填写'},
    desc:{type:String,default:'未填写'},
    inventory:{type:Number,default:0}, // 库存
    used:{type:Number,default:0},
    date:{type:Number,required:true},
    params:{type:Array,default:[]} // [{name:'',unit:'°C'}] 参数的单位与名称
};

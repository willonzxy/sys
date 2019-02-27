/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-02-27 20:18:21 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-02-27 22:16:31
 */
module.exports = {
    company_id:{type:String,default:'未填写',required:true}, //公司id
    area_name:{type:String,default:'未填写',required:true},
    sensor_list:{type:Array,default:[]}, //该区域下传感器的类型 [{type:'name',dev_list:[{did:'',status:'active'}},{did:'',status:''}]}]
    subnet_ip:{type:String,required:true}, // 一个区域子网ip,对应一个上报终端设备
    date:{type:Number,required:true},
    modified_date:{type:Number,required:true},
    modifier:{type:String,required:true},
};

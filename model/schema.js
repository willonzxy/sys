/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-02-27 20:18:21 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-03-13 19:05:17
 */
export default {
    area:{
        company_id:{type:String,default:'未填写',required:true}, //公司id
        area_name:{type:String,default:'未填写',required:true},
        sensor_list:{type:Array,default:[]}, //该区域下传感器的类型 [{type:'name',dev_list:[{did:'',status:'active'}},{did:'',status:''}]}]
        subnet_ip:{type:String,required:true}, // 一个区域子网ip,对应一个上报终端设备
        date:{type:Number,required:true},
        modified_date:{type:Number,required:true},
        modifier:{type:String,required:true},
    },
    company:{
        company_name:{type:String,default:'未填写',required:true},
        site:{type:String,required:true}, // 公司的位置
        tel:{type:String,required:true}, // 公司负责人电话
        date:{type:Number,required:true}, // 创建监控申请的时间
        deadline:{type:Number,required:true}, // 平台使用截止日期
        status:{type:Number,required:true}, // active ，平台使用已过有效期timeout
    },
    msg:{
        company_id:{type:String,required:true},
        params:{type:Array,required:true,default:[]},
        /*
        params的示例
        var params = {
            name1:{
                data:'', // 融合后
                dev_list:[ // 昧融合前
                    {did:'',data:''}, // did为设备id
                    {did:'',data:''},
                ]
            },
            name2:{
                data:'', // 融合后
                dev_list:[ // 昧融合前
                    {did:'',data:''},
                    {did:'',data:''},
                ]
            },
        }*/
    },
    sensor:{
        company_id:{type:String,required:true,default:'未填写'},
        type:{type:String,required:true,default:'未填写'},
        desc:{type:String,default:'未填写'},
        inventory:{type:Number,default:0}, // 库存
        used:{type:Number,default:0},
        date:{type:Number,required:true},
        pic:{type:String}, // 传感器图片
        params:{type:Array,default:[]} // [{name:'',unit:'°C'}] 参数的单位与名称
    },
    user:{
        company_id:{type:String,required:true},
        tel:{type:String,required:true},
        name:{type:String,required:true},
        password:{type:String,required:true},
        avatar:{type:String},
        desc:{type:String},
        audit_status:{type:String,required:true}, // 公司审核状态,是否确认
        role_id:{type:String,required:true}, // 角色id
    }
};

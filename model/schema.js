/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-02-27 20:18:21 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-04-17 16:22:40
 */
export default {
    area:{
        area_company_id:{type:String,default:'未填写'}, //公司id 必填
        area_name:{type:String,default:'未填写',required:true},
        sensor_list:{type:Array,default:[]}, //4-7拟定只有sensor_name 该区域下传感器的类型 [{type:'name',dev_list:[{did:'',status:'active'}},{did:'',status:''}]}]
        // subnet_ip:{type:String,required:true}, // 一个区域子网ip,对应一个上报终端设备
        area_desc:{type:String},
        area_pic:{type:String},
        area_created_date:{type:Number,default:Date.now()},  // 必填
        area_modified_date:{type:Number,default:Date.now()},
        area_modifier:{type:String}, // 必填
    },
    company:{
        company_name:{type:String,default:'未填写',required:true},
        leader:{type:String,default:'未填写',required:true},
        licence:{type:String,required:true},
        password:{type:String,required:true},
        site:{type:String,required:true}, // 公司的位置
        tel:{type:String,required:true}, // 公司负责人电话
        companyinfo_created_date:{type:Number,required:true}, // 创建监控申请的时间
        deadline:{type:Number}, // 平台使用截止日期
        company_status:{type:Number,default:0}, // active ，平台使用已过有效期timeout
        power_list:{type:Array,default:[]}, // [power_id}]
        table_data_list:{type:Array,default:[]},// [{colletion_id
        company_role:{type:Array,default:[]} // 可以有承担多个角色
    },
    msg:{
        msg_company_id:{type:String,required:true},
        area_id:{type:String,required:true},
        ts:{type:Number,required:true},
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
    warehouse:{
        warehouse_company_id:{type:String,required:true,default:'未填写'},
        warehouse_name:{type:String,required:true,default:'未填写'},
        warehouse_desc:{type:String,default:'未填写'},
        inventory:{type:Number,default:0}, // 库存
        used:{type:Number,default:0},
        warehouse_created_date:{type:Number,default:Date.now()},
        unit:{type:String,default:''}, // 单位
        warnhouse_pic:{type:String}, // 传感器图片
        params:{type:Array,default:[]} // [{name:'',unit:'°C'}] 参数的单位与名称
    },
    dir:{  // 数据字典
        p_id:{type:String,required:true}, // 父级id
        p_name:{type:String,required:true},
        d_id:{type:String,required:true},
        dir_name:{type:String,required:true},
        dir_desc:{type:String},
    },
    warnsetting:{
        warnconfig_d_id:{type:String,required:true}, // 指标预警字典值
        warnconfig_name:{type:String,required:true}, // 选取指标名称后
        threshold:{type:String,required:true},
        msg:{type:String,default:'注意! 该指标已达到预警值'},
        warnconfig_status:{type:String}, // 默认关闭该预警
        warnconfig_created_date:{type:String},
        warnconfig_modifier:{type:String},
        warnconfig_modified_date:{type:Number}
    },
    user:{
        user_company_id:{type:String,required:true},
        tel:{type:String,required:true},
        user_name:{type:String,required:true},
        password:{type:String,required:true,default:'123456'},
        avatar:{type:String},
        user_desc:{type:String},
        user_status:{type:Number,required:true,default:0}, // 公司审核状态,是否确认
        role_id:{type:String,required:true,default:''}, // 角色id
        user_role_name:{type:String,required:true},
        role:{type:Array,default:[]} // 管理员标识
    },
    role:{
        role_name:{type:String,required:true},
        role_level:{type:Number,required:true,default:0},
        power_list:{type:Array,default:[]}, // [power_id}]
        table_data_list:{type:Array,default:[]},// ['']
        role_desc:{type:String},
        role_scene:{type:String,required:true}, // 通过session跟踪添加的场景
    },
    power:{
        power_name:{type:String,required:true},
        collection_id:{type:String,required:true},
        collection_name:{type:String,required:true},
        action_id:{type:String,required:true},
        action:{type:String,required:true},
        power_desc:{type:String},
        power_created_date:{type:String,default:Date.now()}
    }
};

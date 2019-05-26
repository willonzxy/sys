/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-02-27 20:18:21 
 * @Last Modified by: 伟龙
 * @Last Modified time: 2019-05-11 18:19:09
 */
export default {
    company:{ // updated
        company_name:{type:String,default:'未填写',required:true},
        company_leader:{type:String,default:'未填写',required:true},
        licence:{type:String,required:true},
        lng:{type:String},
        lat:{type:String},
        site:{type:String,required:true}, // 公司的位置
        company_leader:{type:String},
        company_tel:{type:String,required:true}, // 公司负责人电话
        company_email:{type:String,required:true},
        companyinfo_created_date:{type:Number,required:true}, // 创建监控申请的时间
        company_desc:{type:String},
        company_status:{type:Number,default:0}, // active ，平台使用已过有效期timeout
        company_role_list:{type:Array,default:[]} // 整个公司的权限角色
    },
    user:{
        user_company_id:{type:String,required:true},
        user_company_name:{type:String},
        user_name:{type:String},
        tel:{type:String,required:true},
        email:{type:String,required:true},
        password:{type:String,required:true,default:'e10adc3949ba59abbe56e057f20f883e'}, // 默认密码123456
        avatar:{type:String},
        real_name:{type:String},
        user_status:{type:Number,required:true,default:0}, // 公司审核状态,是否确认
        user_desc:{type:String},
        user_role_name:{type:String,required:true}, // 平台角色
        role_list:{type:Array}, // 角色列表
        user_identity:{type:String}
    },
    power:{
        power_name:{type:String,required:true},
        collection_id:{type:String,required:true},
        collection_name:{type:String,required:true},
        action_id:{type:String,required:true},
        action:{type:String,required:true}, // 动作名称
        power_desc:{type:String},
        power_created_date:{type:String,default:Date.now()}
    },
    warn:{
        warn_company_id:{type:String,required:true},
        warn_area_id:{type:String,required:true}, // 指标预警字典值
        warn_area_name:{type:String,required:true}, // 选取指标名称后
        warn_dev_id:{type:String,required:true},
        warn_dev_name:{type:String,required:true},
        warn_d_id:{type:String,required:true},
        warn_dir_name:{type:String,required:true},
        msg:{type:String,default:'注意! 该指标已达到预警值'},
        warn_status:{type:String}, // 默认关闭该预警
        warn_created_date:{type:String},
        warn_modifier:{type:String},
        warn_modified_date:{type:Number},
        min_val:{type:Number},
        max_val:{type:Number},
        receive:{type:Array,required:true}, // 接收人组
        receive_name_list:{type:Array,required:true},
        unit:{type:String}
    },
//     _id
// role_name
// role_level
// power_list
// table_data_list
// role_desc
// role_scene
    role:{
        role_name:{type:String,required:true},
        role_level:{type:Number,required:true,default:0},
        power_list:{type:Array,default:[]}, // [power_id}]
        table_data_list:{type:Array,default:[]},// ['']
        role_desc:{type:String},
        role_scene:{type:String,required:true}, // 通过session跟踪添加的场景
    },
    area:{
        area_company_id:{type:String,default:'未填写'}, //公司id 必填
        area_name:{type:String,default:'未填写',required:true},
        area_desc:{type:String},
        area_pic:{type:String},
        area_created_date:{type:Number,default:Date.now()},  // 必填
        area_modified_date:{type:Number,default:Date.now()},
        area_modifier:{type:String}, // 必填
    },
    dev:{
        dev_company_id:{type:String,required:true},
        dev_id:{type:String,required:true},
        dev_area_id:{type:String,required:true},
        dev_area_name:{type:String},
        dev_name:{type:String,required:true},
        dev_desc:{type:String}
    },
    msg:{
        msg_dir_id:{type:String,required:true},
        msg_dir_name:{type:String,required:true},
        msg_value:{type:Number,required:true},
        msg_date:{type:Number},
        msg_dev_id:{type:String,required:true},
        msg_unit:{type:String},
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
    
    // user:{
    //     user_company_id:{type:String,required:true},
    //     tel:{type:String,required:true},
    //     user_name:{type:String,required:true},
    //     password:{type:String,required:true,default:'123456'},
    //     avatar:{type:String},
    //     user_desc:{type:String},
    //     real_name:{type:String}, // 真实姓名
    //     user_status:{type:Number,required:true,default:0}, // 公司审核状态,是否确认
    //     role_id:{type:String,required:true,default:''}, // 角色id，没什么用
    //     user_role_name:{type:String,required:true}, // 平台角色
    //     role:{type:Array,default:[]} // 角色ID列表
    // },
    
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
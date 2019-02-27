/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-02-27 22:09:00 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-02-27 22:18:02
 */
module.exports = {
    ip:{type:String,required:true},
    company_name:{type:String,required:true},
    subnet_ip:{type:String,required:true},
    params:{type:Array,required:true,default:[]},
}

var params = {
    name1:{
        data:'', // 融合后
        dev_list:[ // 昧融合前
            {did:'',data:''},
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
}
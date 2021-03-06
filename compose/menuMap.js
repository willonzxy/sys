import CONFIG from '../config/config.json'
const resolvePath = (url='') => CONFIG.base_path + url;
/** 前端路由映射 */
export default {
    company_admin:{
        area:{
            to:resolvePath('/area'),
            icon:'area-chart',
            key:1,
            label:'区域监控',
        },
        dev:{
            to:resolvePath('/dev'),
            icon:'inbox',
            key:2,
            label:'设备管理',
        },
        // warehouse:{
        //     to:resolvePath('/warehouse'),
        //     icon:'inbox',
        //     key:2,
        //     label:'仓储管理',
        // },
        warn:{
            to:resolvePath('/warn'),
            icon:'warning',
            key:3,
            label:'预警配置',
        },
        user:{
            to:resolvePath('/userctrl'),
            icon:'inbox',
            key:4,
            label:'人员管理',
        },
        role:{
            to:resolvePath('/rolectrl'),
            icon:'inbox',
            key:5,
            label:'角色管理',
        },
        msg:{
            to:resolvePath('/msg'),
            icon:'inbox',
            key:6,
            label:'数据阅览',
        }
    },
    common_user:{
        area:{
            to:resolvePath('/area'),
            icon:'area-chart',
            key:1,
            label:'区域监控',
        },
        warn:{
            to:resolvePath('/warn'),
            icon:'warning',
            key:3,
            label:'预警配置',
        },
        user:{
            to:resolvePath('/userctrl'),
            icon:'inbox',
            key:4,
            label:'人员管理',
        },
        role:{
            to:resolvePath('/rolectrl'),
            icon:'inbox',
            key:5,
            label:'角色管理',
        },
        msg:{
            to:resolvePath('/msg'),
            icon:'inbox',
            key:6,
            label:'数据阅览',
        }
    },
    platform_admin:{
        company:{
            to:resolvePath('/company'),
            icon:'inbox',
            key:3,
            label:'公司管理',
        },
        user:{
            to:resolvePath('/userctrl'),
            icon:'inbox',
            key:5,
            label:'人员管理',
        },
        role:{
            to:resolvePath('/rolectrl'),
            icon:'inbox',
            key:4,
            label:'角色管理',
        },
        power:{
            to:resolvePath('/powerctrl'),
            icon:'inbox',
            key:1,
            label:'权限管理',
        },
        dir:{
            to:resolvePath('/dir'),
            icon:'inbox',
            key:2,
            label:'字典管理',
        },
    }
}
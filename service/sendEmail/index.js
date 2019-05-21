/*
 * @Author: willon 伟龙 
 * @Date: 2019-04-23 17:37:44 
 * @Last Modified by: 伟龙
 * @Last Modified time: 2019-04-23 18:56:27
 */

// 引入 nodemailer
import nodemailer from 'nodemailer'
// 创建一个SMTP客户端配置
let config = {
    host: 'smtp.qq.com',
    port: 465,
    auth: {
        user: 'willonmy@qq.com', //邮箱账号
        pass: 'nfnjumyedthwbbjf'  //邮箱的授权码
    }
};

// 创建一个SMTP客户端对象
let transporter = nodemailer.createTransport(config);

// 发送邮件
function send(mail){
    return new Promise((resolve,reject)=>{
        transporter.sendMail(mail, function(error, info){
            if(error) {
                return reject(error);
            }
            console.log('mail sent:', info.response);
            resolve()
        });
    })
};

// 创建一个邮件对象
let mail = {
    // 发件人
    from: 'willonmy@qq.com',
    // 主题
    subject: '农业气象监控平台信息',
    // 收件人
    to: '',
    // 邮件内容，HTML格式
    text: '未填写', //可以是链接，也可以是验证码
    html:``,
};

export default function(props={}){
    mail = {...mail,...props}
    let {caption,user_company_name,user_name,receive_name,warn_area_name,warn_dev_name,warn_dir_name,min_val,max_val,unit,msg} = mail;
    mail.html = `<table border="1" style="text-align: center;border-collapse: collapse;width:700px;">
    <thead>
        <caption>${caption}</caption>
        <tr>
            <th>公司</th>
            <th>发起人</th>
            <th>接收人</th>
            <th>设备所在区域</th>
            <th>设备号</th>
            <th>监控指标</th>
            <th>阈值下限</th>
            <th>阈值上限</th>
            <th>单位</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${user_company_name}</td>
            <td>${user_name}</td>
            <td>${receive_name}</td>
            <td>${warn_area_name}</td>
            <td>${warn_dev_name}</td>
            <td>${warn_dir_name}</td>
            <td>${min_val}</td>
            <td>${max_val}</td>
            <td>${unit}</td>
        </tr>
    </tbody>
</table>
<span>备注：</span></br>
<b>${msg}</b>
`;
    // if(!mail.to){
    //     return Promise.resolve().then(()=>'接收人未填写')
    // }
    return send(mail)
}
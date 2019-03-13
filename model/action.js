/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-03-11 16:23:45 
 * @Last Modified by: 伟龙-Willon
 * @Last Modified time: 2019-03-13 18:49:34
 */
import Mongoose from "mongoose"
/* import dbConnect from "../db/connect.js" */

export default function (db,name,scheme){
    /** 映射实体*/
    let Schema = new Mongoose.Schema(scheme);

    let modelName = name;

    Schema.statics = {
        /**
         * 根据_id删除消息信息
         * @param {String} id 
         */
        removeById(id){
            let _id = Mongoose.Types.ObjectId(id),that = this;
            return new Promise((resolve,reject)=>{
                that.model(modelName).remove({_id},(err)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve();
                    }
                }); 
            })
            
        },

        /**
         * 完善消息信息
         * @param {obj} condition 
         * @param {obj} update 
         * @param {obj} options 
         */
        updateInfo(condition,update,options={multi:true}){
            let that = this;
            return new Promise((resolve,reject)=>{
                that.model(modelName).updateOne(condition,update,options,(err)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve();
                    }
                })
            })
            
        },

        /**
         * 分页请求获取消息信息
         * @param {obj} query 
         */
        list(query = {}){                //返回一个Promise 对象
            query.pageNum = query.pageNum?~~query.pageNum-1:0;
            query.pageSize = query.pageSize?~~query.pageSize:10;
            query.sortBy = query.sortBy?query.sortBy:'date';
            query.sortWay = query.sortWay?query.sortWay:-1;//默认降序
            query.filter = {};
            for(let k in query){
                if(k == 'pageNum' || k == 'pageSize' || k == 'sortBy' || k == 'sortWay' || k == 'filter' ){
                    continue
                }
                query.filter[k] = query[k];
            }
            let that = this;
            let f = new Promise((resolve,reject)=>{
                that.model(modelName).find(query.filter).skip(query.pageNum*query.pageSize).limit(query.pageSize).sort({_id:query.sortWay}).exec((err,result)=>{
                    if(err){
                        console.log(err);
                        reject('获取当前页数据失败');
                    }else{
                        resolve(result);
                    }
                });
            });
            return f.then(
                (result) => new Promise((resolve,reject)=>{
                    that.model(modelName).estimatedDocumentCount(query.filter,(err,num)=>{
                        if(err){
                            reject('获取数据总数失败');
                        }else{
                            let total = num>0 ? ~~((num-1) / query.pageSize)+1 : 0;
                            resolve({list:result,numTotal:num,pageTotal:total});
                        }
                    })
                }),
                err => Promise.reject(err)
            )
            
        },
        /**
         * 保存消息的基本信息
         * @param {obj} obj 
         */
        add(obj){
            console.log('adasdasdnnnn')
            console.log(obj)
            let that = this;
            return new Promise((resolve,reject)=>{
                that.model(modelName).create(obj,err=>{
                    if(err){
                        console.log(err);
                        reject({status:2,msg:'保存信息失败'});
                    }else{
                        resolve();
                    }
                })
            })
        }
    }

    return db.model(modelName,Schema);
}
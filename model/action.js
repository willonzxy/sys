/*
 * @Author: 伟龙-Willon qq:1061258787 
 * @Date: 2019-03-11 16:23:45 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-04-16 03:35:56
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
                that.model(modelName).deleteOne({_id},(err)=>{
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
            condition._id && (condition._id = Mongoose.Types.ObjectId(condition._id))
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
        list(query = {},options){                //返回一个Promise 对象
            query.pageNum = query.pageNum?~~query.pageNum-1:0;
            query.pageSize = query.pageSize?~~query.pageSize:5;
            query.sortBy = query.sortBy?query.sortBy:'date';
            query.sortWay = query.sortWay?query.sortWay:-1;//默认降序
            query.regExp || (query.regExp = []); //以正则形式匹配某些字段 
            query.filter = {};
            query._id && (query.filter._id = Mongoose.Types.ObjectId(query._id))
            for(let k in query){
                if(k == 'pageNum' || k == 'pageSize' || k == 'sortBy' || k == 'sortWay' || k == 'filter' || k == 'regExp'){
                    continue
                }
                query.filter[k] = query.regExp.includes(k) ? new RegExp(query[k]) : query[k];
               
            }
            let that = this;
            let f = new Promise((resolve,reject)=>{
                that.model(modelName).find(query.filter,options).skip(query.pageNum*query.pageSize).limit(query.pageSize).sort({_id:query.sortWay}).exec((err,result)=>{
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
                            resolve({list:result,numTotal:num,pageTotal:total,count:result.length,currentPage:query.pageNum+1,pageSize:query.pageSize});
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
        },
        _findOne(obj){
            let that = this;
            return new Promise((resolve,reject)=>{
                that.model(modelName).findOne(obj,(err,data)=>{
                    if(err){
                        reject({status:2,msg:'不存在该信息'});
                    }else if(!data){
                        resolve()
                    }else{
                        resolve(data)
                    }
                })
            })
        }
    }

    return db.model(modelName,Schema);
}
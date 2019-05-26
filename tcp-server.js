/*
 * @Author: willon 伟龙 
 * @Date: 2019-04-24 04:08:57 
 * @Last Modified by: 伟龙
 * @Last Modified time: 2019-05-10 08:52:05
 */
/** 使用tcp服务器看看能不能接受到相应的数据 */

var net = require('net');
const handleSendData = function(data){
    return new Buffer(new Uint16Array(data))
}
const DATA = {
    login:{
        res:[0x88,0xFB,0xAF,]
    }
}
/* 创建TCP服务器 */
var server = net.createServer(function(socket){
    /* 获取地址信息 */
    var address = server.address();
    var message = "the server address is"+JSON.stringify(address);

    /* 发送数据 */
    // socket.write(message,function(){
    //     var writeSize = socket.bytesWritten;

    //     console.log(message + "has send");
    //     console.log("the size of message is"+writeSize);
    //     console.log(writeSize)
    // })

    /* 监听data事件 */
    socket.on('data',function(data){
        console.log(Object.prototype.toString.call( data));
       
        console.log(data[0] === 0x88)
        var readSize = socket.bytesRead; // 读取到长度
        console.log("the size of data is");
        console.log(readSize)
    })
})

/* 获取地址信息 */
server.listen(2020,function(){
    console.log("Creat server on 2020");
})

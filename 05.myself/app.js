// 开启http服务 引入http模块
let http = require('http');
//生成路径
let path =require('path');
// 引入文件
let fs =require('fs');
// 引入第三方模块 mine模块
let mime=require('mime');
// 引入querrstring模块
let querystring=require('querystring');
// 配置网站的根目录
let rootPath = path.join(__dirname,'www');
// 开启服务
http.createServer((request,response)=>{
// 根据请求的URL生成绝对路径
  let filePath=path.join(rootPath,querystring.unescape(request.url));
  // console.log(filePath);

  // 判断文件夹或文件是否存在
  let isExist=fs.existsSync(filePath);
  // 如果存在
  if(isExist){
    // 有就生成文件列表
    fs.readdir(filePath,(err,files)=>{
      // 如果不是文件夹 就会出错 就是文件
      if(err){
        // console.log(err);
        // console.log('不是文件夹');
        // 进入这里说明是文件
        fs.readFile(filePath,(err,data)=>{
          if(err){
            console.log(err);
          }else{
            response.writeHead(200, {
              "content-type": mime.getType(filePath)
            });

            // 判断文件类型是什么 设置不同的mime类型返回给浏览器

            response.end(data);
          }
        })
      }
      // 这里表示就是文件jia
      else{
        // console.log(files);
        // 判断是否有首页
        if(files.indexOf('index.html')!=-1){
          // 有首页  直接读取
          fs.readFile(path.join(filePath,"index.html"),(err,data)=>{
            if(err){
              // console.log(err);
            }else{
              response.end(data);
            }
          })
        }
        
        else{
         // 没有首页
         let backData = "";
         for (let i = 0; i < files.length; i++) {
           // 根目录 request.url => /
           // 默认拼接的都是 ./ 只能访问根目录
           // 根据请求的url 进行判断 拼接上一级目录的地址 进行即可进行访问
           backData += `<h2><a href="${
             request.url == "/" ? "" : request.url
           }/${files[i]}">${files[i]}</a></h2>`;
         }
         response.writeHead(200, {
           "content-type": "text/html;charset=utf-8"
         });
         response.end(backData);
       }
      }
    })
  }
// 如果不存在
  else{
    // 返回404
  response.writeHead(404,{
    "content-type":"text/html;charest=utf-8"
  })
  // 返回数据
  response.end(`<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
  <html><head>
  <title>404 Not Found</title>
  </head><body>
  <h1>Not Found</h1>
  <p>The requested URL /index.hththt was not found on this server.</p>
  </body></html>`)
  }
  // response.end('heiI')
}).listen(80,'127.0.0.1',()=>{
  console.log('开启成功  127.0.0.1');
})
// 开启监听

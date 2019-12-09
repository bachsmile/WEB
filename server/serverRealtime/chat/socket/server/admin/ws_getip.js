wss_getip.on("connection",function(ws,request){
    ip=request.connection.remoteAddress;
    ws.send(ip);
});
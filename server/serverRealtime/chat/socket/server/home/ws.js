wss.on("connection", function(ws,request){
    
    var date = new Date();
    var year = date.getFullYear();
    var items = {"data":null};
    items.online=clients.length;
    var paginate=5;
    items.paginate=paginate;
    // var count_list_diem='SELECT COUNT(*) AS dem FROM diem WHERE nam='+year;
    // var list_diem='SELECT * FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id INNER JOIN diem ON nganh.nganh_id=diem.nganh_id WHERE diem.nam="'+year+'" LIMIT 0,'+paginate;

    // connection.query(count_list_diem,function(err,result){
    //     items.count=Math.ceil(result[0].dem/paginate);
    //     items.page=1;
    // });
    // connection.query(list_diem,function(err,result){
    //     items.data=result;
    // });
    // connection.query('SELECT * FROM truong',function(err,result){
    //     items.truong=result;
    //     ws.send(JSON.stringify(items));
    // });
    //lang nghe client
    ws.on('message',function(message,req){
      console.log(message)
        var ip_send=message.ip;
        var obj = JSON.parse(message);
        if(obj.message==1){
            clients.forEach(function(client){
                if(obj.ipTo==client.ip){
                    client.ws.forEach(function(client_ws){
                        wss.clients.forEach(function e(ws_s){
                            if(ws_s==client_ws){
                                ws_s.send('{"message":"'+obj.content+'","ip":"'+obj.ipFrom+'","name":"'+obj.name+'"}');
                            }
                        });
                    })
                }
            });
        }else if( obj.admin==1 ){
            var ip_admin=[];
            var ip_client=[];
            var session=obj.session;
            clients.forEach(function(client,stt){
                if(client.ip==session.ip){
                    ip_admin.push({"name":session.fullname+"(Admin)","ip":client.ip});
                    clients[stt].name=session.fullname+"(Admin)";
                    clients[stt].admin=1;
                }else{
                    ip_client.push({"name":"client"+client.ip,"ip":client.ip});
                }
            });
            var ar_ip=ip_admin.concat(ip_client);
            wss.clients.forEach(function e(client){
                client.send(JSON.stringify({"people":ar_ip,"ip":client._socket.remoteAddress}));
            });
        }else if(obj.MaID==1){
            ip=obj.content;
            if(clients.length==0){
                var ar_ws=[];
                ar_ws.push(ws);
                var client = {
                    "ws":ar_ws,
                    "ip":ip,
                    "name":"Client"+ip,
                    "admin":0
                };
                clients.push(client);
            }else{
                var i=0;
                clients.forEach(function(client,stt){
                    if(client.ip==ip){
                        i--;
                        clients[stt].ws.push(ws);
                    }else{
                        i++;
                    }
                });
                if(clients.length==i){
                    var ar_ws=[];
                    ar_ws.push(ws);
                    var client = {
                        "ws":ar_ws,
                        "ip":ip,
                        "name":"Client"+ip,
                        "admin":0
                    };
                    clients.push(client);
                }
            }
        
            var ar_ip=[];
            clients.forEach(function(client,stt){
                ar_ip.push({"name":client.name,"ip":client.ip});
            });
            
            console.log("Co "+clients.length+" nguoi online !");
            wss.clients.forEach(function e(client){
                var items = JSON.parse('{"data":null}');
                    items.count=null;
                    items.page=null;
                    items.paginate=null;
                    items.online=clients.length;
                    items.people=ar_ip;
                    console.log(ar_ip)
        
                    items.ip=client._socket.remoteAddress;
                    client.send(JSON.stringify(items));
            });
        }
        else if(obj.updateAction==1){
         var updateAuc='UPDATE product_auction SET ID_auction="'+obj.ID_auction+'",Name_auction="'+obj.Name_auction+'",Price_start="'+obj.Price_start+'",charity_percent="'+obj.charity_percent+'",Time_start="'+obj.Time_start+'",Time_end="'+obj.Time_end+'",Detail="'+obj.Detail+'",Price_end="'+obj.Price_end+'",Shop="'+obj.Shop+'",Title="'+obj.Title+'",Rate="'+obj.Rate+'",img="'+obj.img+'" WHERE ID_auction="'+obj.ID_auction+'"';
                connection.query(updateAuc,function(err,result){
                    
                    var item={
                        'updateAction':1,
                        'ID_auction':obj.ID_auction,
                        'Name_auction':obj.Name_auction,
                        'Price_start':parseInt(obj.Price_start),
                        'Price_end':obj.Price_end,
                        'charity_percent':parseInt(obj.charity_percent),
                        'Time_start':obj.Time_start,
                        'Time_end':obj.Time_end,
                        'Detail':obj.Detail,
                        'Shop':obj.Shop,
                        'Title':obj.Title,
                        'Rate':parseInt(obj.Rate),
                        'img':obj.img,
                        };
                                             
                        wss.clients.forEach(function e(client){
                                client.send(JSON.stringify(item));
                        });
                });
            }
        // else if(obj.option==1){
        //     var read_nganh='SELECT * FROM nganh WHERE truong_id='+obj.truong_id;
        //     connection.query(read_nganh,function(err,result){
        //         var item={
        //             "nganh":result,
        //             "nganh_id":obj.nganh_id
        //         };
        //         ws.send(JSON.stringify(item));
        //     });
        // }
        // else if(obj.action=="add"){
        //     var add='INSERT INTO diem(diemchuan,nam,ghichu,nganh_id) VALUES("'+obj.data.diemchuan+'","'+obj.data.nam+'","'+obj.data.ghichu+'","'+obj.data.nganh_id+'")';
        //     var check='SELECT COUNT(*) AS dem FROM diem WHERE nganh_id="'+obj.data.nganh_id+'" AND nam="'+obj.data.nam+'" ';
        //     connection.query(check,function(err,result){
        //         var items={};
        //         if(result[0].dem > 0){
        //             items.tb={
        //                 "error":1,
        //                 "content":"Ngành này năm "+obj.data.nam+" đã có điểm chuẩn !"
        //             }
        //             ws.send(JSON.stringify(items));
        //         }else{
        //             connection.query(add,function(err,result){
        //                 if(!err){
        //                     var paginate=5;
        //                     var count_list_diem='SELECT COUNT(id) AS dem FROM diem WHERE nam="'+obj.data.nam+'"';
        //                     var list_diem='SELECT * FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id INNER JOIN diem ON nganh.nganh_id=diem.nganh_id WHERE diem.nam="'+obj.data.nam+'" LIMIT 0,'+paginate;
        //                     console.log(count_list_diem);
        //                     connection.query(count_list_diem,function(err,result){
        //                         items.count=Math.ceil(result[0].dem/paginate);
        //                     });
        //                     connection.query(list_diem,function(err,result){
        //                         items.data=result;
        //                         items.page=1;
        //                         items.paginate=paginate;
        //                         items.tb={
        //                             "error":0,
        //                             "content":"Thêm thành công !"
        //                         }
        //                         ws.send(JSON.stringify(items));
        //                     });
        //                 }else{
        //                     items.tb={
        //                         "error":1,
        //                         "content":"Có lỗi xảy ra !"
        //                     }
        //                     ws.send(JSON.stringify(items));
        //                 }
        //             });
        //         }
        //     });
        // }else if(obj.action=="edit"){
        //     var edit='UPDATE diem SET nganh_id="'+obj.data.nganh_id+'",nam="'+obj.data.nam+'",ghichu="'+obj.data.ghichu+'" WHERE id="'+obj.data.id+'"';
        //     var check='SELECT COUNT(*) AS dem FROM diem WHERE id!="'+obj.data.id+'" AND nganh_id="'+obj.data.nganh_id+'" AND nam="'+obj.data.nam+'" ';
        //     connection.query(check,function(err,result){
        //         var items={};
        //         if(result[0].dem > 0){
        //             items.tb={
        //                 "error":1,
        //                 "content":"Ngành này năm "+obj.data.nam+" đã có điểm chuẩn !"
        //             }
        //             ws.send(JSON.stringify(items));
        //         }else{
        //             connection.query(edit,function(err,result){
        //                 if(!err){
        //                     var paginate=5;
        //                     var count_list_diem='SELECT COUNT(id) AS dem FROM diem WHERE nam="'+obj.data.nam+'"';
        //                     var list_diem='SELECT * FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id INNER JOIN diem ON nganh.nganh_id=diem.nganh_id WHERE diem.nam="'+obj.data.nam+'" LIMIT 0,'+paginate;
        //                     console.log(count_list_diem);
        //                     connection.query(count_list_diem,function(err,result){
        //                         items.count=Math.ceil(result[0].dem/paginate);
        //                     });
        //                     connection.query(list_diem,function(err,result){
        //                         items.data=result;
        //                         items.page=1;
        //                         items.paginate=paginate;
        //                         items.tb={
        //                             "error":0,
        //                             "content":"Sửa thành công !"
        //                         }
        //                         ws.send(JSON.stringify(items));
        //                     });
        //                 }else{
        //                     items.tb={
        //                         "error":1,
        //                         "content":"Có lỗi xảy ra !"
        //                     }
        //                     ws.send(JSON.stringify(items));
        //                 }
        //             });
        //         }
        //     });
        // }else if(obj.action=="del"){
        //     var del='DELETE FROM diem  WHERE id="'+obj.data.id+'"';
        //     connection.query(del,function(err,result){
        //         if(!err){
        //             var paginate=5;
        //             var start = obj.data.page*paginate - paginate;
        //             if(obj.data.nam==0){
        //                 obj.data.nam='diem.nam > 0';
        //             }else{
        //                 obj.data.nam='diem.nam = "'+obj.data.nam+'"';
        //             }
        //             var count_list_diem='SELECT COUNT(id) AS dem FROM diem WHERE '+obj.data.nam;
        //             var list_diem='SELECT * FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id INNER JOIN diem ON nganh.nganh_id=diem.nganh_id WHERE '+obj.data.nam+' LIMIT '+start+','+paginate;
        //             console.log(count_list_diem);
        //             connection.query(count_list_diem,function(err,result){
        //                 items.count=Math.ceil(result[0].dem/paginate);
        //             });
        //             connection.query(list_diem,function(err,result){
        //                 items.data=result;
        //                 items.page=obj.data.page;
        //                 items.paginate=paginate;
        //                 items.tb={
        //                     "error":0,
        //                     "content":"Xóa thành công !"
        //                 }
        //                 ws.send(JSON.stringify(items));
        //             });
        //         }else{
        //             items.message={
        //                 "error":1,
        //                 "content":"Có lỗi xảy ra !"
        //             }
        //             ws.send(JSON.stringify(items));
        //         }
        //     });
        // }else{
        //     var paginate=5;
        //     var items = {"data":null};
        //     if(obj.truong_id==0){
        //         var truong='!=0';
        //     }else{
        //         var truong='='+obj.truong_id;
        //     }
        //     if(obj.nam==0){
        //         var nam='!=0';
        //     }else{
        //         var nam='='+obj.nam;
        //     }
            
        //     if(isNaN(obj.search)){
        //         var search ='( diem.diemchuan LIKE "%'+obj.search+'%" OR truong.matruong LIKE "%'+obj.search+'%" OR nganh.khoi LIKE "%'+obj.search+'%" OR diem.nam LIKE "%'+obj.search+'%" OR nganh.manganh LIKE "%'+obj.search+'%" OR nganh.tennganh LIKE "%'+obj.search+'%" OR truong.tentruong LIKE "%'+obj.search+'%")';
        //     }else{
        //         if(obj.search > 0 && obj.search <= 30){
        //             var search ='diem.diemchuan <= '+obj.search;
        //         }else{
        //             var search ='( diem.diemchuan LIKE "%'+obj.search+'%" OR truong.matruong LIKE "%'+obj.search+'%" OR nganh.khoi LIKE "%'+obj.search+'%" OR diem.nam LIKE "%'+obj.search+'%" OR nganh.manganh LIKE "%'+obj.search+'%" OR nganh.tennganh LIKE "%'+obj.search+'%" OR truong.tentruong LIKE "%'+obj.search+'%")';
        //         }
        //     }
        //     var start=obj.page*paginate - paginate;
        //     var count_action_list='SELECT COUNT(*) as dem FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id INNER JOIN diem ON nganh.nganh_id=diem.nganh_id WHERE truong.truong_id'+truong+' AND diem.nam'+nam+' AND '+search;
        //     var action_list='SELECT * FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id INNER JOIN diem ON nganh.nganh_id=diem.nganh_id WHERE truong.truong_id'+truong+' AND diem.nam'+nam+' AND '+search+' LIMIT '+start+','+paginate;
        //     connection.query(action_list,function(err,result){
        //         if(err)throw err;
        //         else{
        //             items.data=result;
        //             items.truong=null;
        //             connection.query(count_action_list,function(err,result){
        //                 items.count=Math.ceil(result[0].dem/paginate);
        //                 items.paginate=paginate;
        //                 items.page=obj.page;
        //                 ws.send(JSON.stringify(items));
        //             });
        //         }
        //     });
        // }
    });
    ws.on('close',function(){
        console.log("Co client da thoat");
        clients.forEach(function(client,stt){
            client.ws.forEach(function(item,i){
                if(item==ws){
                    clients[stt].ws.splice(i,1);
                }
            });
            if(client.ws.length==0){
                clients.splice(stt,1);
            }
        });
        var ip_admin=[];
        var ip_client=[];
        clients.forEach(function(client){
            if(client.admin==1){
                ip_admin.push({"name":client.name,"ip":client.ip});
            }else{
                ip_client.push({"name":client.name,"ip":client.ip});
            }
        });
        var ar_ip=ip_admin.concat(ip_client);
        console.log("Co "+clients.length+" nguoi online !");
        wss.clients.forEach(function e(client){
            var items = JSON.parse('{"data":null}');
                items.count=null;
                items.page=null;
                items.truong=null;
                items.paginate=null;
                items.people=ar_ip;
                items.ip=client._socket.remoteAddress;
                items.online=clients.length;
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(items));
                }
        });
    });
});
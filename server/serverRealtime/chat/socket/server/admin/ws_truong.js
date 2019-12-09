wss_truong.on("connection",function(ws,request){
    var items={
        "data":null,
        "count":0,
        "paginate":5,
        "page":1,
        "count":null
    };
    var read_truong='SELECT * FROM truong LIMIT 0,'+items.paginate;
    var count_truong='SELECT COUNT(*) AS dem FROM truong';
    connection.query(count_truong,function(err,result){
        items.count=Math.ceil(result[0].dem/items.paginate);
    });
    connection.query(read_truong,function(err,result){
        items.data=result;
        ws.send(JSON.stringify(items));
    });
    ws.on('message',function(message,req){
        var json = JSON.parse(message);
        var items={
            "data":null,
            "count":0,
            "paginate":5,
            "page":1,
            "count":null
        };
        if(json.list==1){
            var start = json.page*items.paginate-items.paginate;
            var read_truong='SELECT * FROM truong WHERE tentruong LIKE "%'+json.search+'%" OR matruong LIKE "%'+json.search+'%" LIMIT '+start+','+items.paginate;
            var count_truong='SELECT COUNT(*) AS dem FROM truong WHERE tentruong LIKE "%'+json.search+'%" OR matruong LIKE "%'+json.search+'%"';
            connection.query(count_truong,function(err,result){
                items.count=Math.ceil(result[0].dem/items.paginate);
            });
            connection.query(read_truong,function(err,result){
                items.data=result;
                items.page=json.page;
                ws.send(JSON.stringify(items));
            });
        }else if(json.action=="add"){
            var add='INSERT INTO truong (tentruong, matruong) VALUES ("'+json.data.tentruong+'","'+json.data.matruong+'")';
            var check='SELECT COUNT(*) AS dem FROM truong WHERE tentruong="'+json.data.tentruong+'" OR matruong="'+json.data.matruong+'"';
            connection.query(check,function(err,result){
                if(result[0].dem > 0){
                    items.message={
                        "error":1,
                        "content":"Tên trường hoặc mã trường bị trùng !"
                    }
                    ws.send(JSON.stringify(items));
                }else{
                    connection.query(add,function(err,result){
                        if(!err){
                            var read_truong='SELECT * FROM truong LIMIT 0,'+items.paginate;
                            var count_truong='SELECT COUNT(*) AS dem FROM truong';
                            connection.query(count_truong,function(err,result){
                                items.count=Math.ceil(result[0].dem/items.paginate);
                            });
                            connection.query(read_truong,function(err,result){
                                items.data=result;
                                items.message={
                                    "error":0,
                                    "content":"Thêm thành công !"
                                }
                                ws.send(JSON.stringify(items));
                            });
                        }else{
                            items.message={
                                "error":1,
                                "content":"Có lỗi xảy ra !"
                            }
                            ws.send(JSON.stringify(items));
                        }
                    });
                }
            });
        }else if(json.action=="edit"){
            var edit='UPDATE truong SET tentruong="'+json.data.tentruong+'", matruong="'+json.data.matruong+'" WHERE truong_id="'+json.data.truong_id+'"';
            var check='SELECT COUNT(*) AS dem FROM truong WHERE truong_id!="'+json.data.truong_id+'" AND (tentruong="'+json.data.tentruong+'" OR matruong="'+json.data.matruong+'")';
            connection.query(check,function(err,result){
                if(result[0].dem > 0){
                    items.message={
                        "error":1,
                        "content":"Tên trường hoặc mã trường bị trùng !"
                    }
                    ws.send(JSON.stringify(items));
                }else{
                    connection.query(edit,function(err,result){
                        if(!err){
                            var start = json.data.page*items.paginate-items.paginate;
                            var read_truong='SELECT * FROM truong LIMIT '+start+','+items.paginate;
                            var count_truong='SELECT COUNT(*) AS dem FROM truong';
                            connection.query(count_truong,function(err,result){
                                items.count=Math.ceil(result[0].dem/items.paginate);
                            });
                            connection.query(read_truong,function(err,result){
                                items.data=result;
                                items.page=json.data.page;
                                items.message={
                                    "error":0,
                                    "content":"Sửa thành công !"
                                }
                                ws.send(JSON.stringify(items));
                            });
                        }else{
                            items.message={
                                "error":1,
                                "content":"Có lỗi xảy ra !"
                            }
                            ws.send(JSON.stringify(items));
                        }
                    });
                }
            });
        }else if(json.action=="del"){
            var start = json.page*items.paginate-items.paginate;
            var del='DELETE FROM truong  WHERE truong_id="'+json.data.truong_id+'"';
            connection.query(del,function(err,result){
                if(!err){
                    var start = json.data.page*items.paginate-items.paginate;
                    var read_truong='SELECT * FROM truong LIMIT '+start+','+items.paginate;
                    var count_truong='SELECT COUNT(*) AS dem FROM truong';
                    connection.query(count_truong,function(err,result){
                        items.count=Math.ceil(result[0].dem/items.paginate);
                    });
                    connection.query(read_truong,function(err,result){
                        items.data=result;
                        items.page=json.data.page;
                        items.message={
                            "error":0,
                            "content":"Xóa thành công !"
                        }
                        ws.send(JSON.stringify(items));
                    });
                }else{
                    items.message={
                        "error":1,
                        "content":"Có lỗi xảy ra !"
                    }
                    ws.send(JSON.stringify(items));
                }
            });  
        }
    });
});
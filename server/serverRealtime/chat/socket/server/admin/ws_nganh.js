wss_nganh.on("connection",function(ws,request){
    var items={
        "data":null,
        "count":0,
        "paginate":5,
        "page":1
    };
    var read_nganh='SELECT * FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id LIMIT 0,'+items.paginate;
    var count_nganh='SELECT COUNT(*) AS dem FROM nganh';
    connection.query(count_nganh,function(err,result){
        items.count=Math.ceil(result[0].dem/items.paginate);
    });
    connection.query(read_nganh,function(err,result){
        items.data=result;
    });
    connection.query('SELECT * FROM truong',function(err,result){
        items.truong=result;
        ws.send(JSON.stringify(items));
    });
    ws.on('message',function(message,req){
        var json = JSON.parse(message);
        var items={
            "data":null,
            "count":0,
            "paginate":5,
            "page":1,
        };
        if(json.list==1){
            var start = json.data.page*items.paginate - items.paginate;
            if(json.data.truong_id==0){ var truong_id=">0"; }else{ var truong_id="="+json.data.truong_id; }
            var read_nganh='SELECT * FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id WHERE truong.truong_id '+truong_id+' AND ( truong.tentruong LIKE "%'+json.data.search+'%" OR truong.matruong LIKE "%'+json.data.search+'%" OR nganh.tennganh LIKE "%'+json.data.search+'%" OR nganh.manganh LIKE "%'+json.data.search+'%" OR nganh.khoi LIKE "%'+json.data.search+'%" ) LIMIT '+start+','+items.paginate;
            var count_nganh='SELECT COUNT(*) AS dem FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id WHERE truong.truong_id'+truong_id+' AND ( truong.tentruong LIKE "%'+json.data.search+'%" OR truong.matruong LIKE "%'+json.data.search+'%" OR nganh.tennganh LIKE "%'+json.data.search+'%" OR nganh.manganh LIKE "%'+json.data.search+'%" OR nganh.khoi LIKE "%'+json.data.search+'%" )';
            connection.query(count_nganh,function(err,result){
                console.log(count_nganh);
                items.count=Math.ceil(result[0].dem/items.paginate);
            });
            connection.query(read_nganh,function(err,result){
                console.log(read_nganh);
                items.data=result;
                items.page=json.data.page;
                ws.send(JSON.stringify(items));
            });
        }else if(json.action=="add"){
            var add='INSERT INTO nganh (tennganh, manganh, khoi, truong_id) VALUES ("'+json.data.tennganh+'","'+json.data.manganh+'","'+json.data.khoi+'","'+json.data.truong_id+'")';
            var check='SELECT COUNT(*) AS dem FROM nganh WHERE truong_id="'+json.data.truong_id+'" AND (tennganh="'+json.data.tennganh+'" OR manganh="'+json.data.manganh+'")';
            connection.query(check,function(err,result){
                if(result[0].dem > 0){
                    items.message={
                        "error":1,
                        "content":"Tên ngành hoặc mã mã bị đã tồn tại !"
                    }
                    ws.send(JSON.stringify(items));
                }else{
                    connection.query(add,function(err,result){
                        if(!err){
                            var read_nganh='SELECT * FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id LIMIT 0,'+items.paginate;
                            var count_nganh='SELECT COUNT(*) AS dem FROM nganh';
                            connection.query(count_nganh,function(err,result){
                                items.count=Math.ceil(result[0].dem/items.paginate);
                            });
                            connection.query(count_nganh,function(err,result){
                                items.data=result;
                            });
                            connection.query(read_nganh,function(err,result){
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
            var edit='UPDATE nganh SET tennganh="'+json.data.tennganh+'", manganh="'+json.data.manganh+'", khoi="'+json.data.khoi+'" WHERE nganh_id="'+json.data.nganh_id+'"';
            var check='SELECT COUNT(*) AS dem FROM nganh WHERE nganh_id!="'+json.data.nganh_id+'" AND (tennganh="'+json.data.tennganh+'" OR manganh="'+json.data.manganh+'")';
            connection.query(check,function(err,result){
                if(result[0].dem > 0){
                    items.message={
                        "error":1,
                        "content":"Tên ngành hoặc mã ngành bị trùng !"
                    }
                    ws.send(JSON.stringify(items));
                }else{
                    connection.query(edit,function(err,result){
                        if(!err){
                            var start = json.data.page*items.paginate - items.paginate;
                            var read_nganh='SELECT * FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id LIMIT '+start+','+items.paginate;
                            var count_nganh='SELECT COUNT(*) AS dem FROM nganh';
                            connection.query(count_nganh,function(err,result){
                                items.count=Math.ceil(result[0].dem/items.paginate);
                            });
                            connection.query(read_nganh,function(err,result){
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
            var del='DELETE FROM nganh  WHERE nganh_id="'+json.data.nganh_id+'"';
            connection.query(del,function(err,result){
                if(!err){
                    var start = json.data.page*items.paginate - items.paginate;
                    var read_nganh='SELECT * FROM truong INNER JOIN nganh ON truong.truong_id=nganh.truong_id LIMIT '+start+','+items.paginate;
                    var count_nganh='SELECT COUNT(*) AS dem FROM nganh';
                    connection.query(count_nganh,function(err,result){
                        items.count=Math.ceil(result[0].dem/items.paginate);
                    });
                    connection.query(read_nganh,function(err,result){
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
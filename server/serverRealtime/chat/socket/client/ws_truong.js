var ws_truong = new WebSocket("ws://192.168.1.7:3001");
ws_truong.onopen = function () {
    console.log("Load trang chu thanh cong !");
    ws_truong.onmessage = function (event) {
        var obj = JSON.parse(event.data);
        console.log(obj);
        i = 0;
        if (obj.data != null) {
            document.getElementById("list_truong").innerHTML = "";
            obj.data.forEach(function (item) {
                i++;
                printList_truong(
                    i,
                    item.truong_id,
                    item.tentruong,
                    item.matruong,
                    obj.paginate,
                    obj.page
                );
            });
        }
        if (obj.count != null) {
            printPaginate_truong(obj.count, obj.page);
        }
        if (obj.message != null) {
            printMessage_truong(obj.message);
        }
    }
}
ws_truong.onclose = function () {
    console.log("Mat ket noi voi may chu !");
    swal("Mất kết nối với máy chủ !", "", "error");
}
document.getElementById("form_search_truong").onsubmit = function () {
    var search = document.getElementById('search_truong').value;
    console.log(search);
    var json = '{"list":1,"search":"' + search + '","page":1}';
    ws_truong.send(json);
    document.getElementById('list_truong').innerHTML = "";
};
function page_truong(i) {
    var search = document.getElementById('search_truong').value;
    var page = i;
    var json = '{"list":1,"search":"' + search + '","page":' + page + '}';
    console.log(json);
    ws_truong.send(json);
    document.getElementById('list_truong').innerHTML = "";
}
function printList_truong(stt, id, tentruong, matruong, paginate, page) {
    var tr = document.createElement('tr');
    var vitri = paginate * page - paginate + stt;
    tr.innerHTML = "<td>" + vitri + "</td>" +
        "<td id='tentruong" + id + "'>" + tentruong + "</td>" +
        "<td id='matruong" + id + "'>" + matruong + "</td>" +
        "<td><a class='btn btn-success' onclick='sua_truong(" + id + ")'>Sửa</a> | <a class='btn btn-danger' onclick='del_truong(" + id + ")' >Xóa</a></td>";
    document.querySelector('tbody.list_truong').appendChild(tr);
}
function printPaginate_truong(count, page) {
    var html = "";
    var active = "";
    var onclick = "";
    if (page <= 3) {
        if (count >= 5) {
            var dau = 1;
            var cuoi = 5;
        } else {
            var dau = 1;
            var cuoi = count;
        }
    } else if (page == count) {
        var dau = count - 4;
        var cuoi = count;
    } else if (count > page) {
        var dau = page - 2;
        if (count - page >= 2) {
            var cuoi = page + 2;
        }
        var cuoi = count;
    }
    for (var i = dau; i <= cuoi; i++) {
        if (i == page) {
            active = 'active';
            onclick = 'id="active_truong"';
        } else {
            active = "";
            onclick = 'onclick="page_truong(' + i + ')" ';
        }
        html += '<li class="page-item ' + active + '"><a class="page-link" ' + onclick + ' href="javascript:void(0)">' + i + '</a></li>';
    }
    document.getElementById('paginate_truong').innerHTML = html;
}
//them truong
function them_truong() {
    document.getElementById("truong").style.display = "block";
    document.getElementById("truong_title").innerText = "Thêm trường";
    document.getElementById("truong_action").innerHTML = '<button onclick="post_add_truong()" class="btn btn-success">Thực hiện</button><button onclick="truong_form_thoat()" class="btn btn-danger">x</button>';
}
function post_add_truong() {
    var tentruong = document.getElementById("tentruong").value;
    var matruong = document.getElementById("matruong").value;
    if (tentruong == "" || matruong == "") {
        return swal("Có trường bị rỗng !", "", "error");
    } else {
        var json = {
            "action": "add",
            "data": {
                "tentruong": tentruong,
                "matruong": matruong
            }
        };
        ws_truong.send(JSON.stringify(json));
    }
}
function sua_truong(id) {
    document.getElementById("truong").style.display = "block";
    document.getElementById("truong_title").innerText = "Sửa trường";
    document.getElementById("tentruong").value = document.getElementById("tentruong" + id).innerText;
    document.getElementById("matruong").value = document.getElementById("matruong" + id).innerText;
    document.getElementById("truong_action").innerHTML = '<button onclick="post_edit_truong(' + id + ')" class="btn btn-success">Thực hiện</button><button onclick="truong_form_thoat()" class="btn btn-danger">x</button>';
}
function post_edit_truong(id) {
    var tentruong = document.getElementById("tentruong").value;
    var matruong = document.getElementById("matruong").value;
    if (tentruong == "" || matruong == "") {
        return swal("Có trường bị rỗng !", "", "error");
    } else {
        var json = {
            "action": "edit",
            "data": {
                "tentruong": tentruong,
                "matruong": matruong,
                "truong_id": id,
                "page": document.getElementById("active_truong").innerText
            }
        };
        ws_truong.send(JSON.stringify(json));
    }
}
function del_truong(id) {
    var truong = document.getElementById("tentruong" + id).innerText;
    swal({
        title: "Bạn có muốn xóa trường này không ?",
        text: truong,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
        closeOnConfirm: false,
    },
        function (isConfirm) {
            if (isConfirm) {
                var json = {
                    "action": "del",
                    "data": {
                        "truong_id": id,
                        "page": document.getElementById("active_truong").innerText
                    }
                };
                console.log(json);
                ws_truong.send(JSON.stringify(json));
            }
        }
    );
}
function truong_form_thoat() {
    document.getElementById("truong").style.display = "none";
}
function printMessage_truong(item) {
    document.getElementById("truong").style.display = "none";
    document.getElementById("tentruong").value = "";
    document.getElementById("matruong").value = "";
    if (item.error == 1) {
        return swal(item.content, "", "error");
    } else {
        return swal(item.content, "", "success");
    }
}

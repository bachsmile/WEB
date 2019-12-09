
var ws = new WebSocket("ws://192.168.1.7:3000");
ws.onopen = function () {
    console.log("Load trang chu thanh cong !");
    ws.onmessage = function (event) {
        var obj = JSON.parse(event.data);
        console.log(obj);
        i = 0;
        if (obj.data != null) {
            document.getElementById("list1").innerHTML = "";
            obj.data.forEach(function (item) {
                i++;
                printList(
                    i,
                    item,
                    obj.paginate,
                    obj.page
                );
            });
        }
        if (obj.truong != null) {
            printTruong(obj.truong);
            printYear(10);
        }
        if (obj.online != null) {
            printOnline(obj.online);
        }
        if (obj.count != null) {
            printPaginate(obj.count, obj.page);
        }
        if (obj.people != null) {
            printPeople(obj.people, obj.ip);
        }
        if (obj.message != null) {
            printMsg(obj.message, obj.ip, obj.name);
        }
        if (obj.nganh != null) {
            if (obj.nganh_id != null) {
                printNganh(obj.nganh, obj.nganh_id);
            } else {
                printNganh(obj.nganh);
            }
        }
        if (obj.tb != null) {
            printMessage_diem(obj.tb);
        }
    }
}
ws.onclose = function () {
    console.log("Mat ket noi voi may chu !");
    swal("Mất kết nối với máy chủ !", "", "error");
}
$(document).ready(function () {
    $("#truong_id").change(function () {
        var truong_id = $("#truong_id").val();
        var nam = $("#nam").val();
        console.log(truong_id + "-" + nam);
        var json = '{"truong_id":' + truong_id + ',"nam":' + nam + ',"search":"","page":1}';
        ws.send(json);
        document.getElementById('list1').innerHTML = "";
        document.getElementById('search').value = "";
    })
})
$(document).ready(function () {
    $("#nam").change(function () {
        var truong_id = $("#truong_id").val();
        var nam = $("#nam").val();
        console.log(truong_id + "-" + nam);
        var json = '{"truong_id":' + truong_id + ',"nam":' + nam + ',"search":"","page":1}';
        ws.send(json);
        document.getElementById('list1').innerHTML = "";
        document.getElementById('search').value = "";
    })
})
document.forms[2].onsubmit = function () {
    var search = document.getElementById('search').value;
    var truong_id = $("#truong_id").val();
    var nam = $("#nam").val();
    console.log(truong_id + "-" + nam + "-" + search);
    var json = '{"truong_id":' + truong_id + ',"nam":' + nam + ',"search":"' + search + '","page":1}';
    ws.send(json);
    document.getElementById('list1').innerHTML = "";
};
function page(i) {
    var truong_id = $("#truong_id").val();
    var nam = $("#nam").val();
    var search = document.getElementById('search').value;
    var page = i;
    console.log(truong_id + "-" + nam + "-" + search + "-" + page);
    var json = '{"truong_id":' + truong_id + ',"nam":' + nam + ',"search":"' + search + '","page":' + page + '}';
    ws.send(json);
    document.getElementById('list1').innerHTML = "";
}
function msg(ip, name) {
    document.getElementById("user").innerHTML = name + '<input style="display:none;" id="ip" value="' + ip + '">';
    document.getElementById("chat_box").style.display = "block";
    document.getElementById("content").style.display = "block";
    document.getElementById("msg_body").innerHTML = "";
}
function thoat() {
    document.getElementById("chat_box").style.display = "none";
}
document.forms[3].onsubmit = function () {
    var span = document.createElement('span');
    var msg = document.getElementById("msg").value;
    document.getElementById("msg").value = "";
    var ip = document.getElementById("ip").value;
    var name = document.getElementById("username").value;
    span.innerHTML = '<div class="msg_b">' + msg + '</div>';
    document.querySelector('div.msg_body').appendChild(span);
    $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    var json = '{"message":1,"content":"' + msg + '","ip":"' + ip + '","name":"' + name + '"}';
    console.log(json);
    ws.send(json);
};
function printList(stt, item, paginate, page) {
    if (item.ghichu == null) { item.ghichu = ""; }
    var tr = document.createElement('tr');
    var vitri = paginate * page - paginate + stt;
    tr.innerHTML = "<td>" + vitri + "</td>" +
        "<td id='tentruong" + item.id + "'>" + item.tentruong + "</td>" +
        "<td>" + item.matruong + "</td>" +
        "<td id='tennganh" + item.id + "'>" + item.tennganh + "</td>" +
        "<td>" + item.manganh + "</td>" +
        "<td>" + item.khoi + "</td>" +
        "<td id='nam" + item.id + "'>" + item.nam + "</td>" +
        "<td id='diemchuan" + item.id + "'>" + item.diemchuan + "</td>" +
        "<td id='ghichu" + item.id + "'>" + item.ghichu + "</td>" +
        "<td><a class='btn btn-success' onclick='sua_diem(" + item.id + "," + item.truong_id + "," + item.nganh_id + ")'>Sửa</a><a class='btn btn-danger' onclick='del_diem(" + item.id + ")' >Xóa</a></td>";
    document.querySelector('tbody.list1').appendChild(tr);
}
function printTruong(items) {
    var html = '<option value="0">Tất cả trường</option>';
    items.forEach(function (item) {
        html += '<option value="' + item.truong_id + '">' + item.tentruong + '</option>';
    })
    document.getElementById('truong_id').innerHTML = html;
}
function printYear(khoang) {
    var list = '<option value="0">Toàn bộ năm</option>';
    var d = new Date();
    var year = d.getFullYear();
    var html = "";
    for (var i = year; i > year - khoang; i--) {
        if (i != year) { selected = ""; } else { selected = "selected"; }
        html += '<option ' + selected + ' value="' + i + '">Năm ' + i + '</option>';
    }
    document.getElementById('nam').innerHTML = list + html;
    document.getElementById('diem_nam').innerHTML = html;
}
function printOnline(online) {
    document.getElementById('online').text = online + ' online';
}
function printPaginate(count, page) {
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
        if (dau <= 0) {
            dau = 1;
        }
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
            active = "active";
            onclick = '';
        } else {
            active = "";
            onclick = 'onclick="page(' + i + ')" ';
        }
        html += '<li class="page-item ' + active + '"><a class="page-link" ' + onclick + ' href="javascript:void(0)">' + i + '</a></li>';
    }
    document.getElementById('paginate').innerHTML = html;
}
function printPeople(items, ip) {
    var html = '';
    var style = "";
    var onclick = "";
    items.forEach(function (item) {
        if (item.ip == ip) {
            style = 'background: #f3dada;color: black;';
            html += '<input id="username" value="' + item.name + '" style="display:none">';
            onclick = '';
        } else {
            style = "color: black;";
            onclick = 'onclick="msg(' + "'" + item.ip + "','" + item.name + "'" + ')"';
        }
        html += '<div ' + onclick + ' style="' + style + '" class="user">' + item.name + '</div>';
    })
    document.getElementById('people').innerHTML = html;
}
function printMsg(message, ip, name) {
    document.getElementById("user").innerHTML = name + '<input style="display:none;" id="ip" value="' + ip + '">';
    document.getElementById("chat_box").style.display = "block";
    document.getElementById("content").style.display = "block";

    var span = document.createElement('span');
    span.innerHTML = '<div class="msg_a">' + message + '</div>';
    document.querySelector('div.msg_body').appendChild(span);
    $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
}
$(document).ready(function () {
    $("#option_truong_diem").change(function () {
        var truong_id = $("#option_truong_diem").val();
        var json = '{"option":1,"truong_id":' + truong_id + '}';
        ws.send(json);
    })
})
function printNganh(items, nganh_id = 0) {
    var html = '<option value="0">Chọn ngành</option>';
    items.forEach(function (item) {
        if (item.nganh_id == nganh_id) {
            html += '<option selected value="' + item.nganh_id + '">' + item.tennganh + '</option>';
        } else {
            html += '<option value="' + item.nganh_id + '">' + item.tennganh + '</option>';
        }
    })
    document.getElementById('option_nganh_diem').innerHTML = html;
}
function them_diem() {
    document.getElementById("diem").style.display = "block";
    document.getElementById("diem_title").innerText = "Thêm điểm chuẩn";
    document.getElementById("diem_diemchuan").value = "";
    document.getElementById("diem_ghichu").value = "";
}
function post_add_diem() {
    var truong_id = document.getElementById("option_truong_diem").value;
    if (truong_id == 0) { return swal("Vui lòng chọn trường !", "", "error"); }
    var nganh_id = document.getElementById("option_nganh_diem").value;
    if (nganh_id == 0) { return swal("Vui lòng chọn ngành !", "", "error"); }
    var nam = document.getElementById("diem_nam").value;
    if (nam == "") { return swal("Vui lòng nhập năm !", "", "error"); }
    var diemchuan = document.getElementById("diem_diemchuan").value;
    if (diemchuan == "") { return swal("Vui lòng nhập điểm chuẩn !", "", "error"); }
    var ghichu = document.getElementById("diem_ghichu").value;
    var json = '{"action":"add","data":{"nganh_id":"' + nganh_id + '","nam":"' + nam + '","diemchuan":"' + diemchuan + '","ghichu":"' + ghichu + '"}}';
    ws.send(json);
    document.getElementById("nam").value = nam;
}
function sua_diem(id, truong_id, nganh_id) {
    document.getElementById("diem").style.display = "block";
    document.getElementById("diem_title").innerText = "Sửa điểm chuẩn";
    document.getElementById("option_truong_diem").value = truong_id;
    document.getElementById("select2-option_truong_diem-container").innerText = document.getElementById("tentruong" + id).innerText;
    var json = '{"option":1,"truong_id":' + truong_id + ',"nganh_id":' + nganh_id + '}';
    ws.send(json);
    document.getElementById("diem_nam").value = document.getElementById("nam" + id).innerText;
    document.getElementById("diem_diemchuan").value = document.getElementById("diemchuan" + id).innerText;
    document.getElementById("diem_ghichu").value = document.getElementById("ghichu" + id).innerText;
    document.getElementById("diem_action").innerHTML = '<button onclick="post_edit_diem(' + id + ')" class="btn btn-success">Thực hiện</button>';
}
function post_edit_diem(id) {
    var truong_id = document.getElementById("option_truong_diem").value;
    if (truong_id == 0) { return swal("Vui lòng chọn trường !", "", "error"); }
    var nganh_id = document.getElementById("option_nganh_diem").value;
    if (nganh_id == 0) { return swal("Vui lòng chọn ngành !", "", "error"); }
    var nam = document.getElementById("diem_nam").value;
    if (nam == "") { return swal("Vui lòng nhập năm !", "", "error"); }
    var diemchuan = document.getElementById("diem_diemchuan").value;
    if (diemchuan == "") { return swal("Vui lòng nhập điểm chuẩn !", "", "error"); }
    var ghichu = document.getElementById("diem_ghichu").value;
    var json = '{"action":"edit","data":{"id":' + id + ',"nganh_id":"' + nganh_id + '","nam":"' + nam + '","diemchuan":"' + diemchuan + '","ghichu":"' + ghichu + '"}}';
    ws.send(json);
    document.getElementById("nam").value = nam;
}
function del_diem(id) {
    var nganh = document.getElementById("tennganh" + id).innerText;
    var truong = document.getElementById("tentruong" + id).innerText;
    swal({
        title: "Bạn có muốn xóa điểm chuẩn này không ?",
        text: truong + " - " + nganh,
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
                        "id": id,
                        "nam": document.getElementById("nam" + id).value,
                        "page": document.getElementById("active_nganh").innerText
                    }
                };
                console.log(json);
                ws.send(JSON.stringify(json));
            }
        }
    );
}
function diem_form_thoat() {
    document.getElementById("diem").style.display = "none";
}
function printMessage_diem(item) {
    document.getElementById("diem").style.display = "none";
    document.getElementById("diem_diemchuan").value = "";
    document.getElementById("diem_ghichu").value = "";
    if (item.error == 1) {
        return swal(item.content, "", "error");
    } else {
        return swal(item.content, "", "success");
    }
}

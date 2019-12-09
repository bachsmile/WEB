
var ws = new WebSocket("ws://192.168.1.103:3000");
ws.onopen = function () {
    console.log("Load trang chu thanh cong !");
    ws.onmessage = function (event) {
        var obj = JSON.parse(event.data);
        console.log(obj);
        i = 0;
        if (obj.data != null) {
            obj.data.forEach(function (item) {
                i++;
                printList(
                    i,
                    item.tentruong,
                    item.matruong,
                    item.tennganh,
                    item.manganh,
                    item.khoi,
                    item.nam,
                    item.diemchuan,
                    item.ghichu,
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
document.forms[0].onsubmit = function () {
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
document.forms[1].onsubmit = function () {
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
/*function setTitle(title){
    document.querySelector('h1').innerHTML = title;
}
*/
function printList(stt, tentruong, matruong, tennganh, manganh, khoi, nam, diemchuan, ghichu, paginate, page) {
    if (ghichu == null) { ghichu = ""; }
    var tr = document.createElement('tr');
    var vitri = paginate * page - paginate + stt;
    tr.innerHTML = "<td>" + vitri + "</td>" +
        "<td>" + tentruong + "</td>" +
        "<td>" + matruong + "</td>" +
        "<td>" + tennganh + "</td>" +
        "<td>" + manganh + "</td>" +
        "<td>" + khoi + "</td>" +
        "<td>" + nam + "</td>" +
        "<td>" + diemchuan + "</td>" +
        "<td>" + ghichu + "</td>";
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
    var html = '<option value="0">Toàn bộ năm</option>';
    var d = new Date();
    var year = d.getFullYear();
    var html = "";
    for (var i = year; i > year - khoang; i--) {
        if (i != year) { selected = ""; } else { selected = "selected"; }
        html += '<option ' + selected + ' value="' + i + '">Năm ' + i + '</option>';
    }
    document.getElementById('nam').innerHTML = html;
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

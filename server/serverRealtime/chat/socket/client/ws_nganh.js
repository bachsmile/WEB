var ws_nganh = new WebSocket("ws://192.168.1.7:3003");
ws_nganh.onopen = function () {
    console.log("Load trang chu thanh cong !");
    ws_nganh.onmessage = function (event) {
        var obj = JSON.parse(event.data);
        console.log(obj);
        i = 0;
        if (obj.data != null) {
            document.getElementById("list_nganh").innerHTML = "";
            obj.data.forEach(function (item) {
                i++;
                printList_nganh(
                    i,
                    item,
                    obj.paginate,
                    obj.page,
                );
            });
        }
        if (obj.count != null) {
            printPaginate_nganh(obj.count, obj.page);
        }
        if (obj.message != null) {
            printMessage_nganh(obj.message);
        }
        if (obj.truong != null) {
            printTruong_nganh(obj.truong);
        }
    }
}
ws_nganh.onclose = function () {
    console.log("Mat ket noi voi may chu !");
    swal("Mất kết nối với máy chủ !", "", "error");
}
function them_nganh() {
    document.getElementById("nganh").style.display = "block";
    document.getElementById("nganh_title").innerText = "Thêm ngành";
    document.getElementById("option_truong").value = "0";
    document.getElementById("select2-option_truong-container").innerText = "Chọn trường";
    document.getElementById("tennganh").value = "";
    document.getElementById("manganh").value = "";
    document.getElementById("khoi").value = "";
}
function post_add_nganh() {
    var truong_id = document.getElementById("option_truong").value;
    if (truong_id == 0) { return swal("Vui lòng chọn trường !", "", "error"); }
    var tennganh = document.getElementById("tennganh").value;
    if (tennganh == "") { return swal("Vui lòng nhập tên ngành !", "", "error"); }
    var manganh = document.getElementById("manganh").value;
    if (manganh == "") { return swal("Vui lòng nhập mã ngành !", "", "error"); }
    var khoi = document.getElementById("khoi").value;
    if (khoi == "") { return swal("Vui lòng nhập khối thi !", "", "error"); }
    var json = '{"action":"add","data":{"truong_id":' + truong_id + ',"tennganh":"' + tennganh + '","manganh":"' + manganh + '","khoi":"' + khoi + '"}}';
    ws_nganh.send(json);
}
function sua_nganh(truong_id, nganh_id) {
    document.getElementById("nganh").style.display = "block";
    document.getElementById("nganh_title").innerText = "Sửa ngành";
    document.getElementById("option_truong").value = truong_id;
    document.getElementById("select2-option_truong-container").innerText = document.getElementById("nganh_tentruong" + nganh_id).innerText;
    document.getElementById("tennganh").value = document.getElementById("nganh_tennganh" + nganh_id).innerText;
    document.getElementById("manganh").value = document.getElementById("nganh_manganh" + nganh_id).innerText;
    document.getElementById("khoi").value = document.getElementById("nganh_khoi" + nganh_id).innerText;
    document.getElementById("nganh_action").innerHTML = '<button onclick="post_edit_nganh(' + nganh_id + ')" class="btn btn-success">Thực hiện</button>';
}
function post_edit_nganh(nganh_id) {
    var truong_id = document.getElementById("option_truong").value;
    if (truong_id == 0) { return swal("Vui lòng chọn trường !", "", "error"); }
    var tennganh = document.getElementById("tennganh").value;
    if (tennganh == "") { return swal("Vui lòng nhập tên ngành !", "", "error"); }
    var manganh = document.getElementById("manganh").value;
    if (manganh == "") { return swal("Vui lòng nhập mã ngành !", "", "error"); }
    var khoi = document.getElementById("khoi").value;
    if (khoi == "") { return swal("Vui lòng nhập khối thi !", "", "error"); }
    var json = {
        "action": "edit",
        "data": {
            "nganh_id": nganh_id,
            "tennganh": tennganh,
            "manganh": manganh,
            "khoi": khoi,
            "truong_id": truong_id,
            "page": document.getElementById("active_nganh").innerText
        }
    };
    console.log(json);
    ws_nganh.send(JSON.stringify(json));
}
function del_nganh(id) {
    var nganh = document.getElementById("nganh_tennganh" + id).innerText;
    swal({
        title: "Bạn có muốn xóa trường này không ?",
        text: nganh,
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
                        "nganh_id": id,
                        "page": document.getElementById("active_nganh").innerText
                    }
                };
                console.log(json);
                ws_nganh.send(JSON.stringify(json));
            }
        }
    );
}
$(document).ready(function () {
    $("#nganh_truong_id").change(function () {
        var truong_id = $("#nganh_truong_id").val();
        var json = '{"list":1,"data":{"truong_id":' + truong_id + ',"search":"","page":1}}';
        ws_nganh.send(json);
        document.getElementById('list_nganh').innerHTML = "";
        document.getElementById('search_nganh').value = "";
    })
})
document.forms[1].onsubmit = function () {
    var search = document.getElementById('search_nganh').value;
    var truong_id = $("#nganh_truong_id").val();
    var json = '{"list":1,"data":{"truong_id":' + truong_id + ',"search":"' + search + '","page":1}}';
    ws_nganh.send(json);
    document.getElementById('list_nganh').innerHTML = "";
};
function printTruong_nganh(items) {
    var nganh = '<option value="0">Tất cả trường</option>';
    var option = '<option value="0">Chọn trường</option>';
    var html = "";
    items.forEach(function (item) {
        html += '<option value="' + item.truong_id + '">' + item.tentruong + '</option>';
    })
    document.getElementById('nganh_truong_id').innerHTML = nganh + html;
    document.getElementById('option_truong').innerHTML = option + html;
    document.getElementById('option_truong_diem').innerHTML = option + html;
}
function page_nganh(i) {
    var search = document.getElementById('search_truong').value;
    var page = i;
    var truong_id = $("#nganh_truong_id").val();
    var json = '{"list":1,"data":{"truong_id":' + truong_id + ',"search":"' + search + '","page":' + page + '}}';
    console.log(json);
    ws_nganh.send(json);
    document.getElementById('list_nganh').innerHTML = "";
}
function printList_nganh(stt, item, paginate, page) {
    var tr = document.createElement('tr');
    var vitri = paginate * page - paginate + stt;
    tr.innerHTML = "<td>" + vitri + "</td>" +
        "<td id='nganh_tentruong" + item.nganh_id + "'>" + item.tentruong + "</td>" +
        "<td id='nganh_matruong" + item.nganh_id + "'>" + item.matruong + "</td>" +
        "<td id='nganh_tennganh" + item.nganh_id + "'>" + item.tennganh + "</td>" +
        "<td id='nganh_manganh" + item.nganh_id + "'>" + item.manganh + "</td>" +
        "<td id='nganh_khoi" + item.nganh_id + "'>" + item.khoi + "</td>" +
        "<td><a class='btn btn-success' onclick='sua_nganh(" + item.truong_id + "," + item.nganh_id + ")'>Sửa</a> | <a class='btn btn-danger' onclick='del_nganh(" + item.nganh_id + ")' >Xóa</a></td>";
    document.querySelector('tbody.list_nganh').appendChild(tr);
}
function printPaginate_nganh(count, page) {
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
            onclick = 'id="active_nganh"';
        } else {
            active = "";
            onclick = 'onclick="page_nganh(' + i + ')" ';
        }
        html += '<li class="page-item ' + active + '"><a class="page-link" ' + onclick + ' href="javascript:void(0)">' + i + '</a></li>';
    }
    document.getElementById('paginate_nganh').innerHTML = html;
}
function nganh_form_thoat() {
    document.getElementById("nganh").style.display = "none";
}
function printMessage_nganh(item) {
    document.getElementById("nganh").style.display = "none";
    document.getElementById("option_truong").value = "";
    document.getElementById("tennganh").value = "";
    document.getElementById("manganh").value = "";
    document.getElementById("tentruong").value = "";
    if (item.error == 1) {
        return swal(item.content, "", "error");
    } else {
        return swal(item.content, "", "success");
    }
}

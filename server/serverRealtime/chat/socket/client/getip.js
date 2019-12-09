
var ws = new WebSocket("ws://192.168.1.7:3002");
ws.onopen = function () {
    ws.onmessage = function (event) {
        var ip = event.data;
        console.log(ip);
        document.getElementById("ip").value = ip;
    }
}
ws.onclose = function () {
    console.log("Mat ket noi voi may chu !");
}

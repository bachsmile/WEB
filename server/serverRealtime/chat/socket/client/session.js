$(document).ready(function () {
	console.log('calling ajax request');
	$.ajax('/session', {
		method: 'GET'
	})
	.done(function (data, status, xhr) {
		if (data != null) {
            var json ={
                "admin":1,
                "session":data
            };
            ws.send(JSON.stringify(json));
            console.log(json);
		}else{
			alert('ban khong phai la admin');
		}
	})
});
$(document).ready(function(){
	
	
	$('#send').click(function(){
		var text = $('#text').val();
		var nick = $('#nick').attr('value');
		var channel_id = $('#channel_api_params').attr('channel_id');
		$.ajax({
			url: '/newMessage/',
			type: 'POST',
			data:{
				text:text,
				nick:nick,
				channel_id:channel_id,
			}			
		});
	});
	
	$('#text').bind('keydown',function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		 if(code == 13) { //Enter keycode
			$('#send').trigger('click');
		 }
	});
	
	var chat_token = $('#channel_api_params').attr('chat_token');
	var channel = new goog.appengine.Channel(chat_token);
	var socket = channel.open();
	$.ajax({
		url: '/open_socket/',
		type: 'POST',
		data:{
			channel_id:channel_id,
		}			
	});
	console.log("opened socket")
	socket.onopen = function(){
	};
	socket.onmessage = function(m){
		var data = $.parseJSON(m.data);
		$('#center').append(data['html']);
		$('#center').animate({scrollTop: $("#center").attr("scrollHeight")}, 500);
	};
    socket.onerror =  function(err){
		alert("Error => "+err.description);
	};
    socket.onclose =  function(){
		alert("channel closed");
	};
	
	$(window).unload(function (){
		socket.close();
		/*var channel_id = $('#channel_api_params').attr('channel_id');
                $.post('/_ah/channel/disconnected/', {channel_id:channel_id},
                    function(data) {
                        $('#center').append(data);
                        $('#center').animate({scrollTop: $("#center").attr("scrollHeight")}, 500);
                });*/
	});
	
	
	$('#center').animate({scrollTop: $("#center").attr("scrollHeight")}, 500);
});
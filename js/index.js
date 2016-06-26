var socket = io.connect('http://localhost:5000/branch');
var chatHistory = "";
var username = "";

$(document).ready(function () {

	loginButtonOnClickListener();

 	sendButtonOnClickListener();

 	socket.on('joined room', function(msg) {
        chatHistory = msg.chat;
        console.log(chatHistory);
        $('.login-screen').hide();
        $('.main-container').fadeIn(1000);
    	populateChat(chatHistory);
    });

});

function populateChat(chatHistory) {
	if (!jQuery.isEmptyObject(chatHistory)) {

	}
}

function loginButtonOnClickListener(){
	$('.login-button').click(function(){
		username = $('.login-name').val();
		if (username.length > 0) {
			socket.emit('join', {'username': username});
		}
	});
}

function sendButtonOnClickListener() {
	$('.send-button').click(function(){
 		sendChat(); 		
	});
	$('.text-input').keypress(function(e){
		if (e.which == 13) {
			sendChat();
		}
	});
}

function sendChat(){
	var chatText = $('.text-input').val();
	chatText = chatText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	if (charText.length > 0) {
		$('.text-input').val("");
		$('.chat-item:first').clone()
							.appendTo(".chat-container")
							.show()
							.animate({top: "+=75px"}, 500)
							.find(".chat-bubble").html(chatText);
		$('.chat-container').scrollTop($('.chat-container')[0].scrollHeight);
	}
}
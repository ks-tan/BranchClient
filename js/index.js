function sendChat(){
	var chatText = $('.text-input').val();
	chatText = chatText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	$('.text-input').val("");
	$('.chat-item:first').clone()
						.appendTo(".chat-container")
						.show()
						.animate({top: "+=75px"}, 500)
						.find(".chat-bubble").html(chatText);
	$('.chat-container').scrollTop($('.chat-container')[0].scrollHeight);
}

$(document).ready(function () {
 	$('.send-button').click(function(){
 		sendChat(); 		
	});
	$('.text-input').keypress(function(e){
		if (e.which == 13) {
			sendChat();
		}
	});
});

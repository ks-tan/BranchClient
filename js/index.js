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
	$('li.conversation-item').click(function() {
		$('li.conversation-item').each(function( index ) {
		  $(this).removeClass('conversation-item-selected');
		});
		$(this).addClass('conversation-item-selected');
		$('.chat-title-bar-title').text($(this).find('.conversation-title').text());
		$('#conversation-title-avatar').attr("src",$(this).find('.conversation-avatar').prop('src'));
	});

	// on startup function calls
	showFirstConversation();
});

function showFirstConversation() {
	var firstConversation = $('ul.conversations li:nth-child(1)');
	firstConversation.addClass('conversation-item-selected');
	$('.chat-title-bar-title').text(firstConversation.find('.conversation-title').text());
	$('#conversation-title-avatar').attr("src",firstConversation.find('.conversation-avatar').prop('src'));
}
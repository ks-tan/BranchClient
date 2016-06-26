$(document).ready(function () {
 	$('.send-button').click(function(){
 		$('.chat-item:first').clone().appendTo(".chat-container").show().animate({top: "+=75px"}, 500);
 		$('.chat-container').scrollTop($('.chat-container')[0].scrollHeight);
	});
});

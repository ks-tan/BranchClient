var socket = io.connect('http://localhost:5000/branch');
var avatarColorsList = ['#EE6D79','#71E096','#698EE0','#93D4F4'];
var chatHistory = "";
var currentBranch = "";
var username = "";

$(document).ready(function () {

	loginButtonOnClickListener();

 	sendButtonOnClickListener();

 	socket.on('joined room', function(msg) {
        chatHistory = msg.chat;
        currentBranch = "main";
        $('.login-screen').hide();
        $('.main-container').fadeIn(1000);
    	populateChat(chatHistory);
    });

   	socket.on('send room message', function(msg) {
		if (msg.branch == "main" && currentBranch == "main") {
			cloneChatBubble(msg);
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

function populateChat(chatHistory) {
	if (!jQuery.isEmptyObject(chatHistory)) {
		for (var topic in chatHistory) {
			if (chatHistory.hasOwnProperty(topic)) {
				var messages = chatHistory[topic].messages;
				if (topic == "main" && currentBranch == "main") {
					for(var i = 0; i < messages.length; i++){
						cloneChatBubble(messages[i]);
					}
				} else {
					//populate branch thread
				}
			}
		}
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

function showFirstConversation() {
	var firstConversation = $('ul.conversations li:nth-child(1)');
	firstConversation.addClass('conversation-item-selected');
	$('.chat-title-bar-title').text(firstConversation.find('.conversation-title').text());
	$('#conversation-title-avatar').attr("src",firstConversation.find('.conversation-avatar').prop('src'));
}

function sendChat(){
	var chatText = $('.text-input').val();
	chatText = chatText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	socket.emit('room message', {
        'branch_name': currentBranch, 
        'message': chatText, 
        'username':username
    });
}

function cloneChatBubble(message){
	var chatText = message.message;
	var username = message.username;
	var avatarLetter = username.charAt(0).toUpperCase();
	var avatarColor = avatarColorsList[username.charCodeAt(0) % 4];
	// console.log(avatarColor);
	if (chatText.length > 0) {
		$('.text-input').val("");
		$('.chat-container div:nth-child(2)').addClass('first-chat-item');
		$('.chat-container div:nth-last-child(2)').children().last().removeClass('animated-chat-line');
		$('.chat-container').children().last().removeClass('last-chat-item');
		$('.chat-container').children().last().children().last().addClass('animated-chat-line');
		
		$('.chat-item:first').clone()
							.removeClass('animated-chat-line')
							.appendTo(".chat-container")
							.show()
							.animate({top: "+=75px"}, 500)
							.find(".chat-bubble").html(chatText)
							.parent().find(".chat-avatar").html(avatarLetter)
														  .css("background-color",avatarColor);
		$('.chat-container').children().last().addClass('last-chat-item');
		$('.chat-container').scrollTop($('.chat-container')[0].scrollHeight);
	}
}
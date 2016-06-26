var socket = io.connect('http://localhost:5000/branch');
var chatHistory = "";
var username = "";
var participants = [["Hayley", "Jack", "Jessica", "Jill", "You"], ["Brad", "Beth", "Margaret", "Steve", "Tyrone", "You"], ["Giselle", "Mams", "Pops", "You"]];
var conversationTitles = ["Friends 5ever", "Bros 5lyf", "Family"];

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

    $('li.conversation-item').click(function() {
		$('li.conversation-item').each(function( index ) {
		  	$(this).removeClass('conversation-item-selected');
		});
		$(this).addClass('conversation-item-selected');
		$('.chat-title-bar-title').text($(this).find('.conversation-title').text());
		$('#conversation-title-avatar').attr("src",$(this).find('.conversation-avatar').prop('src'));
		updateParticipants($(this).index());
	});
});

function populateChat(chatHistory) {
	if (!jQuery.isEmptyObject(chatHistory)) {
		for (var topic in chatHistory) {
			if (chatHistory.hasOwnProperty(topic)) {
				console.log(chatHistory[topic]);
				var currentMessages = chatHistory[topic]["messages"];
				console.log(currentMessages);
				var lastMesage = currentMessages[currentMessages.length - 1];
				showFirstConversation(lastMesage.username + ": " + lastMesage.message);
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


function showFirstConversation(lastMessage) {
	var firstConversation = $('ul.conversations li:nth-child(1)');
	firstConversation.addClass('conversation-item-selected');
	$('.chat-title-bar-title').text(firstConversation.find('.conversation-title').text());
	$('#conversation-title-avatar').attr("src",firstConversation.find('.conversation-avatar').prop('src'));
	updateLastMessage(firstConversation, lastMessage);
	updateParticipants(0);
}

function updateParticipants(conversationIndex) {
	var participantString = "";
	for (var i = 0; i < participants[conversationIndex].length; i++) {
		participantString += participants[conversationIndex][i] + ", ";
	};
	participantString = participantString.substring(0, participantString.length - 2);
	$('.chat-title-bar-participants').html(participantString);
}

function updateLastMessage(conversation, lastMessage) {
	conversation.find('.conversation-last-message').html(lastMessage);
}

function sendChat(){
	var chatText = $('.text-input').val();
	chatText = chatText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	cloneChatBubble(chatText);
}

function cloneChatBubble(chatText){
	if (chatText.length > 0) {
		$('.text-input').val("");
		$('.chat-item:first').clone()
							.appendTo(".chat-container")
							.show()
							.animate({top: "+=75px"}, 500)
							.find(".chat-bubble").html(chatText);
		$('.chat-container').scrollTop($('.chat-container')[0].scrollHeight);
	}
}
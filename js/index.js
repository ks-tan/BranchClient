var socket = io.connect('http://localhost:5000/branch');
var avatarColorsList = ['#EE6D79','#71E096','#698EE0','#93D4F4'];
var chatHistory = "";
var currentBranch = "";
var username = "";
var participants = [["Hayley", "Jack", "Jessica", "Jill", "You"], ["Brad", "Beth", "Margaret", "Steve", "Tyrone", "You"], ["Giselle", "Mams", "Pops", "You"]];
var conversationTitles = ["Friends 5ever", "Bros 5lyf", "Family"];

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
		cloneChatBubble(msg, msg.topic);
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
			if (chatHistory.hasOwnProperty(topic) && topic == currentBranch) {
				var messages = chatHistory[topic].messages;
				var lastMessage = messages[messages.length - 1];
				showFirstConversation(lastMessage);
				for(var i = 0; i < messages.length; i++){
					cloneChatBubble(messages[i], topic);
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

function getConversationFromIndex(index) {
	return $('ul.conversations li:nth-child(' + (index + 1) + ')');
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
	var userNameString;
	if (lastMessage.username == username) {
		userNameString = "";
	} else {
		userNameString = lastMessage.username + ": ";
	}
	var lastMessageString = userNameString + lastMessage.message;

	conversation.find('.conversation-last-message').html(lastMessageString);
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

function cloneChatBubble(message, topic){
	var chatText = message.message;
	var username = message.username;
	var avatarLetter = username.charAt(0).toUpperCase();
	var avatarColor = avatarColorsList[username.charCodeAt(0) % 4];
	if (chatText.length > 0) {
		$('.text-input').val("");
		$('.chat-container div:nth-child(2)').addClass('first-chat-item');
		$('.chat-container div:nth-last-child(2)').children().last().removeClass('animated-chat-line');
		$('.chat-container').children().last().removeClass('last-chat-item');
		$('.chat-container').children().last().children().last().addClass('animated-chat-line');
		$('.chat-item:first').clone()
							.attr("data-branch", "test")
							.removeClass('animated-chat-line')
							.appendTo(".chat-container")
							.show()
							.animate({top: "+=75px"}, 500)
							.find(".chat-bubble").html(chatText)
												 .css("background-color", message.isBranch ? "#6D5782" : "#FADBBF")
												 .css("color", message.isBranch ? "#FFFFFF" : "#000000")
												 .css("margin-left", message.isBranch ? "55px" : "0px")
							.parent().find(".chat-avatar").html(avatarLetter)
														  .css("background-color",avatarColor)
														  .css("display", message.isBranch ? "none" : "inline-block")
		$('.chat-container').children().last().addClass('last-chat-item')
											  .attr("data-branch", topic)
											  .attr("data-isBranch", message.isBranch);
		$('.chat-container').scrollTop($('.chat-container')[0].scrollHeight);
		if (message.isBranch) {
			openBranchOnClickListener($('.chat-container').children().last());		
		}
	}
}

function openBranchOnClickListener(branchMessage){
	branchMessage.click(function(){
		currentBranch = branchMessage.find(".chat-bubble").html();
		$('.chat-item').each(function(){
			if ($(this).attr("data-branch") == "main") {
				$(this).find(".chat-bubble").fadeOut(100);
				$(this).find(".chat-branch-line").fadeOut(250);
				$(this).find(".chat-avatar").css("background-color", "#6D5782")
											.html("");
				if ($(this).attr("data-isBranch")) {
					$(this).find(".chat-avatar").fadeIn(250);
				} else {
					$(this).find(".chat-avatar").animate({height:"25px", width:"25px"},250);
				}
			}
		});
	});
}

















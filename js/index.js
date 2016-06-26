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
    	populateChat();
    });

   	socket.on('send room message', function(msg) {
		cloneChatBubble(msg, msg.branch);
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

function populateChat() {
	if (!jQuery.isEmptyObject(chatHistory)) {
		for (var topic in chatHistory) {
			if (chatHistory.hasOwnProperty(topic) && topic == currentBranch) {
				var messages = chatHistory[topic].messages;
				var lastMessage = messages[messages.length - 1];
				showFirstConversation(lastMessage);
				if (topic != "main") {
					$('.header:first').clone()
									  .appendTo('.branch-chat-container');
					$('.branch-chat-container .header').show();
					$('.branch-chat-container .header .activity').html(chatHistory[topic].activity);
					$('.branch-chat-container .header .description').html(chatHistory[topic].location);
				}
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
	var targetContainer;
	if (currentBranch=="main") {
		targetContainer = ".chat-container";
	} else {
		targetContainer = ".branch-chat-container";
	}
	if (chatText.length > 0) {
		$('.text-input').val("");
		$(targetContainer + ' div:nth-child(2)').addClass('first-chat-item');
		$(targetContainer + ' div:nth-last-child(2)').children().last().removeClass('animated-chat-line');
		$(targetContainer).children().last().removeClass('last-chat-item');
		$(targetContainer).children().last().children().last().addClass('animated-chat-line');
		$('.chat-item:first').clone()
							.removeClass('animated-chat-line')
							.appendTo(targetContainer)
							.show()
							.animate({top: "+=75px"}, 500)
							.find(".chat-bubble").html(chatText)
												 .css("background-color", message.isBranch ? "#6D5782" : "#FADBBF")
												 .css("color", message.isBranch ? "#FFFFFF" : "#000000")
							.parent().find(".chat-avatar").html(avatarLetter)
														  .css("background-color",avatarColor)
		$(targetContainer).children().last().addClass('last-chat-item')
											  .attr("data-branch", topic)
											  .attr("data-isBranch", message.isBranch)
											  .attr("data-username", message.username);
		$(targetContainer).scrollTop($(targetContainer)[0].scrollHeight);
		if (message.isBranch) {
			openBranchOnClickListener($(targetContainer).children().last());		
		}
	}
}

function openBranchOnClickListener(branchMessage){
	branchMessage.click(function(){
		if (currentBranch == "main") {
			//go to branch thread
			currentBranch = branchMessage.find(".chat-bubble").html();
			$('.chat-item').each(function(){
				if ($(this).attr("data-branch") == "main") {
					$(this).find(".chat-bubble").fadeOut(100);
					$(this).find(".chat-branch-line").fadeOut(250);
					$(this).find(".chat-avatar").css("background-color", "#6D5782")
												.html("");
					if ($(this).attr("data-isBranch")) {
						$(this).find(".chat-avatar").animate({height:"56px", width:"56px"},250,function(){
							var sideBranchTopMargin = branchMessage.position().top;
							$('.branch-chat-container').css("margin-top",sideBranchTopMargin)
													   .css("display", "inline-block");
						});
					} else {
						$(this).find(".chat-avatar").animate({height:"25px", width:"25px"},250);
					}
				}
			});
			populateChat();



		} else {
			//go back to main thread
			currentBranch = "main";
			$('.chat-item').each(function(){
				if ($(this).attr("data-branch") == "main") {
					$('.branch-chat-container').empty();
					$(this).find(".chat-bubble").fadeIn(100);
					$(this).find(".chat-branch-line").fadeIn(250);
					$(this).find(".chat-avatar").css("background-color", avatarColorsList[$(this).attr("data-username").charCodeAt(0) % 4])
												.html($(this).attr("data-username").charAt(0));
					if ($(this).attr("data-isBranch")) {
						$(this).find(".chat-avatar").animate({height:"55px", width:"55px"},100);
					} else {
						$(this).find(".chat-avatar").animate({height:"55px", width:"55px"},100);
					}
				}
			});
		}
	});
}

















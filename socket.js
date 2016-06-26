var username;
var room_name = "main";
$(document).ready(function(){
    namespace = '/branch'; // change to an empty string to use the global namespace

    // the socket.io documentation recommends sending an explicit package upon connection
    // this is specially important when using the global namespace
    var socket = io.connect('http://localhost:5000/branch');

    // 
    socket.on('joined room', function(msg) {
        console.log(msg.chat);
    });

    socket.on('send room message', function(msg) {
    	console.log(msg);
    });

    // handlers for the different forms in the page
    // these send data to the server in a variety of ways
    $('form#join').submit(function(event) {
        socket.emit('join', {'username': username});
        return false;
    });
    $('form#new_msg').submit(function(event) {
        socket.emit('room message', {
            'branch_name': room_name, 
            'message': $('#msg').val(), 
            'username':username
        });
        return false;
    });
});
var memory;

function raiseMemoryEvent(event, value){
	memory.raiseEvent( event, value );
}

// function to catch missing console on robot
function logthis(message){
	try{
		console.log(message);
	} catch(err){}
}

// NAOqi connected
function onConnected(session){
	logthis("connected to naoqi");
	session.service("ALMemory").then(
		function (service){
			memory = service;
			logthis("connected");
		},
		function (error) {}
	);
}

// NAOqi disconnected
function onDisconnected(){
	logthis("Disconnected from NAOqi!");
}

// ------ MAIN ------
$( document ).ready(function() {
	logthis("document ready");

	// connect to naoqi
    	setTimeout( function(){
    		logthis("connecting to naoqi...");
			RobotUtils.connect( onConnected, onDisconnected );
	}, 500 );
});

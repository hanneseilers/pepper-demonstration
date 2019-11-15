var locked = false;
var memory;

// function to catch missing console on robot
function logthis(message){
	try{
		console.log(message);
	} catch(err){}
}

// Callback touch event
function onTouchDown(data){
	logthis("touch down");
	if( !locked ){
	
		// recalculate data
		x = data[0] * $(document).width();
		y = data[1] * $(document).height();
	
		// get element
		locked = true;
		var el = document.elementFromPoint(x, y);
		
		if( el != null ){
			// create and sipatch event
			var ev = new MouseEvent('click', {
				'view': window,
				'bubbles': true,
				'cancelable': false
			});
			el.dispatchEvent(ev);
			
			// check if element or parent element is button
			if( el.tagName == 'BUTTON' ){
				logthis(el);
				if( el.id == "abort" ){
					memory.raiseEvent( "custom/tablet/onButtonClick", el.id );
				} else {
					memory.raiseEvent( "custom/tablet/onButtonClick", $('#name').val() );
				}
			} else if( el.parentElement != null && el.parentElement.tagName == 'BUTTON' ){
				logthis(el.parentElement);
				if( el.parentElement.id == "abort" ){
					memory.raiseEvent( "custom/tablet/onButtonClick", el.parentElement.id );
				} else {
					memory.raiseEvent( "custom/tablet/onButtonClick", $('#name').val() );
				}
			}
		}
		
	}
}

function onTouchUp(){
	logthis("touch up");
	locked = false;
}

function onDetectionStatusChange(value){
	el = document.getElementById( 'detectionStatus' );
	if( value ){
		if( value == 1 ){
			el.innerHTML = "ok";
			el.className = "text-success"
		} else {
			el.innerHTML = "zu viele Gesichter";
			el.className = "text-danger"
		}
	} else {
		el.innerHTML = "fehlerhaft";
		el.className = "text-danger"
	}
}

function onRecognitionStart(){
	$('#form').hide();
	$('#alert-wait').show();
}

function onRecognitionSuccess(){
	$('#alert-wait').hide();
	$('#alert-success').show();
	$('#img').attr( 'src', "img/check.png" );
}

function onRecognitionFailed(){
	$('#form').show();
	$('#alert-error').show();
	$('#alert-wait').hide();
	$('#img').attr( 'src', "img/wait.gif" );
}

function onNewImage(){
	$('#img').attr( 'src', "image.jpg?" + new Date().getTime() );
}

// NAOqi connected
function onConnected(session){
	logthis("connected to naoqi");
	session.service("ALMemory").then( 
		function (service){
			memory = service;
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchDown", onTouchDown );
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchUp", onTouchUp );
			RobotUtils.subscribeToALMemoryEvent( "learnFace/detectionStatus", onDetectionStatusChange );
			RobotUtils.subscribeToALMemoryEvent( "learnFace/recognitionStart", onRecognitionStart );
			RobotUtils.subscribeToALMemoryEvent( "learnFace/recognitionSuccess", onRecognitionSuccess );
			RobotUtils.subscribeToALMemoryEvent( "learnFace/recognitionFailed", onRecognitionFailed );
			RobotUtils.subscribeToALMemoryEvent( "learnFace/newImage", onNewImage );
		},
		function (error) {}
	);
}

// NAOqi disconnected
function onDisconnected(){
	alert("Disconnected from NAOqi!");
}

// ------ MAIN ------
$( document ).ready(function() {
	logthis("document ready");
	
	$('#alert-wait').hide();
	$('#alert-success').hide();
	$('#alert-error').hide();

    // connect to naoqi
    setTimeout( function(){
    	logthis("connecting to naoqi...");
		RobotUtils.connect( onConnected, onDisconnected );
	}, 500 );
});




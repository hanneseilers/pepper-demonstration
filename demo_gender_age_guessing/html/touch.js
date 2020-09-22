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
			if( el.tagName == 'BUTTON' && (el.getAttribute('blocked') == null || el.getAttribute('blocked') == "") ){
				logthis(el);
				memory.raiseEvent( "custom/tablet/onButtonClick", el.id );
			} else if( el.parentElement != null && el.parentElement.tagName == 'BUTTON' && (el.parentElement.getAttribute('blocked') == null || el.parentElement.getAttribute('blocked') == "") ){
				logthis(el.parentElement);
				memory.raiseEvent( "custom/tablet/onButtonClick", el.parentElement.id );
			}
		}
		
	}
}

function onTouchUp(){
	logthis("touch up");
	locked = false;
}

var gender = "unbekannt";
var age = "unbekannt";
var expression = "unbekannt";

function onGender(data){
	logthis(data);
	gender = data;
}

function onAge(data){
	logthis(data);
	age = data;
}

function onExpression(data){
	logthis(data);
	expression = data;
}

function onComplete(){
	logthis("complete");
	document.getElementById("gender").innerHTML = gender;
	document.getElementById("age").innerHTML = age;
	document.getElementById("expression").innerHTML = expression;	
}

// NAOqi connected
function onConnected(session){
	logthis("connected to naoqi");
	session.service("ALMemory").then( 
		function (service){
			memory = service;
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchDown", onTouchDown );
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchUp", onTouchUp );
			RobotUtils.subscribeToALMemoryEvent( "GenderAgeExpression/gender", onGender );
			RobotUtils.subscribeToALMemoryEvent( "GenderAgeExpression/age", onAge );
			RobotUtils.subscribeToALMemoryEvent( "GenderAgeExpression/expression", onExpression );
			RobotUtils.subscribeToALMemoryEvent( "GenderAgeExpression/complete", onComplete );
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

    // connect to naoqi
    setTimeout( function(){
    	logthis("connecting to naoqi...");
		RobotUtils.connect( onConnected, onDisconnected );
	}, 500 );
});




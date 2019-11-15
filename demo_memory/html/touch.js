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
				memory.raiseEvent( "custom/tablet/onButtonClick", el.id );
			} else if( el.parentElement != null && el.parentElement.tagName == 'BUTTON' ){
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

function getProgress(){
	// get data for progress bar
	try {
		var current = null;
		var total = null;
		memory.getData( "memory/stat/repeat" ).then( function(value){
			current = value;
			if( total != null && current != null ) setProgress( current, total );
		} );
		memory.getData( "memory/stat/total" ).then( function(value){
			total = value;
			if( total != null && current != null ) setProgress( current, total );
		} );
	} catch(err) {}
}

function setProgress(current, total){
	progress = (current / total) * 100;
	remaining = total - current + 1;
	
	el = document.getElementById('progress-bar');
	if( el != null ){
		logthis( el.getAttribute('aria-valuenow') );
		el.style.width = progress + "%";
		el.setAttribute( 'aria-valuenow', progress );
		el.innerHTML = "noch " + remaining + " Fragen";
	}
}

function reloadImages(){
	d = new Date();
	$("#imglinks").attr("src", "left.jpg?"+d.getTime());
	$("#imgrechts").attr("src", "right.jpg?"+d.getTime());
	
	getProgress();
}

function reloadWord(){
	logthis("word");
	memory.getData( "memory/reloeadWord" ).then( function(value){
		current = value;		
		el = document.getElementById('word');
		if( el != null ){
			el.innerHTML = current;
		}
	} );
}

// NAOqi connected
function onConnected(session){
	logthis("connected to naoqi");	
	session.service("ALMemory").then( 
		function (service){
			memory = service;
			
			// subscripe to events
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchDown", onTouchDown );
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchUp", onTouchUp );
			RobotUtils.subscribeToALMemoryEvent( "memory/reloadImages", reloadImages );
			RobotUtils.subscribeToALMemoryEvent( "memory/reloeadWord", reloadWord );
			
			// get progress
			getProgress();
			
			// get word
			reloadWord();
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




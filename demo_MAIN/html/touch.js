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

function alOnClick(value){
	memory.raiseEvent( "custom/tablet/onButtonClick", value );
}

function onTouchUp(){
	locked = false;
}

// NAOqi connected
function onConnected(session){
	logthis("connected to naoqi");
	session.service("ALMemory").then( 
		function (service){
			memory = service;
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchDown", onTouchDown );
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchUp", onTouchUp );
			
			// set website alive interval
			setInterval( function(){
				memory.raiseEvent( "custom/tablet/alive", 1 );
			}, 1000 );
		},
		function (error) {}
	);
}

// NAOqi disconnected
function onDisconnected(){
	alert("Disconnected from NAOqi!");
}

// include html files
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      } 
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
}

// ------ MAIN ------
$( document ).ready(function() {
	logthis("document ready");

    // connect to naoqi
    setTimeout( function(){
    	logthis("connecting to naoqi...");
		RobotUtils.connect( onConnected, onDisconnected );
	}, 500 );
	
	// include all html file includes
	includeHTML();
});




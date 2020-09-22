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
	locked = false;
}

function onCurrentQuestion(data){
	data = JSON.parse(data);
	var txtQuestion = document.getElementById("txtQuestion");
	var lstAnswers = document.getElementById("lstAnswers");
	
	if( txtQuestion && lstAnswers ){
		txtQuestion.innerHTML = data['text'];
		
		while(lstAnswers.firstChild){
			lstAnswers.removeChild(lstAnswers.firstChild);
		}
		
		for( answer of data['choises'] ){
			var btn = document.createElement("button");
			btn.id = answer;
			btn.className = "btn btn-block btn-lg btn-primary";
			btn.innerHTML = answer;
			lstAnswers.appendChild(btn);
		}
	}
}

function onSuccess(){
	var lstAnswers = document.getElementById("lstAnswers");
	if( lstAnswers ){
		while(lstAnswers.firstChild){
			lstAnswers.removeChild(lstAnswers.firstChild);
		}
	
		var img = document.createElement("img");
		img .src = "img/check.png";
		lstAnswers.appendChild(img);
	}
}

function onFail(){
	var lstAnswers = document.getElementById("lstAnswers");
	if( lstAnswers ){
		while(lstAnswers.firstChild){
			lstAnswers.removeChild(lstAnswers.firstChild);
		}
	
		var img = document.createElement("img");
		img .src = "img/fail.png";
		lstAnswers.appendChild(img);
	}
}

function onScore(data){
	el = document.getElementById( "score" );
	el.innerHTML = data[0]+1 + "/" + data[1];
}

// NAOqi connected
function onConnected(session){
	logthis("connected to naoqi");
	session.service("ALMemory").then( 
		function (service){
			memory = service;
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchDown", onTouchDown );
			RobotUtils.subscribeToALMemoryEvent( "custom/tablet/onTouchUp", onTouchUp );
			RobotUtils.subscribeToALMemoryEvent( "Games/PepperQuiz/currentQuestion", onCurrentQuestion );
			RobotUtils.subscribeToALMemoryEvent( "Games/PepperQuiz/success", onSuccess );	
			RobotUtils.subscribeToALMemoryEvent( "Games/PepperQuiz/fail", onFail );	
			//RobotUtils.subscribeToALMemoryEvent( "Games/PepperQuiz/gameRound", onScore );	
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




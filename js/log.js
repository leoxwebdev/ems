// check for local Storage support

$(document).ready( function(){

var $logName = $( "#logName" ),
	$logPass = $( "#logPass" );

$( ".login-button" ).on( "click", function(){

	iLogin();	
});

$logPass.on( "keypress", function( e ){
	
	if ( e.which === 13 ){
		
		iLogin();
	}
});

function iLogin(){

	var logName = $logName.val(),
		logPass = $logPass.val(),
		logURL = "login.php";

	$.ajax({
		cache: false,
		dataType: "text",
		url: logURL,
		data: {
			log: logName,
			pass: logPass
		}
	}).then( function( logStat ){

		if ( logStat === "success" ){
		
			if ( localStorage ){
		
				localStorage.emsleo = logName;
				localStorage.emsdate = new Date();
				
				window.location.href = "leox.html";

			} else {
			
				alert( "Your browser configuration prohibits You form using this system, Please contact your system developer/programmer" );
			}
		} else if ( logStat = "1" ){
			$logName.val("");
			$logPass.val("");
			$logName.focus();
		} else if ( logStat = "0" ){
			$logName.val("");
			$logPass.val("");
			$logName.focus();
		} else {
			$logName.val("");
			$logPass.val("");
			$logName.focus();
		}
	});
}
if ( localStorage ){

	localStorage.removeItem( "emsleo" );
	localStorage.removeItem( "emsdate" );
}
});
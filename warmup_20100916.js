function roundForPlates( weight, plates ) {
	if ( $('#round').attr('checked') ) {
		var lightest_plate = plates && plates.length ? plates[plates.length-1] : 5;
		var atomic_unit = lightest_plate * 2;
		return Math.round(weight/atomic_unit)*atomic_unit;
	}

	return weight;
}

function getBar() {
	var bar = $("#bar").val();
	return bar && !isNaN(bar) ? parseInt(bar,10) : 45;
}

function getPlateWeights() {
	var platesVal = $("#plates").val();
	var res = [];

	if ( platesVal ) {
		var strings = platesVal.split(",");
		for ( var i = 0; i < strings.length; i++ ) {
			var plateWeight = $.trim(strings[i]);
			if ( plateWeight && !isNaN( plateWeight ) ) {
				res.push( parseFloat( plateWeight, 10 ) );
			}
		}
	}

	if ( res && res.length ) {
		return res.sort(function(a,b){return b - a;});
	}

	return null;
}

function getPlates( weight, plate_weights ) {
	if ( !plate_weights || plate_weights.length < 1 ) {
		return null;
	}

	var one_side = (weight-getBar())/2;
	var lightest_plate = plate_weights[plate_weights.length-1];

	var result = [];

	while ( one_side >= lightest_plate ) {
		var found = 0;
		for ( var i = 0; i < plate_weights.length; i++ ) {
			var plate = plate_weights[i];
			if ( one_side-plate >= 0 ) {
				result.push( plate );
				one_side = one_side - plate;
				found = 1;
				break;
			}
		}
		if ( !found ) {
			return null;
		}
	}
	if ( one_side > 0 ) {
		return null;
	}
	return result;
}

function calc() {
	var starting = parseFloat( $('#starting_weight').val(), 10 );
	var ending = parseFloat( $('#ending_weight').val(), 10 );
	var plate_weights = getPlateWeights();
	if ( ending >= starting ) {
		var step = (ending-starting)/4;
		if ( step && !isNaN(step) ) {
			step = Math.round(step*4)/4;
		}
		$('#increment').html( step );

		$('.set').each( function(index,value) {
			var el = $(value);
			var mult = el.attr('mult');
			var weight = ending;

			if ( mult != 'final' ) {
				weight = roundForPlates( starting+(step*parseInt(mult,10)), plate_weights );
			}

			var plates = getPlates( weight, plate_weights );
				
			el.html( weight );
			if ( plates && plates.length ) {
				$(".plate_list_"+mult).html( plates.join(", ") );
			}
			else {
				$(".plate_list_"+mult).html( "" );
			}
		} );
	}
	else {
		$('.set,#increment').html( '_' );
		$('.pl').html( '' );
	}
}

function saveState() {
	var state = "#";
	state +=  "b=" + $("#bar").val();
	state += "&p=" + $("#plates").val().replace(/ /g,"");
	if ( !$('#round').attr('checked') ) {
		state += "&r=0";
	}
	window.location = state;
}

function loadState() {
	if ( window.location.hash ) {
		var state = window.location.hash.substring(1);
		var keyVals = state.split("&");
		for ( var i = 0; i < keyVals.length; i++ ) {
			var keyVal = keyVals[i].split("=");
			if ( keyVal[0]=="b" ) {
				$("#bar").val( keyVal[1] );
			}
			else if ( keyVal[0]=="p" ) {
				$("#plates").val( keyVal[1] );
			}
			else if ( keyVal[0]=="r" && keyVal[1] == "0" ) {
				$("#round").attr('checked',false);
			}
		}
		calc();
	}
}

function calcAndSave() {
	calc();
	saveState();
}

function showPrefs() {
	$('#preferences_box').slideDown();
	$('#show_prefs_link').html("hide settings");
}
function hidePrefs() {
	$('#preferences_box').slideUp();
	$('#show_prefs_link').html("show settings");
}

$(document).ready( function() {
	loadState();
	$('#starting_weight,#ending_weight').keyup( calc );
	$('#bar,#plates').keyup( calcAndSave );
	$('#round').click( calcAndSave );
	$('#show_prefs_link').toggle( showPrefs, hidePrefs );
} );

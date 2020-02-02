function showNavBar() {
	$("#overlayAdd").hide();
	$("#openActivitiesOverlay").hide();
	$('#fullOverlay').hide();

	// Change the height of the maps
	var mapView = document.getElementById("viewDiv");
	mapView.style.position = "absolute";
	mapView.style.bottom = 0;
	mapView.style.height = "calc(100% - 70px)";

	// Add the navbar
	var topBar = document.getElementById("reportIncidentBar");
	topBar.style.display = "block";
	topBar.style.height = "70px";
}
function hideNavBar() {
	$("#openActivitiesOverlay").show();

	// Change the height of the maps
	var mapView = document.getElementById("viewDiv");
	mapView.style.position = "absolute";
	mapView.style.bottom = 0;
	mapView.style.height = "100%";

	// Add the navbar
	$("#reportIncidentBar").hide();
	hideCrosshairs();
}
function showCrosshairs() {
	$('#vertCrosshair').show();
	$('#horizCrosshair').show();
}
function hideCrosshairs() {
	$('#vertCrosshair').hide();
	$('#horizCrosshair').hide();
}
function getCoords(evt, view) {
	var pt = view.toMap({ x: evt.x, y: evt.y });

	return {"lat": pt.latitude.toFixed(5),
      		"lon": pt.longitude.toFixed(5),
      		"x": pt.x.toFixed(5),
      		"y": pt.y.toFixed(5)};
}
function exit() {
	hideCrosshairs();
	hideNavBar();
	$('#topbar').show();
}


// Handle reporting a incident at a certain location
// This class will allow the user to first tap the vague location
//   then drag crosshairs to fine tune the location.
class reportLocation_tapDrag {
	constructor(view) {
		this.view = view;
		this.pointMade = false;
		this.navbarOn = false;
	}
	init() {
		this.navbarOn = true;
		showNavBar();
	}
	click(evt) {
		if (!this.navbarOn) {
			return;
		}
		if (!this.pointMade) {
			showCrosshairs();
			this.centerCoords(evt);
			this.changeInstructions();
			$('#submitReportBtn').show();
			this.pointMade = true;
		}
	}
	centerCoords(evt) {
		// Move point to center
		this.coords = getCoords(evt, this.view);
		this.view.center = [this.coords['lon'],
												this.coords['lat']];
	}
	changeInstructions() {
		$('#locationHelpTxt').html("Drag map to fine tune location.");
	}
	exit() {
		this.navbarOn = false;
		this.pointMade = false;
		exit();
	}
}


// This class will create the report location view with just
//  the crosshairs to drag. This should be initialised on
//  the click of the report incident button.
class reportLocation_crosshairs {
	constructor(view) {
		this.view = view;
	}
	init() {
		// Open NavBar
		showNavBar();
		// Show crosshairs
		showCrosshairs();
		// Change the text
		this.changeInstructions();
		// Show ok button
		$('#submitReportBtn').show();
	}
	click(evt) {
	}
	changeInstructions() {
		$('#locationHelpTxt').html("Select location under crosshairs.");
	}
	exit() {
		exit();
	}
}

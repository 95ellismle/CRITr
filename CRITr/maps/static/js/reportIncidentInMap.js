// Handle reporting a incident at a certain location
class reportLocation {
	constructor(view, Point) {
		this.view = view;
		this.pointMade = false;
		this.navbarOn = false;
	}
	showNavBar() {
		this.navbarOn = true;

		$("#overlayAdd").hide();
		$("#openActivities").hide();
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
	hideNavBar() {
		this.navbarOn = false;
		$("#openActivities").show();

		// Change the height of the maps
		var mapView = document.getElementById("viewDiv");
		mapView.style.position = "absolute";
		mapView.style.bottom = 0;
		mapView.style.height = "100%";

		// Add the navbar
		$("#reportIncidentBar").hide();
		this.hideCrosshairs();
	}
	click(evt) {
		if (!this.navbarOn) {
			return;
		}
		if (!this.pointMade) {
			this.showCrosshairs(evt);
			this.changeInstructions();
			$('#submitReportBtn').show();
			this.pointMade = true;
		}
	}
	showCrosshairs(evt) {
		$('#vertCrosshair').show();
		$('#horizCrosshair').show();

		// Move point to center
		this.getCoords(evt);
		this.view.center = [this.coords['lon'],
												this.coords['lat']];
	}
	changeInstructions() {
		$('#locationHelpTxt').html("Drag map to fine tune location.");
	}
	hideCrosshairs() {
		$('#vertCrosshair').hide();
		$('#horizCrosshair').hide();
		this.pointMade = false;
	}
	getCoords(evt) {
		var pt = this.view.toMap({ x: evt.x, y: evt.y });

		this.coords = {"lat": pt.latitude.toFixed(5),
									 "lon": pt.longitude.toFixed(5),
									 "x": pt.x.toFixed(5),
									 "y": pt.y.toFixed(5)};
	}
	exit() {
		this.hideCrosshairs();
		this.hideNavBar();
		$('#topbar').show();
	}
}

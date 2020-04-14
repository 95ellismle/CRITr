var ptsLoaded = {};
var trackPtsDrawn = [];
var trackPtsLocation = [];
var locationsToSave = {'x': [], 'y': [], 'lat': [], 'lon': []};
var prevLocation = {'latitude':-1000, 'longitude': -1000};
var iconsToRemove = [];
var trackID;
var graphicsLayer;


function getData(table, columns="*", func=false, extraQ="") {
	var result = "";

	$.ajax({
		url: '',
		dataType: 'json',
		type: 'post',
		contentType: 'application/x-www-form-urlencoded',
		data: {"columns": columns,
			   "tableName": table,
			   "extra": extraQ,
			  },
		success: function(data){
			if (func != false) {
				result =  func(data);
			}
		},
		error: function( jqXhr, textStatus, errorThrown ){
			console.log( errorThrown );
		}
	});

	return result;
}

function cancelCreate(){};
function submitReport(){};
function startTracking(){};
function stopTracking(){};
function drawTrackPoint(){};
function saveTrackData(){};
function addIconAtCurrentPos(){};
function removeMapsIcons(){};
function getUserLocation(){};
function changeMapIcon(){};

require([
	// The map
	"esri/Map",
	"esri/views/MapView",
	// Widget to find location of user
	"esri/widgets/Locate",
	// Widget for Graphics
	"esri/Graphic",
	"esri/layers/GraphicsLayer",
	"esri/widgets/Sketch/SketchViewModel",
	"esri/widgets/Track",
	// "esri/geometry/Point",
],

		function(Map, MapView, Locate, Graphic,
					   GraphicsLayer, SketchViewModel, Track
					  ) {

	let editGraphic;


	// Add the drop pin functionality
	graphicsLayer = new GraphicsLayer({
		id: "dropPins"
	});


	var hr = (new Date()).getHours();
	if (hr >= 19) {
		 var basemap = "streets-night-vector";
	} else {
		var basemap = "streets-navigation-vector";
	}
	const map = new Map({
		basemap: basemap,
		layers: [graphicsLayer],
		slider: false
	});


	// Set the map view and zoom to the Milnrow and Newhey
	const view = new MapView({
		container: "viewDiv",
		map: map,
		center: [-2.105367, 53.604835], // longitude, latitude
		zoom: 15,
		slider: false
	});

	// Create the tools for dropping pins
	const pointSymbol = {
		type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
		style: "circle",
		color: "#8A2BE2",
		size: "13px",
		outline: {'color': '#000000',
				  'width': '1px'},
	};

	// Add the tracking widget
	var track = new Track({
		view: view,
		goToLocationEnabled: true // disable this since we want to control what happens after our location is acquired
	});


	const activityColors = {'Littering': '#a6cee3',
													'Loitering': '#1f78b4',
													'Graffiti': '#b2df8a',
													'Parking': '#33a02c',
													'Speeding': '#fb9a99',
													'': '#e31a1c',	'': '#fdbf6f',
													'': '#ff7f00', '': '#cab2d6',
													'': '#6a3d9a', '': '#ffff99',
													'': '#b15928'};
	// Create popup template
	var popupTemplate = {
		title: "<h2>{name}</h2>",
		content: function() {
			hideActButton();
			return "The incident of <b>{name}</b> was reported at <b>{reportedTime}</b>.{details}{img}";
		}
	};

	function createDetails(deets) {
		if (deets == "") {
			return "<br><br>There are no extra details.";
		} else {
			return "<br><br>The details that came with it were:<br><br><p style='width: 80%; float: right'>"+deets+"</p>.";
		}
	}

	function createImg(path) {
		if (path == "") {
			return "";
		} else {
			return "<br><br><img height=\"80px\" width=\"80px\" src=\""+path+"\">";
		}
	}

	function drawAllIncidents(allData) {
		var points = [];
		var symbol = pointSymbol;
		for (var i=0; i<allData.length; i++) {
			var data = allData[i];
			const id = data['id'];
			if (!(id in ptsLoaded)) {
				// Create attributes
					var attributes = {
					name: data['incidentType'],  // The name of the
					reportedTime: data['timeSubmitted'],
					details: createDetails(data['details']),
					img: createImg(data['photoPath']),
				};
				var point = {
					type: "point",
					longitude: data['longitude'],
					latitude: data['latitude']
				};
				ptCol = activityColors[data['incidentType']];
				symbol['color'] = ptCol;
				//symbol['outline'] = {'color': ptCol};
				var pointGraphic = new Graphic({
					geometry: point,
					symbol: symbol,
					attributes: attributes,
					popupTemplate: popupTemplate,
				});
				//console.log("Drawn "+data['latitude']+data['longitude']);
				points.push(pointGraphic);
				graphicsLayer.add(pointGraphic);
				/*graphicsLayer.on("pointer-down", function() {
					console.log("BOB");
				});*/

				ptsLoaded[id] = true;
			}
		}

		return points;
	}

	function drawPoint(lat, lon, extraAttr={}, symbol=pointSymbol) {
		var pointAttr = {
			type: "point",
			latitude: lat,
			longitude: lon,
		};
		pointAttr = Object.assign(pointAttr, extraAttr);

		var pointGraphic = new Graphic({
			geometry: pointAttr,
			symbol: symbol,
		});
		graphicsLayer.add(pointGraphic);

		return pointGraphic;
	}

	// When the view is ready, do this lot of things
	view.when(function() {
		var reporter = new reportLocation_crosshairs(view);


		// Create the add incident button
		const sketchViewModel = new SketchViewModel ({
			view,
			layer: graphicsLayer,
			pointSymbol,
		});

		var coords = {};

		view.on("pointer-down", function(evt) {
			reporter.click(evt);
		});

		sketchViewModel.on("create", handleEventCreation);

		// logic for handling the creation of pins
		function handleEventCreation(event) {
			if (event.state === "complete") {
				document.getElementById("submitReportBtn").style.display = "inline-block";
			}
		}

		// After the user presses the OK button
		submitReport = function() {
			coords = {'x':view.center.x, 'y':view.center.y,
								'lat':view.center.latitude, 'lon':view.center.longitude};
			window.localStorage.setItem("coords", JSON.stringify(coords));
			window.location.href = reportIncidentPage;
		}

		cancelCreate = function() {
			reporter.exit()
		};

		$("#reportIncidentBtn").on("click", function() {
			reporter.init();
		});


		track.on("track", function() {
			var location = track.graphic.geometry;

			const threshold = 0.0001;
			var latDiff = Math.pow(location.latitude - prevLocation.latitude, 2);
			var lonDiff = Math.pow(location.longitude - prevLocation.longitude, 2);
			var doSave = Math.sqrt(latDiff + lonDiff) > threshold

			if (doSave)
			{
				locationsToSave['x'].push(location.x);
				locationsToSave['y'].push(location.y);
				locationsToSave['lat'].push(location.latitude);
				locationsToSave['lon'].push(location.longitude);

				prevLocation.latitude = location.latitude;
				prevLocation.longitude = location.longitude;
			}
		}, 5000);

		/*
		Will add an icon at the user's current position
		*/
		addIconAtCurrentPos = function(iconName) {
			var location = track.graphic.geometry;

			var iconPoint = {
				type: "point",
				longitude: location.longitude,
				latitude: location.latitude,
			};
			var mapIcon = new Graphic({
				geometry: iconPoint,
				symbol: incidentIcons[iconName],
				color: [255., 255., 255., 0.5],
			});

			view.graphics.add(mapIcon);
			iconsToRemove.push(mapIcon);

			return mapIcon;
		};

		/*
		Will change an icon on the map.

		Nothing will happen if the icon's name doesn't exist

		Inputs:
			* icon_num <int> => The number of the icon in the iconsToRemove array.
		*/
		changeMapIcon = function(icon_num, newIconName) {
			if (!incidentIcons[newIconName]) { return; }

			iconsToRemove[icon_num].symbol = incidentIcons[newIconName];
		}

		/*
		Will return the user's location
		*/
		getUserLocation = function() { 
			return track.graphic.geometry;
		}

		/*
		Will remove all icons in the list iconsToRemove from the graphicsLayer.

		The iconsToRemove list was created to hold the patrol incident icons, though
		it could hold others if required. Just be careful!

		Inputs:
			* arr <array> => A list of the graphics that need to be removed.

		N.B I should probably look a bit more carefully into how to remove the graphics
		rather than make them invisible.
		*/
		removeFromGraphics = function(arr) {
			for (var i=0; i<arr.length; i++) {
				arr[i].visible = false;
				graphicsLayer.remove(arr[i]);
			};

		};


		startTracking = function() {
			// Get the trackID
			var csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].getAttribute("value");
			$.ajax({
				headers: {'X-CSRFToken': csrftoken},
				url: urls['get_track_ID'],
				dataType: 'json',
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded',
				success: function(data){
					trackID = data['trackID'];
				},
				error: function( jqXhr, textStatus, errorThrown ){
					console.log( errorThrown );
				}
			});

			// Start the tracking
			track.start();
			console.log("Start Tracking!");
		};

		/*
		Will stop the tracking of the user and handle the calculate the distance
		they travelled.
		*/
		stopTracking = function() {
			// First turn off tracking
			track.stop();
			dist = calcDistanceTravelled(trackPtsLocation);

			return dist;
		};

		/*
		Will end the patrol by resetting lists and removing the graphics produced etc..
		*/
		removeMapsIcons = function() {
			removeFromGraphics(iconsToRemove);
			removeFromGraphics(trackPtsDrawn);
		}

		saveTrackData = function(anon=false) {
			var csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].getAttribute("value");
			locData = JSON.stringify(locationsToSave);
			$.ajax({
				headers: {'X-CSRFToken': csrftoken},
				url: urls['save_track_data'],
				dataType: 'text',
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded',
				data: {
					 	'locations_to_save': locData,
			 			'trackID': trackID,
						'anon': anon,
					  },
				success: function(data){
				// console.log(data);
				},
				error: function( jqXhr, textStatus, errorThrown ){
					console.log( errorThrown );
				}
			});

			// Reset variables
			locationsToSave = {'x': [], 'y': [], 'lat': [], 'lon': []};
			trackPtsDrawn = [];
			prevLocation = {'latitude':-1000, 'longitude': -1000};
		};

		/*
		Will get the distance in meters between 2 point via latitude and longitude.

		This function has been adapted from an answer on stackoverflow submitted by
		user 'b-h-' and editted by 'Brian Burns'
		*/
		function calcDist(location1, location2){
			  var lat1 = location1.latitude;
			  var lon1 = location1.longitude;
			  var lat2 = location2.latitude;
			  var lon2 = location2.longitude;

		    const R = 6378.137; // Radius of earth in KM
		    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
		    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;

		    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		    	Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
		    	Math.sin(dLon/2) * Math.sin(dLon/2);
		    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		    var d = R * c;
		    return d * 1000; // meters
		};

		/*
		Returns a bool value depending on whether the user is far enough away from
		previous points to make is sensible to draw a point.
		*/
		function shouldDrawMapPoint(point, allPoints, minDist=5) {
			 var shouldDraw = true;

			 // Compare with the other points (starting from the last one  as this is
		 	 //  probably closest).
			 for (var i=allPoints.length-1; i>=0; i--) {
				  distance = calcDist(point, allPoints[i]);
					shouldDraw = false;
					if (distance < minDist) {
						break
					}
			 } return shouldDraw;
		};

		/*
		Will get the distance travelled by the user over their whole patrol.
		*/
		function calcDistanceTravelled(points) {
			sum = 0.0;
			for (var i=0; i<points.length-1; i++) {
				dist = calcDist(points[i], points[i+1]);
				if (dist > 1) { // If the user moved more than a meter then sum up
					sum = sum + dist
				}
			} return sum;
		};

		/*
		Will draw a point on the map to show where the user has been patrolling.
		*/
		drawTrackPoint = function() {
			// Get location
			var location = getUserLocation();
			// Exit if location is null
			if (location != location) { return; };

			// Decide whether to draw or not and draw
			var shouldDraw = shouldDrawMapPoint(location, trackPtsLocation);
			if (shouldDraw) {
				var point = drawPoint(location.latitude, location.longitude);
				trackPtsDrawn.push(point);
				trackPtsLocation.push(location);
			}
		}
	}); // End view.when

});

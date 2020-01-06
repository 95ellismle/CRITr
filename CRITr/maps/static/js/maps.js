var ptsLoaded = {};
var trackPtsDrawn = [];


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
var reportedPoints = [];

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
	"esri/geometry/Point",
],

		function(Map, MapView, Locate, Graphic,
					   GraphicsLayer, SketchViewModel, Track,
						 Search, Point) {

	let editGraphic;


	// Add the drop pin functionality
	const graphicsLayer = new GraphicsLayer({
		id: "dropPins"
	});


	const map = new Map({
		basemap: "streets-navigation-vector",
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

	function drawAllPoints(allData) {
		var symbol = pointSymbol;
		for (var i=0; i<allData.length; i++) {
			var data = allData[i];
				var point = {
					type: "point",
					longitude: data['longitude'],
					latitude: data['latitude']
				};
				var pointGraphic = new Graphic({
					geometry: point,
					symbol: symbol,
				});
			graphicsLayer.add(pointGraphic);
		}
	}

	// When the view is ready, do this lot of things
	view.when(function() {
		var reporter = new reportLocation_crosshairs(view);
		var prevLocation = {'latitude':-1000, 'longitude': -1000};

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
			var testDiv = document.getElementById("testOut");
			var latDiff = Math.abs(location.latitude - prevLocation.latitude);
			var lonDiff = Math.abs(location.longitude - prevLocation.longitude);
			var doSave = true; // Math.abs(location.latitude - prevLocation.latitude) > threshold || Math.abs(location.longitude - prevLocation.longitude) > threshold;
			// testDiv.innerHTML = "lat diff: "+latDiff+" | lon diff: "+lonDiff+" | doSave: "+doSave.toString();
			if (doSave)
			{
				var csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].getAttribute("value");

				// Save Location every 5 seconds
				var result = "";
				$.ajax({
					headers: {'X-CSRFToken': csrftoken},
					url: urls['track_location'],
					dataType: 'text',
					type: 'POST',
					contentType: 'application/x-www-form-urlencoded',
					data: {'latitude': location.latitude,
							   'longitude': location.longitude,
							   'x': location.x,
							   'y': location.y
							  },
					success: function(data){
					},
					error: function( jqXhr, textStatus, errorThrown ){
						console.log( errorThrown );
					}
				});
				prevLocation.latitude = location.latitude;
				prevLocation.longitude = location.longitude;
			}
		}, 5000);

		startTracking = function() {
			track.start();
		}
		stopTracking = function() {
			track.stop();
			for (var i=0; i<trackPtsDrawn.length; i++) {
				graphicsLayer.remove(trackPtsDrawn[i]);
			}
			trackPtsDrawn = [];
		}
		drawTrackPoint = function(lat_lon) {
			var location = track.graphic.geometry;

			var point = drawPoint(location.latitude, location.longitude);
			trackPtsDrawn.push(point);
		}
	}); // End view.when

});

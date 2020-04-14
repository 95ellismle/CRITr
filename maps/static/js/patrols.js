/*
A module to house the code that handles patrolling.
*/

window.numIncidents = 0;
window.allIncidentInfo = {};
window.start_time = 0.0;
window.total_time = 0;


/*
Will handle the starting of a patrol e.g. open relevant overlays and start timer

  * @param[Date] startTime    The time the patrol started (for the clock).
*/
function startPatrol(startTime) {
  window.patrolOn = true;
  window.start_time = startTime;

  // Open the relevant overlays
  document.getElementById("fullOverlay").style.display = "none";
  document.getElementById("startActivityOverlay").style.display = "none";
  document.getElementById("patrolOverlay").style.display = "block";
  startTracking();

  // Make the plus symbol now report an incident
  // document.getElementById("openActivitiesOverlay").removeAttribute("onclick")
  document.getElementById("openActivitiesOverlay").setAttribute("onclick",
													"open_on_patrol_incident_choice();");

  // Update the clock every second
  window.patrolTimer_incrementClock = setInterval(function(){
	// Adjust the timer
	var endTime = new Date();
	window.total_time = endTime - startTime;
	document.getElementById("patrolTimer").innerHTML = secToTimer(window.total_time);
  }, 1000);

  // Draw a point every 10 seconds
  window.patrolTimer_drawPoint = setInterval(function() {
	drawTrackPoint();
  }, 10000);
}

function endPatrol() {
  // Create a new end of patrol report
  window.PatrolReport = new Patrol_Report();

  // Stop clock and drawing tracking points.
  clearInterval(window.patrolTimer_incrementClock);
  clearInterval(window.patrolTimer_drawPoint);


}


/*
Will show the extra details div for a user to report during their patrol.
*/
function openExtraDetails(incident_type) {
  document.getElementById("addDetails").style.display = "block";
  document.getElementById("addDetails-title").innerHTML = "Details of " + incident_type;
  centerOverlayDiv("addDetails");
}

/*
Will get a photo if the user says yes to taking one.
*/
function getPhoto(){
  $('#fullOverlay').show();

  $('#getPhoto').show();
  centerOverlayDiv("getPhoto");
}

/*
Will the date and time and return them in a struct
*/
function getDateTime() {
  var today = new Date();
  return {
		  'DateObj': today,
		  'date': today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate(),
		  'time': today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
		 };
}

/*
Will add an icon to the map and save the recording of an incident.
*/
function addPatrolIncident(incidentType) {
   resetMapsPage();

   // Add the icon
   var icon = addIconAtCurrentPos(incidentType);
   // icon.onclick = function() { openExtraDetails(incidentType);}
   // openExtraDetails(incidentType);

   // Get the user location and photo (if taken)
   var currLoc = getUserLocation();
   // var photo = getPhoto();

   var dt = getDateTime();
   
   incident = {
	  "type": incidentType,
	  "latitude": currLoc['latitude'],
	  "longitude": currLoc['longitude'],
	  "x": currLoc['x'],
	  "y": currLoc['y'],
	  "time": dt['time'],
	  "date": dt['date'],
	  "details": "",
	  "photoPath": "",
	  "trackID": trackID,
   };

   // Save the incident data
   window.allIncidentInfo[window.numIncidents] = incident;
   window.numIncidents = window.numIncidents + 1;
}

/*
Create a string with the number 'num' and padd it with 'num_pad' 0's

Inputs:
	* num <num> => A num to pad
	* num_pad <int> => The number of zeros to use
*/
function fillZeroes(num = 0, num_pad = 1) {
  const p = Math.max(1, num_pad);
  return String(num).replace(/\d+/, x => '0'.repeat(Math.max(p - x.length, 0)) + x);
}

/*
Will convert seconds to a timer format 
*/
function secToTimer(timeDiff){
  secTD = Math.round(timeDiff / 1000);
  var hours = Math.floor(secTD / 3600);
  var minutes = Math.floor((secTD - (hours*3600))/60);
  var secs = Math.floor(secTD - (hours*3600) - (minutes*60));
  return fillZeroes(hours, 2)+':'+fillZeroes(minutes, 2)+':'+fillZeroes(secs, 2);
}

/*
Will rearrange the maps page to reset it.
*/
function closePatrolReview(maps_div, navbar_div) {
	resetMapsPage();

	maps_div = document.getElementById("viewDiv");
	navbar_div = document.getElementById("reportIncidentBar");

	navbar_div.display = "none";
	navbar_div.onclick = function () { cancelCreate(); }

	maps_div.style.height = "100%";
	maps_div.style.top = "0";
	maps_div.style.margin = "0";
	maps_div.style.width = "100%";

	$('#endPatrolReportForm').hide();
	$('#locationReportDiv').hide();


}

/*
A class to handle the end of patrol reporting.

This is rearrange the page to make it look like a reporting page.
It will then submit all the data to django so django can save it
in the postgres db.  
*/
class Patrol_Report {


  	constructor() {
		// Maps divs
		this.maps_div = document.getElementById("viewDiv");
		this.map_buttons = document.getElementById("topbar");
		this.zoom_widget = document.getElementsByClassName("esri-zoom")[0];
		// Navbar
		this.navbar_div = document.getElementById("reportIncidentBar");
		this.navbar_title = document.getElementById("locationHelpTxt");
		this.navbar_subtitle = document.getElementById("locationHelpTxt2");
		this.navbar_title_div = document.getElementById("navbarTitleDiv");
		this.next_button_div = document.getElementById("submitReportBtn");
		this.prev_button = document.getElementById("previousButton");
		// Location title
		this.location_title = document.getElementById("incidentLocationTitle");
		this.location_title_div = document.getElementById("locationReportDiv");
		// The form divs
		this.details_txt = document.getElementById("incident_details");
		this.incident_type_title = document.getElementById("incidentTypeTitle");
		this.form = document.getElementById("endPatrolReportForm");
		this.incident_type_div = document.getElementById("incident_type_form_div");
		this.incident_choice_div = document.getElementById("incidentChoice");
		this.fullOverlay = document.getElementById("fullOverlay");
		// Final stats page
		this.end_patrol_stats_div = document.getElementById("end_of_patrol_stats");
		// Current page number
		this.curr_page = 0;
		this.incident_types = ['littering', 'graffiti',  'speeding', 'loitering',
							   'parking'];
		this.incident_code_map = {}
		this.choice_divs = [];
		for (var i=0; i<this.incident_types.length; i++) {
			var incident_type = this.incident_types[i];
			this.choice_divs.push(document.getElementById("choice_" + incident_type));
			this.incident_code_map[incident_type] = i;
		}

		// First re-arrange the page to create the proper view
		this.init_tidy();
		this.set_onclicks();
		this.load_page(this.curr_page);
  	}

  	/*
	Will do some tidying of the page that always needs doing.
	
  	E.g. hiding the patrol timer
  	*/
  	init_tidy() {
		$('#patrolOverlay').hide();
  	}

	/*
	Will set all the onclick functions needed for the end of patrol reporting.
	*/
	set_onclicks() {
		self = this;

		this.incident_type_div.onclick = function() { self.show_incident_type(); }

		// Set the incident choice click handlers
		for (var i=0; i<this.incident_types.length; i++) {
			// The dummy argument is to deal with javascript's annoying scope implementation.
			var incidentChoiceClickHandler = function(arg) {
				return function() { self.change_incident_type(arg);}
			};
			this.choice_divs[i].onclick = incidentChoiceClickHandler(this.incident_types[i]);
		}
	}
  
	/*
	If we are on the first page then the back button points to the restart patrol,
	if not then it points to the previous page.
	*/
	setup_back_button(page_num) {
		var self = this;
	
		this.prev_button.style.display = "inline-block";
		if (page_num == 0) {
		 	this.prev_button.onclick = function() {
				self.restart_patrol();
		  	}
		} else if (page_num > 0) {
		  	this.prev_button.onclick = function() {
				self.curr_page = self.curr_page - 1;
				self.load_page(self.curr_page);
			}
		} else {
		  	console.log("Page number cock up!");
		}
	}

	/*
	If we are on the last page then the forward button points to the end patrol,
	if not then it points to the next page.
	*/
	setup_forward_button(page_num) {
		var self = this;
		const to_stats_btn_html = "<p class='navBtn' style='margin-top: calc(25% + 2px); line-height:100%;'>ok</p>";
		const next_page_patrol_btn_html = "<button class=\"navBtn\"><i class=\"material-icons\" class=\"btnIcon\">arrow_forward</i></button>"
	
		this.next_button_div.style.display = "inline-block";
		if (window.numIncidents <= 1 | this.curr_page == window.numIncidents - 1) {
			this.next_button_div.innerHTML = to_stats_btn_html;
			this.next_button_div.onclick = function () { self.stats_report(); }
		} else {
			this.next_button_div.innerHTML = next_page_patrol_btn_html;
			this.next_button_div.onclick = function () { 
				self.curr_page = self.curr_page + 1;
				self.load_page(self.curr_page);
		   	}
		}
	}
  
  	/*
  	Will create the relevant page in the end of patrol screen.

  	Inputs:
		* page_num <int> => The page number to load
  	*/
  	load_page(page_num) {
		// If we are on the last page then display the back button.
		if (!page_num) {
			var page_num = this.curr_page;
		}
		this.setup_back_button(page_num);
		this.setup_forward_button(page_num);

		var incidentData = window.allIncidentInfo[page_num];
		if (!incidentData) {
			console.log("Page numbering cock up!");
		}

		// Add the navbar
		this.navbar_div.style.display = "block";
		this.location_title_div.style.display = "block";
		this.map_buttons.style.display = "none";
		this.end_patrol_stats_div.style.display = "none";
		if (this.zoom_widget) { this.zoom_widget.style.display = "none"; }

		if (window.numIncidents > 0) {
	  		// Reset the size of the maps div
	  		this.maps_div.style.height = "150px";
	  		// this.maps_div.style.position = "absolute";
	  		this.maps_div.style.top = "100px";
	  		this.maps_div.style.marginTop = "5%";
	  		// this.maps_div.style.width = "90%";

	  		// Add the navbar title
	  		this.navbar_title.style.marginTop = "0px;";
	  		this.navbar_title.style.lineHeight = "35px";
	  		this.navbar_title.style.textAlign = "left";
	  		this.navbar_title.innerHTML = "Review Incident " + (page_num + 1).toString();

	  		this.form.style.display = "block";

	  		// Now set the values of the various elements in the form
	  		self = this;
	  		this.details_txt.onchange = function() { self.save_details_text(self.curr_page); }
	  		this.set_details_text(page_num);
	  		this.set_incident_type_on_page(incidentData['type'])

		} else {
	  		this.stats_report();
		}
	}

	/*
	Will set the incident type on a end of patrol page.

	This involves setting the subtitle in the navbar and the incident type in the
	incident type chooser div.
	*/
	set_incident_type_on_page(incident_type) {
		this.navbar_subtitle.innerHTML = incident_type;
		this.incident_type_title.innerHTML = "Incident Type: " + incident_type;
		this.location_title.innnerHTML = incident_type + " Location";
	}

  	/*
  	Will set the incident details in the details textarea from the allIncidentInfo dict.

  	Inputs:
  		* page_num <int> => The page number in the end of patrol report
  	*/
  	set_details_text(page_num) {
		var incidentData = window.allIncidentInfo[page_num];

		if (incidentData) {
	   		this.details_txt.value = incidentData['details'];
		} else {
	  		console.log("Page numbering cock up! This needs fixing -look into the Patrol_Report class in the patrol.js file.");
		}
  	}

  	save_details_text(page_num) {
  		window.allIncidentInfo[page_num]['details'] = this.details_txt.value;
  	}

  	/*
  	Will set the incident box shadow on the incident choice div.

  	If an incident_type isn't given or if the incident type isn't in the 
  	accepted list then it will just remove all box shadowing.
  	*/
  	set_box_shadow_incident(incident_type) {
  		for (var i=0; i<this.choice_divs.length; i++) {
			this.choice_divs[i].style.boxShadow = "";
		}

		if (!incident_type) { return; }

		var incident_code = this.incident_code_map[incident_type];
		if (!incident_code & incident_code != 0) {
			console.log("Can't find '"+incident_type+"' in this.incident_code_map!");
			console.log("this.incident_code_map = ", this.incident_code_map);
		} else {
			this.choice_divs[incident_code].style.boxShadow = "1px 1px 3px #ff5722";
		}
  	}

  	/*
  	Will bring up the incident type popup
  	*/
  	show_incident_type() {
		this.fullOverlay.style.display = "block";
		this.incident_choice_div.style.display = "block";

		var curr_incident_data = window.allIncidentInfo[this.curr_page];
		this.set_box_shadow_incident(curr_incident_data['type']);
  	}

  	/*
  	Will take the selection from the incident type popup and use that as the choice.
  	*/
  	change_incident_type(incident_type) {
		window.allIncidentInfo[this.curr_page]['type'] = incident_type;
		this.set_box_shadow_incident(incident_type);
		this.set_incident_type_on_page(incident_type);
		changeMapIcon(this.curr_page, incident_type);

		this.fullOverlay.style.display = "none";
		this.incident_choice_div.style.display = "none";
  	}

  	/*
  	A final screen in the end of patrol report that shows some stats on the journey.
  	*/
  	stats_report() {
		const end_patrol_btn_html = "<svg class='navBtn' width=\"70\" height=\"70\">  \
		  	<polygon points=\"20,25 40,45\"                          \
				   	style=\"stroke:white;stroke-width:4;\" />       \
		  	<polygon points=\"20,45 40,25\"                          \
				   	style=\"stroke:white;stroke-width:4;\" />       \
		  	Sorry, your browser does not support inline SVG.         \
			</svg>";
		// this.prev_button.style.display = "none";
		this.form.style.display = "none";
		this.navbar_subtitle.innerHTML = "";
		this.next_button_div.innerHTML = end_patrol_btn_html;
		this.end_patrol_stats_div.style.display = "";

		this.navbar_title.innerHTML = "<span style='float: left; line-height: 68px;'>Your patrol</span>";
		this.location_title.innerHTML = "Your route";

		this.maps_div.style.height = "50%";
		this.maps_div.style.top = "70px";

		var tot_time = secToTimer(window.total_time).split(':');
		var hrs = tot_time[0][0] == "0" ? tot_time[0][1] : tot_time[0];
		var mins = tot_time[1][0] == "0" ? tot_time[1][1] : tot_time[1];
		$('#total_time_stat').html(hrs + " hrs " + mins + " mins");

		// Stop the tracking and remove graphics
		this.distanceTravelled = stopTracking();
		if (this.distanceTravelled) {
	  		this.distanceTravelled = this.distanceTravelled.toFixed(2);
	  		$("#distance_stat").html(this.distanceTravelled +  " km");
		}

		self = this;
		this.next_button_div.onclick = function () {self.end_patrol();}
  	}

  	/*
  	Will return to the maps page, hiding all the end of patrol content
  	*/
  	show_maps () {
		this.navbar_div.style.display = "none";
		this.location_title_div.style.display = "none";
		this.form.style.display = "none";
		this.map_buttons.style.display = "block";

		this.maps_div.style.height = "100%";
		this.maps_div.style.top = "0";
		this.maps_div.style.width = "100%";
		this.maps_div.style.margin = "0";
		if (this.zoom_widget) {
	  	this.zoom_widget.style.display = "";
		}
  	}

  	/*
  	Will restart the patrolling functionality
  	*/
  	restart_patrol() {
		this.show_maps();
		startPatrol(window.start_time);

		// Reset the incident choice click handlers
		for (var i=0; i<this.incident_types.length; i++) {
			// The dummy argument is to deal with javascript's annoying scope implementation.
			var incidentChoiceClickHandler = function(arg) {
				return function() { addPatrolIncident(arg);}
			};
			this.choice_divs[i].onclick = incidentChoiceClickHandler(this.incident_types[i]);
		}

		// Reset the box shadow on the incident choices.
		this.set_box_shadow_incident();
  	}

  	/*
  	Will close the end of patrol form and reset variables
  	*/
  	exit() {
	  	// Reset variables
	  	window.numIncidents = 0;
	  	window.allIncidentInfo = {};
	  	window.start_time = 0.0;
	  	window.total_time = 0;
	  	window.patrolOn = false;

	  	// Will return to the maps page
	  	this.show_maps();

	  	// Reset the 
	  	document.getElementById("openActivitiesOverlay").setAttribute("onclick",
																	"openActivitiesOverlay();");
  	}

  	/*
  	Will end the patrol and save all the data and exit the end of patrol report.
  	*/
  	end_patrol() {
		// Will remove anything drawn on the maps (this must appear before saveTrackData)
		removeMapsIcons();

		// Save all the tracking location data.
		saveTrackData();

		// Reset image of clock
		document.getElementById("patrolTimer").innerHTML = "00:00:00";

		// Exit the stats page and reset map variables.
		this.exit();
  	}
}













































// /*
// Will create an extra details div that will record any details of the incident.

// This div will be hidden and will only be shown when the user clicks the incident
// icon on the screen.

// The created html will look something like this:
//   <div id="addDetails_1" style="height: 50%;">
//       <div style="height: 50px;">
//         <h2 class="addDeatils-title">&nbsp; Details of ...</h2>
//         <button class="addDetails-title-button btn btn-success" id="deetsOK"
//                 onclick="closeOverlay()">
//           OK</button>
//       </div>
//       <div style="height: 85%">
//         <textarea class="detailsTxtBox"
//                   id="detailsUser"
//                   placeholder="Enter any extra details you think may be useful in here"></textarea>
//      </div>
//   </div>
// */

// function createExtraDetails(div_num, incident_type) {
//   console.log("BOB");
//   parent = document.createElement("div");
//   parent.id = "addDetails_"+div_num.toString();
//   parent.style.height = "50%";
//   parent.style.display = "block";

//   // Add the title bit
//   title_div = document.createElement("div");
//   title_div.style.height = "50px";
//   title = document.createElement("h2");
//   title.className = "addDetails-title";
//   title.innerHTML = "&nbsp; Details of " + incident_type;
//   title_button = document.createElement("button");
//   title_button.classList.add("addDetails-title-button");
//   title_button.classList.add("btn");
//   title_button.classList.add("btn-success");
//   title_button.onclick = function() { closeOverlay() };
//   title_button.innerHTML = "OK";
//   title_button.id = "deetsOK"
//   title_div.appendChild(title);
//   title_div.appendChild(title_button);

//   // Add the textarea
//   text_div = document.createElement("div");
//   text_div.style.height = "85%";
//   text = document.createElement("textarea");
//   text.className = "detailsTxtBox";
//   text.id = "detailsUser_" + div_num.toString();
//   text.placeholder = "Enter any extra details you think may be useful in here";

//   parent.appendChild(title_div);
//   parent.appendChild(text_div);
// }
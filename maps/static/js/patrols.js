/*
A module to house the code that handles patrolling.
*/

numIncidents = 0;
allIncidentInfo = {};


/*
Will handle the starting of a patrol e.g. open relevant overlays and start timer

  * @param[Date] startTime    The time the patrol started (for the clock).
*/
function startPatrol(startTime) {
  window.patrolOn = true;
  numIncidents = 0;
  allIncidentInfo = {};

  // Open the relevant overlays
  document.getElementById("fullOverlay").style.display = "none";
  document.getElementById("startActivityOverlay").style.display = "none";
  document.getElementById("patrolOverlay").style.display = "block";
  startTracking();

  // Make the plus symbol now report an incident
  // document.getElementById("openActivitiesOverlay").removeAttribute("onclick")
  document.getElementById("openActivitiesOverlay").setAttribute("onclick",
                                                    "openPatrolReport();");

  // Update the clock every second
  window.patrolTimer_incrementClock = setInterval(function(){
    // Adjust the timer
    var endTime = new Date();
    var timeDiff = endTime - startTime;
    document.getElementById("patrolTimer").innerHTML = secToTimer(timeDiff);
  }, 1000);

  // Draw a point every 10 seconds
  window.patrolTimer_drawPoint = setInterval(function() {
    drawTrackPoint();
  }, 10000);
}

function endPatrol() {
  // Go back to normal screen
  resetMapsPage();

  clearInterval(window.patrolTimer_incrementClock);
  clearInterval(window.patrolTimer_drawPoint);
  document.getElementById("patrolTimer").innerHTML = "00:00:00";

  // Stop the tracking and remove graphics
  distanceTravelled = stopTracking();

  // Open the final end patrol window
  openEndPatrol(distanceTravelled);

  endMapsPatrol();
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
Will add an icon to the map and save the recording of an incident.
*/
function addPatrolIncident(incidentType) {
   resetMapsPage();

   // Add the icon
   var icon = addIconAtCurrentPos(incidentType);
   icon.onclick = function() { openExtraDetails(incidentType);}
   // openExtraDetails(incidentType);

   // Get the user location and photo (if taken)
   var currLoc = getUserLocation();
   var photo = getPhoto();

   incident = {
      "type": incidentType,
      "location": currLoc,
   };

   // Save the incident data
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

function openPatrolReview () {
  window.PatrolReport = new Patrol_Report();
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
    this.maps_div = document.getElementById("viewDiv");
    this.navbar_div = document.getElementById("reportIncidentBar");
    this.navbar_title = document.getElementById("locationHelpTxt");
    this.navbar_title_div = document.getElementById("navbarTitleDiv");

    this.location_title = document.getElementById("locationReportDiv");
    this.form = document.getElementById("endPatrolReportForm");

    // First re-arrange the page to create the proper view
    this.init_page_layout();
  }
  
  /*
  Will initialise the reporting layout.
  */
  init_page_layout() {

    this.navbar_div.style.display = "block";
    this.navbar_div.onclick = function () { closePatrolReview(); }

    this.navbar_title.innerHTML = "<strong>Review Incidents</strong>\nIncident 1";
    this.navbar_title.style.marginTop = "0px;";
    this.navbar_title.style.lineHeight = "35px";
    this.navbar_title.style.textAlign = "left";
    
    this.maps_div.style.height = "150px";
    this.maps_div.style.position = "absolute";
    this.maps_div.style.top = "100px";
    this.maps_div.style.margin = "5%";
    this.maps_div.style.width = "90%";

    this.location_title.style.display = "block";
    this.form.style.display = "block";
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
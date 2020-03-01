/*
Will open the activities menu that appears in the top-right of the screen
*/
function openActivitiesOverlay() {
  $('#openActivitiesOverlay').hide();
  $('#fullOverlay').show();
  $('#overlayAdd').show();
}

/*
Will open the accounts menu that appears in the top-right of the screen
*/
function openAccountOverlay () {
  $('#openAccountOverlay').hide();
  $('#fullOverlay').show();
  $('#overlayAccount').show();
}

/*
Will center an overlayDiv in the window

* @param [string] overlayDiv  The id of the div that needs centering.
*/
function centerOverlayDiv(overlayDiv) {
  var activityDiv = document.getElementById(overlayDiv);

  var windowHeight = window.innerHeight;
  var vertMargin = Math.floor((windowHeight - activityDiv.clientHeight)/2) - 10;
  activityDiv.style.top = vertMargin.toString() + "px";

  // Set the left margin
  var windowWidth = window.innerWidth;
  var horizMargin =  Math.floor((windowWidth - activityDiv.clientWidth)/2);
  activityDiv.style.left = horizMargin.toString() + "px";
}

/*
Will center an overlay and a row of divs inside it.

   * @param[string] className   The name of the class within the div to set the width of.
   * @param[string] overlayDiv   The div to center in the window.
   * @param[string] choiceRowDiv   The div to change according to div width.
*/
function setStartActDim(className, overlayDiv, choiceRowDiv, changeHeight=true) {
  // Set the button heights
  var choices = document.getElementsByClassName(className);
  var btnWidth = choices[0].clientWidth;
  var btnRow = document.getElementById(choiceRowDiv);
  var rowWidth = btnRow.clientWidth;
  var numSquares = choices.length;
  var margin = Math.floor(
                          (
                           (rowWidth * (1-(0.01*(numSquares-1)))
                            - (numSquares * btnWidth)
                           )
                          ) / 2
                         )
               - 5;
  if (changeHeight) {
    btnRow.style.height = btnWidth.toString() + "px";
  }
  choices[0].style.marginLeft = margin.toString() + "px";

  // Set the top margin
  if (overlayDiv) {    centerOverlayDiv(overlayDiv);  }
}

/*
Will open the start acitivity overlay. This is the one that has the choices of
which activity to choose (i.e. patrol, speed watch etc..)
*/
function openStartActivity() {
  $('#overlayAdd').hide();
  $('#openActivitiesOverlay').show();
  document.getElementById("fullOverlay").style.display = "block";
  document.getElementById("startActivityOverlay").style.display = "block";
  setStartActDim("choiceAct", "startActivityOverlay", "activityChoices");
}

/*
Will open the end patrol overlay.
*/
function openEndPatrol() {
  document.getElementById("fullOverlay").removeAttribute("onclick");

  $('#overlayAdd').hide();
  $('#openActivitiesOverlay').show();
  $("#fullOverlay").show();
  $("#endTrack").show();
  centerOverlayDiv("endTrack");
}

/*
Will open the overlay that allows users to report an incident on patrols.
*/
function openPatrolReport() {
  $('#fullOverlay').show();
  $('#incidentChoice').show();
  centerOverlayDiv('incidentChoice');
}

/*
Will add an icon to the map and save the recording of an incident.
*/
function addPatrolIncident(incident) {
   resetMapsPage();
   addIconAtCurrentPos(incident);
}

/*
Will hide overlays and show divs in order to return to the first page the user
sees upon arrival to the maps screen.
*/
function resetMapsPage() {
  // Hide some overlays
  $('#startActivityOverlay').hide();
  $('#fullOverlay').hide();
  $('#overlayAdd').hide();
  $('#incidentChoice').hide();
  $('#overlayAccount').hide();
  if (! window.patrolOn) {
    $('#patrolOverlay').hide();
  }
  $('#endTrack').hide();

  // Show some overlays
  $('#openActivitiesOverlay').show();
  $('#openAccountOverlay').show();
}

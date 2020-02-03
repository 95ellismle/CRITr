function getChoice(choiceDivs) {
  var divs = document.getElementsByClassName(choiceDivs);
  for (var i=0; i<divs.length; i++) {
    if (divs[i].classList.contains("selected")) {
      return divs[i].id;
    }
  }
}

function selectActivity(currDiv, choiceClass) {
  if (currDiv.classList.contains("inactive")) {
    return;
  }

  var divs = document.getElementsByClassName(choiceClass);
  for (var i=0; i<divs.length; i++) {
    divs[i].classList.remove("selected");
  }
  currDiv.classList.add("selected");
}

function startActivity() {
  var currActivity = getChoice("choiceAct");

  switch (currActivity) {
    case "patrolAct":
      var startTime = new Date();
      startPatrol(startTime);
    default:

  }
}

/*
Will handle the ending of an activity and close relevant overlays etc...

  * @param[string] activity     The name of the activity to end. Choose from: 'patrol'.
*/
function endActivity(activity) {
  document.getElementById("fullOverlay").setAttribute('onclick','resetMapsPage();');

  if (activity == "patrol") {
    saveTrackData();
    window.patrolOn = false;
    // Go back to normal home page
    resetMapsPage();
  }

  document.getElementById("openActivitiesOverlay").setAttribute("onclick",
                                                    "openActivitiesOverlay();");
}

/*
Will handle the starting of a patrol e.g. open relevant overlays and start timer

  * @param[Date] startTime    The time the patrol started (for the clock).
*/
function startPatrol(startTime) {
  window.patrolOn = true;

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

  // Draw a point every 5 seconds
  window.patrolTimer_drawPoint = setInterval(function() {
    drawTrackPoint();
  }, 5000);
}

function endPatrol() {
  // Go back to normal screen
  resetMapsPage();

  clearInterval(window.patrolTimer_incrementClock);
  clearInterval(window.patrolTimer_drawPoint);
  document.getElementById("patrolTimer").innerHTML = "00:00:00";

  // Stop the tracking and remove graphics
  stopTracking();

  // Open the final end patrol window
  openEndPatrol();
}


function fillZeroes(n = 0, m = 1) {
  const p = Math.max(1, m);
  return String(n).replace(/\d+/, x => '0'.repeat(Math.max(p - x.length, 0)) + x);
}

function secToTimer(timeDiff){
  secTD = Math.round(timeDiff / 1000);
  var hours = Math.floor(secTD / 3600);
  var minutes = Math.floor((secTD - (hours*3600))/60);
  var secs = Math.floor(secTD - (hours*3600) - (minutes*60));
  return fillZeroes(hours, 2)+':'+fillZeroes(minutes, 2)+':'+fillZeroes(secs, 2);
}

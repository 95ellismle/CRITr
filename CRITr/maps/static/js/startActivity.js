var lat_lon = [];

function getActivityType() {
  var divs = document.getElementsByClassName("actChoice");
  for (var i=0; i<divs.length; i++) {
    if (divs[i].classList.contains("selected")) {
      return divs[i].id;
    }
  }
}

function selectActivity(currDiv) {
  if (currDiv.classList.contains("inactive")) {
    return;
  }

  var divs = document.getElementsByClassName("actChoice");
  for (var i=0; i<divs.length; i++) {
    divs[i].classList.remove("selected");
  }
  currDiv.classList.add("selected");
}

function startActivity() {
  var currActivity = getActivityType();

  switch (currActivity) {
    case "patrolAct":
      var startTime = new Date();
      startPatrol(startTime);
    default:

  }
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

function startPatrol(startTime) {
  document.getElementById("fullOverlay").style.display = "none";
  document.getElementById("startActivityOverlay").style.display = "none";
  document.getElementById("patrolOverlay").style.display = "block";
  lat_lon = [];
  startTracking();

  window.patrolTimer = setInterval(function(){
    // Adjust the timer
    var endTime = new Date();
    var timeDiff = endTime - startTime;
    document.getElementById("patrolTimer").innerHTML = secToTimer(timeDiff);
  }, 1000);

  window.patrolTimer2 = setInterval(function() {
    drawTrackPoint(lat_lon);
  }, 5000);
}

function endPatrol() {
  resetMapsPage();
  lat_lon = [];
  clearInterval(window.patrolTimer);
  clearInterval(window.patrolTimer2);
  document.getElementById("patrolTimer").innerHTML = "00:00:00";
  stopTracking();
}

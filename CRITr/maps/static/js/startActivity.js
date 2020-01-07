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

function startPatrol(startTime) {
  document.getElementById("fullOverlay").style.display = "none";
  document.getElementById("startActivityOverlay").style.display = "none";
  document.getElementById("patrolOverlay").style.display = "block";
  startTracking();

  window.patrolTimer_incrementClock = setInterval(function(){
    // Adjust the timer
    var endTime = new Date();
    var timeDiff = endTime - startTime;
    document.getElementById("patrolTimer").innerHTML = secToTimer(timeDiff);
  }, 1000);

  window.patrolTimer_drawPoint = setInterval(function() {
    drawTrackPoint();
  }, 5000);
}

function endPatrol() {
  resetMapsPage();

  clearInterval(window.patrolTimer_incrementClock);
  clearInterval(window.patrolTimer_drawPoint);
  document.getElementById("patrolTimer").innerHTML = "00:00:00";
  stopTracking();
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

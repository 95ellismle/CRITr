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

    openPatrolReview();
  }

  document.getElementById("openActivitiesOverlay").setAttribute("onclick",
                                                                "openActivitiesOverlay();");
}

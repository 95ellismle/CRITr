function showCards() {
    // document.getElementById("overlayBtn").style.display = "none";
    // document.getElementById("overlayCards").style.display = "flex";
}

// Will hide the cards overlay
function hideCards() {
    // document.getElementById("overlayBtn").style.display = "flex";
    // document.getElementById("overlayCards").style.display = "none";
    document.getElementById("openActivitiesOverlay").style.display = "block";
    $('#startActivityBtn').hide()
}

// Will hide the activities button
function hideActButton() {
	// document.getElementById("overlayBtn").style.display = "none";
    // document.getElementById("overlayCards").style.display = "none";
}

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
  if (overlayDiv) {
    var activityDiv = document.getElementById(overlayDiv);
    var windowHeight = window.innerHeight;
    var vertMargin = Math.floor((windowHeight - activityDiv.clientHeight)/2) - 10;
    activityDiv.style.top = vertMargin.toString() + "px";

    // Set the left margin
    var windowWidth = window.innerWidth;
    var horizMargin =  Math.floor((windowWidth - activityDiv.clientWidth)/2);
    activityDiv.style.left = horizMargin.toString() + "px";
  }
}

function openStartActivity() {
  $('#overlayAdd').hide();
  $('#openActivitiesOverlay').show();
  document.getElementById("fullOverlay").style.display = "block";
  document.getElementById("startActivityOverlay").style.display = "block";
  setStartActDim("choiceAct", "startActivityOverlay", "activityChoices");
}

function openEndActivity() {
  document.getElementById("fullOverlay").removeAttribute("onclick");

  $('#overlayAdd').hide();
  $('#openActivitiesOverlay').show();
  document.getElementById("fullOverlay").style.display = "block";
  document.getElementById("endTrack").style.display = "block";
  setStartActDim("choiceSaveTrack", "endTrack", "saveChoiceRow", false);
  setStartActDim("choiceAnon", "", "anonChoiceRow", false);
}

function resetMapsPage() {
  // Hide some overlays
  $('#startActivityOverlay').hide();
  $('#fullOverlay').hide();
  $('#overlayAdd').hide();
  $('#overlayAccount').hide();
  document.getElementById("overlayAccount").style.display = "none";
  $('#patrolOverlay').hide();
  $('#endTrack').hide();

  // Show some overlays
  $('#openActivitiesOverlay').show();
  $('#openAccountOverlay').show();
  console.log("hide #overlayAccount");
}

// Will show remove the topBar for the user and go back to how the first screen was
function backToFullMap() {
  showCards();
  document.getElementById("reportIncidentBar").style.display = "none";
  document.getElementById("viewDiv").style.height = "100%";
}

// const urls = localStorage.getItem("urls");

// Will get the activities to display on the bottom panel
function getActivities() {
  activities = [
                {'title': 'Evening Patrol',
                 'date': 'Monday',
                 'time': '18:00',
                 'location': 'Fayke street, North',
                 'points': 150,
                 'numPeople': 3,
                 'spacesTaken': 1,
                 'details': 'This is a space for more details' +
                 ' on the activity. Maybe there have been suspicious people' +
                 ' in the area and the users need to be warned. That was just' +
                 ' an example but I\'m sure there\'ll be more useful details' +
                 ' This space is for that rather than this filler text.',
                 'imageLocation': urls['img_folder']+'patrolSmall.jpg',
               },

                {'title': 'Litter Picking',
                 'date': 'Wednesday',
                 'time': '15:30',
                 'location': 'Prettend Road, West',
                 'points': 50,
                 'numPeople': 2,
                 'spacesTaken': 0, 'details': 'This is a space for more details' +
                 ' on the activity. Maybe there have been suspicious people' +
                 ' in the area and the users need to be warned. That was just' +
                 ' an example but I\'m sure there\'ll be more useful details' +
                 ' This space is for that rather than this filler text.',
                 'imageLocation': urls['img_folder']+'litterSmall.jpg',
               },
               {'title': 'Litter Picking',
                'date': 'Wednesday',
                'time': '15:30',
                'location': 'Prettend Road, West',
                'points': 50,
                'numPeople': 2,
                'spacesTaken': 0, 'details': 'This is a space for more details' +
                ' on the activity. Maybe there have been suspicious people' +
                ' in the area and the users need to be warned. That was just' +
                ' an example but I\'m sure there\'ll be more useful details' +
                ' This space is for that rather than this filler text.',
                'imageLocation': urls['img_folder']+'litterSmall.jpg',
              },
              {'title': 'Litter Picking',
               'date': 'Wednesday',
               'time': '15:30',
               'location': 'Prettend Road, West',
               'points': 50,
               'numPeople': 2,
               'spacesTaken': 0, 'details': 'This is a space for more details' +
               ' on the activity. Maybe there have been suspicious people' +
               ' in the area and the users need to be warned. That was just' +
               ' an example but I\'m sure there\'ll be more useful details' +
               ' This space is for that rather than this filler text.',
               'imageLocation': urls['img_folder']+'litterSmall.jpg',
             },
               ];
   return activities;
}

// Will create the overlay cards
function createCardOverlay(dict, i) {
    var parentDiv = document.createElement("div");
    parentDiv.id = "card_" + i.toString();
    parentDiv.className = "col-11 col-sm-7 col-md-5 col-lg-3";

    var cardDiv = document.createElement("div");
    cardDiv.className = "container card card-block";
    var cardTop = document.createElement("div");
    cardTop.className = "cardTop";

    // Create Title
    var cardLeft = document.createElement("div");
    cardLeft.className = "colLeft";
    var title = document.createElement("h5");
    title.innerHTML = dict['title'];
    cardLeft.appendChild(title);
    cardTop.appendChild(cardLeft);

    // Create num people
    var cardRight = document.createElement("div");
    cardRight.className = "colRight";
    var people = document.createElement("h5");
    for (var i=0; i<dict['spacesTaken']; i++) {
        icon = document.createElement("i");
        icon.className = "material-icons";
        icon.innerHTML = "person";
        icon.style.fontSize = "17px";
        people.appendChild(icon);
    }
    for (var i=0; i<(dict['numPeople'] - dict['spacesTaken']); i++) {
        icon = document.createElement("i");
        icon.className = "material-icons";
        icon.innerHTML = "person_outline";
        icon.style.fontSize = "17px";
        people.appendChild(icon);
    }
    cardRight.appendChild(people);
    cardTop.appendChild(cardRight);
    cardDiv.appendChild(cardTop);

    // Created the title now create the rest
    //////////////////////////////////////////

    // Create the address
    var spanAddress = document.createElement("span");
    spanAddress.className = "cardWhere";
    spanAddress.innerHTML = dict['location'];

    // Create the time
    var spanTime = document.createElement("span");
    spanTime.className = "cardWhere";
    spanTime.innerHTML = dict['date'] + " " + dict['time']

    // Create the picture
    var picture = document.createElement("picture");
  	var source = document.createElement("source");
  	var img = document.createElement("img");
  	source.srcset = dict['imageLocation'];
  	source.media = "(min-height: 550px), (min-width: 50rem)";
  	img.src = "";
  	picture.className = "evtImg";
  	source.className = "evtImg";
  	img.className = "evtImg";
  	picture.appendChild(source);
  	picture.appendChild(img);

    // Create the commit button
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-sm btn-primary";
    btn.innerHTML = "Commit";

    // Create the points
    var spanPts = document.createElement("span");
    spanPts.className = "cardPts";
    spanPts.innerHTML = "+ " + dict['points'].toString() + " pts";


    // Now create the divs to position things
    var cardDetailsBit = document.createElement("div");
    cardDetailsBit.className = "cardBottom";

    var cardLeft = document.createElement("div");
    cardLeft.className = "colLeft";
    cardLeft.style.height = '100%';
    cardLeft.style.width = "60%";
    var cardLeftTop = document.createElement("div");
    cardLeftTop.className = "";
    cardLeftTop.style.height = '70%';
    var cardLeftBot = document.createElement("div");
    cardLeftBot.className = "cardBottom";
    cardLeftBot.style.align = "bottom";
    cardLeftBot.style.height = '30%';

    var cardRight = document.createElement("div");
    cardRight.className = "colRight";
    cardRight.style.width = "40%";

    cardLeftTop.appendChild(spanAddress);
    cardLeftTop.appendChild(spanTime);

    cardLeftBot.appendChild(btn);
    cardLeftBot.appendChild(spanPts);

    cardLeft.appendChild(cardLeftTop);
    cardLeft.appendChild(cardLeftBot);

    cardRight.appendChild(picture);

    cardDetailsBit.appendChild(cardLeft);
    cardDetailsBit.appendChild(cardRight);

    cardDiv.appendChild(cardDetailsBit);


    parentDiv.appendChild(cardDiv);
    return parentDiv;
}







// Will create the card div to add to the row at the bottom
function createCard(dict, i) {
    var cardDiv = document.createElement("div");
    cardDiv.id = "card_" + i.toString();
    cardDiv.className = "cardDiv row";

    // First column (half size)
    var colDiv1_1 = document.createElement("div");
    colDiv1_1.className = "col-xs-6";

    // The title of the activity
    var title = document.createElement("p");
    title.innerHTML = dict['name'];
    title.className = "cardTitle";
    colDiv1_1.appendChild(title);

    // Second column (quarter)
    var colDiv2_1 = document.createElement("div");
    colDiv2_1.className = "col-xs-3";

    // Create the date
    var dateStr = document.createElement("p");
    dateStr.className = "cardDate";
    dateStr.innerHTML = dict['date'].slice(0, 3);
    colDiv2_1.appendChild(dateStr);

    // Third column (quarter)
    var colDiv3_1 = document.createElement("div");
    colDiv3_1.className = "col-xs-3";

    // Create the time
    var timeStr = document.createElement("p");
    timeStr.className = "cardTime";
    timeStr.innerHTML = dict['time'];
    colDiv3_1.appendChild(timeStr);

    // Add the first column (second row)
    colDiv1_2 = document.createElement("div");
    colDiv1_2.className = "col-xs-6";

    // Add the location
    var locStr = document.createElement("p");
    locStr.className = "cardLoc";
    locStr.innerHTML = dict['location'];
    colDiv1_2.appendChild(locStr);

    // Add the second column (second row)
    colDiv2_2 = document.createElement("div");
    colDiv2_2.className = "col-xs-3";

    // Add the location
    var ptsStr = document.createElement("p");
    ptsStr.className = "cardPts";
    ptsStr.innerHTML = dict['points'] + " pt";
    colDiv2_2.appendChild(ptsStr);

    // Add the third column (second row)
    colDiv3_2 = document.createElement("span");
    colDiv3_2.className = "col-xs-3";
    colDiv3_2.style.display = "inline-block";

    for (var i=0; i<dict['spacesTaken']; i++){
        icon = document.createElement("i");
        icon.className = "material-icons";
        icon.innerHTML = "person";
        icon.style.fontSize = "17px";
        colDiv3_2.appendChild(icon);
    }
    for (var i=0; i<(dict['numPeople'] - dict['spacesTaken']); i++) {
        icon = document.createElement("i");
        icon.className = "material-icons";
        icon.innerHTML = "person_outline";
        icon.style.fontSize = "17px";
        colDiv3_2.appendChild(icon);
    }

    row1 = document.createElement("div");
    row2 = document.createElement("div");
    row1.className = "row col-xs-12";
    row1.appendChild(colDiv1_1);
    row1.appendChild(colDiv2_1);
    row1.appendChild(colDiv3_1);
    row2.className = "row col-xs-12";
    row2.appendChild(colDiv1_2);
    row2.appendChild(colDiv2_2);
    row2.appendChild(colDiv3_2);

    // cardDiv.appendChild(rowBreak);
    cardDiv.appendChild(row1);
    cardDiv.appendChild(row2);

    return cardDiv;
}

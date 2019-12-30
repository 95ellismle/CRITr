function backToMap(location) {
	window.location.href = location;
}

function openIncidentSelect() {
	document.getElementById("grayOverlay").style.display = "block";
	document.getElementById("overlayIncident").style.display = "block";
}

function closeOverlay() {
	document.getElementById("grayOverlay").style.display = "none";
	document.getElementById("overlayDetails").style.display = "none";
	document.getElementById("overlayIncident").style.display = "none";

	getExtraDetails();
}

function setPhoto() {
	var file = document.getElementById("fileToUpload");
	document.getElementById("photoToChange").innerHTML = file.files[0]['name'];
	closeOverlay();
}

function openPhotoOverlay() {
	document.getElementById("grayOverlay").style.display = "block";
	document.getElementById("overlayPhoto").style.display = "block";
}

function setDate() {
	const date = document.getElementById("datePicker").value;
	document.getElementById("dateToChange").innerHTML = date;
	var form = document.getElementById("id_incidentDate");
	form.value = date;
}

function setTime() {
	const time = document.getElementById("timePicker").value;
	document.getElementById("timeToChange").innerHTML = time;
	var form = document.getElementById("id_incidentTime");
	form.value = time
}

function selectIncident(incident) {
	document.getElementById('incidentToChange').innerHTML = incident;

	// Save it in the form
	var form = document.getElementById("id_incidentType");
	form.value = incident;

	closeOverlay();
}

function showDeetsButton() {
	var deets = document.getElementById("deetsOverlay");
	deets.style.display = "inline-block";
}

function getExtraDetails() {
	if(typeof(String.prototype.trim) === "undefined")
	{
	  String.prototype.trim = function()
	  {
	      return String(this).replace(/^\s+|\s+$/g, '');
	  };
	}
	var user = document.getElementById("detailsUser");
	var form = document.getElementById("id_details");
	if (user.value.trim()){
		document.getElementById("detailsToChange").innerHTML = user.value;
	} else {
		document.getElementById("detailsToChange").innerHTML = "Tap to Select";
		user.value = "";
	}

	form.value = user.value;
}

function openDetails() {
	document.getElementById("grayOverlay").style.display = "block";
	document.getElementById("overlayDetails").style.display = "block";
}


function validateForm() {
	var incidentDiv = document.getElementById("incidentDiv");
	const incidentForm = document.getElementById("id_incidentType").value;
	const validIncidents = ['Littering', 'Loitering', 'Graffiti',
													'Speeding', 'Parking'];
	if (validIncidents.indexOf(incidentForm) == -1) {
		incidentDiv.style.border = "1px solid #ffaa00";
		incidentDiv.style.color = "red";
		document.getElementById("incidentToChange").innerHTML = "Incident Type Required";
		document.getElementById("incidentToChange").style.color = "red";
	}
	var date_ = new Date();
	var dateString =
			("0" + date_.getUTCDate()).slice(-2) + "/" +
			("0" + (date_.getUTCMonth()+1)).slice(-2) + "/" +
			date_.getUTCFullYear();
	var timeString =
			("0" + date_.getUTCHours()).slice(-2) + ":" +
			("0" + date_.getUTCMinutes()).slice(-2);

	const timeForm = document.getElementById("id_incidentTime");
	if (!(timeForm.value)) {
		timeForm.value = timeString;
	}
	const dateForm = document.getElementById("id_incidentDate");
	if (!(dateForm.value)) {
		dateForm.value = dateString;
	}

	document.getElementById("dateToChange").innerHTML = dateString;
	document.getElementById("timeToChange").innerHTML = timeString;
}

function submit() {
	fillInDateTime();
	validateForm();
}

function fillInDateTime() {
	setTime();
	setDate();
	console.log("BOB");
}

function getValsFromForm() {
	const gets = ['id_incidentType', 'id_incidentDate', 'id_incidentTime',
								'id_details', 'id_photoPath'];
	const sets = ['incidentToChange', 'dateToChange', 'timeToChange',
								'detailsToChange', 'photoToChange'];

	gets.forEach(function(item, index) {
		var getVal = document.getElementById(item).value;
		if (getVal) {
			document.getElementById(sets[index]).innerHTML = getVal;
		}
	});
}

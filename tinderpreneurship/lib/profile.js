/*--------------------------------------------*/
/*---> LISTS <--------------------------------*/
/*--------------------------------------------*/

var skills = [
	"Public Speaking",
	"Graphic Design",
	"Brainstorming",
	"Web Development",
	"Time Management",
	"Slide Decks",
	"Reports",
	"Statistics",
	"Animation",
	"Photography",
	"Finances",
	"Business Model Canvases"
];

/*--------------------------------------------*/
/*---> FORMS <--------------------------------*/
/*--------------------------------------------*/

function createHTMLCheckbox(checkboxData){
	var html = '';
	html += '<label class="checkSquareLabel">';
		html += '<input type="checkbox" onchange="recordChange(this);" name="';
		html += checkboxData['name'];
		html += '" value="';
		html += convertOptionTagName(checkboxData['value'], false);
		html += '"'
		if(checkboxData['checked']){
			html += 'checked';
		}
		html += '>';
		html += '<div class="checkSquare"></div>';
		html += checkboxData['value'];
	html += '</label>';
	return html;
}

function getArrayFromForm(formName){
	var response = [];
	$('input[name="' + formName + '"]:checked').each(function(){
		response.push($(this).val());
	});
	return response;
}

/*--------------------------------------------*/
/*---> DATABASE <-----------------------------*/
/*--------------------------------------------*/

var unsavedChanges = false;

function recordChange(elementChanged){
	//console.log(elementChanged);
	unsavedChanges = true;
}

/*
* To add updating for new fields, simply add them to profileData
*/
function updateProfile(){

	function updateProfileFields(userID, profileData){
		var path = "tinderpreneurship.firebaseio.com/users/" + userID + "/profile/";
		$.each(profileData, function(key, value){
			var profileRef = new Firebase(path + key);
			profileRef.set(value);
		});
	}

	if(userID && unsavedChanges){
		var profileData = {
			description: document.getElementById('profile-description').value,
			strengths: JSON.stringify(
					getArrayFromForm('strengths')
				),
			desires: JSON.stringify(
					getArrayFromForm('desires')
				),
			peeves: document.getElementById('profile-peeves').value
		}
		updateProfileFields(userID, profileData);
		displayMessage("Your profile has been updated.");
		unsavedChanges = false;
	}
	else{
		console.log("ERROR: UserID not authenticated. (or no changes to be saved)");
	}

}

/*--------------------------------------------*/
/*---> LOADING <------------------------------*/
/*--------------------------------------------*/

function loadProfile(){
	loadClientText('description');
	loadClientSkills('strengths');
	loadClientSkills('desires');
	loadClientText('peeves');
}

var profileSkills = [];

function loadClientSkills(formID){

	function findInList(search, array){
		var response = false;
		var size = array.length;
		for(var i = 0; i < size; i++){
			if(array[i] === search){
				response = true;
				break;
			}
		}
		return response;
	}

	function loadProfileSkills(callback){
		var path = "tinderpreneurship.firebaseio.com/users/" + userID + "/profile/";
		var skillsRef = new Firebase(path + formID);
			skillsRef.on("value", function(snapshot){
				profileSkills = JSON.parse(snapshot.val());
				callback();
			});	
	}

	function loadSkillsCallback(){
		if(userID){
			var output = document.getElementById('center-' + formID);
				output.innerHTML = "";
			var size = skills.length;
			for(var s = 0; s < size; s++){
				output.innerHTML += (createHTMLCheckbox({
					name: formID,
					value: skills[s],
					checked: findInList(convertOptionTagName(skills[s], false), profileSkills)
				}));
			}
		}
		else{
			console.log("ERROR: UserID not authenticated.");
		}
	}

	loadProfileSkills(loadSkillsCallback);

}

function loadClientText(formID){
	var output = document.getElementById('profile-' + formID);
	var path = "tinderpreneurship.firebaseio.com/users/" + userID + "/profile/";
	var textRef = new Firebase(path + formID);
		textRef.on("value", function(snapshot){
			output.value = snapshot.val();
		});	
}

var userDatabase = [];

function userFactory(data){
	var user = {
		uid: data['uid'],
		google: data['google'],
		profile: data['profile']
	}
	return user;
}

function loadProfileData(){
	var ref = new Firebase("https://tinderpreneurship.firebaseio.com/users");

	ref.on("value", function(snapshot){
		var data = snapshot.val();
		$.each(data, function(key, value){
			var user = userFactory({
				uid: key,
				google: value['google'],
				profile: value['profile']
			});
			userDatabase.push(user);
		});
	});
}

console.log("LOADED profile.js");
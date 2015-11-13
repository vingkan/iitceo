var currentSection = 'login';

function openSection(focusSection, override){
	if(userID || override){
		var sections = document.getElementsByTagName('section');
		var size = sections.length;
		for(var s = 0; s < size; s++){
			sections[s].style.display = 'none';
		}
		if(focusSection === 'login' && userID){
			userID = null;
			displayMessage("You have been logged out.");
		}
		if(focusSection === 'profile'){
			loadProfile();
		}
		if(currentSection === 'profile'){
			updateProfile();
		}
		currentSection = focusSection;
		document.getElementById(focusSection).style.display = 'block';
	}
	else{
		if(currentSection === 'login'){
			openSection('about', true);
		}
		else{
			openSection('login', true);
		}
		//displayMessage("You must be logged in to continue");
	}
}

function toggleMenu(reveal){
	header = document.querySelector("header");
	if(reveal){
		classie.add(header,"smaller");
	}
	else{
		classie.remove(header,"smaller");
	}
}

function displayMessage(message){
	var output = document.getElementById('messageContent');
		output.innerHTML = message;
	$('#messageBox').removeClass('close');
	$('#messageBox').addClass('open');
}

function closeMessageBox(){
	$('#messageBox').removeClass('open');
	$('#messageBox').addClass('close');
}

function convertOptionTagName(tag, toReadable){
	var response;
	if(toReadable){
		//Not ready for this case yet.
	}
	else{
		response = tag.replace(/\s+/g, '-').toLowerCase();
	}
	return response;
}

function initCollapsingHeader() {
	window.addEventListener('scroll', function(e){
		var distanceY = window.pageYOffset || document.documentElement.scrollTop,
			shrinkOn = 50,
			header = document.querySelector("header");
		if(distanceY > shrinkOn) {
			classie.add(header,"smaller");
		} 
		else{
			if(classie.has(header,"smaller")) {
				classie.remove(header,"smaller");
			}
		}
	});
}
window.onload = initCollapsingHeader();

console.log("LOADED utils.js");

tracksToUseAsData = null;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(240);

	let response = null;
	while(tracksToUseAsData == null){
		response = prompt("In order to fulfill requirement #7 for the assignment, I need you to specify how many of the " +
				"47 available tracks the algorithm should train on. Please enter an integer in the range [1, 47]." +
				"\n\nAlso, after entering a number, please allow the algorithm some time to process everything before the " +
				"piano roll appears. The number you enter does not significantly affect the loading time.", "47");
		response = parseInt(response);
		if(isNaN(response) || response < 1 || response > 47){
			alert("You fool!! You entered something invalid!");
		}
		else{
			tracksToUseAsData = response;
		}
	}

	midiPlayer = new MidiPlayer();
    midiPlayer.loadMidis("data/midi_files.json", onMIDIsLoaded);
}

function draw() {
    midiPlayer.draw();
}

function onMIDIsLoaded(pianoRolls) {

	// Encode the piano rolls (2D arrays) as strings
	let midiTexts = [];
	for(let i = 0; i < tracksToUseAsData; i++){
		midiTexts.push(midiPlayer.pianoRoll2Text(pianoRolls[i]));
	}
	//console.log(midiTexts);

	let mc = new MarkovChain(midiTexts);

	let generatedSong = mc.sample(2000); // max 2000 samplings so we can't get an infinite song
	console.log(generatedSong); // Print it so I can copy it and put it into a file, as per assignment specification

	let midi = midiPlayer.text2Midi(generatedSong);
	let midiData = midiPlayer.parseMidi(midi);
	let pianoRoll = midiPlayer.notes2PianoRoll(midiData.duration, midiData.notes);

	midiPlayer.setPianoRoll(pianoRoll, tsCallback);
}


function tsCallback(currentTs, notesOn) {
    // console.log(currentTs, notesOn);
}

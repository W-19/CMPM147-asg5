class MarkovChain{
	// songs is an array of strings representing the MIDI files
	constructor(songs){
		// a dictionary which maps each token (note or timestep) to an array of pairs,
		// where each pair is {token: occurences} (i.e. a single entry in a dictionary)
		// I called it a map because it maps things (as dictionaries do) and it's a nice alliteration
		this.markovMap = {};

		for(let songIndex = 0; songIndex < songs.length; songIndex++){
			let tokens = songs[songIndex].split(" "); // each entry is a string representing either a note or a timestep

			this.updateProbabilities("start", tokens[0]);
			for(let i = 0; i < tokens.length-2; i++){ // for each token except the last two
				this.updateProbabilities(tokens[i], tokens[i+1]);
			}
			this.updateProbabilities(tokens[tokens.length-2], "end"); // for the penultimate token (the last one is a dummy)
		}
	}

	// Should really be private, but I'm iffy on the syntax for doing that
	updateProbabilities(token, nextToken){
		if(!(token in this.markovMap)){
			this.markovMap[token] = [];
		}

		if(this.markovMap[token][nextToken] === undefined){
			this.markovMap[token][nextToken] = 1;
		}
		else{
			this.markovMap[token][nextToken]++; // Add 1 to the number of times nextToken occurs after token
		}
	}

	sample(maxSamplings){
		let song = "";
		let currentToken = "start";
		for(let i = 0; i < maxSamplings; i++){
			if(currentToken == "end") break;
			else if(currentToken != "start") song += currentToken + " ";

			// Choose a new token to come next (using two different ways of iterating through a dictionary!)
			let ooct = 0; // Occurences of current token
			// key is the (potential next) token and this.markovMap[currentToken][key] is the occurences count for said key
			for(let key in this.markovMap[currentToken]){
				ooct += this.markovMap[currentToken][key];
			}

			let rand = Math.random()*ooct;
			let currentValue = 0;
			// https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
			for(const [key, value] of Object.entries(this.markovMap[currentToken])) { // key = token, value = occurences
				currentValue += value;
				if(currentValue >= rand){
					currentToken = key;
					break;
				}
			}

		}
		return song;
	}
}
